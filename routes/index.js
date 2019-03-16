const express = require('express')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const User = require('../models/index')
const mailer = require('../lib/mailer')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/', async (req, res) => {

    try {
        // main query
        let users = await User.findAll({
            where: {
                zipcode1: req.body.zip
            }
        })

        // send if no matches
        if (users.length === 0) {
            // but actually make a page alerting that there is no one available to deliver!
            return res.send('<h1>No users in that zip code, please call 911</h1>')
        }

        // crafting message
        let bodyString = "NALOXONE911 - naloxone needed at " +
            req.body.add1 + " " +
            req.body.add2 + " " +
            req.body.city + ", " +
            req.body.state + " " +
            req.body.zip + ". You can reach this individual at: " +
            req.body.phone

        // send message to each recipient
        users.forEach(async user => {
            let message = await client.messages
                .create({
                    body: bodyString,
                    from: process.env.TWILIO_NUM,
                    to: user.phone
                })
            console.log(message.sid)
        })

        mailer(users, req)

    } catch(error) {
        console.error(error)
    }

    // send response page, actually make a page tho homie
    res.send('<h1>Message sent to at least one responder. Please wait</h1>')
})

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
