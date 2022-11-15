'use strict'

const lang = require('../lang/es')
const axios = require('axios').default
const mongoose = require(`mongoose`)
const constant = require(`../util/constant`)
const cloudinary = require('cloudinary').v2
const config = require('../config')
const user = require('../models').user

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Finance {
	constructor(finance = {}) {
		this.__id = finance._id || ''
		this._name = finance.name
		this._card_number = finance.card_number || ''
		this._expiration = finance.expiration
		this._ccv = finance.ccv || 0
		this._type = finance.type || ''
		this._token_id = finance.token_id || ''
		this._card_id = finance.card_id || ''
		this._merchant = finance.merchant || {}
		this._create_by = finance.create_by
		this._create_at = finance.create_at || ''
		this._modified_by = finance.modified_by
		this._modified_at = finance.modified_at || ''
		this._inactive = finance.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get name() {
		return this._name
	}
	set name(value) {
		this._name = value || ''
	}
	get card_number() {
		return this._card_number
	}
	set card_number(value) {
		this._card_number = value || ''
	}
	get expiration() {
		return this._expiration
	}
	set expiration(value) {
		this._expiration = value || ''
	}
	get ccv() {
		return this._ccv
	}
	set ccv(value) {
		this._ccv = value || 0
	}
	get type() {
		return this._type
	}
	set type(value) {
		this._type = value || 0
	}
	get token_id() {
		return this._token_id
	}
	set token_id(value) {
		this._token_id = value || 0
	}
	get card_id() {
		return this._card_id
	}
	set card_id(value) {
		this._card_id = value || 0
	}
	get merchant() {
		return this._merchant
	}
	set merchant(value) {
		this._merchant = value || {}
	}
	get create_by() {
		return this._create_by
	}
	set create_by(value) {
		this._create_by = value || {}
	}
	get create_at() {
		return this._create_at
	}
	set create_at(value) {
		this._create_at = value || ''
	}
	get modified_by() {
		return this._modified_by
	}
	set modified_by(value) {
		this._modified_by = value || 'system'
	}
	get modified_at() {
		return this._modified_at
	}
	set modified_at(value) {
		this._modified_at = value || ''
	}
	get inactive() {
		return this._inactive
	}
	set inactive(value) {
		this._inactive = value || false
	}
	// Methods
	eventByCommand(command) {
		const commands = [
			{
				command: 'GET_PAYMENT_METHODS',
				event: 'getFinance',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_PAYMENT_METHOD',
				event: 'registerFinance',
				required: [
					'name',
					'card_number',
					'expiration',
					'ccv',
					'inactive'
				],
				params: [
					'name',
					'card_number',
					'expiration',
					'ccv',
					'type',
					'inactive'
				]
			},
			{
				command: 'UPDATE_PAYMENT_METHOD',
				event: 'updateFinance',
				required: [
					'name',
					'card_number',
					'expiration',
					'ccv',
					'inactive'
				],
				params: [
					'_id',
					'name',
					'card_number',
					'expiration',
					'ccv',
					'type',
					'inactive'
				]
			},
			{
				command: 'DELETE_PAYMENT_METHOD',
				event: 'deleteFinance',
				required: ['_id'],
				params: ['_id']
			}
		]
		let event = null
		commands.forEach((element) => {
			if (element.command === command) {
				event = element
			}
		})
		return event
	}
	getFinance() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			filter._id = this.merchant.sub
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.find(filter, () => {
				user.findOne(filter, { cards: 1 }, (err, oFinances) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oFinances.cards
						resolve(params)
					}
				})
			})
		})
		return promise
	}
	registerFinance() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let object = {}
			let Authorization = ''
			var cardId = mongoose.Types.ObjectId()
			const data = `${config.payu_api_login}:${config.payu_api_key}`
			const buff = new Buffer.from(data)
			const base64data = buff.toString('base64')
			const objFinance = {
				_id: cardId,
				name: this.name,
				card_number: this.card_number,
				expiration: this.expiration,
				ccv: this.ccv,
				type: this.type,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			// Se registra la tarjeta en la pasarela
			user.findOne({ _id: this.merchant.sub }, async (err, oUser) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					if (config.payment_gateway == 'PAYU') {
						uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/customers/${oUser.customer_id}/creditCards`
						object = {
							name: oUser.name,
							document: oUser.document,
							number: this.card_number,
							expMonth: this.expiration.split('-')[1],
							expYear: this.expiration.split('-')[0],
							type: this.type,
							address: {
								line1: 'Av. Brasil 123',
								postalCode: '01',
								city: 'Lima',
								country: 'PE',
								phone: '6505434800'
							}
						}
						oUser.addresses.forEach((address) => {
							if (address.principal) {
								object.line1 = address.address
								object.phone = address.mobile
							}
						})
						Authorization = `Basic ${base64data}`
					} else {
						// Se genera un token para la tarjeta
						try {
							Authorization = `Bearer ${config.culqi_public_key}`
							const resp = await axios.post(
								`${config.culqi_uri_secure}/tokens`,
								{
									card_number: this.card_number,
									cvv: this.ccv,
									expiration_month: this.expiration.split(
										'-'
									)[1],
									expiration_year: this.expiration.split(
										'-'
									)[0],
									email: oUser.email
								},
								{
									headers: {
										Authorization: Authorization
									}
								}
							)
							uri = `${config.culqi_uri}/cards`
							object = {
								customer_id: oUser.customer_id,
								token_id: resp.data.id
							}
							Authorization = `Bearer ${config.culqi_private_key}`
						} catch (err) {
							params[0] = lang.mstrSavingError.code
							params[1] = constant.ResponseCode.error
							params[2] = err.response
								? err.response.data.user_message
								: lang.mstrSavingError.message
							params[3] = err.response ? err.response.data : err
							reject(params)
							return
						}
					}
					axios
						.post(uri, object, {
							headers: {
								Authorization: Authorization
							}
						})
						.then((resp) => {
							const data = resp.data
							if (config.payment_gateway == 'PAYU') {
								objFinance.token_id = data.token
							} else {
								objFinance.card_id = data.id
								objFinance.token_id = data.token
									? data.token.id
									: data.source.id
							}
							// Reemplazando el valor de la tarjeta
							objFinance.card_number = objFinance.card_number.replace(
								objFinance.card_number.substring(6, 12),
								'******'
							)
							user.updateOne(
								{ _id: this.merchant.sub },
								{
									$push: { cards: objFinance }
								},
								(err, success) => {
									if (err) {
										params[0] = lang.mstrSavingError.code
										params[1] = constant.ResponseCode.error
										params[2] = `${lang.mstrSavingError.message}: ${err}`
										reject(params)
									} else {
										params[0] = lang.mstrSavedRecord.code
										params[1] =
											constant.ResponseCode.success
										params[2] = lang.mstrSavedRecord.message
										params[3] = objFinance
										params[4] = success
										resolve(params)
									}
								}
							)
						})
						.catch((err) => {
							params[0] = lang.mstrSavingError.code
							params[1] = constant.ResponseCode.error
							if (config.payment_gateway == 'PAYU') {
								params[2] = lang.mstrSavingError.message
							} else {
								params[2] = err.response
									? err.response.data.user_message
									: lang.mstrSavingError.message
							}
							params[3] = err.response ? err.response.data : err
							reject(params)
						})
				}
			})
		})
		return promise
	}
	updateFinance() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: this._id },
				{
					_id: this.merchant.sub,
					cards: {
						$elemMatch: {
							_id: this._id
						}
					}
				},
				{
					$set: {
						'cards.$.name': this.name,
						'cards.$.modified_by': this.merchant,
						'cards.$.modified_at': new Date(),
						'cards.$.inactive': this.inactive
					}
				},
				(err, success) => {
					if (err) {
						params[0] = lang.mstrUpdateError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrUpdateError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrRecordUpdate.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrRecordUpdate.message
						params[3] = success
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	deleteFinance() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.deleteOne({ _id: this._id }, () => {
				let uri = ''
				let Authorization = ''
				const data = `${config.payu_api_login}:${config.payu_api_key}`
				const buff = new Buffer.from(data)
				const base64data = buff.toString('base64')
				// Se elimina la tarjeta de la pasarela
				user.findOne({ _id: this.merchant.sub }, async (err, oUser) => {
					//c3c4effe2bf632889fdd188928ccee68f3d53f79
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						oUser.cards.forEach((card) => {
							if (card._id.toString() === this._id) {
								if (config.payment_gateway == 'PAYU') {
									uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/customers/${oUser.customer_id}/creditCards/${card.token_id}`
									Authorization = `Basic ${base64data}`
								} else {
									uri = `${config.culqi_uri}/cards/${card.card_id}`
									Authorization = `Bearer ${config.culqi_private_key}`
								}
							}
						})
						const idx = oUser.cards
							.map((e) => {
								return e._id
							})
							.indexOf(this._id)

						if (idx === -1) {
							params[0] = lang.mstrSearchError.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrSearchError.message
							reject(params)
							return
						}
						axios
							.delete(uri, {
								headers: {
									Authorization: Authorization
								}
							})
							.then((resp) => {
								user.updateOne(
									{
										_id: this.merchant.sub,
										cards: {
											$elemMatch: {
												_id: this._id
											}
										}
									},
									{
										$pull: {
											cards: {
												_id: this._id
											}
										}
									},
									(err, success) => {
										if (err) {
											params[0] =
												lang.mstrDeleteError.code
											params[1] =
												constant.ResponseCode.error
											params[2] = `${lang.mstrDeleteError.message}: ${err}`
											reject(params)
										} else {
											params[0] =
												lang.mstrRecordDelete.code
											params[1] =
												constant.ResponseCode.success
											params[2] =
												lang.mstrRecordDelete.message
											params[3] = success
											params[4] = resp.data
												? resp.data
												: resp
											resolve(params)
										}
									}
								)
							})
							.catch((err) => {
								params[0] = lang.mstrDeleteError.code
								params[1] = constant.ResponseCode.error
								params[2] = lang.mstrDeleteError.message
								params[3] = err.response
									? err.response.data
									: err
								reject(params)
							})
					}
				})
			})
		})
		return promise
	}
}

module.exports = Finance
