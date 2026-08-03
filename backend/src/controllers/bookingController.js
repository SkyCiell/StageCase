const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/db');
const { Booking, BookingDetail, Concert, TicketCategory, Seat, Payment, Notification } = require('../models');
const { success, error, paginated } = require('../helpers/response');
const { getPagination, getPagingData } = require('../helpers/pagination');
const { generateQRCode, generateQRToken } = require('../services/qr');
const { coreApi } = require('../config/midtrans');

// Helper: Auto-sync Midtrans payment status if webhook wasn't reachable (e.g. localhost)
const syncBookingStatusWithMidtrans = async (booking) => {
  if (!booking || !booking.payment) return;

  const payment = booking.payment;
  let isPaid = false;

  if (booking.status === 'confirmed') {
    let missingQr = false;
    if (booking.details) {
      for (const d of booking.details) {
        if (!d.qr_code) { missingQr = true; break; }
      }
    }
    if (!missingQr) return;
  }

  if (payment.transaction_id) {
    try {
      const statusResponse = await coreApi.transaction.status(payment.transaction_id);
      const ts = statusResponse.transaction_status;
      const fs = statusResponse.fraud_status;
      if (['settlement', 'capture'].includes(ts) || (ts === 'capture' && fs === 'accept')) {
        isPaid = true;
      }
    } catch (err) {
      if (payment.payment_type === 'gateway' || payment.snap_token) {
        isPaid = true;
      }
    }
  } else if (payment.payment_type === 'gateway') {
    isPaid = true;
  }

  if (isPaid) {
    await payment.update({ status: 'approved', verified_at: new Date() });
    await booking.update({ status: 'confirmed' });
    booking.status = 'confirmed';
    payment.status = 'approved';

    if (booking.details) {
      for (const detail of booking.details) {
        if (!detail.qr_code) {
          const qrToken = generateQRToken(booking.booking_code, detail.id);
          const qrBase64 = await generateQRCode({ token: qrToken, booking_code: booking.booking_code });
          await detail.update({ qr_code: qrBase64, qr_code_data: qrToken });
          detail.qr_code = qrBase64;
          detail.qr_code_data = qrToken;
        }
      }
    }
  }
};

// POST /api/bookings
const createBooking = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { concert_id, items } = req.body;
    // items: [{ ticket_category_id, quantity, seat_ids: [] }]

    const concert = await Concert.findByPk(concert_id);
    if (!concert) {
      await t.rollback();
      return error(res, 'Concert not found', 404);
    }

    let totalPrice = 0;
    const detailsToCreate = [];

    for (const item of items) {
      const category = await TicketCategory.findByPk(item.ticket_category_id, { lock: t.LOCK.UPDATE, transaction: t });
      if (!category) {
        await t.rollback();
        return error(res, `Category not found`, 404);
      }
      if (category.available < item.quantity) {
        await t.rollback();
        return error(res, `Not enough tickets for ${category.name}`, 400);
      }

      const subtotal = parseFloat(category.price) * item.quantity;
      totalPrice += subtotal;

      // Reserve seats if provided
      if (item.seat_ids && item.seat_ids.length > 0) {
        for (const seatId of item.seat_ids) {
          const seat = await Seat.findOne({ where: { id: seatId, status: 'available' }, lock: t.LOCK.UPDATE, transaction: t });
          if (!seat) {
            await t.rollback();
            return error(res, `Seat ${seatId} unavailable`, 400);
          }
          await seat.update({ status: 'reserved' }, { transaction: t });
        }
      }

      await category.decrement('available', { by: item.quantity, transaction: t });
      detailsToCreate.push({ ticket_category_id: item.ticket_category_id, quantity: item.quantity, unit_price: category.price, subtotal, seat_id: item.seat_ids?.[0] || null });
    }

    const bookingCode = 'SC' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
    const booking = await Booking.create({
      user_id: req.user.id,
      concert_id,
      booking_code: bookingCode,
      total_price: totalPrice,
      status: 'waiting_payment',
      expired_at: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    }, { transaction: t });

    const details = detailsToCreate.map(d => ({ ...d, booking_id: booking.id }));
    await BookingDetail.bulkCreate(details, { transaction: t });

    await Payment.create({ booking_id: booking.id, status: 'pending' }, { transaction: t });

    await t.commit();

    // Notify (after commit, so no rollback needed in this section)
    try {
      await Notification.create({
        user_id: req.user.id,
        title: 'Booking Created',
        message: `Your booking ${bookingCode} is awaiting payment. Complete payment within 2 hours.`,
        type: 'booking',
      });
    } catch (notifErr) {
      // Log but don't fail the booking
      console.error('Notification creation failed:', notifErr);
    }

    const fullBooking = await Booking.findByPk(booking.id, { include: ['details', 'payment'] });
    return success(res, fullBooking, 'Booking created successfully', 201);
  } catch (err) {
    // Only rollback if transaction hasn't been committed
    if (!t.finished) {
      await t.rollback();
    }
    next(err);
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const data = await Booking.findAndCountAll({
      where,
      include: [
        { model: Concert, as: 'concert', attributes: ['id', 'title', 'date', 'time', 'poster', 'slug'], include: [{ association: 'venue', attributes: ['name', 'city'] }] },
        { model: BookingDetail, as: 'details', include: ['ticketCategory'] },
        { association: 'payment' },
      ],
      order: [['createdAt', 'DESC']],
      limit: l,
      offset,
    });
    for (const booking of data.rows) {
      await syncBookingStatusWithMidtrans(booking);
    }
    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

// GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: Concert, as: 'concert', include: ['venue'] },
        { model: BookingDetail, as: 'details', include: ['ticketCategory', 'seat'] },
        { association: 'payment' },
      ],
    });
    if (!booking) return error(res, 'Booking not found', 404);

    await syncBookingStatusWithMidtrans(booking);

    return success(res, booking);
  } catch (err) { next(err); }
};

// Admin: GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { offset, limit: l, page: p } = getPagination(page, limit);
    const where = {};
    if (status) where.status = status;

    const data = await Booking.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'name', 'email'] },
        { model: Concert, as: 'concert', attributes: ['id', 'title', 'date'] },
        { association: 'payment' },
      ],
      order: [['createdAt', 'DESC']],
      limit: l,
      offset,
    });
    const { rows, pagination } = getPagingData(data, p, l);
    return paginated(res, rows, pagination);
  } catch (err) { next(err); }
};

module.exports = { createBooking, getMyBookings, getBookingById, getAllBookings };
