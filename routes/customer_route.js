// src/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer_controller');


// Register a new customer
router.post('/register', customerController.registerCustomer);
router.post('/check-eligibility', customerController.checkEligibility);

module.exports = router;
