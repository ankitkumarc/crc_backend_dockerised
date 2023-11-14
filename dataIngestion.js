const xlsx = require('xlsx');
const Customer = require('./models/customer_model');
const Loan = require('./models/loan_model');

const ingestData = async () => {
    try {
        // Ingest Customer Data
        const customerData = xlsx.readFile('./data/customer_data.xlsx');
        const customerSheet = customerData.Sheets[customerData.SheetNames[0]];
        const customers = xlsx.utils.sheet_to_json(customerSheet);
        let customer_without_id = customers.map((customer) => {
            delete customer.customer_id;
            return customer;
        });
        await Customer.bulkCreate(customer_without_id);

        // Ingest Loan Data
        const loanData = xlsx.readFile('./data/loan_data.xlsx');
        const loanSheet = loanData.Sheets[loanData.SheetNames[0]];
        const loans = xlsx.utils.sheet_to_json(loanSheet);
        let loans_without_id = loans.map((loan) => {
            delete loan.loan_id;
            return loan;
        });

        await Loan.bulkCreate(loans_without_id);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = { ingestData };