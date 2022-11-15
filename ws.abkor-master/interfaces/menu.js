'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const cloudinary = require('cloudinary').v2
const config = require('../config')
const menu = require('../models').menu

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Menu {
	constructor(menu = {}) {
		this.__id = menu._id || ''
		this._name = menu.name || ''
		this._type_service = menu.type_service || ''
		this._ingredients = menu.ingredients || []
		this._photos = menu.photos || []
		this._merchant = menu.merchant || {}
		this._create_by = menu.create_by
		this._create_at = menu.create_at || ''
		this._modified_by = menu.modified_by
		this._modified_at = menu.modified_at || ''
		this._inactive = menu.inactive || false
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
	get type_service() {
		return this._type_service
	}
	set type_service(value) {
		this._type_service = value || ''
	}
	get category() {
		return this._category
	}
	get description() {
		return this._description
	}
	set description(value) {
		this._description = value || ''
	}
	get ingredients() {
		return this._ingredients
	}
	set ingredients(value) {
		this._ingredients = value || ''
	}
	get photos() {
		return this._photos
	}
	set photos(value) {
		this._photos = value || ''
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
				command: 'GET_MENUS',
				event: 'getMenus',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_WEEK_MENUS',
				event: 'getWeekMenus',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_MENU',
				event: 'registerMenu',
				required: ['name', 'type_service', 'inactive'],
				params: [
					'name',
					'type_service',
					'description',
					'ingredients',
					'photos',
					'inactive'
				]
			},
			{
				command: 'UPDATE_MENU',
				event: 'updateMenu',
				required: ['_id', 'name', 'type_service', 'inactive'],
				params: [
					'_id',
					'name',
					'type_service',
					'description',
					'ingredients',
					'photos',
					'inactive'
				]
			},
			{
				command: 'DELETE_MENU',
				event: 'deleteMenu',
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
	getMenus() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			menu.find(filter, (err, oMenus) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oMenus
					resolve(params)
				}
			})
		})
		return promise
	}
	getWeekMenus() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			menu.find({ inactive: { $ne: true } }, (err, oMenus) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oMenus
					resolve(params)
				}
			})
		})
		return promise
	}
	registerMenu() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objMenu = {
				name: this.name,
				type_service: this.type_service,
				description: this.description,
				ingredients: this.ingredients,
				photos: this.photos,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mMenu = new menu(objMenu)
			mMenu.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mMenu
					resolve(params)
				}
			})
		})
		return promise
	}
	updateMenu() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			menu.updateOne(
				{ _id: this._id },
				{
					name: this.name,
					type_service: this.type_service,
					description: this.description,
					ingredients: this.ingredients,
					photos: this.photos,
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
	deleteMenu() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			menu.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Menu
