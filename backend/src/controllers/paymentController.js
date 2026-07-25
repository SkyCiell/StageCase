const { Payment, Booking, BookingDetail, Notification } = require('../models');
const { success, error } = require('../helpers/response');
const { generateQRCode, generateQRToken } = require('../services/qr');

// POST /api/payments/:bookingId/upload
const uploadProof = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { method, amount } = req.body;

    const booking = await Booking.findOne({ where: { id: bookingId, user_id: req.user.id } });
    if (!booking) return error(res, 'Booking not found', 404);
    if (!['waiting_payment'].includes(booking.status)) return error(res, 'Booking is not awaiting payment', 400);

    const payment = await Payment.findOne({ where: { booking_id: bookingId } });
    if (!payment) return error(res, 'Payment record not found', 404);

    const proof_image = req.file ? req.file.filename : null;
    if (!proof_image) return error(res, 'Payment proof image is required', 400);

    await payment.update({ method, amount, proof_image, status: 'submitted' });
    await booking.update({ status: 'payment_review' });

    await Notification.create({
      user_id: req.user.id,
      title: 'Payment Submitted',
      message: `Your payment proof for booking ${booking.booking_code} has been submitted and is under review.`,
      type: 'payment',
    });

    return success(res, payment, 'Payment proof uploaded. Awaiting review.');
  } catch (err) { next(err); }
};

// Admin: PATCH /api/admin/payments/:id/approve
const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'booking', include: ['details', 'user'] }],
    });
    if (!payment) return error(res, 'Payment not found', 404);
    if (payment.status !== 'submitted') return error(res, 'Payment is not in submitted state', 400);

    await payment.update({ status: 'approved', verified_at: new Date(), verified_by: req.user.id });
    await payment.booking.update({ status: 'confirmed' });

    // Generate QR codes for each booking detail
    for (const detail of payment.booking.details) {
      const qrToken = generateQRToken(payment.booking.booking_code, detail.id);
      const qrBase64 = await generateQRCode({ token: qrToken, booking_code: payment.booking.booking_code });
      await detail.update({ qr_code: qrBase64, qr_code_data: qrToken });
    }

    await Notification.create({
      user_id: payment.booking.user_id,
      title: 'Payment Approved! 🎉',
      message: `Your payment for booking ${payment.booking.booking_code} has been approved. Your e-ticket is ready!`,
      type: 'payment',
    });

    return success(res, payment, 'Payment approved and QR tickets generated');
  } catch (err) { next(err); }
};

// Admin: PATCH /api/admin/payments/:id/reject
const rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'booking' }],
    });
    if (!payment) return error(res, 'Payment not found', 404);

    await payment.update({ status: 'rejected', rejection_reason: reason });
    await payment.booking.update({ status: 'waiting_payment' });

    await Notification.create({
      user_id: payment.booking.user_id,
      title: 'Payment Rejected',
      message: `Your payment for ${payment.booking.booking_code} was rejected. Reason: ${reason}. Please re-upload your proof.`,
      type: 'payment',
    });

    return success(res, payment, 'Payment rejected');
  } catch (err) { next(err); }
};

module.exports = { uploadProof, approvePayment, rejectPayment };
