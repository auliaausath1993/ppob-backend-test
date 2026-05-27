const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/registration', membershipController.register);
router.post('/login', membershipController.login);
router.get('/profile', authenticate, membershipController.getProfile);
router.put('/profile/update', authenticate, membershipController.updateProfile);
router.put('/profile/image', authenticate, upload.single('file'), membershipController.updateProfileImage);

module.exports = router;
