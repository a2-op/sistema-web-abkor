'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let appointmentSchema = new Schema({
	alias: { type: String },
	sinceTime: { type: String },
	untilTime: { type: String },
	date: { type: Date },
	nutritionist: { type: String },
	code: { type: String },
	price: { type: Number },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Appointment', appointmentSchema)
