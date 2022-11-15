'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
	address: { type: String }
})

let allergySchema = new Schema({
	name: { type: String }
})

const userSchema = new Schema({
	name: { type: String },
	email: { type: String },
	document: { type: String },
	address: addressSchema,
	allergies: [allergySchema]
})

const billingSchema = new Schema({
	card_number: { type: String },
	type: { type: String },
	currency: { type: String },
	amount_paid: { type: Date },
	operation_date: { type: Date },
	status: { type: String }
})

const categorySchema = new Schema({
	name: { type: String }
})

const optionSchema = new Schema({
	name: { type: String },
	additional_amount: { type: Number },
	type_additional: { type: Object }
})

const variantSchema = new Schema({
	name: { type: String },
	options: [optionSchema],
	selection: { type: Number }
})

const productSchema = new Schema({
	name: { type: String },
	category: categorySchema,
	description: { type: String },
	tags: { type: Array },
	photos: { type: Array },
	variants: [variantSchema],
	quantity: { type: Number },
	price: { type: Number }
})

const orderSchema = new Schema({
	user: userSchema,
	products: [productSchema],
	billing: billingSchema,
	total_price: { type: Number },
	total_quantity: { type: Number },
	status: { type: String },
	operation_number: { type: Number },
	method: { type: String },
	date_trns: {
		type: Date,
		default: new Date(
			`${new Date().getFullYear()}-${new Date().getMonth() +
				1}-${new Date().getDate()}`
		)
	},
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Order', orderSchema)
