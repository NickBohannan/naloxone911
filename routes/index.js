const express = require('express');
const router = express.Router();
const User = require('../models/index');
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {


  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = require('twilio')(accountSid, authToken)

  User.findAll({
      where: {
        zipcode1: req.body.zip
      }
    }).then((users) => {
      if (users.length === 0) {
          return res.send('<h1>No users in that zip code, please call 911</h1>') // make a page alerting that there is no one available to deliver
      }

      let bodyString = "NALOXONE911 - naloxone needed at " +
        req.body.add1 + " " +
        req.body.add2 + " " +
        req.body.city + ", " +
        req.body.state + ". You can reach this individual at: " +
        req.body.phone

      for (let i = 0; i < users.length; i++) {
        client.messages
          .create({
            body: bodyString,
            from: process.env.TWILIO_NUM,
            to: users[i].phone
          })
          .then(message => console.log(message.sid))
      }

    //     //define mailer function
    //     async function main() {
    //         let transporter = nodemailer.createTransport({
    //             host: "smtp.gmail.com",
    //             port: 465,
    //             secure: true,
    //             auth: {
    //                 user: process.env.EMAIL,
    //                 pass: process.env.EMAIL_PASS
    //             }
    //         })
    //
    //         let recipients
    //
    //         if (users.length > 1) {
    //             let emailArray = []
    //             users.forEach((user) => {
    //                 emailArray.push(user.email)
    //             })
    //             recipients = emailArray.join(', ')
    //         } else {
    //             recipients = users[0].email
    //         }
    //
    //         let mailOptions = {
    //             from: '"naloxone911" <sender@naloxone911.com>', // sender address
    //             to: recipients, // list of receivers
    //             subject: "(TEST) ALERT - NALOXONE NEEDED IN YOUR AREA", // Subject line
    //             text: "test email", // plain text body
    //             html: "<b>THIS IS A TEST - ALERT - NALOXONE NEEDED AT "
    //                 + req.body.add1 + " "
    //                 + req.body.add2 + " "
    //                 + req.body.city + ", "
    //                 + req.body.state + " "
    //                 + req.body.zip + ". You can call this individual at "
    //                 + req.body.phone + "</b>" // html body
    //         }
    //
    //         let info = await transporter.sendMail(mailOptions)
    //
    //         console.log("Message sent: %s", info.messageId);
    //     }
    //
    //     // invoke mailer function
    //     main().catch(console.error)
    //
    }).then(() => {
      // send response page - work needed obviously
      res.send('<h1>Message sent to at least one responder. Please wait</h1>')
    }).catch(console.error)
})

router.get('/signup', (req, res) => {
  res.render('signup')
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
