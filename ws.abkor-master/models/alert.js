'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let alertSchema = new Schema({
	title: { type: String },
	content: { type: String },
	icon: { type: String },
	end: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Alert', alertSchema)
