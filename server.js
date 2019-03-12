require('dotenv').config()
const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index');
const User = require('./models/index')
const path = require('path')


const port = process.env.port || 8080

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', indexRouter)

app.listen(port, () => {
    console.log("Listening on port " + port + ".")
    console.log(process.env.HOME)
})

//User.sync()
User.sync()
