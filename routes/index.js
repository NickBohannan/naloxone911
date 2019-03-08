const express = require('express');
const router = express.Router();
const User = require('../models/index');

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/signup', (req, res, next) => {
    User.create({
        email: req.body.email,
        phone: req.body.phone,
        zipcode1: req.body.zip1,
        zipcode2: req.body.zip2,
        zipcode3: req.body.zip3
    }).then(() => {
        res.render('thankyou')
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router