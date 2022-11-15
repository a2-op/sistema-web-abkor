'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let historySchema = new Schema({
	origin: { type: String },
	title: { type: String },
	content: { type: String },
	module: { type: String },
	color: { type: String },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('History', historySchema)
