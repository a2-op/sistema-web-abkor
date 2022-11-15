'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const axios = require('axios').default
const config = require('../config')
// const visit = require('../models').visit

class Visit {
	constructor(visit = {}) {
		this._id = visit.id || ''
		this._title = visit.title || ''
		this._address = visit.address || ''
		this._latitude = visit.latitude || 0
		this._longitude = visit.longitude || 0
		this._contact_name = visit.contact_name || ''
		this._contact_phone = visit.contact_phone || 0
		this._contact_email = visit.contact_email || ''
		this._reference = visit.reference || ''
		this._notes = visit.notes || ''
		this._planned_date = visit.planned_date || ''
	}

	// Getters & Setters
	get id() {
		return this._id
	}
	set id(value) {
		this._id = value || ''
	}
	get title() {
		return this._title
	}
	set title(value) {
		this._title = value || ''
	}
	get address() {
		return this._address
	}
	set address(value) {
		this._address = value || ''
	}
	get latitude() {
		return this._latitude
	}
	set latitude(value) {
		this._latitude = value || 0
	}
	get longitude() {
		return this._longitude
	}
	set longitude(value) {
		this._longitude = value || 0
	}
	get contact_name() {
		return this._contact_name
	}
	set contact_name(value) {
		this._contact_name = value || ''
	}
	get contact_phone() {
		return this._contact_phone
	}
	set contact_phone(value) {
		this._contact_phone = value || 0
	}
	get contact_email() {
		return this._contact_email
	}
	set contact_email(value) {
		this._contact_email = value || ''
	}
	get reference() {
		return this._reference
	}
	set reference(value) {
		this._reference = value || ''
	}
	get notes() {
		return this._notes
	}
	set notes(value) {
		this._notes = value || ''
	}
	get planned_date() {
		return this._planned_date
	}
	set planned_date(value) {
		this._planned_date = value || ''
	}
	// Methods
	eventByCommand(command) {
		const commands = [
			{
				command: 'GET_VISITS',
				event: 'getVisits',
				required: [],
				params: []
			},
			{
				command: 'GET_USERS_SIMPLIROUTE',
				event: 'getUsers',
				required: [],
				params: []
			},
			{
				command: 'REGISTER_VISIT',
				event: 'registerVisit',
				required: ['title', 'address', 'contact_name'],
				params: [
					'title',
					'address',
					'latitude',
					'longitude',
					'contact_name',
					'contact_phone',
					'contact_email',
					'reference',
					'notes',
					'planned_date'
				]
			},
			{
				command: 'UPDATE_VISIT',
				event: 'updateVisit',
				required: ['id', 'title', 'address'],
				params: [
					'id',
					'title',
					'address',
					'latitude',
					'longitude',
					'contact_name',
					'contact_phone',
					'contact_email',
					'reference',
					'notes',
					'planned_date'
				]
			},
			{
				command: 'DELETE_VISIT',
				event: 'deleteVisit',
				required: ['id'],
				params: ['id']
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
	getVisits() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = `${config.simpliroute_uri}/routes/visits/`
			let Authorization = `Token ${config.simpliroute_api_key}`
			axios
				.get(uri, {
					headers: {
						Authorization: Authorization
					}
				})
				.then((resp) => {
					if (resp.status === 401) {
						params[0] = '401'
						params[1] = constant.ResponseCode.error
						params[2] = `Invalid token.`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = resp.data
						resolve(params)
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
	getUsers() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = `${config.simpliroute_uri}/accounts/users/`
			let Authorization = `Token ${config.simpliroute_api_key}`
			axios
				.get(uri, {
					headers: {
						Authorization: Authorization
					}
				})
				.then((resp) => {
					if (resp.status === 401) {
						params[0] = '401'
						params[1] = constant.ResponseCode.error
						params[2] = `Invalid token.`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = resp.data
						resolve(params)
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
	registerVisit() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = `${config.simpliroute_uri}/routes/visits/`
			let Authorization = `Token ${config.simpliroute_api_key}`
			let object = {
				title: this.title,
				address: this.address,
				latitude: this.latitude,
				longitude: this.longitude,
				contact_name: this.contact_name,
				contact_phone: this.contact_phone,
				contact_email: this.contact_email,
				reference: this.reference,
				notes: this.notes,
				planned_date: this.planned_date
			}
			axios
				.post(uri, object, {
					headers: {
						Authorization: Authorization
					}
				})
				.then((resp) => {
					if (resp.status === 400) {
						params[0] = '400'
						params[1] = constant.ResponseCode.error
						params[2] = `Solicitud fallida.`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = resp.data
						resolve(params)
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
	updateVisit() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = `${config.simpliroute_uri}/routes/visits/${this.id}`
			let Authorization = `Token ${config.simpliroute_api_key}`
			let object = {
				title: this.title,
				address: this.address,
				latitude: this.latitude,
				longitude: this.longitude,
				contact_name: this.contact_name,
				contact_email: this.contact_email,
				contact_phone: this.contact_phone,
				reference: this.reference,
				notes: this.notes,
				planned_date: this.planned_date
			}
			axios
				.put(uri, object, {
					headers: {
						Authorization: Authorization
					}
				})
				.then((resp) => {
					if (resp.status === 400) {
						params[0] = '400'
						params[1] = constant.ResponseCode.error
						params[2] = `Solicitud fallida.`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						resolve(params)
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
	deleteVisit() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = `${config.simpliroute_uri}/routes/visits/${this.id}`
			let Authorization = `Token ${config.simpliroute_api_key}`
			axios
				.delete(uri, {
					headers: {
						Authorization: Authorization
					}
				})
				.then((resp) => {
					if (resp.status === 400) {
						params[0] = '400'
						params[1] = constant.ResponseCode.error
						params[2] = `Solicitud fallida.`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						resolve(params)
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
}

module.exports = Visit
