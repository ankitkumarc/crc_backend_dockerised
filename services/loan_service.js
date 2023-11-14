// services/loanService.js
const Loan = require('../models/loan_model');
const Customer = require('../models/customer_model');
const customerService = require('../services/customer_service');

const createLoan = async ({ customer_id, loan_amount, interest_rate, tenure }) => {
    try {
        // Implement eligibility check logic using customerService
        const eligibilityResult = await customerService.checkEligibility({ customer_id, loan_amount, interest_rate, tenure });

        const loanApproved = eligibilityResult.approval;
        const monthly_installment = calculateMonthlyInstallment(loan_amount, interest_rate, tenure);

        // If loan is approved, create a new loan record
        if (loanApproved) {
            const newLoan = await Loan.create({
                customer_id,
                loan_amount,
                interest_rate,
                tenure,
                monthly_installment,
            });

            return {
                loan_id: newLoan.loan_id,
                customer_id,
                loan_approved: true,
                message: "Loan Approved",
                monthly_installment,
            };
        } else {
            return {
                loan_id: null,
                customer_id,
                loan_approved: false,
                message: eligibilityResult.message,
                monthly_installment: 0,
            };
        }
    } catch (error) {
        console.error('Error creating loan:', error);
        throw error;
    }
};

const viewLoan = async (loan_id) => {
    try {
        // View loan details and customer details
        const loanDetails = await Loan.findByPk(loan_id, {
            include: [
                {
                    model: Customer,
                    attributes: ['customer_id', 'first_name', 'last_name', 'phone_number', 'age'],
                    // as: 'Customer', // Add an alias for the Customer model
                },
            ],
        });

        console.log(loanDetails);

        if (!loanDetails) {
            return null; // Handle case where loan is not found
        }

        return {
            loan_id: loanDetails.id,
            customer: {
                id: loanDetails.Customer.customer_id,
                first_name: loanDetails.Customer.first_name,
                last_name: loanDetails.Customer.last_name,
                phone_number: loanDetails.Customer.phone_number,
                age: loanDetails.Customer.age,
            },
            loan_amount: loanDetails.loan_amount,
            interest_rate: loanDetails.interest_rate,
            monthly_installment: loanDetails.monthly_installment,
            tenure: loanDetails.tenure,
        };
    } catch (error) {
        console.error('Error viewing loan details:', error);
        throw error;
    }
};


const makePayment = async ({ customer_id, loan_id, amount }) => {
    try {
        // Make a payment towards an EMI
        const loan = await Loan.findByPk(loan_id);

        if (!loan) {
            return null; // Handle case where loan is not found
        }

        // Placeholder logic for calculating remaining EMIs (replace with your actual logic)
        const repayments_left = calculateRemainingEMIs(loan.loan_amount, loan.monthly_payment, amount);

        // Update the loan record with the payment information
        const newMonthlyPayment = await calculateMonthlyInstallment(loan.loan_amount - amount, loan.interest_rate, loan.tenure);
        const updatedLoan = await Loan.update(
            { monthly_payment: newMonthlyPayment },
            { where: { loan_id: loan_id } }
        );

        if (updatedLoan[0] === 1) {
            // Successfully updated one row
            console.log('Loan updated successfully');
        } else {
            // No rows were updated
            console.log('Loan not found or not updated');
        }

        return {
            customer_id,
            loan_id: updatedLoan.loan_id,
            principal: updatedLoan.loan_amount,
            interest_rate: updatedLoan.interest_rate,
            amount_paid: amount,
            monthly_payment: newMonthlyPayment,
        };
    } catch (error) {
        console.error('Error making payment:', error);
        throw error;
    }
};

const viewStatement = async (customer_id, loan_id, amount) => {
    try {
        // View statement of a particular loan taken by the customer
        const loanStatement = await Loan.findAll({
            where: { customer_id, loan_id: loan_id },
            attributes: ['customer_id', 'loan_id', 'loan_amount', 'interest_rate', 'monthly_payment'],
        });

        if (!loanStatement || loanStatement.length === 0) {
            return null; // Handle case where loan statement is not found
        }

        return loanStatement.map((loan) => {
            const remainingEMIs = calculateRemainingEMIs(loan.loan_amount, loan.monthly_repayment, amount);

            return {
                customer_id: loan.customer_id,
                loan_id: loan.loan_id,
                principal: loan.loan_amount,
                interest_rate: loan.interest_rate,
                amount_paid: amount,
                monthly_installment: loan.monthly_payment,
                repayments_left: remainingEMIs.remaining_emis,
            };
        });
    } catch (error) {
        console.error('Error viewing loan statement:', error);
        throw error;
    }
};


// function to calculate monthly installment
const calculateMonthlyInstallment = (loan_amount, interest_rate, tenure) => {
    const monthly_interest_rate = interest_rate / (12 * 100);
    const monthly_installment = (loan_amount * monthly_interest_rate) / (1 - Math.pow(1 + monthly_interest_rate, -tenure));
    return monthly_installment;


};

// function to calculate remaining EMIs
const calculateRemainingEMIs = (loan_amount, monthly_installment, amount_paid) => {
    const remaining_emis = Math.ceil((parseFloat(loan_amount) - parseFloat(amount_paid)) / parseFloat(monthly_installment));
    console.log(remaining_emis);
    return remaining_emis;
};


module.exports = {
    createLoan,
    viewLoan,
    makePayment,
    viewStatement,
};
