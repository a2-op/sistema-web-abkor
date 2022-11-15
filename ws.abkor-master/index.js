'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
const socketIO = require('socket.io')

mongoose.connect(
	config.db,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) {
			return console.log(`Error connecting to the database: ${err}`)
		}
		console.log('Connection to the established database ...')
		let server = app.listen(config.port, () => {
			console.log(`API REST running in port: ${config.port}`)
		})
		const io = socketIO(server)
		require('./sockets')(io)
	}
)
