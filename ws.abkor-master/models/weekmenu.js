'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
	name: { type: String },
	description: { type: String },
	ingredients: { type: Array },
	photos: { type: Array },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

const weekMenuSchema = new Schema({
	day: { type: String },
	schedule: { type: String },
	menu: [menuSchema],
	expiration_date: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('WeekMenu', weekMenuSchema)
