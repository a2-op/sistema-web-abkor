'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
	name: { type: String },
	card_number: { type: String },
	expiration: { type: String },
	ccv: { type: String },
	type: { type: String },
	token_id: { type: String },
	card_id: { type: String },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

const coordinateShema = new Schema({
	latitude: { type: Number },
	longitude: { type: Number }
})

const addressSchema = new Schema({
	name: { type: String },
	mobile: { type: String },
	address: { type: String },
	reference: { type: String },
	latitude: { type: String },
	principal: { type: Boolean },
	coordinates: coordinateShema
})

let planSchema = new Schema({
	name: { type: String },
	photos: { type: Array },
	includes: { type: Array },
	duration: { type: Number },
	price: { type: Number },
	interval: { type: String },
	interval_count: { type: Number },
	maximum_appointments: { type: Number },
	suspended: { type: Array, default: [] },
	start: { type: Date, default: new Date() },
	state: { type: String },
	operation_number: { type: Number },
	method: { type: String },
	plan_id: { type: String },
	description: { type: String },
	subscription_id: { type: String }
})

let routesSchema = new Schema({
	code: { type: String },
	profile: { type: String },
	name: { type: String },
	path: { type: String },
	icon: { type: String },
	level: { type: Number },
	children: { type: Array }
})

let allergySchema = new Schema({
	name: { type: String }
})

const userSchema = new Schema({
	photo: { type: String },
	name: { type: String },
	email: { type: String },
	password: { type: String },
	password_fb: { type: String },
	password_go: { type: String },
	gender: { type: String },
	entity: { type: String },
	reference: { type: String },
	customer_id: { type: String },
	notifications: { type: Boolean },
	cards: [cardSchema],
	profile: { type: String },
	birthday: { type: Date },
	document: { type: String },
	phone: { type: String },
	allergies: [allergySchema],
	occupation: { type: String },
	addresses: [addressSchema],
	plan: planSchema,
	permissions: [routesSchema],
	medical_history: { type: Array },
	patients: { type: Array },
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('User', userSchema)
