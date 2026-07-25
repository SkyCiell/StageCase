const router = require('express').Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar } = require('../config/multer');

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', uploadAvatar.single('avatar'), updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
