const router = require('express').Router();
const { createBooking, getMyBookings, getBookingById } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);

module.exports = router;
