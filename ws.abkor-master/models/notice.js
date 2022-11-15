'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noticeSchema = new Schema({
	title: { type: String },
	description: { type: String },
	tags: { type: Array },
	photos: { type: Array },
	start: { type: Date },
	end: { type: Date },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Notice', noticeSchema)
