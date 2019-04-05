const express = require('express')
const caller = require('../lib/caller')
const User = require('../models/index')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/', caller)

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    // create user in the db then send thank you page
    try {
        await User.create({
            email: req.body.email,
            phone: req.body.phone,
            zipcode1: req.body.zip1,
            zipcode2: req.body.zip2,
            zipcode3: req.body.zip3
        })

        res.render('thankyou')
    } catch(error) {
        console.log(error)
    }
})

module.exports = router
