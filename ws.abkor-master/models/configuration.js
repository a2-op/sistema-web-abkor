'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bankAccountsSchema = new Schema({
	bank: { type: String },
	number_account: { type: String },
	cci: { type: String },
	beneficiary: { type: String },
	inactive: { type: Boolean }
})

const cashSchema = new Schema({
	bank_accounts: [bankAccountsSchema],
	active: { type: Boolean }
})

const culqiSchema = new Schema({
	public_key: { type: String },
	private_key: { type: String }
})

const payuSchema = new Schema({
	api_key: { type: String },
	api_login: { type: String },
	public_key: { type: String },
	merchant_id: { type: String },
	account_id: { type: String },
	payu_test: { type: Boolean }
})

const paymentMethodsSchema = new Schema({
	payu: payuSchema,
	culqi: culqiSchema,
	type: { type: String },
	active: { type: Boolean },
	cash: cashSchema
})

const securitySchema = new Schema({
	access_code: { type: String }
})

const personalizationSchema = new Schema({
	carousel: { type: Array }
})
/* GERAL
const socialSchema = new Schema({
	instagram: { type: String },
	facebook: { type: String }
})*/

const companySchema = new Schema({
	logo: { type: String },
	name: { type: String },
	//social: socialSchema GERAL
	social: { type: Object }
})

const configurationSchema = new Schema({
	name: { type: String },
	company: companySchema,
	personalization: personalizationSchema,
	payment_methods: paymentMethodsSchema,
	security: securitySchema,
	create_by: { type: Object },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
	inactive: { type: Boolean }
})

module.exports = mongoose.model('Configuration', configurationSchema)
