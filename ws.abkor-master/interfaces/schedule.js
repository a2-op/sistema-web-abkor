'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const schedule = require('../models').schedule

class Schedule {
	constructor(schedule = {}) {
		this.__id = schedule._id || ''
		this._alias = schedule.alias || ''
		this._sinceTime = schedule.sinceTime || ''
		this._untilTime = schedule.untilTime || ''
		this._date = schedule.date || ''
		this._merchant = schedule.merchant || {}
		this._create_by = schedule.create_by
		this._create_at = schedule.create_at || ''
		this._modified_by = schedule.modified_by
		this._modified_at = schedule.modified_at || ''
		this._inactive = schedule.inactive || false
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
				command: 'GET_SCHEDULE_USER',
				event: 'getScheduleUser',
				required: ['filter'],
				params: ['filter', 'inactive']
			},
			{
				command: 'GET_SCHEDULE',
				event: 'getSchedule',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_SCHEDULE',
				event: 'registerSchedule',
				required: [
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'inactive'
				],
				params: ['alias', 'sinceTime', 'untilTime', 'date', 'inactive']
			},
			{
				command: 'UPDATE_SCHEDULE',
				event: 'updateSchedule',
				required: [
					'_id',
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'inactive'
				],
				params: [
					'_id',
					'alias',
					'sinceTime',
					'untilTime',
					'date',
					'inactive'
				]
			},
			{
				command: 'DELETE_SCHEDULE',
				event: 'deleteSchedule',
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
	getScheduleUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			schedule.find(
				{ 'create_by.sub': this.filter },
				(err, oSchedule) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oSchedule
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	getSchedule() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			schedule.find(
				{ 'create_by.sub': this.merchant.sub },
				(err, oSchedule) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oSchedule
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerSchedule() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objSchedule = {
				alias: this.alias,
				sinceTime: this.sinceTime,
				untilTime: this.untilTime,
				date: this.date,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mSchedule = new schedule(objSchedule)
			mSchedule.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mSchedule
					resolve(params)
				}
			})
		})
		return promise
	}
	updateSchedule() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			schedule.updateOne(
				{ _id: this._id },
				{
					alias: this.alias,
					sinceTime: this.sinceTime,
					untilTime: this.untilTime,
					date: this.date,
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
	deleteSchedule() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			schedule.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Schedule
