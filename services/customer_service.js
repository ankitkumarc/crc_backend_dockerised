const Customer = require('../models/customer_model');
const Loan = require('../models/loan_model');

async function createCustomer({ first_name, last_name, age, monthly_salary, phone_number }) {
    try {
        // Calculate approved limit based on the provided formula
        const approved_limit = Math.round(36 * monthly_salary / 100000) * 100000;

        // Create a new customer record
        const newCustomer = await Customer.create({
            first_name,
            last_name,
            age,
            monthly_salary,
            approved_limit,
            phone_number,
        });

        return newCustomer;
    } catch (error) {
        throw error;
    }
}

async function getCustomerById(customerId) {
    try {
        // Retrieve a customer by their ID
        const customer = await Customer.findByPk(customerId);
        return customer;
    } catch (error) {
        throw error;
    }
}

const calculateCreditScore = (customer) => {
    console.log(customer)
    const { Loan, monthly_salary, approved_limit } = customer;

    // i. Past Loans paid on time
    const pastLoansPaidOnTime = Loan.filter((loan) => loan.end_date && loan.end_date <= new Date() && loan.emis_paid_on_time === loan.tenure).length;

    // ii. No of loans taken in past
    const numberOfLoansTaken = Loan.length;

    // iii. Loan activity in the current year
    const currentYear = new Date().getFullYear();
    const loanActivityInCurrentYear = Loan.filter((loan) => loan.start_date.getFullYear() === currentYear).length;

    // iv. Loan approved volume
    const loanApprovedVolume = Loan.filter((loan) => loan.approval).length;

    // v. If the sum of current loans of the customer > approved limit, credit score = 0
    const sumOfCurrentLoans = Loan.reduce((total, loan) => (loan.end_date === null ? total + loan.loan_amount : total), 0);

    let creditScore = 0;

    // Implement your scoring logic based on the provided components
    creditScore += pastLoansPaidOnTime * 10; // Weight for past loans paid on time
    creditScore += numberOfLoansTaken * 5; // Weight for number of loans taken
    creditScore += loanActivityInCurrentYear * 8; // Weight for loan activity in the current year
    creditScore += loanApprovedVolume * 12; // Weight for loan approved volume

    if (sumOfCurrentLoans <= approved_limit) {
        creditScore += 20; // Weight for sum of current loans within approved limit
    } else {
        creditScore = 0; // Credit score is 0 if sum of current loans exceeds approved limit
    }

    // Your scoring logic goes here, adjust the weights and thresholds as needed

    return creditScore;
};

async function checkEligibility({ customer_id, loan_amount, interest_rate, tenure }) {
    try {
        // Fetch customer details from the database
        const customer = await Customer.findByPk(customer_id, { include: 'Loan' });

        // Calculate credit score
        const creditScore = calculateCreditScore(customer);

        // Check eligibility based on credit score
        let approval = false;
        let corrected_interest_rate = interest_rate;
        let message = '';

        if (creditScore > 50) {
            approval = true;
        } else if (creditScore > 30) {
            if (interest_rate <= 12) {
                approval = true;
            } else {
                corrected_interest_rate = 12;
                message = 'Interest rate corrected to match credit score.';
            }
        } else if (creditScore > 10) {
            if (interest_rate <= 16) {
                approval = true;
            } else {
                corrected_interest_rate = 16;
                message = 'Interest rate corrected to match credit score.';
            }
        } else {
            message = 'Loan not approved due to low credit score.';
        }

        // Respond with the eligibility result
        const eligibilityResult = {
            customer_id,
            approval,
            interest_rate,
            corrected_interest_rate,
            tenure,
            monthly_installment: loan_amount / tenure,
            message,
        };

        return eligibilityResult;
    } catch (error) {
        console.error('Error checking eligibility:', error);
        throw error;
    }
};


module.exports = {
    createCustomer,
    getCustomerById,
    checkEligibility
};