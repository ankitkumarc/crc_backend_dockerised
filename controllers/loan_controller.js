// src/controllers/loanController.js
const loanService = require('../services/loan_service');

const createLoan = async (req, res) => {
    try {
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;

        // Process a new loan based on eligibility
        const loanApprovalResult = await loanService.createLoan({
            customer_id,
            loan_amount,
            interest_rate,
            tenure,
        });

        // Respond with the loan approval result
        res.status(200).json(loanApprovalResult);
    } catch (error) {
        console.error('Error processing loan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const viewLoan = async (req, res) => {
    try {
        const { loan_id } = req.params;

        // View loan details and customer details
        const loanDetails = await loanService.viewLoan(loan_id);

        // Respond with the loan details
        res.status(200).json(loanDetails);
    } catch (error) {
        console.error('Error viewing loan details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const makePayment = async (req, res) => {
    try {
        const { customer_id, loan_id } = req.params;
        const { amount } = req.body;

        // Make a payment towards an EMI
        const updatedLoan = await loanService.makePayment({
            customer_id,
            loan_id,
            amount,
        });

        // Respond with the updated loan details
        res.status(200).json(updatedLoan);
    } catch (error) {
        console.error('Error making payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const viewStatement = async (req, res) => {
    try {
        const { customer_id, loan_id } = req.params;
        const { amount } = req.body;

        // View statement of a particular loan taken by the customer
        const loanStatement = await loanService.viewStatement(customer_id, loan_id, amount);

        // Respond with the loan statement
        res.status(200).json(loanStatement);
    } catch (error) {
        console.error('Error viewing loan statement:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createLoan,
    viewLoan,
    makePayment,
    viewStatement,
};
