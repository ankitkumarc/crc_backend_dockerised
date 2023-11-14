// models/loan.js
const { DataTypes } = require('sequelize');
const database = require('../database/database');

const Loan = database.define('Loan', {
    loan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    loan_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tenure: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    interest_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    monthly_payment: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    EMIs_paid_on_Time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Loan;
