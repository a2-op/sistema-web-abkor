'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const reminder = require('../models').reminder

class Reminder {
	constructor(reminder = {}) {
		this.__id = reminder._id || ''
		this._name = reminder.name || ''
		this._send_to = reminder.send_to || ''
		this._date = reminder.date || ''
		this._hour = reminder.hour || ''
		this._merchant = reminder.merchant || {}
		this._create_by = reminder.create_by
		this._create_at = reminder.create_at || ''
		this._modified_by = reminder.modified_by
		this._modified_at = reminder.modified_at || ''
		this._inactive = reminder.inactive || false
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
	get send_to() {
		return this._send_to
	}
	set send_to(value) {
		this._send_to = value || ''
	}
	get date() {
		return this._date
	}
	set date(value) {
		this._date = value || ''
	}
	get hour() {
		return this._hour
	}
	set hour(value) {
		this._hour = value || ''
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
				command: 'GET_REMINDERS',
				event: 'getReminders',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_REMINDER',
				event: 'registerReminder',
				required: ['name', 'send_to', 'date', 'hour', 'inactive'],
				params: ['name', 'send_to', 'date', 'hour', 'inactive']
			},
			{
				command: 'UPDATE_REMINDER',
				event: 'updateReminder',
				required: [
					'_id',
					'name',
					'send_to',
					'date',
					'hour',
					'inactive'
				],
				params: ['_id', 'name', 'send_to', 'date', 'hour', 'inactive']
			},
			{
				command: 'DELETE_REMINDER',
				event: 'deleteReminder',
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
	getReminders() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			reminder.find(filter, (err, oReminders) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oReminders
					resolve(params)
				}
			})
		})
		return promise
	}
	registerReminder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objReminder = {
				name: this.name,
				send_to: this.send_to,
				date: this.date,
				hour: this.hour,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mReminder = new reminder(objReminder)
			mReminder.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mReminder
					resolve(params)
				}
			})
		})
		return promise
	}
	updateReminder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			reminder.updateOne(
				{ _id: this._id },
				{
					name: this.name,
					send_to: this.send_to,
					date: this.date,
					hour: this.hour,
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
	deleteReminder() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			reminder.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Reminder
