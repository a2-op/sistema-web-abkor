'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')
const route = require('./routes')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.set('view engine', 'pug')
app.use(methodOverride())
app.use(cors())
app.use(route)
app.use('/static', express.static(__dirname + '/public'))

module.exports = app
