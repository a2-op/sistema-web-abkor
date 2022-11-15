'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const history = require('../models').history

class History {
	constructor(history = {}) {
		this.__id = history._id || ''
		this._origin = history.origin || ''
		this._title = history.title || ''
		this._content = history.content || ''
		this._module = history.module || ''
		this._color = history.color || ''
		this._merchant = history.merchant || {}
		this._create_by = history.create_by
		this._create_at = history.create_at || ''
		this._modified_by = history.modified_by
		this._modified_at = history.modified_at || ''
		this._inactive = history.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get origin() {
		return this._origin
	}
	set origin(value) {
		this._origin = value || ''
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
	get module() {
		return this._module
	}
	set module(value) {
		this._module = value || ''
	}
	get color() {
		return this._color
	}
	set color(value) {
		this._color = value || ''
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
				command: 'GET_HISTORY',
				event: 'getHistory',
				required: ['module'],
				params: ['module']
			},
			{
				command: 'REGISTER_HISTORY',
				event: 'registerHistory',
				required: [
					'origin',
					'title',
					'content',
					'module',
					'color',
					'inactive'
				],
				params: [
					'origin',
					'title',
					'content',
					'module',
					'color',
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
	getHistory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			history.find({ module: this.module }, (err, oHistory) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oHistory
					resolve(params)
				}
			})
		})
		return promise
	}
	registerHistory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objHistory = {
				origin: this.origin,
				title: this.title,
				content: this.content,
				module: this.module,
				color: this.color,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mHistory = new history(objHistory)
			mHistory.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mHistory
					resolve(params)
				}
			})
		})
		return promise
	}
}

module.exports = History
