'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const service = require('../models').service

class Service {
	constructor(service = {}) {
		this.__id = service._id || ''
		this._name = service.name || ''
		this._merchant = service.merchant || {}
		this._create_by = service.create_by
		this._create_at = service.create_at || ''
		this._modified_by = service.modified_by
		this._modified_at = service.modified_at || ''
		this._inactive = service.inactive || false
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
				command: 'GET_SERVICES',
				event: 'getServices',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_SERVICE',
				event: 'registerService',
				required: ['name', 'inactive'],
				params: ['name', 'inactive']
			},
			{
				command: 'UPDATE_SERVICE',
				event: 'updateService',
				required: ['_id', 'name', 'inactive'],
				params: ['_id', 'name', 'inactive']
			},
			{
				command: 'DELETE_SERVICE',
				event: 'deleteService',
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
	getServices() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			service.find(filter, (err, oServices) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oServices
					resolve(params)
				}
			})
		})
		return promise
	}
	registerService() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objService = {
				name: this.name,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mService = new service(objService)
			mService.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mService
					resolve(params)
				}
			})
		})
		return promise
	}
	updateService() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			service.updateOne(
				{ _id: this._id },
				{
					name: this.name,
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
	deleteService() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			service.deleteOne({ _id: this._id }, (err) => {
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
}

module.exports = Service
