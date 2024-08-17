const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const bot = require('./routes/botRoutes');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
dotenv.config({ path: './config/config.env' })

app.use('/api/v1', bot)

module.exports = app