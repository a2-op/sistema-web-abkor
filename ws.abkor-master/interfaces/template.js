'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const template = require('../models').template

class Template {
	constructor(template = {}) {
		this.__id = template._id || ''
		this._code = template.code || ''
		this._type = template.type || 'html'
		this._templateId = template.templateId || ''
		this._merchant = template.merchant || {}
		this._create_by = template.create_by || 'system'
		this._create_at = template.create_at || ''
		this._modified_by = template.modified_by || 'system'
		this._modified_at = template.modified_at || ''
		this._inactive = template.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get code() {
		return this._code
	}
	set code(value) {
		this._code = value || ''
	}
	get type() {
		return this._type
	}
	set type(value) {
		this._type = value || ''
	}
	get templateId() {
		return this._templateId
	}
	set templateId(value) {
		this._templateId = value || ''
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
		this._create_by = value || 'system'
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
				command: 'GET_TEMPLATE',
				event: 'getTemplate',
				required: ['code'],
				params: ['code']
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
	getTemplate() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			template.findOne({ code: this.code }, (err, oTemplate) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					if (oTemplate) {
						params[0] = lang.mstrRecordFound.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrRecordFound.message
						params[3] = oTemplate
						resolve(params)
					} else {
						params[0] = lang.mstrRecordNotFound.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrRecordNotFound.message
						reject(params)
					}
				}
			})
		})
		return promise
	}
}

module.exports = Template
