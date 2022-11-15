'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const weekMenuSchema = new Schema({
	day: { type: String },
	schedule: { type: String },
	menu: { type: Array },
	expiration_date: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

const myWeekSchema = new Schema({
	day: { type: String },
	schedule: { type: String },
	weekmenu: [weekMenuSchema],
	start_date: { type: Date },
	expiration_date: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('MyWeek', myWeekSchema)
