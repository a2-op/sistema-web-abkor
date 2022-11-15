'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const comun = require(`../util/comun`)
const config = require('../config')
const configuration = require('../models').configuration
const mongoose = require(`mongoose`)
const cloudinary = require('cloudinary').v2

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Configuration {
	constructor(configuration = {}) {
		this.__id = configuration._id || ''
		this._name = configuration.name
		this._company = configuration.company
		this._personalization = configuration.personalization
		this._payment_methods = configuration.payment_methods
		this._security = configuration.security
		this._merchant = configuration.merchant || {}
		this._create_by = configuration.create_by
		this._create_at = configuration.create_at || ''
		this._modified_by = configuration.modified_by
		this._modified_at = configuration.modified_at || ''
		this._inactive = configuration.inactive || false
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
	get company() {
		return this._company
	}
	set company(value) {
		this._company = value || ''
	}
	get personalization() {
		return this._personalization
	}
	set personalization(value) {
		this._personalization = value || ''
	}
	get payment_methods() {
		return this._payment_methods
	}
	set payment_methods(value) {
		this._payment_methods = value || ''
	}
	get security() {
		return this._security
	}
	set security(value) {
		this._security = value || ''
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
				command: 'GET_CONFIGURATIONS',
				event: 'getConfigurations',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_CONFIGURATION',
				event: 'registerConfiguration',
				required: ['name', 'inactive'],
				params: [
					'name',
					'company',
					'personalization',
					'payment_methods',
					'security',
					'active',
					'inactive'
				]
			},
			{
				command: 'UPDATE_CONFIGURATION',
				event: 'updateConfiguration',
				required: ['_id', 'name', 'inactive'],
				params: [
					'_id',
					'name',
					'company',
					'personalization',
					'payment_methods',
					'security',
					'active',
					'inactive'
				]
			},
			{
				command: 'DELETE_CONFIGURATION',
				event: 'deleteConfiguration',
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
	getConfigurations() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			configuration.find(filter, (err, oConfigurations) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oConfigurations
					resolve(params)
				}
			})
		})
		return promise
	}
	registerConfiguration() {
		let params = []
		const newCarousel = []
		const promise = new Promise((resolve, reject) => {
			var configurationId = mongoose.Types.ObjectId()
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.personalization.carousel.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				const name = `./fileserver/${configurationId}-${index + 1}.png`
				comun.base64_decode(photo, name)
				cloudinary.uploader.upload(
					name,
					{
						public_id: `${this.merchant.sub}-${index + 1}`
					},
					(error, result) => {
						if (error) {
							params[0] = lang.mstrUploadError.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrUploadError.message
							params[3] = error
							reject(params)
						} else {
							newCarousel.push(result.secure_url)
							if (
								newCarousel.length ===
								this.personalization.carousel.length
							) {
								const objConfiguration = {
									_id: configurationId,
									name: this.name,
									company: this.company,
									personalization: {
										carousel: newCarousel
									},
									payment_methods: this.payment_methods,
									security: this.security,
									create_by: this.merchant,
									create_at: new Date(),
									inactive: this.inactive
								}
								const mConfiguration = new configuration(
									objConfiguration
								)
								mConfiguration.save((err) => {
									if (err) {
										params[0] = lang.mstrSavingError.code
										params[1] = constant.ResponseCode.error
										params[2] = `${lang.mstrSavingError.message}: ${err}`
										reject(params)
									} else {
										params[0] = lang.mstrSavedRecord.code
										params[1] =
											constant.ResponseCode.success
										params[2] = lang.mstrSavedRecord.message
										params[3] = mConfiguration
										resolve(params)
									}
								})
							}
						}
					}
				)
			})
			if (this.personalization.carousel.length <= 0) {
				const objConfiguration = {
					_id: configurationId,
					name: this.name,
					company: this.company,
					personalization: this.personalization,
					payment_methods: this.payment_methods,
					security: this.security,
					create_by: this.merchant,
					create_at: new Date(),
					inactive: this.inactive
				}
				const mConfiguration = new configuration(objConfiguration)
				mConfiguration.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = mConfiguration
						resolve(params)
					}
				})
			}
		})
		return promise
	}
	updateConfiguration() {
		let params = []
		const newCarousel = []
		const promise = new Promise((resolve, reject) => {
			const operation = () => {
				const regex64 = /^data:image\/[a-z]+;base64,/
				const updCfg = () => {
					if (
						newCarousel.length ===
						this.personalization.carousel.length
					) {
						configuration.updateOne(
							{ _id: this._id },
							{
								name: this.name,
								company: this.company,
								personalization: {
									carousel: newCarousel
								},
								payment_methods: this.payment_methods,
								security: this.security,
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
					}
				}
				this.personalization.carousel.forEach((photo, index) => {
					photo = photo.replace(regex64, '')
					if (!comun.isValidUrl(photo, true)) {
						const name = `./fileserver/${this._id}-${index + 1}.png`
						comun.base64_decode(photo, name)
						cloudinary.uploader.upload(
							name,
							{
								public_id: `${this.merchant.sub}-${index + 1}`
							},
							(error, result) => {
								if (error) {
									params[0] = lang.mstrUploadError.code
									params[1] = constant.ResponseCode.error
									params[2] = lang.mstrUploadError.message
									params[3] = error
									reject(params)
								} else {
									newCarousel.push(result.secure_url)
									updCfg()
								}
							}
						)
					} else {
						newCarousel.push(photo)
						updCfg()
					}
				})
				if (this.personalization.carousel <= 0) {
					configuration.updateOne(
						{ _id: this._id },
						{
							name: this.name,
							company: this.company,
							personalization: this.personalization,
							payment_methods: this.payment_methods,
							security: this.security,
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
				}
			}
			if (!this.inactive) {
				configuration.updateMany(
					{ inactive: false },
					{
						inactive: true
					},
					(err, success) => {
						operation(err, success)
					}
				)
			} else {
				operation()
			}
		})
		return promise
	}
	deleteConfiguration() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			configuration.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Configuration
