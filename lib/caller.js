const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

module.exports = async (req, res) => {

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

        //mailer(users, req) KEEP THIS COMMENTED OUT UNTIL YOUR GET A BIG BOY EMAIL

    } catch(error) {
        console.error(error)
    }

    // send response page, actually make a page tho homie
    res.send('<h1>Message sent to at least one responder. Please wait</h1>')
}