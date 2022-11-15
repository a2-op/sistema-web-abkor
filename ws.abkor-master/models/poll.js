'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let answersSchema = new Schema({
	title: { type: String }, // Title
	description: { type: String }, // Description
	respondent: { type: String }, // Respondent
	sections: { type: Array }, // Sections
	create_by: { type: String }, // User Create
	create_at: { type: Date } // Create Date
})

let pollSchema = new Schema({
	title: { type: String }, // Title
	description: { type: String }, // Description
	sections: { type: Array }, // Sections
	answers: [answersSchema], // Answers
	wallet: { type: Array }, // Wallet
	step: { type: Number },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Poll', pollSchema)
