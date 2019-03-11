const Sequelize = require('sequelize')
const config = require('../config')

// initiating database
let db

db = new Sequelize('naloxone911', 'postgres', config.dbPass, {
    host: 'localhost',
    dialect: 'postgres'
})

// database schema
const User = db.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    // this will probably need some attention
    phone: {
        type: Sequelize.STRING(10),
        unique: true,
        allowNull: true
    },
    // add args and messages for error handling
    zipcode1: {
        type: Sequelize.STRING(5),
        allowNull: false,
    },
    zipcode2: {
        type: Sequelize.STRING(5),
        allowNull: true
    },
    zipcode3: {
        type: Sequelize.STRING(5),
        allowNull: true
    }
})

module.exports = User
