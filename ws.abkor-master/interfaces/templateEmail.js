'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const template = require('../models').templateEmail

class TemplateEmail {
	constructor(template = {}) {
		this.__id = template._id || ''
		this._name = template.name || ''
		this._subject = template.subject || ''
		this._preheader = template.preheader || ''
		this._content = template.content || ''
		this._styles = template.styles || {}
		this._design = template.design || []
		this._merchant = template.merchant || {}
		this._create_by = template.create_by
		this._create_at = template.create_at || ''
		this._modified_by = template.modified_by
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
	get name() {
		return this._name
	}
	set name(value) {
		this._name = value || ''
	}
	get subject() {
		return this._subject
	}
	set subject(value) {
		this._subject = value || ''
	}
	get preheader() {
		return this._preheader
	}
	set preheader(value) {
		this._preheader = value || ''
	}
	get content() {
		return this._content
	}
	set content(value) {
		this._content = value || ''
	}
	get styles() {
		return this._styles
	}
	set styles(value) {
		this._styles = value || {}
	}
	get design() {
		return this._design
	}
	set design(value) {
		this._design = value || []
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
				command: 'GET_TEMPLATES_MAIL',
				event: 'getTemplates',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_TEMPLATE_EMAIL',
				event: 'registerTemplate',
				required: ['name', 'inactive'],
				params: [
					'name',
					'subject',
					'preheader',
					'content',
					'styles',
					'design',
					'inactive'
				]
			},
			{
				command: 'UPDATE_TEMPLATE_EMAIL',
				event: 'updateTemplate',
				required: ['_id', 'name', 'inactive'],
				params: [
					'_id',
					'name',
					'subject',
					'preheader',
					'content',
					'styles',
					'design',
					'inactive'
				]
			},
			{
				command: 'DELETE_TEMPLATE_EMAIL',
				event: 'deleteTemplate',
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
	getTemplates() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			template.find(filter, (err, oTemplates) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oTemplates
					resolve(params)
				}
			})
		})
		return promise
	}
	registerTemplate() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objTemplate = {
				name: this.name,
				subject: this.subject,
				preheader: this.preheader,
				content: this.content,
				styles: this.styles,
				design: this.design,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mTemplate = new template(objTemplate)
			mTemplate.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mTemplate
					resolve(params)
				}
			})
		})
		return promise
	}
	updateTemplate() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			template.updateOne(
				{ _id: this._id },
				{
					name: this.name,
					subject: this.subject,
					preheader: this.preheader,
					content: this.content,
					styles: this.styles,
					design: this.design,
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
	deleteTemplate() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			template.deleteOne({ _id: this._id }, (err) => {
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

module.exports = TemplateEmail
