const router = require('express').Router();
const { createGatewayPayment, handleWebhook, uploadProof } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { uploadPayment } = require('../config/multer');

// Webhook dari Midtrans (TIDAK PAKAI AUTH!)
router.post('/webhook', handleWebhook);

// User routes (pakai auth)
router.use(authenticate);
router.post('/:bookingId/gateway', createGatewayPayment);  // Payment gateway otomatis
router.post('/:bookingId/upload', uploadPayment.single('proof_image'), uploadProof);  // Manual transfer

module.exports = router;
