'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const cloudinary = require('cloudinary').v2
const config = require('../config')
const myWeek = require('../models').myweek

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class MyWeek {
	constructor(myWeek = {}) {
		this.__id = myWeek._id || ''
		this._day = myWeek.day || ''
		this._schedule = myWeek.schedule || ''
		this._weekmenu = myWeek._weekmenu
		this._start_date = myWeek.start_date
		this._expiration_date = myWeek.expiration_date
		this._merchant = myWeek.merchant || {}
		this._create_by = myWeek.create_by
		this._create_at = myWeek.create_at || ''
		this._modified_by = myWeek.modified_by
		this._modified_at = myWeek.modified_at || ''
		this._inactive = myWeek.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get day() {
		return this._day
	}
	set day(value) {
		this._day = value || ''
	}
	get schedule() {
		return this._schedule
	}
	set schedule(value) {
		this._schedule = value || ''
	}
	get weekmenu() {
		return this._weekmenu
	}
	set weekmenu(value) {
		this._weekmenu = value || ''
	}
	get start_date() {
		return this._start_date
	}
	set start_date(value) {
		this._start_date = value || ''
	}
	get expiration_date() {
		return this._expiration_date
	}
	set expiration_date(value) {
		this._expiration_date = value || ''
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
				command: 'GET_MY_WEEK_CURRENT',
				event: 'getMyWeekCurrents',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_MY_WEEK',
				event: 'registerMyWeek',
				required: [
					'day',
					'schedule',
					'start_date',
					'expiration_date',
					'weekmenu',
					'inactive'
				],
				params: [
					'day',
					'schedule',
					'start_date',
					'expiration_date',
					'weekmenu',
					'inactive'
				]
			},
			{
				command: 'UPDATE_MY_WEEK',
				event: 'updateMyWeek',
				required: [
					'_id',
					'day',
					'schedule',
					'start_date',
					'expiration_date',
					'weekmenu',
					'inactive'
				],
				params: [
					'_id',
					'day',
					'schedule',
					'start_date',
					'expiration_date',
					'weekmenu',
					'inactive'
				]
			},
			{
				command: 'DELETE_MY_WEEK',
				event: 'deleteMyWeek',
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
	getMyWeekCurrents() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			myWeek.find(filter, (err, oMyWeek) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oMyWeek
					resolve(params)
				}
			})
		})
		return promise
	}
	registerMyWeek() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objMyWeek = {
				day: this.day,
				schedule: this.schedule,
				start_date: this.start_date,
				expiration_date: this.expiration_date,
				weekmenu: this.weekmenu,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mObjMyWeek = new myWeek(objMyWeek)
			mObjMyWeek.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mObjMyWeek
					resolve(params)
				}
			})
		})
		return promise
	}
	updateMyWeek() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			myWeek.updateOne(
				{ _id: this._id },
				{
					day: this.day,
					schedule: this.schedule,
					start_date: this.start_date,
					expiration_date: this.expiration_date,
					weekmenu: this.weekmenu,
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
	deleteMyWeek() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			myWeek.deleteOne({ _id: this._id }, (err) => {
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

module.exports = MyWeek
