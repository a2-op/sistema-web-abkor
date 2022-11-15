'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const category = require('../models').category

class Category {
	constructor(category = {}) {
		this.__id = category._id || ''
		this._name = category.name || ''
		this._merchant = category.merchant || {}
		this._create_by = category.create_by
		this._create_at = category.create_at || ''
		this._modified_by = category.modified_by
		this._modified_at = category.modified_at || ''
		this._inactive = category.inactive || false
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
				command: 'GET_CATEGORIES',
				event: 'getCategories',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_CATEGORY',
				event: 'registerCategory',
				required: ['name', 'inactive'],
				params: ['name', 'inactive']
			},
			{
				command: 'UPDATE_CATEGORY',
				event: 'updateCategory',
				required: ['_id', 'name', 'inactive'],
				params: ['_id', 'name', 'inactive']
			},
			{
				command: 'DELETE_CATEGORY',
				event: 'deleteCategory',
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
	getCategories() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			category.find(filter, (err, oCategories) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oCategories
					resolve(params)
				}
			})
		})
		return promise
	}
	registerCategory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objCategory = {
				name: this.name,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mCategory = new category(objCategory)
			mCategory.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mCategory
					resolve(params)
				}
			})
		})
		return promise
	}
	updateCategory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			category.updateOne(
				{ _id: this._id },
				{
					name: this.name,
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
	deleteCategory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			category.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Category
