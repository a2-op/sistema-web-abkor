'use strict'

const lang = require('../lang/es')
const constant = require(`../util/constant`)
const comun = require(`../util/comun`)
const config = require('../config')
const service = require('../services')
const poll = require('../models').poll
const user = require('../models').user

// Interfaces
const intTemplate = require('../interfaces/template')

class Poll {
	constructor(poll = {}) {
		this.__id = poll._id || ''
		this._title = poll.title || ''
		this._description = poll.description || ''
		this._sections = poll.sections || []
		this._answers = poll.answers || []
		this._wallet = poll.wallet || []
		this._step = poll.step || 0
		this._token = poll.token
		this._merchant = poll.merchant || {}
		this._create_by = poll.create_by
		this._create_at = poll.create_at || ''
		this._modified_by = poll.modified_by
		this._modified_at = poll.modified_at || ''
		this._inactive = poll.inactive || false
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
	get sections() {
		return this._sections
	}
	set sections(value) {
		this._sections = value || ''
	}
	get answers() {
		return this._answers
	}
	set answers(value) {
		this._answers = value || []
	}
	get wallet() {
		return this._wallet
	}
	set wallet(value) {
		this._wallet = value || ''
	}
	get step() {
		return this._step
	}
	set step(value) {
		this._step = value || 0
	}
	get token() {
		return this._token
	}
	set token(value) {
		this._token = value
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
				command: 'GET_POLL',
				event: 'getPoll',
				required: ['token'],
				params: ['token']
			},
			{
				command: 'GET_POLLS',
				event: 'getPolls',
				required: [],
				params: ['inactive']
			},
			{
				command: 'REGISTER_POLL',
				event: 'registerPolls',
				required: ['title', 'description', 'inactive'],
				params: [
					'title',
					'description',
					'sections',
					'answers',
					'wallet',
					'step',
					'inactive'
				]
			},
			{
				command: 'REGISTER_ANSWER',
				event: 'registerAnswer',
				required: [
					'_id',
					'title',
					'description',
					'sections',
					'answers',
					'wallet',
					'step',
					'inactive'
				],
				params: [
					'_id',
					'title',
					'description',
					'sections',
					'answers',
					'wallet',
					'step',
					'inactive'
				]
			},
			{
				command: 'SEND_POLL',
				event: 'pollSend',
				required: ['email', 'profile'],
				params: ['email', 'profile', '_id']
			},
			{
				command: 'UPDATE_POLL',
				event: 'updatePoll',
				required: ['_id', 'title', 'description', 'inactive'],
				params: [
					'_id',
					'title',
					'description',
					'sections',
					'answers',
					'wallet',
					'step',
					'inactive'
				]
			},
			{
				command: 'DELETE_POLL',
				event: 'deletePoll',
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
	getPolls() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			poll.find(filter, (err, oPolls) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oPolls
					resolve(params)
				}
			})
		})
		return promise
	}
	getPoll() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			service
				.decodeTokenPoll(this.token)
				.then((response) => {
					poll.findOne(
						{
							_id: response.response.poll,
							inactive: false
						},
						(err, oPoll) => {
							if (err) {
								params[0] = lang.mstrSearchError.code
								params[1] = constant.ResponseCode.error
								params[2] = `${lang.mstrSearchError.message}: ${err}`
								reject(params)
							} else {
								params[0] = lang.mstrSuccessfulSearch.code
								params[1] = constant.ResponseCode.success
								params[2] = lang.mstrSuccessfulSearch.message
								params[3] = oPoll
								resolve(params)
							}
						}
					)
				})
				.catch((response) => {
					params[0] = response.code
					params[1] = constant.ResponseCode.error
					params[2] = response.message
					reject(params)
				})
		})
		return promise
	}
	registerPolls() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objPoll = {
				title: this.title,
				description: this.description,
				sections: this.sections,
				answers: this.answers,
				wallet: this.wallet,
				step: this.step,
				create_by: this.merchant,
				create_at: new Date(),
				inactive: this.inactive
			}
			const mPoll = new poll(objPoll)
			mPoll.save((err) => {
				if (err) {
					params[0] = lang.mstrSavingError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSavingError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSavedRecord.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSavedRecord.message
					params[3] = mPoll
					resolve(params)
				}
			})
		})
		return promise
	}
	updatePoll() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			poll.updateOne(
				{ _id: this._id },
				{
					title: this.title,
					description: this.description,
					sections: this.sections,
					answers: this.answers,
					wallet: this.wallet,
					step: this.step,
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
	deletePoll() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			poll.deleteOne({ _id: this._id }, (err) => {
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
	findPollById() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			poll.findOne(
				{
					_id: this._id
				},
				(err, oPoll) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrRecordFound.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrRecordFound.message
						params[3] = oPoll
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	findUserByEmail() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.findOne(
				{
					email: this.email.toLowerCase(),
					profile: this.profile,
					inactive: false
				},
				(err, oUser) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrRecordFound.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrRecordFound.message
						params[3] = oUser
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	pollSend() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			this.findUserByEmail()
				.then(async (resp) => {
					const user = resp[3]
					if (user === null) {
						params[0] = lang.mstrUserNotFound.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrUserNotFound.message
						reject(params)
					}
					this.findPollById()
						.then(async (resp) => {
							const poll = resp[3]
							if (poll === null) {
								params[0] = lang.mstrUserNotFound.code
								params[1] = constant.ResponseCode.error
								params[2] = lang.mstrUserNotFound.message
								reject(params)
							} else {
								const oTemplate = new intTemplate({
									code: 'SEND_POLL'
								})
								// Se obtiene la plantilla
								const token = service.createTokenPoll(
									poll._id,
									poll._id,
									user._id
								)
								const link_poll = `${config.client}/forms/${token}`
								oTemplate
									.getTemplate('SEND_POLL')
									.then((resp) => {
										comun
											.sendMailTemplate(
												[
													{
														data: {
															email: user.email,
															name: user.name
														},
														substitution: {
															link_poll: link_poll
														}
													}
												],
												'Encuesta',
												'',
												resp[3].templateId
											)
											.then((resp) => {
												params[0] =
													lang.mstrTokenGeneratedCorrectly.code
												params[1] =
													constant.ResponseCode.success
												params[2] =
													lang.mstrTokenGeneratedCorrectly.message
												params[3] = resp
												resolve(params)
											})
											.catch((err) => {
												params[0] =
													lang.mstrErrorSendingMessage.code
												params[1] =
													constant.ResponseCode.error
												params[2] =
													lang.mstrErrorSendingMessage.message
												params[3] = err
												reject(params)
											})
									})
									.catch((err) => {
										resolve(err)
									})
							}
						})
						.catch((err) => {
							params[0] = lang.mstrComparisonError.code
							params[1] = constant.ResponseCode.error
							params[2] = `${lang.mstrComparisonError.message}: ${err}`
							reject(params)
						})
				})
				.catch((err) => {
					params[0] = lang.mstrComparisonError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrComparisonError.message}: ${err}`
					reject(params)
				})
		})
		return promise
	}
	registerAnswer() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			poll.updateOne(
				{ _id: this._id },
				{
					sections: this.sections
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
}

module.exports = Poll
