'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const master = require('../models').master

class Master {
	constructor(master = {}) {
		this.__id = master._id || ''
		this._code = master.code || ''
		this._value1 = master.value1 || ''
		this._value2 = master.value1 || ''
		this._value3 = master.value1 || ''
		this._value4 = master.value1 || ''
		this._value5 = master.value1 || ''
		this._merchant = master.merchant || {}
		this._create_by = master.create_by || 'system'
		this._create_at = master.create_at || ''
		this._modified_by = master.modified_by || 'system'
		this._modified_at = master.modified_at || ''
		this._inactive = master.inactive || false
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
	get value1() {
		return this._value1
	}
	set value1(value) {
		this._value1 = value || ''
	}
	get value2() {
		return this._value2
	}
	set value2(value) {
		this._value2 = value || ''
	}
	get value3() {
		return this._value3
	}
	set value3(value) {
		this._value3 = value || ''
	}
	get value4() {
		return this._value4
	}
	set value4(value) {
		this._value4 = value || ''
	}
	get value5() {
		return this._value5
	}
	set value5(value) {
		this._value5 = value || ''
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
				command: 'GET_MASTER',
				event: 'getMaster',
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
	getMaster() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			master.find({ code: this.code }, (err, oMasters) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oMasters
					resolve(params)
				}
			})
		})
		return promise
	}
}

module.exports = Master
