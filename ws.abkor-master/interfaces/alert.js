'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const alert = require('../models').alert

class Alert {
	constructor(alert = {}) {
		this.__id = alert._id || ''
		this._title = alert.title || ''
		this._content = alert.content || ''
		this._icon = alert.icon || ''
		this._end = alert.end || ''
		this._merchant = alert.merchant || {}
		this._create_by = alert.create_by
		this._create_at = alert.create_at || ''
		this._modified_by = alert.modified_by
		this._modified_at = alert.modified_at || ''
		this._inactive = alert.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get title() {
		return this._title
	}
	set title(value) {
		this._title = value || ''
	}
	get content() {
		return this._content
	}
	set content(value) {
		this._content = value || ''
	}
	get icon() {
		return this._icon
	}
	set icon(value) {
		this._icon = value || ''
	}
	get end() {
		return this._end
	}
	set end(value) {
		this._end = value || ''
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
				command: 'GET_ALERTS',
				event: 'getAlerts',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_ALERTS_CURRENT',
				event: 'getAlertsCurrent',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_ALERT',
				event: 'registerAlert',
				required: ['title', 'content', 'end', 'inactive'],
				params: ['title', 'content', 'icon', 'end', 'inactive']
			},
			{
				command: 'UPDATE_ALERT',
				event: 'updateAlert',
				required: ['_id', 'title', 'content', 'end', 'inactive'],
				params: ['_id', 'title', 'content', 'end', 'icon', 'inactive']
			},
			{
				command: 'DELETE_ALERT',
				event: 'deleteAlert',
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
	getAlerts() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			alert.find(filter, (err, oAlerts) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oAlerts
					resolve(params)
				}
			})
		})
		return promise
	}
	getAlertsCurrent() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			alert.find(
				{
					inactive: false,
					create_at: { $lte: new Date() },
					end: { $gte: new Date() }
				},
				(err, oAlerts) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oAlerts
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerAlert() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objAlert = {
				title: this.title,
				content: this.content,
				icon: this.icon,
				end: this.end,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mAlert = new alert(objAlert)
			mAlert.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mAlert
					resolve(params)
				}
			})
		})
		return promise
	}
	updateAlert() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			alert.updateOne(
				{ _id: this._id },
				{
					title: this.title,
					content: this.content,
					icon: this.icon,
					end: this.end,
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
	deleteAlert() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			alert.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Alert
