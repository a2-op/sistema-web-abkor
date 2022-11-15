'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const cloudinary = require('cloudinary').v2
const config = require('../config')
const weekMenu = require('../models').weekMenu

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class WeekMenu {
	constructor(weekMenu = {}) {
		this.__id = weekMenu._id || ''
		this._day = weekMenu.day || ''
		this._schedule = weekMenu.schedule || ''
		this._menu = weekMenu.menu
		this._expiration_date = weekMenu.expiration_date
		this._merchant = weekMenu.merchant || {}
		this._create_by = weekMenu.create_by
		this._create_at = weekMenu.create_at || ''
		this._modified_by = weekMenu.modified_by
		this._modified_at = weekMenu.modified_at || ''
		this._inactive = weekMenu.inactive || false
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
	get menu() {
		return this._menu
	}
	set menu(value) {
		this._menu = value || ''
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
				command: 'GET_WEEK_MENU_CURRENTS',
				event: 'getWeekMenusCurrents',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_WEEK_MENU_CURRENT',
				event: 'registerWeekMenusCurrent',
				required: [
					'day',
					'schedule',
					'expiration_date',
					'menu',
					'inactive'
				],
				params: [
					'day',
					'schedule',
					'expiration_date',
					'menu',
					'inactive'
				]
			},
			{
				command: 'UPDATE_WEEK_MENU_CURRENT',
				event: 'updateWeekMenusCurrent',
				required: [
					'_id',
					'day',
					'schedule',
					'expiration_date',
					'menu',
					'inactive'
				],
				params: [
					'_id',
					'day',
					'schedule',
					'expiration_date',
					'menu',
					'inactive'
				]
			},
			{
				command: 'DELETE_WEEK_MENU_CURRENT',
				event: 'deleteWeekMenusCurrent',
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
	getWeekMenusCurrents() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			weekMenu.find(filter, (err, oWeekMenus) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oWeekMenus
					resolve(params)
				}
			})
		})
		return promise
	}
	registerWeekMenusCurrent() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objWeekMenu = {
				day: this.day,
				schedule: this.schedule,
				expiration_date: this.expiration_date,
				menu: this.menu,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mobjWeekMenu = new weekMenu(objWeekMenu)
			mobjWeekMenu.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mobjWeekMenu
					resolve(params)
				}
			})
		})
		return promise
	}
	updateWeekMenusCurrent() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			weekMenu.updateOne(
				{ _id: this._id },
				{
					day: this.day,
					schedule: this.schedule,
					expiration_date: this.expiration_date,
					menu: this.menu,
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
	deleteWeekMenusCurrent() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			weekMenu.deleteOne({ _id: this._id }, (err) => {
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

module.exports = WeekMenu
