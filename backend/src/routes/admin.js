const router = require('express').Router();
const { getDashboard } = require('../controllers/adminController');
const { getAllConcerts, createConcert, updateConcert, deleteConcert } = require('../controllers/concertController');
const { getVenues, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');
const { getAllUsers } = require('../controllers/userController');
const { getAllBookings } = require('../controllers/bookingController');
const { approvePayment, rejectPayment } = require('../controllers/paymentController');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/ticketCategoryController');
const { generateSeats } = require('../controllers/seatController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadPoster } = require('../config/multer');

router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.get('/users', getAllUsers);

// Concerts
router.get('/concerts', getAllConcerts);
router.post('/concerts', uploadPoster.single('poster'), createConcert);
router.put('/concerts/:id', uploadPoster.single('poster'), updateConcert);
router.delete('/concerts/:id', deleteConcert);

// Venues
router.get('/venues', getVenues);
router.post('/venues', createVenue);
router.put('/venues/:id', updateVenue);
router.delete('/venues/:id', deleteVenue);

// Ticket categories
router.post('/ticket-categories', createCategory);
router.put('/ticket-categories/:id', updateCategory);
router.delete('/ticket-categories/:id', deleteCategory);

// Seats
router.post('/seats/generate', generateSeats);

// Bookings
router.get('/bookings', getAllBookings);

// Payments
router.patch('/payments/:id/approve', approvePayment);
router.patch('/payments/:id/reject', rejectPayment);

module.exports = router;
