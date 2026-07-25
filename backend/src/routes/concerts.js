const router = require('express').Router();
const { getConcerts, getConcertBySlug, getAllConcerts, createConcert, updateConcert, deleteConcert } = require('../controllers/concertController');
const { getSeatMap } = require('../controllers/seatController');
const { authenticate } = require('../middleware/auth');
const { uploadPoster } = require('../config/multer');

// Public
router.get('/', getConcerts);
router.get('/:slug', authenticate, getConcertBySlug); // optional auth for isFavorited

// Seats
router.get('/:id/seats', getSeatMap);

module.exports = router;
