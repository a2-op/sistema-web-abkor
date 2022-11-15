'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
	name: { type: String },
	email: { type: String }
})

let reminderSchema = new Schema({
	name: { type: String },
	send_to: [userSchema],
	date: { type: String },
	hour: { type: String },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Reminder', reminderSchema)
