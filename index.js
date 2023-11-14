const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database/database');
const customerRoutes = require('./routes/customer_route');
const loanRoutes = require('./routes/loan_route');
const Customer = require('./models/customer_model');
const Loan = require('./models/loan_model');
const dataIngestion = require('./dataIngestion');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/customers', customerRoutes);
app.use('/loans', loanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err });
});

// Define associations
Customer.hasMany(Loan, { foreignKey: 'customer_id', as: 'Loan' });
Loan.belongsTo(Customer, { foreignKey: 'customer_id' });

// Sync Model with Database
// (async () => {
//     try {
//         await sequelize.sync({ force: true }); // Change database.sync to sequelize.sync
//         await dataIngestion.ingestData(); // Call the function with await
//         console.log("All models were synchronized successfully.");
//     } catch (error) {
//         console.log('Error synchronizing models with database: ', error);
//     }
// })();

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
