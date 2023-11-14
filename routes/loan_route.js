// src/routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan_controller');


// Create a new loan
router.post('/create-loan', loanController.createLoan);

// View loan details by ID
router.get('/view-loan/:loan_id', loanController.viewLoan);

// /make-payment/:customer_id/:loan_id endpoint
router.post('/make-payment/:customer_id/:loan_id', loanController.makePayment);

// /view-statement/:customer_id/:loan_id endpoint
router.get('/view-statement/:customer_id/:loan_id', loanController.viewStatement)

module.exports = router;
