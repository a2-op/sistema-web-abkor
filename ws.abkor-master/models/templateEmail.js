'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let templateSchema = new Schema({
	name: { type: String },
	subject: { type: String }, // Subject
	preheader: { type: String }, // Preheader
	content: { type: String }, // Content
	styles: { type: Object }, // Styles
	design: { type: Array }, // Design
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('TemplateEmail', templateSchema)
