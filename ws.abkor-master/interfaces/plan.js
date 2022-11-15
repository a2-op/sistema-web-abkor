'use strict'

const axios = require('axios').default
const mongoose = require(`mongoose`)
const comun = require(`../util/comun`)
const lang = require('../lang/es')
const constant = require(`../util/constant`)
const config = require('../config')
const cloudinary = require('cloudinary').v2
const plan = require('../models').plan
const isBase64 = require('is-base64')

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Plan {
	constructor(plan = {}) {
		this.__id = plan._id || ''
		this._name = plan.name || ''
		this._photos = plan.photos || []
		this._includes = plan.includes || []
		this._duration = plan.duration || 0
		this._price = plan.price || 0
		this._maximum_appointments = plan.maximum_appointments || 0
		this._plan_id = plan.plan_id || ''
		this._description = plan.description || ''
		this._merchant = plan.merchant || {}
		this._create_by = plan.create_by
		this._create_at = plan.create_at || ''
		this._modified_by = plan.modified_by
		this._modified_at = plan.modified_at || ''
		this._inactive = plan.inactive || false
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
	get photos() {
		return this._photos
	}
	set photos(value) {
		this._photos = value || []
	}
	get includes() {
		return this._includes
	}
	set includes(value) {
		this._includes = value || []
	}
	get duration() {
		return this._duration
	}
	set duration(value) {
		this._duration = value || 0
	}
	get price() {
		return this._price
	}
	set price(value) {
		this._price = value || 0
	}
	get maximum_appointments() {
		return this._maximum_appointments
	}
	set maximum_appointments(value) {
		this._maximum_appointments = value || 0
	}
	get description() {
		return this._description
	}
	set description(value) {
		this._description = value || 0
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
		this._create_by = value
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
		this._modified_by = value
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
				command: 'GET_PLANS',
				event: 'getPlans',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_LAST_PLAN',
				event: 'lastPlan',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_PLAN_RANGE',
				event: 'GetPlanRange',
				required: ['firstday', 'lastday'],
				params: ['firstday', 'lastday']
			},
			{
				command: 'REGISTER_PLAN',
				event: 'registerPlan',
				required: ['name', 'includes', 'duration', 'price', 'inactive'],
				params: [
					'name',
					'photos',
					'includes',
					'duration',
					'price',
					'maximum_appointments',
					'plan_id',
					'description',
					'inactive'
				]
			},
			{
				command: 'UPDATE_PLAN',
				event: 'updatePlan',
				required: [
					'_id',
					'name',
					'includes',
					'duration',
					'price',
					'inactive'
				],
				params: [
					'_id',
					'name',
					'photos',
					'includes',
					'duration',
					'price',
					'maximum_appointments',
					'plan_id',
					'description',
					'inactive'
				]
			},
			{
				command: 'DELETE_PLAN',
				event: 'deletePlan',
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
	getPlans() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			plan.find(filter, (err, oPlans) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oPlans
					resolve(params)
				}
			})
		})
		return promise
	}
	lastPlan() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			plan.findOne(filter)
				.sort({ create_at: -1 })
				.limit(1)
				.exec((err, oPlans) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oPlans
						resolve(params)
					}
				})
		})
		return promise
	}
	GetPlanRange() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			plan.aggregate(
				[
					{
						$match: {
							create_at: {
								$gte: new Date(this.firstday),
								$lte: new Date(this.lastday)
							},
							inactive: false
						}
					},
					{
						$group: {
							_id: {
								month: { $month: '$create_at' },
								day: { $dayOfMonth: '$create_at' },
								year: { $year: '$create_at' }
							},
							count: { $sum: 1 }
						}
					}
				],
				(err, oPlans) => {
					if (err) {
						params[0] = lang.mstrErrorSearching.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrErrorSearching.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oPlans
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerPlan() {
		let params = []
		const newPhotos = []
		const promise = new Promise((resolve, reject) => {
			var planId = mongoose.Types.ObjectId()
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.photos.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				const name = `./fileserver/${planId}-${index + 1}.png`
				comun.base64_decode(photo, name)
				cloudinary.uploader.upload(
					name,
					{
						public_id: `${this.merchant.sub}-${index + 1}`
					},
					(error, result) => {
						if (error) {
							params[0] = lang.mstrUploadError.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrUploadError.message
							params[3] = error
							reject(params)
						} else {
							newPhotos.push(result.secure_url)
							if (newPhotos.length === this.photos.length) {
								let uri = ''
								let object = {}
								let Authorization = ''
								const data = `${config.payu_api_login}:${config.payu_api_key}`
								const buff = new Buffer.from(data)
								const base64data = buff.toString('base64')
								const objPlan = {
									_id: planId,
									name: this.name,
									photos: newPhotos,
									includes: this.includes,
									duration: this.duration,
									description: this.description,
									price: this.price,
									maximum_appointments: this
										.maximum_appointments,
									interval_count: 30,
									interval: 'dias',
									plan_id: this.plan_id,
									create_by: this.merchant,
									create_at: new Date(),
									inactive: this.inactive
								}
								console.log(objPlan)
								// SE REGISTRA EL NUEVO PLAN EN LA PASARELA
								if (config.payment_gateway == 'PAYU') {
									uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans`
									object = {
										accountId: config.payu_account_id,
										planCode: planId,
										description: this.name,
										maxPaymentsAllowed: this.duration,
										paymentAttemptsDelay:
											config.payu_payment_attempts_delay,
										additionalValues: [
											{
												name: 'PLAN_VALUE',
												value: parseFloat(
													this.price
												).toFixed(2),
												currency: 'PEN'
											}
										]
									}
									Authorization = `Basic ${base64data}`
								} else {
									uri = `${config.culqi_uri}/plans`
									const amount =
										(Math.round(
											parseFloat(
												this.price.toString()
											).toFixed(2) * 100
										) /
											100) *
										100
									object = {
										name: this.name,
										amount: amount,
										currency_code: 'PEN',
										limit: this.duration,
										metdata: objPlan
									}
									Authorization = `Bearer ${config.culqi_private_key}`
								}
								axios
									.post(uri, object, {
										headers: {
											Authorization: Authorization
										}
									})
									.then((resp) => {
										const data = resp.data
										objPlan.plan_id = data.id
										const mPlan = new plan(objPlan)
										mPlan.save((err) => {
											if (err) {
												params[0] =
													lang.mstrSavingError.code
												params[1] =
													constant.ResponseCode.error
												params[2] = `${lang.mstrSavingError.message}: ${err}`
												reject(params)
											} else {
												params[0] =
													lang.mstrSavedRecord.code
												params[1] =
													constant.ResponseCode.success
												params[2] =
													lang.mstrSavedRecord.message
												params[3] = mPlan
												resolve(params)
											}
										})
									})
									.catch((err) => {
										params[0] = lang.mstrSavingError.code
										params[1] = constant.ResponseCode.error
										params[2] = err.response
											? err.response.data.user_message
											: lang.mstrSavingError.message
										params[3] = err.response
											? err.response.data
											: err
										reject(params)
									})
							}
						}
					}
				)
			})
			if (this.photos.length <= 0) {
				let uri = ''
				let object = {}
				let Authorization = ''
				const data = `${config.payu_api_login}:${config.payu_api_key}`
				const buff = new Buffer.from(data)
				const base64data = buff.toString('base64')
				const objPlan = {
					_id: planId,
					name: this.name,
					photos: this.photos,
					includes: this.includes,
					duration: this.duration,
					description: this.description,
					price: this.price,
					maximum_appointments: this.maximum_appointments,
					interval_count: 30,
					interval: 'dias',
					plan_id: this.plan_id,
					create_by: this.merchant,
					create_at: new Date(),
					inactive: this.inactive
				}
				// SE REGISTRA EL NUEVO PLAN EN LA PASARELA
				if (config.payment_gateway == 'PAYU') {
					uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans`
					object = {
						accountId: config.payu_account_id,
						planCode: planId,
						description: this.name,
						interval_count: 30,
						interval: 'dias',
						maxPaymentsAllowed: this.duration,
						paymentAttemptsDelay:
							config.payu_payment_attempts_delay,
						additionalValues: [
							{
								name: 'PLAN_VALUE',
								value: parseFloat(this.price).toFixed(2),
								currency: 'PEN'
							}
						]
					}
					Authorization = `Basic ${base64data}`
				} else {
					uri = `${config.culqi_uri}/plans`
					const amount =
						(Math.round(
							parseFloat(this.price.toString()).toFixed(2) * 100
						) /
							100) *
						100
					object = {
						name: this.name,
						amount: amount,
						currency_code: 'PEN',
						interval_count: 30,
						interval: 'dias',
						limit: this.duration,
						metdata: objPlan
					}
					Authorization = `Bearer ${config.culqi_private_key}`
				}
				axios
					.post(uri, object, {
						headers: {
							Authorization: Authorization
						}
					})
					.then((resp) => {
						const data = resp.data
						objPlan.plan_id = data.id
						const mPlan = new plan(objPlan)
						mPlan.save((err) => {
							if (err) {
								params[0] = lang.mstrSavingError.code
								params[1] = constant.ResponseCode.error
								params[2] = `${lang.mstrSavingError.message}: ${err}`
								reject(params)
							} else {
								params[0] = lang.mstrSavedRecord.code
								params[1] = constant.ResponseCode.success
								params[2] = lang.mstrSavedRecord.message
								params[3] = mPlan
								resolve(params)
							}
						})
					})
					.catch((err) => {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = err.response
							? err.response.data.user_message
							: lang.mstrSavingError.message
						params[3] = err.response ? err.response.data : err
						reject(params)
					})
			}
		})
		return promise
	}
	updatePlan() {
		let params = []
		const newPhotos = []
		const promise = new Promise((resolve, reject) => {
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.photos.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				if (isBase64(photo) && photo != '') {
					const name = `./fileserver/${this._id}-${index + 1}.png`
					comun.base64_decode(photo, name)
					cloudinary.uploader.upload(
						name,
						{
							public_id: `${this.merchant.sub}-${index + 1}`
						},
						(error, result) => {
							if (error) {
								params[0] = lang.mstrUploadError.code
								params[1] = constant.ResponseCode.error
								params[2] = lang.mstrUploadError.message
								params[3] = error
								reject(params)
							} else {
								newPhotos.push(result.secure_url)
								if (newPhotos.length === this.photos.length) {
									let uri = ''
									let object = {}
									let Authorization = ''
									let method = ''
									const data = `${config.payu_api_login}:${config.payu_api_key}`
									const buff = new Buffer.from(data)
									const base64data = buff.toString('base64')
									// Se actualiza el plan localmente
									let objPlan = {
										name: this.name,
										photos: newPhotos,
										includes: this.includes,
										duration: this.duration,
										price: this.price,
										maximum_appointments: this
											.maximum_appointments,
										plan_id: this.plan_id,
										description: this.description,
										modified_by: this.merchant,
										modified_at: new Date(),
										inactive: this.inactive
									}
									plan.updateOne(
										{ _id: this._id },
										objPlan,
										(err, success) => {
											if (err) {
												params[0] =
													lang.mstrUpdateError.code
												params[1] =
													constant.ResponseCode.error
												params[2] = `${lang.mstrUpdateError.message}: ${err}`
												reject(params)
											} else {
												params[0] =
													lang.mstrRecordUpdate.code
												params[1] =
													constant.ResponseCode.success
												params[2] =
													lang.mstrRecordUpdate.message
												params[3] = success
												resolve(params)
											}
										}
									)
									// Se actualiza el plan en la pasarela
									if (config.payment_gateway == 'PAYU') {
										uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans${this.id}`
										object = {
											planCode: this.id,
											description: this.name,
											paymentAttemptsDelay:
												config.payu_payment_attempts_delay,
											maxPendingPayments: '1',
											maxPaymentAttempts: this.duration,
											additionalValues: [
												{
													name: 'PLAN_VALUE',
													value: parseFloat(
														this.price
													).toFixed(2),
													currency: 'PEN'
												}
											]
										}
										Authorization = `Basic ${base64data}`
										method = 'PUT'
									} else {
										uri = `${config.culqi_uri}/plans/${this.plan_id}`
										object = {
											metadata: {
												id: this.id
											}
										}
										Authorization = `Bearer ${config.culqi_private_key}`
										method = 'PATCH'
									}
									axios
										.request({
											url: uri,
											method: method,
											headers: {
												Authorization: Authorization
											},
											params: {},
											data: object
										})
										.then((resp) => {
											console.log(resp)
										})
										.catch((err) => {
											console.log(err)
										})
								}
							}
						}
					)
				} else {
					newPhotos.push(photo)
					if (newPhotos.length === this.photos.length) {
						let uri = ''
						let object = {}
						let Authorization = ''
						let method = ''
						const data = `${config.payu_api_login}:${config.payu_api_key}`
						const buff = new Buffer.from(data)
						const base64data = buff.toString('base64')
						// Se actualiza el plan localmente
						let objPlan = {
							name: this.name,
							photos: newPhotos,
							includes: this.includes,
							duration: this.duration,
							price: this.price,
							plan_id: this.plan_id,
							description: this.description,
							modified_by: this.merchant,
							modified_at: new Date(),
							inactive: this.inactive
						}
						plan.updateOne(
							{ _id: this._id },
							objPlan,
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
						// Se actualiza el plan en la pasarela
						if (config.payment_gateway == 'PAYU') {
							uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans${this.id}`
							object = {
								planCode: this.id,
								description: this.name,
								paymentAttemptsDelay:
									config.payu_payment_attempts_delay,
								maxPendingPayments: '1',
								maxPaymentAttempts: this.duration,
								additionalValues: [
									{
										name: 'PLAN_VALUE',
										value: parseFloat(this.price).toFixed(
											2
										),
										currency: 'PEN'
									}
								]
							}
							Authorization = `Basic ${base64data}`
							method = 'PUT'
						} else {
							uri = `${config.culqi_uri}/plans/${this.plan_id}`
							object = {
								metadata: {
									id: this.id
								}
							}
							Authorization = `Bearer ${config.culqi_private_key}`
							method = 'PATCH'
						}
						axios
							.request({
								url: uri,
								method: method,
								headers: {
									Authorization: Authorization
								},
								params: {},
								data: object
							})
							.then((resp) => {
								console.log(resp)
							})
							.catch((err) => {
								console.log(err)
							})
					}
				}
			})
			if (this.photos.length <= 0) {
				let uri = ''
				let object = {}
				let Authorization = ''
				let method = ''
				const data = `${config.payu_api_login}:${config.payu_api_key}`
				const buff = new Buffer.from(data)
				const base64data = buff.toString('base64')
				// Se actualiza el plan localmente
				let objPlan = {
					name: this.name,
					photos: this.photos,
					includes: this.includes,
					duration: this.duration,
					price: this.price,
					maximum_appointments: this.maximum_appointments,
					plan_id: this.plan_id,
					description: this.description,
					modified_by: this.merchant,
					modified_at: new Date(),
					inactive: this.inactive
				}
				plan.updateOne({ _id: this._id }, objPlan, (err, success) => {
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
				})
				// Se actualiza el plan en la pasarela
				if (config.payment_gateway == 'PAYU') {
					uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans${this.id}`
					object = {
						planCode: this.id,
						description: this.name,
						paymentAttemptsDelay:
							config.payu_payment_attempts_delay,
						maxPendingPayments: '1',
						maxPaymentAttempts: this.duration,
						additionalValues: [
							{
								name: 'PLAN_VALUE',
								value: parseFloat(this.price).toFixed(2),
								currency: 'PEN'
							}
						]
					}
					Authorization = `Basic ${base64data}`
					method = 'PUT'
				} else {
					uri = `${config.culqi_uri}/plans/${this.plan_id}`
					object = {
						metadata: {
							id: this.id
						}
					}
					Authorization = `Bearer ${config.culqi_private_key}`
					method = 'PATCH'
				}
				axios
					.request({
						url: uri,
						method: method,
						headers: {
							Authorization: Authorization
						},
						params: {},
						data: object
					})
					.then((resp) => {
						console.log(resp)
					})
					.catch((err) => {
						console.log(err)
					})
			}
		})
		return promise
	}
	deletePlan() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let Authorization = ''
			const data = `${config.payu_api_login}:${config.payu_api_key}`
			const buff = new Buffer.from(data)
			const base64data = buff.toString('base64')
			plan.deleteOne({ _id: this._id }, (err) => {
				if (err) {
					params[0] = lang.mstrDeleteError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrDeleteError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrRecordDelete.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordDelete.message
					resolve(params)
				}
			})
			// Se elimina el plan en la pasarela
			if (config.payment_gateway == 'PAYU') {
				uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/plans${this._id}`
				Authorization = `Basic ${base64data}`

				axios
					.delete(uri, {
						headers: {
							Authorization: Authorization
						}
					})
					.then((resp) => {
						console.log(resp)
					})
					.catch((err) => {
						console.log(err)
					})
			} else {
				// Se obtiene el codigo del plan de la pasarela
				plan.findOne(
					{ _id: this._id },
					{ plan_id: 1 },
					(err, oPlan) => {
						if (err) {
							console.log(err)
						} else {
							this.plan_id = oPlan.plan_id
							uri = `${config.culqi_uri}/plans/${this.plan_id}`
							Authorization = `Bearer ${config.culqi_private_key}`
							axios
								.delete(uri, {
									headers: {
										Authorization: Authorization
									}
								})
								.then((resp) => {
									console.log(resp)
								})
								.catch((err) => {
									console.log(err)
								})
						}
					}
				)
			}
		})
		return promise
	}
}

module.exports = Plan
