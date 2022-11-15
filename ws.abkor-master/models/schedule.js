'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let scheduleSchema = new Schema({
	alias: { type: String },
	sinceTime: { type: String },
	untilTime: { type: String },
	date: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Schedule', scheduleSchema)
