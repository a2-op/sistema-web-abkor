'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const route = require('../models').route

class Route {
	constructor(route = {}) {
		this.__id = route._id || ''
		this._code = route.code || ''
		this._name = route.name || ''
		this._path = route.path || ''
		this._level = route.level || 0
		this._children = route.children || []
		this._merchant = route.merchant || {}
		this._create_by = route.create_by || 'system'
		this._create_at = route.create_at || ''
		this._modified_by = route.modified_by || 'system'
		this._modified_at = route.modified_at || ''
		this._inactive = route.inactive || false
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
	get name() {
		return this._name
	}
	set name(value) {
		this._name = value || ''
	}
	get path() {
		return this._path
	}
	set path(value) {
		this._path = value || ''
	}
	get level() {
		return this._level
	}
	set level(value) {
		this._level = value || 0
	}
	get children() {
		return this._children
	}
	set children(value) {
		this._children = value || []
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
				command: 'GET_ROUTES',
				event: 'getRoutes',
				required: [],
				params: []
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
	getRoutes() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			route.find({}, (err, oRoutes) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrRecordFound.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordFound.message
					params[3] = oRoutes
					resolve(params)
				}
			})
		})
		return promise
	}
}

module.exports = Route
