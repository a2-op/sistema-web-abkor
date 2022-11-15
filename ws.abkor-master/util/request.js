'use strict'
const lang = require('../lang/es')
const comun = require(`../util/comun`)
const constant = require(`../util/constant`)
const services = require('../services')

const executePetition = (type, objectClass, req, authentication = true) => {
	let promise = null
	switch (type) {
		case 'GET': {
			promise = new Promise((resolve, reject) => {
				let params = {}
				const oparams = req.query
				const oClass = new objectClass()
				const event = oClass.eventByCommand(oparams.command)
				if (event !== null) {
					// Evaluando parametros requeridos
					let transaction = {}
					try {
						transaction = JSON.parse(oparams.transaction)
					} catch (err) {
						transaction = {}
					}
					const aux = comun.containProps(transaction, event.required)
					if (aux) {
						event.params.forEach((element) => {
							oClass[element] = transaction[element]
						})
						// Se decodifica el token
						if (authentication) {
							const token = req.headers.authorization.split(
								' '
							)[1]
							services
								.decodeToken(token)
								.then((response) => {
									oClass.merchant = response.response.user
									oClass[event.event]()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								})
								.catch((response) => {
									params[0] = response.code
									params[1] = constant.ResponseCode.error
									params[2] = response.message
									reject(params)
								})
						} else {
							oClass[event.event]()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						}
					} else {
						params[0] = lang.mstrRequiredParameters.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRequiredParameters.message
						reject(params)
					}
				} else {
					params[0] = lang.mstrNotFoundOperation.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrNotFoundOperation.message
					reject(params)
				}
			})
			break
		}
		case 'POST': {
			promise = new Promise((resolve, reject) => {
				let params = {}
				const body = req.body
				const data = body.transaction
				const oClass = new objectClass()
				const event = oClass.eventByCommand(body.command)
				if (event !== null) {
					// Evaluando parametros requeridos
					const aux = comun.containProps(data, event.required)
					if (aux) {
						event.params.forEach((element) => {
							oClass[element] = data[element]
						})
						// Se decodifica el token
						if (authentication) {
							const token = req.headers.authorization.split(
								' '
							)[1]
							services
								.decodeToken(token)
								.then((response) => {
									oClass.merchant = response.response.user
									oClass[event.event]()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								})
								.catch((response) => {
									params[0] = response.code
									params[1] = constant.ResponseCode.error
									params[2] = response.message
									reject(params)
								})
						} else {
							oClass[event.event]()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						}
					} else {
						params[0] = lang.mstrRequiredParameters.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRequiredParameters.message
						reject(params)
					}
				} else {
					params[0] = lang.mstrNotFoundOperation.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrNotFoundOperation.message
					reject(params)
				}
			})
			break
		}
		case 'PUT': {
			promise = new Promise((resolve, reject) => {
				let params = {}
				const body = req.body
				const data = body.transaction
				const oClass = new objectClass()
				if (req.params.id) {
					data._id = req.params.id
				}
				const event = oClass.eventByCommand(body.command)
				if (event !== null) {
					// Evaluando parametros requeridos
					const aux = comun.containProps(data, event.required)
					if (aux) {
						event.params.forEach((element) => {
							oClass[element] = data[element]
						})
						// Se decodifica el token
						if (authentication) {
							const token = req.headers.authorization.split(
								' '
							)[1]
							services
								.decodeToken(token)
								.then((response) => {
									oClass.merchant = response.response.user
									oClass[event.event]()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								})
								.catch((response) => {
									params[0] = response.code
									params[1] = constant.ResponseCode.error
									params[2] = response.message
									reject(params)
								})
						} else {
							oClass[event.event]()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						}
					} else {
						params[0] = lang.mstrRequiredParameters.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRequiredParameters.message
						reject(params)
					}
				} else {
					params[0] = lang.mstrNotFoundOperation.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrNotFoundOperation.message
					reject(params)
				}
			})
			break
		}
		case 'PATCH': {
			promise = new Promise((resolve, reject) => {
				let params = {}
				const body = req.body
				const data = body.transaction
				const oClass = new objectClass()
				if (req.params.id) {
					data._id = req.params.id
				}
				const event = oClass.eventByCommand(body.command)
				if (event !== null) {
					// Evaluando parametros requeridos
					const aux = comun.containProps(data, event.required)
					if (aux) {
						event.params.forEach((element) => {
							oClass[element] = data[element]
						})
						// Se decodifica el token
						if (authentication) {
							const token = req.headers.authorization.split(
								' '
							)[1]
							services
								.decodeToken(token)
								.then((response) => {
									oClass.merchant = response.response.user
									oClass[event.event]()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								})
								.catch((response) => {
									params[0] = response.code
									params[1] = constant.ResponseCode.error
									params[2] = response.message
									reject(params)
								})
						} else {
							oClass[event.event]()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						}
					} else {
						params[0] = lang.mstrRequiredParameters.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRequiredParameters.message
						reject(params)
					}
				} else {
					params[0] = lang.mstrNotFoundOperation.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrNotFoundOperation.message
					reject(params)
				}
			})
			break
		}
		case 'DELETE': {
			promise = new Promise((resolve, reject) => {
				let params = {}
				const body = req.body
				let data = {}
				const oClass = new objectClass()
				if (req.params.id) {
					data._id = req.params.id
				}
				const event = oClass.eventByCommand(body.command)
				if (event !== null) {
					// Evaluando parametros requeridos
					const aux = comun.containProps(data, event.required)
					if (aux) {
						event.params.forEach((element) => {
							oClass[element] = data[element]
						})
						// Se decodifica el token
						if (authentication) {
							const token = req.headers.authorization.split(
								' '
							)[1]
							services
								.decodeToken(token)
								.then((response) => {
									oClass.merchant = response.response.user
									oClass[event.event]()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								})
								.catch((response) => {
									params[0] = response.code
									params[1] = constant.ResponseCode.error
									params[2] = response.message
									reject(params)
								})
						} else {
							oClass[event.event]()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						}
					} else {
						params[0] = lang.mstrRequiredParameters.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRequiredParameters.message
						reject(params)
					}
				} else {
					params[0] = lang.mstrNotFoundOperation.code
					params[1] = constant.ResponseCode.error
					params[2] = lang.mstrNotFoundOperation.message
					reject(params)
				}
			})
			break
		}
	}
	return promise
}

module.exports = {
	executePetition
}
