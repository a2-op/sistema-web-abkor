'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const feedback = require('../models').feedback

class Feedback {
	constructor(feedback = {}) {
		this.__id = feedback._id || ''
		this._description = feedback.description || ''
		this._html = feedback.html || ''
		this._merchant = feedback.merchant || {}
		this._create_by = feedback.create_by
		this._create_at = feedback.create_at || ''
		this._modified_by = feedback.modified_by
		this._modified_at = feedback.modified_at || ''
		this._inactive = feedback.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get description() {
		return this._description
	}
	set description(value) {
		this._description = value || ''
	}
	get html() {
		return this._html
	}
	set html(value) {
		this._html = value || ''
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
				command: 'GET_COMMENTS',
				event: 'getComments',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_FEEDBACK',
				event: 'registerFeedback',
				required: ['description', 'inactive'],
				params: ['description', 'html', 'inactive']
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
	getComments() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			feedback.find(filter, (err, oCommits) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oCommits
					resolve(params)
				}
			})
		})
		return promise
	}
	registerFeedback() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objFeedback = {
				description: this.description,
				html: this.html,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mFeedback = new feedback(objFeedback)
			mFeedback.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mFeedback
					resolve(params)
				}
			})
		})
		return promise
	}
}

module.exports = Feedback
