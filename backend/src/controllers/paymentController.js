const { Payment, Booking, BookingDetail, Notification, Concert, User } = require('../models');
const { success, error } = require('../helpers/response');
const { generateQRCode, generateQRToken } = require('../services/qr');
const { snap, coreApi } = require('../config/midtrans');
const crypto = require('crypto');

// POST /api/payments/:bookingId/gateway - Create payment with Midtrans (OTOMATIS)
const createGatewayPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      where: { id: bookingId, user_id: req.user.id },
      include: [
        { model: Concert, as: 'concert', include: ['venue'] },
        { model: BookingDetail, as: 'details', include: ['ticketCategory'] }
      ]
    });

    if (!booking) return error(res, 'Booking not found', 404);
    if (!['waiting_payment'].includes(booking.status)) {
      return error(res, 'Booking is not awaiting payment', 400);
    }

    const payment = await Payment.findOne({ where: { booking_id: bookingId } });
    if (!payment) return error(res, 'Payment record not found', 404);

    // Prepare items for Midtrans
    const items = booking.details.map(detail => ({
      id: detail.id,
      price: parseInt(detail.unit_price),
      quantity: detail.quantity,
      name: `${booking.concert.title} - ${detail.ticketCategory.name}`
    }));

    // Create Snap transaction parameter
    const parameter = {
      transaction_details: {
        order_id: `${booking.booking_code}-${Date.now()}`,
        gross_amount: parseInt(booking.total_price)
      },
      item_details: items,
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '08123456789'
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/bookings/${booking.id}/payment-success`,
        error: `${process.env.FRONTEND_URL}/bookings/${booking.id}/payment-failed`,
        pending: `${process.env.FRONTEND_URL}/bookings/${booking.id}/payment-pending`
      },
      expiry: {
        start_time: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace('T', ' ') + ' +0700',
        unit: 'minutes',
        duration: 120
      },
      enabled_payments: ['credit_card', 'gopay', 'shopeepay', 'bca_va', 'bni_va', 'bri_va', 'permata_va', 'other_va', 'qris']
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(parameter);

    // Update payment record
    await payment.update({
      payment_type: 'gateway',
      snap_token: transaction.token,
      snap_redirect_url: transaction.redirect_url,
      transaction_id: parameter.transaction_details.order_id,
      transaction_status: 'pending',
      amount: booking.total_price
    });

    return success(res, {
      snap_token: transaction.token,
      snap_redirect_url: transaction.redirect_url,
      transaction_id: parameter.transaction_details.order_id
    }, 'Payment gateway initialized');

  } catch (err) {
    console.error('Midtrans error:', err);
    next(err);
  }
};

// POST /api/payments/webhook - Midtrans webhook notification (AUTO APPROVE!)
const handleWebhook = async (req, res, next) => {
  try {
    const notification = req.body;
    
    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;

    const hash = crypto.createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    if (hash !== signatureKey) {
      console.error('Invalid signature from Midtrans');
      return error(res, 'Invalid signature', 403);
    }

    // Get transaction status from Midtrans
    const statusResponse = await coreApi.transaction.status(orderId);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // Find payment by transaction_id
    const payment = await Payment.findOne({
      where: { transaction_id: orderId },
      include: [{ model: Booking, as: 'booking', include: ['details', 'user'] }]
    });

    if (!payment) {
      console.error('Payment not found for order_id:', orderId);
      return error(res, 'Payment not found', 404);
    }

    // Update payment based on status (OTOMATIS TANPA ADMIN!)
    let bookingStatus = payment.booking.status;
    let paymentStatus = payment.status;
    let notificationTitle = '';
    let notificationMessage = '';
    let shouldGenerateQR = false;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = 'approved';
        bookingStatus = 'confirmed';
        shouldGenerateQR = true;
        notificationTitle = 'Payment Success! 🎉';
        notificationMessage = `Your payment for booking ${payment.booking.booking_code} has been confirmed. Your e-ticket is ready!`;
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'approved';
      bookingStatus = 'confirmed';
      shouldGenerateQR = true;
      notificationTitle = 'Payment Success! 🎉';
      notificationMessage = `Your payment for booking ${payment.booking.booking_code} has been confirmed. Your e-ticket is ready!`;
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
      bookingStatus = 'waiting_payment';
      notificationTitle = 'Payment Pending';
      notificationMessage = `Your payment for booking ${payment.booking.booking_code} is being processed.`;
    } else if (['deny', 'expire', 'cancel'].includes(transactionStatus)) {
      paymentStatus = 'rejected';
      bookingStatus = 'cancelled';
      notificationTitle = 'Payment Failed';
      notificationMessage = `Your payment for booking ${payment.booking.booking_code} has failed. Please try again.`;
    }

    // Update payment record
    await payment.update({
      status: paymentStatus,
      transaction_status: transactionStatus,
      transaction_time: new Date(statusResponse.transaction_time),
      method: statusResponse.payment_type,
      payment_response: statusResponse,
      verified_at: paymentStatus === 'approved' ? new Date() : null
    });

    // Update booking status
    await payment.booking.update({ status: bookingStatus });

    // Generate QR codes OTOMATIS jika payment approved
    if (shouldGenerateQR) {
      for (const detail of payment.booking.details) {
        const qrToken = generateQRToken(payment.booking.booking_code, detail.id);
        const qrBase64 = await generateQRCode({ 
          token: qrToken, 
          booking_code: payment.booking.booking_code 
        });
        await detail.update({ 
          qr_code: qrBase64, 
          qr_code_data: qrToken 
        });
      }
      console.log(`✅ QR codes generated for booking ${payment.booking.booking_code}`);
    }

    // Send notification
    if (notificationTitle) {
      await Notification.create({
        user_id: payment.booking.user_id,
        title: notificationTitle,
        message: notificationMessage,
        type: 'payment',
      });
    }

    console.log(`✅ Webhook processed: ${orderId} - ${transactionStatus}`);
    return res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/payments/:bookingId/upload - Manual payment proof upload (BACKUP OPTION)
const uploadProof = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { method, amount } = req.body;

    const booking = await Booking.findOne({ where: { id: bookingId, user_id: req.user.id } });
    if (!booking) return error(res, 'Booking not found', 404);
    if (!['waiting_payment'].includes(booking.status)) {
      return error(res, 'Booking is not awaiting payment', 400);
    }

    const payment = await Payment.findOne({ where: { booking_id: bookingId } });
    if (!payment) return error(res, 'Payment record not found', 404);

    const proof_image = req.file ? req.file.filename : null;
    if (!proof_image) return error(res, 'Payment proof image is required', 400);

    await payment.update({ 
      payment_type: 'manual_transfer',
      method, 
      amount, 
      proof_image, 
      status: 'submitted' 
    });
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

// Admin: PATCH /api/admin/payments/:id/approve (untuk manual transfer saja)
const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'booking', include: ['details', 'user'] }],
    });
    if (!payment) return error(res, 'Payment not found', 404);
    if (payment.status !== 'submitted') {
      return error(res, 'Payment is not in submitted state', 400);
    }

    await payment.update({ 
      status: 'approved', 
      verified_at: new Date(), 
      verified_by: req.user.id 
    });
    await payment.booking.update({ status: 'confirmed' });

    // Generate QR codes for each booking detail
    for (const detail of payment.booking.details) {
      const qrToken = generateQRToken(payment.booking.booking_code, detail.id);
      const qrBase64 = await generateQRCode({ 
        token: qrToken, 
        booking_code: payment.booking.booking_code 
      });
      await detail.update({ 
        qr_code: qrBase64, 
        qr_code_data: qrToken 
      });
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

    await payment.update({ 
      status: 'rejected', 
      rejection_reason: reason 
    });
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

module.exports = { 
  createGatewayPayment,  // Payment gateway otomatis
  handleWebhook,         // Auto-approve dari Midtrans
  uploadProof,           // Backup: manual transfer
  approvePayment,        // Admin approve manual transfer
  rejectPayment          // Admin reject manual transfer
};
