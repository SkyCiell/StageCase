const router = require('express').Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getFavorites);
router.post('/toggle', toggleFavorite);

module.exports = router;
