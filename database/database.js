const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crc_database', 'postgres', 'Ank123456@', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
