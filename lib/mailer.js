const nodemailer = require('nodemailer')

module.exports = async function mailer(users, req) {
    try {
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

    } catch(error) {
        console.error(error)
    }
}