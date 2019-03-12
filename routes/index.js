const express = require('express');
const router = express.Router();
const User = require('../models/index');
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/', (req, res) => {
    // gather twilio info and require
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)

    // main query
    User.findAll({
        where: {
            zipcode1: req.body.zip
        }
    }).then((users) => {

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
            req.body.state + ". You can reach this individual at: " +
            req.body.phone

        // send message to each recipient
        users.forEach((user) => {
            client.messages
                .create({
                    body: bodyString,
                    from: process.env.TWILIO_NUM,
                    to: user.phone
                })
                .then(message => console.log(message.sid))
        }

        //define mailer function
        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS
                }
            })

            let recipients

            // this handles both single and multiple recipients
            if (users.length > 1) {
                let emailArray = []
                users.forEach((user) => {
                    emailArray.push(user.email)
                })
                recipients = emailArray.join(', ')
            } else {
                recipients = users[0].email
            }

            // define mail options
            let mailOptions = {
                from: '"naloxone911" <sender@naloxone911.com>', // sender address
                to: recipients, // list of receivers
                subject: "(TEST) ALERT - NALOXONE NEEDED IN YOUR AREA", // Subject line
                text: "test email", // plain text body
                html: "<b>THIS IS A TEST - ALERT - NALOXONE NEEDED AT "
                    + req.body.add1 + " "
                    + req.body.add2 + " "
                    + req.body.city + ", "
                    + req.body.state + " "
                    + req.body.zip + ". You can call this individual at "
                    + req.body.phone + "</b>" // html body
            }

            //send message
            let info = await transporter.sendMail(mailOptions)
            console.log("Message sent: %s", info.messageId)
        }

        // invoke mailer function
        main().catch(console.error)

    }).then(() => {
        // send response page, actually make a page tho homie
        res.send('<h1>Message sent to at least one responder. Please wait</h1>')
    }).catch(console.error)
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    // create user in the db then send thank you page
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
