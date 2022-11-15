'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let supplySchema = new Schema({
	name: { type: String },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Supply', supplySchema)
