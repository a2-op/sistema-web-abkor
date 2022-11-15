'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const comun = require(`../util/comun`)
const config = require('../config')
const product = require('../models').product
const mongoose = require(`mongoose`)
const cloudinary = require('cloudinary').v2
const isBase64 = require('is-base64')

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Product {
	constructor(product = {}) {
		this.__id = product._id || ''
		this._name = product.name
		this._category = product.category
		this._description = product.description || ''
		this._tags = product.tags || []
		this._photos = product.photos || []
		this._variants = product.variants || []
		this._price = product.price || 0
		this._stock = product.stock || 0
		this._merchant = product.merchant || {}
		this._create_by = product.create_by
		this._create_at = product.create_at || ''
		this._modified_by = product.modified_by
		this._modified_at = product.modified_at || ''
		this._inactive = product.inactive || false
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
	get category() {
		return this._category
	}
	set category(value) {
		this._category = value || ''
	}
	get description() {
		return this._description
	}
	set description(value) {
		this._description = value || ''
	}
	get tags() {
		return this._tags
	}
	set tags(value) {
		this._tags = value || ''
	}
	get photos() {
		return this._photos
	}
	set photos(value) {
		this._photos = value || ''
	}
	get variants() {
		return this._variants
	}
	set variants(value) {
		this._variants = value || ''
	}
	get price() {
		return this._price
	}
	set price(value) {
		this._price = value || ''
	}
	get stock() {
		return this._stock
	}
	set stock(value) {
		this._stock = value || 0
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
				command: 'GET_PRODUCTS',
				event: 'getProducts',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_LAST_PRODUCT',
				event: 'lastProduct',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_PRODUCT_RANGE',
				event: 'GetProductRange',
				required: ['firstday', 'lastday'],
				params: ['firstday', 'lastday']
			},
			{
				command: 'REGISTER_PRODUCT',
				event: 'registerProduct',
				required: ['name', 'category', 'inactive'],
				params: [
					'name',
					'category',
					'description',
					'tags',
					'photos',
					'variants',
					'price',
					'stock',
					'inactive'
				]
			},
			{
				command: 'UPDATE_PRODUCT',
				event: 'updateProduct',
				required: ['_id', 'name', 'category', 'inactive'],
				params: [
					'_id',
					'name',
					'category',
					'description',
					'tags',
					'photos',
					'variants',
					'price',
					'stock',
					'inactive'
				]
			},
			{
				command: 'DELETE_PRODUCT',
				event: 'deleteProduct',
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
	getProducts() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			product.find(filter, (err, oProducts) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oProducts
					resolve(params)
				}
			})
		})
		return promise
	}
	lastProduct() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			product
				.findOne(filter)
				.sort({ create_at: -1 })
				.limit(1)
				.exec((err, oProducts) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oProducts
						resolve(params)
					}
				})
		})
		return promise
	}
	GetProductRange() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			product.aggregate(
				[
					{
						$match: {
							create_at: {
								$gte: new Date(this.firstday),
								$lte: new Date(this.lastday)
							},
							inactive: false
						}
					},
					{
						$group: {
							_id: {
								month: { $month: '$create_at' },
								day: { $dayOfMonth: '$create_at' },
								year: { $year: '$create_at' }
							},
							count: { $sum: 1 }
						}
					}
				],
				(err, oProducts) => {
					if (err) {
						params[0] = lang.mstrErrorSearching.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrErrorSearching.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = { products: oProducts }
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerProduct() {
		let params = []
		const newPhotos = []
		const promise = new Promise((resolve, reject) => {
			var productId = mongoose.Types.ObjectId()
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.photos.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				const name = `./fileserver/${productId}-${index + 1}.png`
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
							newPhotos.push(result.secure_url)
							if (newPhotos.length === this.photos.length) {
								const objProduct = {
									_id: productId,
									name: this.name,
									category: this.category,
									description: this.description,
									tags: this.tags,
									photos: newPhotos,
									variants: this.variants,
									price: this.price,
									stock: this.stock,
									create_by: this.merchant,
									create_at: new Date(),
									inactive: this.inactive
								}
								const mProduct = new product(objProduct)
								mProduct.save((err) => {
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
										params[3] = mProduct
										resolve(params)
									}
								})
							}
						}
					}
				)
			})
			if (this.photos.length <= 0) {
				const objProduct = {
					_id: productId,
					name: this.name,
					category: this.category,
					description: this.description,
					tags: this.tags,
					photos: this.photos,
					variants: this.variants,
					price: this.price,
					stock: this.stock,
					create_by: this.merchant,
					create_at: new Date(),
					inactive: this.inactive
				}
				const mProduct = new product(objProduct)
				mProduct.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = mProduct
						resolve(params)
					}
				})
			}
		})
		return promise
	}
	updateProduct() {
		let params = []
		const newPhotos = []
		const promise = new Promise((resolve, reject) => {
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.photos.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				if (isBase64(photo) && photo != '') {
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
								newPhotos.push(result.secure_url)
								if (newPhotos.length === this.photos.length) {
									product.updateOne(
										{ _id: this._id },
										{
											name: this.name,
											category: this.category,
											description: this.description,
											tags: this.tags,
											photos: newPhotos,
											variants: this.variants,
											price: this.price,
											stock: this.stock,
											modified_by: this.merchant,
											modified_at: new Date(),
											inactive: this.inactive
										},
										(err, success) => {
											if (err) {
												params[0] =
													lang.mstrUpdateError.code
												params[1] =
													constant.ResponseCode.error
												params[2] = `${lang.mstrUpdateError.message}: ${err}`
												reject(params)
											} else {
												params[0] =
													lang.mstrRecordUpdate.code
												params[1] =
													constant.ResponseCode.success
												params[2] =
													lang.mstrRecordUpdate.message
												params[3] = success
												resolve(params)
											}
										}
									)
								}
							}
						}
					)
				} else {
					newPhotos.push(photo)
					if (newPhotos.length === this.photos.length) {
						product.updateOne(
							{ _id: this._id },
							{
								name: this.name,
								category: this.category,
								description: this.description,
								tags: this.tags,
								photos: newPhotos,
								variants: this.variants,
								price: this.price,
								stock: this.stock,
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
			})
			if (this.photos.length <= 0) {
				product.updateOne(
					{ _id: this._id },
					{
						name: this.name,
						category: this.category,
						description: this.description,
						tags: this.tags,
						photos: this.photos,
						variants: this.variants,
						price: this.price,
						stock: this.stock,
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
		})
		return promise
	}
	deleteProduct() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			product.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Product
