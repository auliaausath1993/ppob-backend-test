const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/banner', infoController.getBanners);
router.get('/services', authenticate, infoController.getServices);

module.exports = router;
