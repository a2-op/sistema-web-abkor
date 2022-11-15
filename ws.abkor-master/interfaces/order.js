'use strict'

const md5 = require('md5')
const mongoose = require(`mongoose`)
const axios = require('axios').default
const lang = require('../lang/es')
const constant = require(`../util/constant`)
const config = require('../config')
const order = require('../models').order
const product = require('../models').product
const user = require('../models').user

class Order {
	constructor(order = {}) {
		this.__id = order._id || ''
		this._user = order.user || {}
		this._products = order.products || []
		this._billing = order.billing || {}
		this._total_price = order.total_price || 0
		this._total_quantity = order.total_quantity || 0
		this._status = order.status
		this._operation_number = order.operation_number || 0
		this._method = order.method || 'CARD'
		this._merchant = order.merchant || {}
		this._create_by = order.create_by
		this._create_at = order.create_at || ''
		this._modified_by = order.modified_by
		this._modified_at = order.modified_at || ''
		this._inactive = order.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get user() {
		return this._user
	}
	set user(value) {
		this._user = value || ''
	}
	get products() {
		return this._products
	}
	set products(value) {
		this._products = value || ''
	}
	get billing() {
		return this._billing
	}
	set billing(value) {
		this._billing = value || {}
	}
	get total_price() {
		return this._total_price
	}
	set total_price(value) {
		this._total_price = value || ''
	}
	get total_quantity() {
		return this._total_quantity
	}
	set total_quantity(value) {
		this._total_quantity = value || ''
	}
	get status() {
		return this._status
	}
	set status(value) {
		this._status = value
	}
	get operation_number() {
		return this._operation_number
	}
	set operation_number(value) {
		this._operation_number = value
	}
	get method() {
		return this._method
	}
	set method(value) {
		this._method = value || 'CARD'
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
				command: 'GET_ORDERS',
				event: 'getOrders',
				required: ['inactive'],
				params: ['status', 'inactive']
			},
			{
				command: 'GET_LAST_ORDER',
				event: 'lastOrder',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_ORDER_RANGE',
				event: 'GetOrderRange',
				required: ['firstday', 'lastday'],
				params: ['firstday', 'lastday']
			},
			{
				command: 'GET_ORDER_RANGE_USER',
				event: 'GetOrderRangeUser',
				required: ['firstday', 'lastday'],
				params: ['firstday', 'lastday']
			},
			{
				command: 'GET_ORDERS_STATUS',
				event: 'getOrdersStatus',
				required: ['inactive'],
				params: ['inactive']
			},
			{
				command: 'GET_ORDERS_USER',
				event: 'getOrdersUser',
				required: ['inactive'],
				params: ['status', 'inactive']
			},
			{
				command: 'GET_ORDERS_USER_ID',
				event: 'getOrdersUserId',
				required: ['userId'],
				params: ['userId']
			},
			{
				command: 'GET_ORDERS_PROD',
				event: 'getOrdersProd',
				required: ['current_date'],
				params: ['current_date']
			},
			{
				command: 'REGISTER_ORDER',
				event: 'registerOrder',
				required: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity'
				],
				params: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity',
					'status',
					'operation_number',
					'method',
					'inactive'
				]
			},
			{
				command: 'REGISTER_ORDER_USER',
				event: 'registerOrderUser',
				required: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity'
				],
				params: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity',
					'status',
					'operation_number',
					'method',
					'inactive'
				]
			},
			{
				command: 'REGISTER_ORDER_APPOINTMENT',
				event: 'registerOrderAppointment',
				required: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity'
				],
				params: [
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity',
					'status',
					'operation_number',
					'method',
					'inactive'
				]
			},
			{
				command: 'UPDATE_ORDER_STATUS',
				event: 'updateOrderStatus',
				required: ['_id', 'status', 'inactive'],
				params: [
					'_id',
					'user',
					'products',
					'billing',
					'total_price',
					'total_quantity',
					'operation_number',
					'method',
					'status',
					'inactive'
				]
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
	getOrders() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			if (this.status) {
				filter.status = this.status
			}
			order.find(filter, (err, oOrders) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oOrders
					resolve(params)
				}
			})
		})
		return promise
	}
	lastOrder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			order
				.findOne(filter)
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
	GetOrderRange() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.aggregate(
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
	GetOrderRangeUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.aggregate(
				[
					{
						$match: {
							create_at: {
								$gte: new Date(this.firstday),
								$lte: new Date(this.lastday)
							},
							inactive: false,
							'user._id': mongoose.Types.ObjectId(
								this.merchant.sub
							)
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
				(err, oOrders) => {
					if (err) {
						params[0] = lang.mstrErrorSearching.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrErrorSearching.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oOrders
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	getOrdersStatus() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			order.find(filter, (err, oOrders) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oOrders
					resolve(params)
				}
			})
		})
		return promise
	}
	getOrdersUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			if (this.status) {
				filter.status = this.status
			}
			order.find({ 'user._id': this.merchant.sub }, (err, oOrders) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oOrders
					resolve(params)
				}
			})
		})
		return promise
	}
	getOrdersUserId() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.find({ 'user._id': this.userId }, (err, oOrders) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oOrders
					resolve(params)
				}
			})
		})
		return promise
	}
	getOrdersProd() {
		let params = []
		let filter = {}
		const promise = new Promise((resolve, reject) => {
			filter = {
				$lte: new Date(new Date(this.current_date).setHours(24)),
				$gte: new Date(new Date(this.current_date).setHours(24))
			}
			order.find(
				{
					inactive: false,
					date_trns: filter
				},
				(err, oOrders) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oOrders
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerOrder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let object = {}
			let Authorization = ''
			var orderId = mongoose.Types.ObjectId()
			const objOrder = {
				_id: orderId,
				user: this.user,
				products: this.products,
				billing: this.billing,
				total_price: this.total_price,
				total_quantity: this.total_quantity,
				status: 'PENDING',
				operation_number: this.operation_number,
				method: this.method,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			let description = 'Compra de Productos GetUp \n'
			this.products.forEach((product) => {
				description += `- ${product.name} \n`
			})
			const mOrder = new order(objOrder)
			const saveOrder = (data) => {
				mOrder.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						// SE REDUCE EL STOCK DE LOS PRODUCTOS
						const prods = []
						this.products.forEach((product) => {
							const idx = prods
								.map((e) => {
									return e._id
								})
								.indexOf(product._id)
							if (idx !== -1) {
								prods[idx].quantity += product.quantity
							} else {
								prods.push({
									product: product._id,
									quantity: product.quantity
								})
							}
						})
						prods.forEach((prod) => {
							product.updateOne(
								{ _id: prod.product },
								{
									$inc: {
										stock: -prod.quantity
									}
								},
								(err, success) => {
									console.log(err, success)
								}
							)
						})
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = data
						if (data.code === 'ERROR') {
							params[0] = data.code
							params[1] = constant.ResponseCode.error
							params[2] = data.error
							params[3] = data
							reject(params)
						} else {
							resolve(params)
						}
					}
				})
			}
			this.asynchronousMethod('', '')
				.then(async () => {
					if (this.method === 'CASH') {
						saveOrder({})
					} else {
						// SE GENERA LA VENTA MEDIANTE LA PASARELA
						if (config.payment_gateway == 'PAYU') {
							const signature = md5(
								`${config.payu_api_key}~${config.payu_merchant_id}~payment_getup_${mOrder._id}~${this.total_price}~${this.billing.currency}`
							)
							uri = config.payu_test
								? config.payu_uri_test_payments
								: config.payu_uri_prod_payments
							object = {
								language: 'es',
								command: 'SUBMIT_TRANSACTION',
								merchant: {
									apiKey: config.payu_api_key,
									apiLogin: config.payu_api_login
								},
								transaction: {
									order: {
										accountId: config.payu_account_id,
										referenceCode: `payment_getup_${mOrder._id}`,
										description: description,
										language: 'es',
										signature: signature,
										additionalValues: {
											TX_VALUE: {
												value: this.total_price,
												currency: this.billing.currency
											}
										},
										buyer: {
											fullName: this.user.name,
											emailAddress: this.user.email,
											dniNumber: this.user.document
										}
									},
									payer: {
										fullName: this.user.name,
										emailAddress: this.user.email,
										dniNumber: this.user.document
									},
									creditCard: {
										number: this.billing.card_number,
										securityCode: this.billing.ccv,
										expirationDate: this.billing.expiration.replace(
											'-',
											'/'
										),
										name: 'APPROVED'
									},
									extraParameters: {
										INSTALLMENTS_NUMBER: 1
									},
									type: 'AUTHORIZATION_AND_CAPTURE',
									paymentMethod: this.billing.type,
									paymentCountry: 'PE'
								},
								test: config.payu_test
							}
							Authorization = ''
						} else {
							// Se genera un token para la tarjeta
							Authorization = `Bearer ${config.culqi_public_key}`
							try {
								const resp = await axios.post(
									`${config.culqi_uri_secure}/tokens`,
									{
										card_number: this.billing.card_number,
										cvv: this.billing.ccv,
										expiration_month: this.billing.expiration.split(
											'-'
										)[1],
										expiration_year: this.billing.expiration.split(
											'-'
										)[0],
										email: this.user.email
									},
									{
										headers: {
											Authorization: Authorization
										}
									}
								)
								uri = `${config.culqi_uri}/charges`
								const amount =
									(Math.round(
										parseFloat(
											this.total_price.toString()
										).toFixed(2) * 100
									) /
										100) *
									100
								object = {
									amount: amount,
									currency_code: this.billing.currency,
									email: this.user.email,
									source_id: resp.data.id
								}
							} catch (err) {
								params[0] = lang.mstrSavingError.code
								params[1] = constant.ResponseCode.error
								params[2] = err.response
									? err.response.data.user_message
									: lang.mstrSavingError.message
								params[3] = err.response
									? err.response.data
									: err
								reject(params)
								return
							}
							Authorization = `Bearer ${config.culqi_private_key}`
						}

						this._id = orderId
						// ENVIANDO ORDEN DE VENTA
						axios
							.post(uri, object, {
								headers: {
									Authorization: Authorization
								}
							})
							.then((response) => {
								const data = response.data
								// SE CREA LA NUEVA ORDEN PENDIENTE DE ATENDER
								saveOrder(data)
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
								params[3] = err.response
									? err.response.data
									: err
								reject(params)
							})
					}
				})
				.catch((err) => {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrSavingError.message
					params[3] = err
					reject(params)
				})
		})
		return promise
	}
	registerOrderUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let object = {}
			let Authorization = ''
			var orderId = mongoose.Types.ObjectId()
			const objOrder = {
				_id: orderId,
				user: this.user,
				products: this.products,
				billing: this.billing,
				total_price: this.total_price,
				total_quantity: this.total_quantity,
				status: 'PENDING',
				operation_number: this.operation_number,
				method: this.method,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			let description = 'Compra de Productos GetUp \n'
			this.products.forEach((product) => {
				description += `- ${product.name} \n`
			})
			const mOrder = new order(objOrder)
			const saveOrder = (data) => {
				// SE CREA LA NUEVA ORDEN PENDIENTE DE ATENDER
				mOrder.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						// SE REDUCE EL STOCK DE LOS PRODUCTOS
						const prods = []
						this.products.forEach((product) => {
							const idx = prods
								.map((e) => {
									return e._id
								})
								.indexOf(product._id)
							if (idx !== -1) {
								prods[idx].quantity += product.quantity
							} else {
								prods.push({
									product: product._id,
									quantity: product.quantity
								})
							}
						})
						prods.forEach((prod) => {
							product.updateOne(
								{ _id: prod.product },
								{
									$inc: {
										stock: -prod.quantity
									}
								},
								(err, success) => {
									console.log(err, success)
								}
							)
						})
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = data
						if (data.code === 'ERROR') {
							params[0] = data.code
							params[1] = constant.ResponseCode.error
							params[2] = data.error
							params[3] = data
							reject(params)
						} else {
							resolve(params)
						}
					}
				})
			}
			this.asynchronousMethod('', '')
				.then(async () => {
					if (this.method === 'CASH') {
						saveOrder({})
					} else {
						// SE GENERA LA VENTA MEDIANTE LA PASARELA
						if (config.payment_gateway == 'PAYU') {
							const signature = md5(
								`${config.payu_api_key}~${config.payu_merchant_id}~payment_getup_${mOrder._id}~${this.total_price}~${this.billing.currency}`
							)
							uri = config.payu_test
								? config.payu_uri_test_payments
								: config.payu_uri_prod_payments
							object = {
								language: 'es',
								command: 'SUBMIT_TRANSACTION',
								merchant: {
									apiKey: config.payu_api_key,
									apiLogin: config.payu_api_login
								},
								transaction: {
									order: {
										accountId: config.payu_account_id,
										referenceCode: `payment_getup_${mOrder._id}`,
										description: description,
										language: 'es',
										signature: signature,
										additionalValues: {
											TX_VALUE: {
												value: this.total_price,
												currency: this.billing.currency
											}
										},
										buyer: {
											fullName: this.user.name,
											emailAddress: this.user.email,
											dniNumber: this.user.document
										}
									},
									payer: {
										fullName: this.user.name,
										emailAddress: this.user.email,
										dniNumber: this.user.document
									},
									creditCardTokenId: this.billing.token_id,
									creditCard: {
										processWithoutCvv2: 'false',
										securityCode: this.billing.ccv
									},
									extraParameters: {
										INSTALLMENTS_NUMBER: 1
									},
									type: 'AUTHORIZATION_AND_CAPTURE',
									paymentMethod: this.billing.type,
									paymentCountry: 'PE'
								},
								test: config.payu_test
							}
							Authorization = ''
						} else {
							uri = `${config.culqi_uri}/charges`
							const amount =
								(Math.round(
									parseFloat(
										this.total_price.toString()
									).toFixed(2) * 100
								) /
									100) *
								100
							this.billing.currency = 'PEN'
							object = {
								amount: amount,
								currency_code: this.billing.currency,
								email: this.user.email,
								source_id: this.billing.card_id
							}
							Authorization = `Bearer ${config.culqi_private_key}`
						}
						this._id = orderId
						// ENVIANDO ORDEN DE VENTA
						axios
							.post(uri, object, {
								headers: {
									Authorization: Authorization
								}
							})
							.then((response) => {
								const data = response.data
								saveOrder(data)
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
								params[3] = err.response
									? err.response.data
									: err
								reject(params)
							})
					}
				})
				.catch((err) => {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrSavingError.message
					params[3] = err
					reject(params)
				})
		})
		return promise
	}
	updatePlan(total_items, id) {
		let params = []
		let total = 0
		let plan = {}
		const promise = new Promise((resolve, reject) => {
			user.find({ _id: id }, (err, oUser) => {
				if (err) {
					return
				} else {
					plan = oUser[0].plan
					total =
						Number(plan.maximum_appointments) + Number(total_items)
					let objUser = {
						photos: plan.photos,
						includes: plan.includes,
						_id: plan._id,
						name: plan.name,
						duration: plan.duration,
						description: plan.description,
						price: plan.price,
						maximum_appointments: total,
						plan_id: plan.plan_id,
						state: plan.state,
						method: plan.method,
						operation_number: plan.operation_number,
						subscription_id: plan.subscription_id
					}
					user.updateOne(
						{ _id: id },
						{ plan: objUser },
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
				}
			})
		})
		return promise
	}
	registerOrderAppointment() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let object = {}
			let Authorization = ''
			var orderId = mongoose.Types.ObjectId()
			const objOrder = {
				_id: orderId,
				user: this.user,
				products: this.products,
				billing: this.billing,
				total_price: this.total_price,
				total_quantity: this.total_quantity,
				status: 'PENDING',
				operation_number: this.operation_number,
				method: this.method,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			let description = 'Compra de Productos GetUp \n'
			description += `- ${this.products.name} \n`
			const mOrder = new order(objOrder)
			const saveOrder = (data) => {
				// SE CREA LA NUEVA ORDEN PENDIENTE DE ATENDER
				mOrder.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = data
						this.updatePlan(this.total_quantity, this.user._id)
						if (data.code === 'ERROR') {
							params[0] = data.code
							params[1] = constant.ResponseCode.error
							params[2] = data.error
							params[3] = data
							reject(params)
						} else {
							resolve(params)
						}
					}
				})
			}
			this.asynchronousMethod('', '')
				.then(async () => {
					if (this.method === 'CASH') {
						saveOrder({})
					} else {
						// SE GENERA LA VENTA MEDIANTE LA PASARELA
						if (config.payment_gateway == 'PAYU') {
							const signature = md5(
								`${config.payu_api_key}~${config.payu_merchant_id}~payment_getup_${mOrder._id}~${this.total_price}~${this.billing.currency}`
							)
							uri = config.payu_test
								? config.payu_uri_test_payments
								: config.payu_uri_prod_payments
							object = {
								language: 'es',
								command: 'SUBMIT_TRANSACTION',
								merchant: {
									apiKey: config.payu_api_key,
									apiLogin: config.payu_api_login
								},
								transaction: {
									order: {
										accountId: config.payu_account_id,
										referenceCode: `payment_getup_${mOrder._id}`,
										description: description,
										language: 'es',
										signature: signature,
										additionalValues: {
											TX_VALUE: {
												value: this.total_price,
												currency: this.billing.currency
											}
										},
										buyer: {
											fullName: this.user.name,
											emailAddress: this.user.email
										}
									},
									payer: {
										fullName: this.user.name,
										emailAddress: this.user.email
									},
									creditCardTokenId: this.billing.token_id,
									creditCard: {
										processWithoutCvv2: 'false',
										securityCode: this.billing.ccv
									},
									extraParameters: {
										INSTALLMENTS_NUMBER: 1
									},
									type: 'AUTHORIZATION_AND_CAPTURE',
									paymentMethod: this.billing.type,
									paymentCountry: 'PE'
								},
								test: config.payu_test
							}
							Authorization = ''
						} else {
							uri = `${config.culqi_uri}/charges`
							const amount =
								(Math.round(
									parseFloat(
										this.total_price.toString()
									).toFixed(2) * 100
								) /
									100) *
								100
							this.billing.currency = 'PEN'
							object = {
								amount: amount,
								currency_code: this.billing.currency,
								email: this.user.email,
								source_id: this.billing.card_id
							}
							Authorization = `Bearer ${config.culqi_private_key}`
						}
						this._id = orderId
						// ENVIANDO ORDEN DE VENTA
						axios
							.post(uri, object, {
								headers: {
									Authorization: Authorization
								}
							})
							.then((response) => {
								const data = response.data
								saveOrder(data)
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
								params[3] = err.response
									? err.response.data
									: err
								reject(params)
							})
					}
				})
				.catch((err) => {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrSavingError.message
					params[3] = err
					reject(params)
				})
		})
		return promise
	}
	updateOrderStatus() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.updateOne(
				{ _id: this._id },
				{
					user: this.user,
					products: this.products,
					billing: this.billing,
					total_price: this.total_price,
					total_quantity: this.total_quantity,
					status: this.status,
					operation_number: this.operation_number,
					method: this.method,
					modified_by: this.merchant,
					modified_at: new Date(),
					inactive: this.inactive
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
	updateOrder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.updateOne(
				{ _id: this._id },
				{
					user: this.user,
					products: this.products,
					billing: this.billing,
					total_price: this.total_price,
					total_quantity: this.total_quantity,
					status: this.status,
					operation_number: this.operation_number,
					method: this.method,
					modified_by: this.merchant,
					modified_at: new Date(),
					inactive: this.inactive
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
	deleteOrder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			order.deleteOne({ _id: this._id }, (err) => {
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
		})
		return promise
	}
	asynchronousMethod(param1, param2) {
		const promise = new Promise((resolve, reject) => {
			if (param1 === param2) {
				resolve({ message: 'success' })
			} else {
				reject({ message: 'error' })
			}
		})
		return promise
	}
}

module.exports = Order
