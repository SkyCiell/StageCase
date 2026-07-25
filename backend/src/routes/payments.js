const router = require('express').Router();
const { uploadProof } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { uploadPayment } = require('../config/multer');

router.use(authenticate);
router.post('/:bookingId/upload', uploadPayment.single('proof_image'), uploadProof);

module.exports = router;
