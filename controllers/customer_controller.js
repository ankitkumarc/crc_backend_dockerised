const customerService = require('../services/customer_service');

const registerCustomer = async (req, res) => {
    try {
        const { first_name, last_name, age, monthly_salary, phone_number } = req.body;

        const approved_limit = Math.round((monthly_salary * 36) / 100000) * 100000;
        // Call the service to register a new customer
        const newCustomer = await customerService.createCustomer({
            first_name,
            last_name,
            age,
            monthly_salary,
            approved_limit,
            phone_number,
        });

        // Send the response back to the client
        res.status(201).json({
            customer_id: newCustomer.customer_id,
            name: `${newCustomer.first_name} ${newCustomer.last_name}`,
            age: newCustomer.age,
            monthly_income: newCustomer.monthly_salary,
            approved_limit: newCustomer.approved_limit,
            phone_number: newCustomer.phone_number,
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const checkEligibility = async (req, res) => {
    try {
        // Extracting required fields from the request body
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;

        // Implement eligibility check logic using customerService
        const eligibilityResult = await customerService.checkEligibility({
            customer_id,
            loan_amount,
            interest_rate,
            tenure,
        });

        // Respond with the eligibility result
        res.status(200).json(eligibilityResult);
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    registerCustomer,
    checkEligibility
};