'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const visitSchema = new Schema({
	title: { type: String },
	address: { type: String },
	latitude: { type: String },
	longitude: { type: String },
	contact_name: { type: String },
	contact_phone: { type: Number },
	contact_email: { type: String },
	reference: { type: String },
	notes: { type: String },
	planned_date: { type: String }
})

module.exports = mongoose.model('Visit', visitSchema)
