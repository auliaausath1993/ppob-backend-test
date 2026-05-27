const express = require('express');
const router = express.Router();

const membershipRoutes = require('./membershipRoutes');
const infoRoutes = require('./infoRoutes');
const transactionRoutes = require('./transactionRoutes');

router.use(membershipRoutes);
router.use(infoRoutes);
router.use(transactionRoutes);

module.exports = router;
