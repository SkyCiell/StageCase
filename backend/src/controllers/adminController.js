const { sequelize } = require('../config/db');
const { User, Concert, Booking, Payment, TicketCategory, BookingDetail } = require('../models');
const { success } = require('../helpers/response');
const { Op } = require('sequelize');

const getDashboard = async (req, res, next) => {
  try {
    const isPostgres = sequelize.getDialect() === 'postgres';

    const [totalUsers, totalConcerts, totalBookings, approvedPaymentSum, bookingSum, recentBookings] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Concert.count(),
      Booking.count(),
      Payment.sum('amount', { where: { status: 'approved' } }),
      Booking.sum('total_price', { where: { status: 'confirmed' } }),
      Booking.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          { association: 'user', attributes: ['name', 'email'] },
          { model: Concert, as: 'concert', attributes: ['title'] },
          { association: 'payment' },
        ],
      }),
    ]);

    let monthlyRevenue = [];
    try {
      const monthlyQuery = isPostgres
        ? `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(total_price) as revenue, COUNT(*) as transactions FROM bookings WHERE status = 'confirmed' AND created_at >= NOW() - INTERVAL '6 MONTH' GROUP BY month ORDER BY month ASC`
        : `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as revenue, COUNT(*) as transactions FROM bookings WHERE status = 'confirmed' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY month ORDER BY month ASC`;
      monthlyRevenue = await sequelize.query(monthlyQuery, { type: sequelize.QueryTypes.SELECT });
    } catch (e) {
      console.error('Monthly revenue query error:', e.message);
    }

    const totalRevenue = approvedPaymentSum || bookingSum || 0;

    return success(res, {
      stats: {
        totalUsers,
        totalConcerts,
        totalBookings,
        totalRevenue: parseFloat(totalRevenue),
      },
      recentBookings,
      monthlyRevenue,
    });
  } catch (err) { next(err); }
};

// GET /api/admin/verify-qr?code=...
const verifyTicketQR = async (req, res, next) => {
  try {
    const rawCode = (req.query.code || req.body.code || '').trim();
    if (!rawCode) {
      return success(res, { status: 'INVALID', message: 'No QR code or booking reference provided' });
    }

    const code = rawCode.replace(/^#/, '');

    let booking = await Booking.findOne({
      where: { booking_code: code },
      include: [
        { association: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Concert, as: 'concert', include: ['venue'] },
        { model: BookingDetail, as: 'details', include: ['ticketCategory', 'seat'] },
        { association: 'payment' },
      ],
    });

    if (!booking) {
      const detail = await BookingDetail.findOne({
        where: { qr_code_data: code },
        include: [{
          model: Booking,
          as: 'booking',
          include: [
            { association: 'user', attributes: ['id', 'name', 'email', 'phone'] },
            { model: Concert, as: 'concert', include: ['venue'] },
            { model: BookingDetail, as: 'details', include: ['ticketCategory', 'seat'] },
            { association: 'payment' },
          ]
        }]
      });
      if (detail && detail.booking) {
        booking = detail.booking;
      }
    }

    if (!booking) {
      return success(res, {
        status: 'INVALID',
        message: '⚠️ INVALID / FAKE QR CODE DETECTED. Ticket record not found in system!',
      });
    }

    const isRejected = booking.status === 'rejected' || booking.status === 'cancelled' || booking.payment?.status === 'rejected';
    const isConfirmed = booking.status === 'confirmed' || booking.payment?.status === 'approved';

    if (isRejected) {
      return success(res, {
        status: 'REJECTED',
        message: '❌ ACCESS DENIED! Payment for this ticket was rejected or cancelled.',
        booking,
      });
    }

    if (!isConfirmed) {
      return success(res, {
        status: 'UNPAID',
        message: '⚠️ ACCESS DENIED! Payment for this booking has not been verified yet.',
        booking,
      });
    }

    return success(res, {
      status: 'VALID',
      message: '✅ OFFICIAL VERIFIED E-TICKET PASS! Gate Entry Approved.',
      booking,
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, verifyTicketQR };
