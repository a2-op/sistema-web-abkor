'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let masterSchema = new Schema({
	code: { type: String },
	value1: { type: String },
	value2: { type: String },
	value3: { type: String },
	value4: { type: String },
	value5: { type: String },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Master', masterSchema)
