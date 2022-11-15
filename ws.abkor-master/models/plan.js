'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let serviceSchema = new Schema({
	name: { type: String }
})

let planSchema = new Schema({
	name: { type: String },
	photos: { type: Array },
	includes: [serviceSchema],
	duration: { type: Number },
	price: { type: Number },
	maximum_appointments: { type: Number },
	plan_id: { type: String },
	description: { type: String },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Plan', planSchema)
