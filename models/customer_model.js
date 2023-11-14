const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Customer = sequelize.define('Customer', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        max: 10,
        allowNull: false
    },
    monthly_salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    approved_limit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    current_debt: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },

},
    {
        initialAutoIncrement: 20000
    },
);

module.exports = Customer;
