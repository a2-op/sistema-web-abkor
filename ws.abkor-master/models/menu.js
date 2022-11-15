'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let serviceSchema = new Schema({
	name: { type: String }
})

let supplySchema = new Schema({
	name: { type: String }
})

const menuSchema = new Schema({
	name: { type: String },
	type_service: [serviceSchema],
	description: { type: String },
	ingredients: [supplySchema],
	photos: { type: Array },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Menu', menuSchema)
