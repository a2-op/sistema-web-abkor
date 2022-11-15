'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const appointment = require('../models').appointment
const user = require('../models').user

class Appointment {
	constructor(appointment = {}) {
		this.__id = appointment._id || ''
		this._alias = appointment.alias || ''
		this._sinceTime = appointment.sinceTime || ''
		this._untilTime = appointment.untilTime || ''
		this._date = appointment.date || ''
		this._nutritionist = appointment.nutritionist || ''
		this._price = appointment.price || 0
		this._code = appointment.code || ''
		this._merchant = appointment.merchant || {}
		this._create_by = appointment.create_by
		this._create_at = appointment.create_at || ''
		this._modified_by = appointment.modified_by
		this._modified_at = appointment.modified_at || ''
		this._inactive = appointment.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get alias() {
		return this._alias
	}
	set alias(value) {
		this._alias = value || ''
	}
	get sinceTime() {
		return this._sinceTime
	}
	set sinceTime(value) {
		this._sinceTime = value || ''
	}
	get untilTime() {
		return this._untilTime
	}
	set untilTime(value) {
		this._untilTime = value || ''
	}
	get date() {
		return this._date
	}
	set date(value) {
		this._date = value || ''
	}
	get nutritionist() {
		return this._nutritionist
	}
	set nutritionist(value) {
		this._nutritionist = value || ''
	}
	get price() {
		return this._price
	}
	set price(value) {
		this._price = value || 0
	}
	get code() {
		return this._code
	}
	set code(value) {
		this._code = value || ''
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
				command: 'GET_APPOINTMENTS',
				event: 'getAppointments',
				required: ['code'],
				params: ['code', 'inactive']
			},
			{
				command: 'GET_ADMIN_APPOINTMENTS',
				event: 'getAdminAppointments',
				required: ['code'],
				params: ['code', 'inactive']
			},
			{
				command: 'GET_APPOINTMENTS_NUTRITIONIST',
				event: 'getAppointmentsNutritionist',
				required: ['code'],
				params: ['code']
			},
			{
				command: 'GET_APPOINTMENTS_NUTRITIONIST_RANGE',
				event: 'getAppointmentsNutritionistRange',
				required: ['code', 'firstday', 'lastday'],
				params: ['code', 'firstday', 'lastday']
			},
			{
				command: 'GET_APPOINTMENTS_CLIENT',
				event: 'getAppointmentsClient',
				required: ['code'],
				params: ['code']
			},
			{
				command: 'REGISTER_APPOINTMENT',
				event: 'registerAppointment',
				required: [
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'nutritionist',
					'code',
					'inactive'
				],
				params: [
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'nutritionist',
					'code',
					'inactive'
				]
			},
			{
				command: 'REGISTER_APPOINTMENT_ADMIN',
				event: 'registerAppointmentAdmin',
				required: ['alias', 'price', 'code', 'inactive'],
				params: ['alias', 'price', 'code', 'inactive']
			},
			{
				command: 'UPDATE_APPOINTMENT',
				event: 'updateAppointment',
				required: [
					'_id',
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'nutritionist',
					'code',
					'inactive'
				],
				params: [
					'_id',
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'nutritionist',
					'code',
					'inactive'
				]
			},
			{
				command: 'UPDATE_APPOINTMENT_ADMIN',
				event: 'updateAppointmentAdmin',
				required: ['_id', 'price', 'code', 'inactive'],
				params: [
					'_id',
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'nutritionist',
					'price',
					'code',
					'inactive'
				]
			},
			{
				command: 'DELETE_APPOINTMENT',
				event: 'deleteAppointment',
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
	getAppointments() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.find({ code: this.code }, (err, oAppointments) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oAppointments
					resolve(params)
				}
			})
		})
		return promise
	}
	getAdminAppointments() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.find({ code: this.code }, (err, oAppointments) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = !oAppointments.price ? oAppointments : []
					resolve(params)
				}
			})
		})
		return promise
	}
	getAppointmentsNutritionist() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.find(
				{ nutritionist: this.merchant.sub, code: this.code },
				(err, oAppointments) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oAppointments
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	getAppointmentsNutritionistRange() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.aggregate(
				[
					{
						$match: {
							date: {
								$gte: new Date(this.firstday),
								$lte: new Date(this.lastday)
							},
							inactive: false,
							nutritionist: this.merchant.sub,
							code: this.code
						}
					},
					{
						$group: {
							_id: {
								month: { $month: '$date' },
								day: { $dayOfMonth: '$date' },
								year: { $year: '$date' }
							},
							count: { $sum: 1 }
						}
					}
				],
				(err, oAppointments) => {
					if (err) {
						params[0] = lang.mstrErrorSearching.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrErrorSearching.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oAppointments
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	getAppointmentsClient() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.find(
				{ 'create_by.sub': this.merchant.sub, code: this.code },
				(err, oAppointments) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oAppointments
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	addPatients(idUsr, xpatients) {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: idUsr },
				{
					patients: xpatients,
					inactive: false
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
	registerAppointment() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objAppointment = {
				alias: this.alias,
				sinceTime: this.sinceTime,
				untilTime: this.untilTime,
				date: this.date,
				nutritionist: this.nutritionist,
				code: this.code,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mAppointment = new appointment(objAppointment)
			mAppointment.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					this.addPatients(this.nutritionist, this.merchant)
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mAppointment
					resolve(params)
				}
			})
		})
		return promise
	}
	registerAppointmentAdmin() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objAppointment = {
				alias: this.alias,
				price: this.price,
				code: this.code,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mAppointment = new appointment(objAppointment)
			mAppointment.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					this.addPatients(this.nutritionist, this.merchant)
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mAppointment
					resolve(params)
				}
			})
		})
		return promise
	}
	updateAppointment() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.updateOne(
				{ _id: this._id },
				{
					alias: this.alias,
					sinceTime: this.sinceTime,
					untilTime: this.untilTime,
					date: this.date,
					nutritionist: this.nutritionist,
					code: this.code,
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
	updateAppointmentAdmin() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.updateOne(
				{ _id: this._id },
				{
					alias: this.alias,
					sinceTime: this.sinceTime,
					untilTime: this.untilTime,
					date: this.date,
					nutritionist: this.nutritionist,
					price: this.price,
					code: this.code,
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
	deleteAppointment() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			appointment.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Appointment
