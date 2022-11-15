'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const comun = require(`../util/comun`)
const config = require('../config')
const notice = require('../models').notice
const mongoose = require(`mongoose`)
const cloudinary = require('cloudinary').v2
const isBase64 = require('is-base64')

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class Notice {
	constructor(notice = {}) {
		this.__id = notice._id || ''
		this._title = notice.title
		this._description = notice.description || ''
		this._tags = notice.tags || []
		this._photos = notice.photos || []
		this._start = notice.start || ''
		this._end = notice.end || ''
		this._merchant = notice.merchant || {}
		this._create_by = notice.create_by
		this._create_at = notice.create_at || ''
		this._modified_by = notice.modified_by
		this._modified_at = notice.modified_at || ''
		this._inactive = notice.inactive || false
	}

	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get title() {
		return this._title
	}
	set title(value) {
		this._title = value || ''
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
	get start() {
		return this._start
	}
	set start(value) {
		this._start = value || ''
	}
	get end() {
		return this._end
	}
	set end(value) {
		this._end = value || ''
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
				command: 'GET_NOTICES',
				event: 'getNotices',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_NOTICES_CLIENT',
				event: 'getNoticesClient',
				required: [],
				params: []
			},
			{
				command: 'REGISTER_NOTICE',
				event: 'registerNotice',
				required: ['title', 'photos', 'end', 'inactive'],
				params: [
					'title',
					'description',
					'tags',
					'photos',
					'start',
					'end',
					'inactive'
				]
			},
			{
				command: 'UPDATE_NOTICE',
				event: 'updateNotice',
				required: ['_id', 'title', 'photos', 'inactive'],
				params: [
					'_id',
					'title',
					'description',
					'tags',
					'photos',
					'start',
					'end',
					'inactive'
				]
			},
			{
				command: 'DELETE_NOTICE',
				event: 'deleteNotice',
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
	getNotices() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			notice.find(filter, (err, oNotices) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oNotices
					resolve(params)
				}
			})
		})
		return promise
	}
	getNoticesClient() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			notice.find(
				{
					inactive: false,
					start: { $lte: new Date() },
					end: { $gte: new Date() }
				},
				(err, oNotices) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oNotices
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	registerNotice() {
		let params = []
		const newPhotos = []
		const promise = new Promise((resolve, reject) => {
			var noticeId = mongoose.Types.ObjectId()
			const regex64 = /^data:image\/[a-z]+;base64,/
			this.photos.forEach((photo, index) => {
				photo = photo.replace(regex64, '')
				const name = `./fileserver/${noticeId}-${index + 1}.png`
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
								const objNotice = {
									_id: noticeId,
									title: this.title,
									description: this.description,
									tags: this.tags,
									photos: newPhotos,
									start: new Date(),
									end: this.end,
									create_by: this.merchant,
									create_at: new Date(),
									inactive: this.inactive
								}
								const mNotice = new notice(objNotice)
								mNotice.save((err) => {
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
										params[3] = mNotice
										resolve(params)
									}
								})
							}
						}
					}
				)
			})
			if (this.photos.length <= 0) {
				const objNotice = {
					_id: noticeId,
					title: this.title,
					description: this.description,
					tags: this.tags,
					photos: newPhotos,
					start: new Date(),
					end: this.end,
					create_by: this.merchant,
					create_at: new Date(),
					inactive: this.inactive
				}
				const mNotice = new Notice(objNotice)
				mNotice.save((err) => {
					if (err) {
						params[0] = lang.mstrSavingError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSavingError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSavedRecord.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSavedRecord.message
						params[3] = mNotice
						resolve(params)
					}
				})
			}
		})
		return promise
	}
	updateNotice() {
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
									notice.updateOne(
										{ _id: this._id },
										{
											title: this.title,
											description: this.description,
											tags: this.tags,
											photos: newPhotos,
											start: new Date(),
											end: this.end,
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
						notice.updateOne(
							{ _id: this._id },
							{
								title: this.title,
								description: this.description,
								tags: this.tags,
								photos: newPhotos,
								start: new Date(),
								end: this.end,
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
				notice.updateOne(
					{ _id: this._id },
					{
						title: this.title,
						description: this.description,
						tags: this.tags,
						photos: newPhotos,
						start: new Date(),
						end: this.end,
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
	deleteNotice() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			notice.deleteOne({ _id: this._id }, (err) => {
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

module.exports = Notice
