'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let routesSchema = new Schema({
	code: { type: String },
	profile: { type: String },
	name: { type: String },
	path: { type: String },
	icon: { type: String },
	level: { type: Number },
	children: { type: Array },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Route', routesSchema)
