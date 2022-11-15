'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const isBase64 = require('is-base64')
const cloudinary = require('cloudinary').v2
const lang = require('../lang/es')
const config = require('../config')
const constant = require(`../util/constant`)
const comun = require(`../util/comun`)
const user = require('../models').user
const configuration = require('../models').configuration
const route = require('../models').route
const service = require('../services')
const axios = require('axios').default

// Interfaces
const intTemplate = require('../interfaces').template

cloudinary.config({
	cloud_name: config.cloudname,
	api_key: config.cloudinarykey,
	api_secret: config.cloudinarysecret
})

class User {
	constructor(user = {}) {
		this.__id = user._id || ''
		this._photo = user.photo || ''
		this._name = user.name || ''
		this._email = user.email || ''
		this._password = user.password || ''
		this._password_fb = user.password_fb || ''
		this._password_go = user.password_go || ''
		this._newPassword = user.newPassword || ''
		this._gender = user.gender || ''
		this._entity = user.entity || ''
		this._notifications = user.notifications
		this._token = user.token || ''
		this._reference = user.reference || ''
		this._customer_id = user.customer_id || ''
		this._profile = user.profile || 'USR'
		this._document = user.document || ''
		this._phone = user.phone || ''
		this._allergies = user.allergies || []
		this._occupation = user.occupation || ''
		this._birthday = user.birthday || ''
		this._addresses = user.addresses || []
		this._plan = user.plan || {}
		this._permissions = user.permissions || {}
		this._medical_history = user.medical_history || []
		this._patients = user.patients || []
		this._subscription_id = user.subscription_id || ''
		this._billing = user.billing || {}
		this._merchant = user.merchant || {}
		this._create_by = user.create_by
		this._create_at = user.create_at || ''
		this._modified_by = user.modified_by
		this._modified_at = user.modified_at || ''
		this._inactive = user.inactive || false
	}
	// Getters & Setters
	get _id() {
		return this.__id
	}
	set _id(value) {
		this.__id = value || ''
	}
	get photo() {
		return this._photo
	}
	set photo(value) {
		this._photo = value || ''
	}
	get name() {
		return this._name
	}
	set name(value) {
		this._name = value || ''
	}
	get email() {
		return this._email
	}
	set email(value) {
		this._email = value || ''
	}
	get password() {
		return this._password
	}
	set password(value) {
		this._password = value || ''
	}
	get password_fb() {
		return this._password_fb
	}
	set password_fb(value) {
		this._password_fb = value || ''
	}
	get newPassword() {
		return this._newPassword
	}
	set newPassword(value) {
		this._newPassword = value || ''
	}
	get gender() {
		return this._gender
	}
	set gender(value) {
		this._gender = value || ''
	}
	get entity() {
		return this._entity
	}
	set entity(value) {
		this._entity = value || ''
	}
	get notifications() {
		return this._notifications
	}
	set notifications(value) {
		this._notifications = value
	}
	get token() {
		return this._token
	}
	set token(value) {
		this._token = value || ''
	}
	get reference() {
		return this._reference
	}
	set reference(value) {
		this._reference = value || ''
	}
	get customer_id() {
		return this._customer_id
	}
	set customer_id(value) {
		this._customer_id = value || ''
	}
	get profile() {
		return this._profile
	}
	set profile(value) {
		this._profile = value || ''
	}
	get document() {
		return this._document
	}
	set document(value) {
		this._document = value || ''
	}
	get phone() {
		return this._phone
	}
	set phone(value) {
		this._phone = value || ''
	}
	get allergies() {
		return this._allergies
	}
	set allergies(value) {
		this._allergies = value || ''
	}
	get occupation() {
		return this._occupation
	}
	set occupation(value) {
		this._occupation = value || ''
	}
	get birthday() {
		return this._birthday
	}
	set birthday(value) {
		this._birthday = value || ''
	}
	get addresses() {
		return this._addresses
	}
	set addresses(value) {
		this._addresses = value || []
	}
	get plan() {
		return this._plan
	}
	set plan(value) {
		this._plan = value || []
	}
	get permissions() {
		return this._permissions
	}
	set permissions(value) {
		this._permissions = value || []
	}
	get medical_history() {
		return this._medical_history
	}
	set medical_history(value) {
		this._medical_history = value || []
	}
	get patients() {
		return this._patients
	}
	set patients(value) {
		this._patients = value || []
	}
	get subscription_id() {
		return this._subscription_id
	}
	set subscription_id(value) {
		this._subscription_id = value || []
	}
	get billing() {
		return this._billing
	}
	set billing(value) {
		this._billing = value || []
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
				command: 'LOGIN',
				event: 'signinUser',
				required: ['email', 'password', 'profile'],
				params: [
					'photo',
					'name',
					'email',
					'password',
					'entity',
					'profile',
					'reference'
				]
			},
			{
				command: 'GET_USERS',
				event: 'getUsers',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_CLIENTS',
				event: 'getClients',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_LAST_CLIENT',
				event: 'lastClient',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_CLIENT_RANGE',
				event: 'GetClientRange',
				required: ['firstday', 'lastday'],
				params: ['firstday', 'lastday']
			},
			{
				command: 'GET_NUTRITIONISTS',
				event: 'getNutritionists',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_NUTRITIONISTS_APPOINTMENTS',
				event: 'getNutritionistsAppointments',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_USER_PLAN',
				event: 'getUserPlan',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_PENDING_PLANS',
				event: 'getPendingPlans',
				required: [],
				params: []
			},
			{
				command: 'GET_MEDICAL_HISTORY',
				event: 'getMedicalHistory',
				required: [],
				params: ['inactive']
			},
			{
				command: 'GET_MEDICAL_HISTORY_UPDATE',
				event: 'getMedicalHistoryUpdate',
				required: ['filter'],
				params: ['filter', 'inactive']
			},
			{
				command: 'REGISTER',
				event: 'signupUser',
				required: ['name', 'email', 'entity'],
				params: [
					'photo',
					'name',
					'email',
					'password',
					'profile',
					'entity',
					'token',
					'reference'
				]
			},
			{
				command: 'REGISTER_USER',
				event: 'registerUserSystem',
				required: ['name', 'email', 'entity'],
				params: [
					'name',
					'email',
					'password',
					'profile',
					'entity',
					'token',
					'reference'
				]
			},
			{
				command: 'GET_PROFILE',
				event: 'getProfileUser',
				required: [],
				params: []
			},
			{
				command: 'GET_PAYMENT_METHODS',
				event: 'getPaymentMethods',
				required: [],
				params: []
			},
			{
				command: 'UPDATE_PROFILE',
				event: 'updateProfile',
				required: ['name'],
				params: [
					'name',
					'gender',
					'notifications',
					'photo',
					'birthday',
					'document',
					'phone',
					'allergies',
					'occupation',
					'addresses'
				]
			},
			{
				command: 'UPDATE_USER',
				event: 'updateUserSystem',
				required: ['_id', 'email', 'profile'],
				params: ['_id', 'email', 'name', 'profile', 'inactive']
			},
			{
				command: 'UPDATE_PASSWORD',
				event: 'updatePassword',
				required: ['password', 'newPassword'],
				params: ['password', 'newPassword']
			},
			{
				command: 'UPDATE_PLAN_STATUS',
				event: 'updatePlanStatus',
				required: ['_id', 'plan'],
				params: ['_id', 'plan']
			},
			{
				command: 'DELETE_USER',
				event: 'deleteUser',
				required: ['_id'],
				params: ['_id']
			},
			{
				command: 'RECOVER_PASSWORD',
				event: 'recoverPassword',
				required: ['email', 'profile'],
				params: ['email', 'profile']
			},
			{
				command: 'VALIDATE_TOKEN',
				event: 'validateToken',
				required: [],
				params: []
			},
			{
				command: 'RESTORE_PASSWORD',
				event: 'restorePassword',
				required: ['password'],
				params: ['password']
			},
			{
				command: 'DELETE_CLIENT',
				event: 'deleteClient',
				required: ['_id'],
				params: ['_id']
			},
			{
				command: 'UPDATE_CLIENT',
				event: 'updateClient',
				required: ['_id', 'name', 'inactive'],
				params: ['_id', 'name', 'inactive']
			},
			{
				command: 'ASSOCIATE_PLAN',
				event: 'associatePlan',
				required: ['plan', 'billing'],
				params: ['plan', 'billing']
			},
			{
				command: 'ASSIGN_PERMISSIONS',
				event: 'assignPermissions',
				required: ['_id', 'permissions', 'inactive'],
				params: ['_id', 'permissions', 'inactive']
			},
			{
				command: 'ADD_MEDICAL_HISTORY',
				event: 'addMedicalHistory',
				required: ['_id', 'medical_history', 'inactive'],
				params: ['_id', 'medical_history', 'inactive']
			},
			{
				command: 'SUSPEND_PLAN',
				event: 'suspendPlan',
				required: ['_id', 'duration', 'suspended'],
				params: ['_id', 'duration', 'suspended']
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
	findUserById(id = null) {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const idusr = id === null ? this.merchant.sub : id
			user.findOne({ _id: idusr }, (err, oUser) => {
				if (err) {
					params[0] = lang.mstrRecordFound.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrRecordFound.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrRecordFound.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordFound.message
					params[3] = oUser
					resolve(params)
				}
			})
		})
		return promise
	}
	getUsers() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.find({ profile: { $ne: 'USR' } }, (err, oUser) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser
					resolve(params)
				}
			})
		})
		return promise
	}
	getClients() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.find({ profile: 'USR' }, (err, oUser) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser
					resolve(params)
				}
			})
		})
		return promise
	}
	lastClient() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.findOne(filter)
				.sort({ create_at: -1 })
				.limit(1)
				.exec((err, oClients) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oClients
						resolve(params)
					}
				})
		})
		return promise
	}
	GetClientRange() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.aggregate(
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
				(err, oClients) => {
					if (err) {
						params[0] = lang.mstrErrorSearching.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrErrorSearching.message}: ${err}`
						reject(params)
					} else {
						params[0] = lang.mstrSuccessfulSearch.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrSuccessfulSearch.message
						params[3] = oClients
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	getNutritionists() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.find({ profile: 'NUT' }, (err, oUser) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser
					resolve(params)
				}
			})
		})
		return promise
	}
	getNutritionistsAppointments() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.find({ _id: this.merchant.sub }, (err, oUser) => {
				/* if (!oUser.patients) {
					params[0] = lang.mstrNotMembership.code
					params[1] = constant.ResponseCode.warning
					params[2] = lang.mstrNotMembership.message
					reject(params)
				} else  */
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser
					resolve(params)
				}
			})
		})
		return promise
	}
	getMedicalHistory() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.findOne({ _id: this.merchant.sub }, (err, oUser) => {
				if (!oUser.medical_history) {
					params[0] = lang.mstrNotMembership.code
					params[1] = constant.ResponseCode.warning
					params[2] = lang.mstrNotMembership.message
					reject(params)
				} else if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser.medical_history
					resolve(params)
				}
			})
		})
		return promise
	}
	getMedicalHistoryUpdate() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.findOne({ _id: this.filter }, (err, oUser) => {
				if (!oUser.medical_history) {
					params[0] = lang.mstrNotMembership.code
					params[1] = constant.ResponseCode.warning
					params[2] = lang.mstrNotMembership.message
					reject(params)
				} else if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser.medical_history
					resolve(params)
				}
			})
		})
		return promise
	}
	getUserPlan() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const filter = {}
			if (this.inactive) {
				filter.inactive = this.inactive
			}
			user.findOne({ _id: this.merchant.sub }, (err, oUser) => {
				if (!oUser.plan) {
					params[0] = lang.mstrNotMembership.code
					params[1] = constant.ResponseCode.warning
					params[2] = lang.mstrNotMembership.message
					reject(params)
				} else if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					params[0] = lang.mstrSuccessfulSearch.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrSuccessfulSearch.message
					params[3] = oUser.plan
					resolve(params)
				}
			})
		})
		return promise
	}
	deleteClient() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.deleteOne({ _id: this._id }, (err) => {
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
	signinUser() {
		let params = []
		const bsr = config.bcrypt_salt_rounds
		const promise = new Promise((resolve, reject) => {
			this.findUserByEmail()
				.then(async (resp) => {
					const user = resp[3]
					if (user === null) {
						params[0] = lang.mstrUserNotFound.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrUserNotFound.message
						reject(params)
					} else {
						let clientPassword = ''
						let serverPassword = ''
						this.merchant = {
							sub: user._id,
							profile: user.profile,
							name: user.name,
							email: user.email
						}
						const exclude = ['entity', 'reference']
						switch (this.entity) {
							case 'GETUP': {
								try {
									clientPassword = this.password
									serverPassword = user.password
									if (
										!user.password ||
										user.password === ''
									) {
										// Asignamos los valores de usuario a la clase
										for (let prop in user) {
											if (exclude.indexOf(prop) <= -1) {
												this[prop] = user[prop]
											}
										}
										const altPassword = crypto
											.createHash('md5')
											.update('DefaultGeUpPassword')
											.digest('hex')
										const hashedPass = await bcrypt.hash(
											altPassword,
											bsr
										)
										serverPassword = hashedPass
										this.password = serverPassword
										await this.updateUser()
									}
								} catch (ex) {
									params[0] = lang.mstrUpdateError.code
									params[1] = constant.ResponseCode.error
									params[2] = `${lang.mstrUpdateError.message}: ${ex}`
									reject(params)
								}
								break
							}
							case 'FACEBOOK': {
								try {
									clientPassword = this.reference
									serverPassword = user.password_fb
									if (
										!user.password_fb ||
										user.password_fb === ''
									) {
										// Asignamos los valores de usuario a la clase
										for (let prop in user) {
											if (exclude.indexOf(prop) <= -1) {
												this[prop] = user[prop]
											}
										}
										const hashedPass = await bcrypt.hash(
											this.reference,
											bsr
										)
										serverPassword = hashedPass
										this.password_fb = serverPassword
										await this.updateUser()
									}
								} catch (ex) {
									params[0] = lang.mstrUpdateError.code
									params[1] = constant.ResponseCode.error
									params[2] = `${lang.mstrUpdateError.message}: ${ex}`
									reject(params)
								}
								break
							}
							case 'GOOGLE': {
								try {
									clientPassword = this.reference
									serverPassword = user.password_go
									if (
										!user.password_go ||
										user.password_go === ''
									) {
										// Asignamos los valores de usuario a la clase
										for (let prop in user) {
											if (exclude.indexOf(prop) <= -1) {
												this[prop] = user[prop]
											}
										}
										const hashedPass = await bcrypt.hash(
											this.reference,
											bsr
										)
										serverPassword = hashedPass
										this.password_go = serverPassword
										await this.updateUser()
									}
								} catch (ex) {
									params[0] = lang.mstrUpdateError.code
									params[1] = constant.ResponseCode.error
									params[2] = `${lang.mstrUpdateError.message}: ${ex}`
									reject(params)
								}
								break
							}
						}
						bcrypt
							.compare(clientPassword, serverPassword)
							.then((validate) => {
								if (validate) {
									params[0] = lang.mstrCorrectPassword.code
									params[1] = constant.ResponseCode.success
									params[2] = lang.mstrCorrectPassword.message
									params[3] = {
										token: service.createToken(user)
									}
									resolve(params)
								} else {
									params[0] = lang.mstrIncorrectPassword.code
									params[1] = constant.ResponseCode.error
									params[2] =
										lang.mstrIncorrectPassword.message
									reject(params)
								}
							})
							.catch((err) => {
								params[0] = lang.mstrComparisonError.code
								params[1] = constant.ResponseCode.error
								params[2] = `${lang.mstrComparisonError.message}: ${err}`
								reject(params)
							})
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	signupUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			this.findUserByEmail()
				.then((resp) => {
					let user = resp[3]
					if (user === null) {
						// Se obtiene el codigo de seguridad
						configuration.findOne(
							{ inactive: false },
							(err, oConf) => {
								if (err) {
									params[0] = lang.mstrSearchError.code
									params[1] = constant.ResponseCode.error
									params[2] = lang.mstrSearchError.message
									reject(params)
								} else {
									// Validando token de seguridad si el acceso es administrador
									if (this.profile !== 'USR') {
										oConf = oConf
											? oConf
											: { security: { access_code: '' } }
										let token_admins = oConf.security
											.access_code
											? oConf.security.access_code
											: ''
										token_admins =
											token_admins === ''
												? config.token_admins
												: token_admins
										if (this.token !== token_admins) {
											params[0] =
												lang.mstrInvalidTokenAdmin.code
											params[1] =
												constant.ResponseCode.error
											params[2] =
												lang.mstrInvalidTokenAdmin.message
											reject(params)
											return
										}
									}
									this.registerUser()
										.then((resp) => {
											resolve(resp)
										})
										.catch((err) => {
											reject(err)
										})
								}
							}
						)
					} else {
						if (this.entity !== 'GETUP') {
							this.signinUser()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						} else {
							params[0] = lang.mstrUserAlreadyExists.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrUserAlreadyExists.message
							reject(params)
						}
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	registerUser() {
		let params = []
		const bsr = config.bcrypt_salt_rounds
		const promise = new Promise((resolve, reject) => {
			let datreg = comun.getDateTime('yyyy-MM-dd hh:mm:ss')
			let newPassword = ''
			switch (this.entity) {
				case 'GETUP': {
					newPassword = this.password
					break
				}
				default: {
					newPassword = this.reference
					break
				}
			}
			this.getRoutes()
				.then((resp) => {
					bcrypt.hash(newPassword, bsr).then((hashedPass) => {
						let objUser = {
							photo: this.photo,
							name: this.name,
							email: this.email,
							entity: this.entity,
							reference: this.reference,
							profile: this.profile,
							notifications: this.notifications,
							permissions: resp[3],
							create_by: { sub: 'system' },
							create_at: datreg,
							inactive: false
						}
						switch (this.entity) {
							case 'GETUP': {
								objUser.password = hashedPass
								this.password = hashedPass
								break
							}
							case 'FACEBOOK': {
								objUser.password_fb = hashedPass
								this.password_fb = hashedPass
								break
							}
							case 'GOOGLE': {
								objUser.password_go = hashedPass
								this.password_go = hashedPass
								break
							}
						}
						const mUser = new user(objUser)
						// Se valida el nombre
						let firstname = ''
						let lastname = ''
						const name = this.name.split(' ')
						if (name.length <= 1) {
							params[0] = lang.mstrMalformedName.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrMalformedName.message
							reject(params)
							return
						} else {
							if (name.length == 2) {
								firstname = name[0]
								lastname = name[1]
							} else if (name.length == 3) {
								firstname = name[0]
								lastname = `${name[1]} ${name[2]}`
							} else if (name.length == 4) {
								firstname = `${name[0]} ${name[1]}`
								lastname = `${name[2]} ${name[3]}`
							}
						}
						mUser.save((err) => {
							if (err) {
								params[0] = lang.mstrSavingError.code
								params[1] = constant.ResponseCode.error
								params[2] = `${lang.mstrSavingError.message}: ${err}`
								reject(params)
							} else {
								this.id = mUser._id
								let uri = ''
								let object = {}
								let Authorization = ''
								const data = `${config.payu_api_login}:${config.payu_api_key}`
								const buff = new Buffer.from(data)
								const base64data = buff.toString('base64')
								if (this.profile === 'USR') {
									// Se guarda el nuevo usuario como cliente en la pasarela
									if (config.payment_gateway == 'PAYU') {
										uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/customers`
										object = {
											fullName: this.name,
											email: this.email
										}
										Authorization = `Basic ${base64data}`
									} else {
										uri = `${config.culqi_uri}/customers`
										object = {
											first_name: firstname,
											last_name: lastname,
											email: this.email,
											address: 'Av. Brasil 123',
											address_city: 'Lima',
											country_code: 'PE',
											phone_number: '6505434800',
											metadata: {
												name: this.name,
												email: this.email,
												profile: this.profile
											}
										}
										Authorization = `Bearer ${config.culqi_private_key}`
									}
									axios
										.post(uri, object, {
											headers: {
												Authorization: Authorization
											}
										})
										.then((resp) => {
											const data = resp.data
											this.customer_id = data.id
										})
										.catch((err) => {
											console.log(err)
										})
										.finally(() => {
											this.merchant = {
												sub: mUser._id,
												profile: 'USR',
												name: mUser.name,
												email: mUser.email
											}
											this.updateUser()
												.then((resp2) => {
													params[0] =
														lang.mstrSavedRecord.code
													params[1] =
														constant.ResponseCode.success
													params[2] =
														lang.mstrSavedRecord.message
													params[3] = {
														token: service.createToken(
															mUser
														)
													}
													params[4] = resp2
													resolve(params)
												})
												.catch((err) => {
													params[0] =
														lang.mstrSavingError.code
													params[1] =
														constant.ResponseCode.error
													params[2] =
														lang.mstrSavingError.message
													params[3] = err
													reject(params)
												})
										})
								} else {
									params[0] = lang.mstrSavedRecord.code
									params[1] = constant.ResponseCode.success
									params[2] = lang.mstrSavedRecord.message
									params[3] = {
										token: service.createToken(mUser)
									}
									params[4] = mUser
									resolve(params)
								}
							}
						})
					})
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	updateClient() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: this._id },
				{ inactive: true },
				{
					name: this.name,
					modified_by: this.merchant,
					modified_at: new Date(),
					inactive: false
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
			),
				user.updateOne(
					{ _id: this._id },
					{ inactive: false },
					{
						name: this.name,
						modified_by: this.merchant,
						modified_at: new Date(),
						inactive: true
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
	updateUser(id = null) {
		let params = []
		const promise = new Promise((resolve, reject) => {
			const objUser = {
				photo: this.photo,
				name: this.name,
				email: this.email,
				password: this.password,
				password_fb: this.password_fb,
				password_go: this.password_go,
				entity: this.entity,
				reference: this.reference,
				customer_id: this.customer_id,
				profile: this.profile,
				create_by: this.create_by,
				create_at: this.create_at,
				modified_by: this.modified_by,
				modified_at: this.modified_at,
				inactive: this.inactive
			}
			const idusr = id === null ? this.merchant.sub : id
			user.updateOne({ _id: idusr }, objUser, (err, success) => {
				if (err) {
					params[0] = lang.mstrUpdateError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrUpdateError.message}: ${err}`
					reject(params)
				}
				if (this.profile === 'USR') {
					// Se actualiza la información en la pasarela
					let uri = ''
					let object = {}
					let Authorization = ''
					let method = ''
					const data = `${config.payu_api_login}:${config.payu_api_key}`
					const buff = new Buffer.from(data)
					const base64data = buff.toString('base64')
					if (config.payment_gateway == 'PAYU') {
						uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/customers${this.customer_id}`
						object = {
							fullName: this.name,
							email: this.email
						}
						Authorization = `Basic ${base64data}`
						method = 'PUT'
					} else {
						uri = `${config.culqi_uri}/customers/${this.customer_id}`
						object = {
							metadata: {
								name: this.name,
								email: this.email,
								profile: this.profile
							}
						}
						Authorization = `Bearer ${config.culqi_private_key}`
						method = 'PATCH'
					}
					axios
						.request({
							url: uri,
							method: method,
							headers: {
								Authorization: Authorization
							},
							params: {},
							data: object
						})
						.then((resp) => {
							console.log(resp)
						})
						.catch((err) => {
							console.log(err)
						})
					params[0] = lang.mstrRecordUpdate.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordUpdate.message
					resolve(params)
				} else {
					params[0] = lang.mstrRecordUpdate.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordUpdate.message
					params[3] = success
					resolve(params)
				}
			})
		})
		return promise
	}
	getProfileUser() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			user.findOne(
				{ _id: this.merchant.sub },
				{ password: 0, password_fb: 0, password_go: 0, entity: 0 },
				(err, oUser) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.code}: ${err}`
						reject(params)
					} else {
						if (oUser) {
							params[0] = lang.mstrRecordFound.code
							params[1] = constant.ResponseCode.success
							params[2] = lang.mstrRecordFound.code
							params[3] = oUser
							resolve(params)
						} else {
							params[0] = lang.mstrUserNotFound.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrUserNotFound.message
							reject(params)
						}
					}
				}
			)
		})
		return promise
	}
	async updateProfile() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			this.photo = this.photo.replace(/^data:image\/[a-z]+;base64,/, '')
			if (isBase64(this.photo) && this.photo != '') {
				comun.base64_decode(
					this.photo,
					`./fileserver/${this.merchant.sub}.png`
				)
				cloudinary.uploader.upload(
					`./fileserver/${this.merchant.sub}.png`,
					{
						public_id: this.merchant.sub
					},
					(error, result) => {
						if (error) {
							params[0] = lang.mstrUploadError.code
							params[1] = constant.ResponseCode.error
							params[2] = `${lang.mstrUploadError.message}: ${error}`
							reject(params)
						} else {
							this.photo = result.secure_url
						}
						user.updateOne(
							{ _id: this.merchant.sub },
							{
								name: this.name,
								photo: this.photo,
								birthday: this.birthday,
								document: this.document,
								allergies: this.allergies,
								occupation: this.occupation,
								phone: this.phone,
								gender: this.gender,
								notifications: this.notifications,
								addresses: this.addresses,
								modified_by: this.merchant,
								modified_at: new Date()
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
				)
			} else {
				user.updateOne(
					{ _id: this.merchant.sub },
					{
						name: this.name,
						photo: this.photo,
						birthday: this.birthday,
						gender: this.gender,
						notifications: this.notifications,
						document: this.document,
						allergies: this.allergies,
						phone: this.phone,
						occupation: this.occupation,
						addresses: this.addresses,
						modified_by: this.merchant,
						modified_at: new Date()
					},
					(err, success) => {
						if (err) {
							params[0] = lang.mstrUpdateError.code
							params[1] = constant.ResponseCode.error
							params[2] = `${lang.mstrUpdateError.message}: ${err}`
							reject(params)
						} else {
							user.findOne(
								{ _id: this.merchant.sub },
								(err1, oUser) => {
									if (err1) {
										params[0] = lang.mstrSearchError.code
										params[1] = constant.ResponseCode.error
										params[2] = lang.mstrSearchError.message
										params[3] = err1
										reject(params)
									} else {
										params[0] = lang.mstrRecordUpdate.code
										params[1] =
											constant.ResponseCode.success
										params[2] =
											lang.mstrRecordUpdate.message
										params[3] = oUser
										params[4] = success
										resolve(params)
									}
								}
							)
						}
					}
				)
			}
		})
		return promise
	}
	updatePassword() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			this.findUserById()
				.then((resp) => {
					const usr = resp[3]
					bcrypt
						.compare(this.password, usr.password)
						.then((validate) => {
							if (validate) {
								const bsr = config.bcrypt_salt_rounds
								bcrypt
									.hash(this.newPassword, bsr)
									.then((hashedPass) => {
										for (let prop in usr) {
											this[prop] = usr[prop]
										}
										this.password = hashedPass
										this.updateUser()
											.then((resp) => {
												resolve(resp)
											})
											.catch((err) => {
												reject(err)
											})
									})
							} else {
								params[0] = lang.mstrIncorrectPassword.code
								params[1] = constant.ResponseCode.error
								params[2] = lang.mstrIncorrectPassword.message
								reject(params)
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
					reject(err)
				})
		})
		return promise
	}
	recoverPassword() {
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
					} else {
						const oTemplate = new intTemplate({
							code: 'RECOVER_PASSWORD'
						})
						// Se obtiene la plantilla
						const token = service.createToken(user)
						const link_recover = `${config.client}/account/auth/recover-password?token=${token}`
						oTemplate
							.getTemplate('RECOVER_PASSWORD')
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
													name: user.name,
													link_recover: link_recover
												}
											}
										],
										'Solicitud de cambio de clave',
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
										params[1] = constant.ResponseCode.error
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
		return promise
	}
	validateToken() {
		let params = {}
		const promise = new Promise((resolve) => {
			params[0] = lang.mstrValidToken.code
			params[1] = constant.ResponseCode.success
			params[2] = lang.mstrValidToken.message
			resolve(params)
		})
		return promise
	}
	restorePassword() {
		const promise = new Promise((resolve, reject) => {
			const bsr = config.bcrypt_salt_rounds
			bcrypt.hash(this.password, bsr).then((hashedPass) => {
				this.findUserById()
					.then((resp) => {
						const usr = resp[3]
						usr.password = hashedPass
						// Asignamos los valores de usuario a la clase
						for (let prop in usr) {
							this[prop] = usr[prop]
						}
						this.updateUser()
							.then((resp) => {
								resolve(resp)
							})
							.catch((err) => {
								reject(err)
							})
					})
					.catch((err) => {
						reject(err)
					})
			})
		})
		return promise
	}
	getPaymentMethods() {
		const promise = new Promise((resolve, reject) => {
			this.getProfileUser()
				.then((resp) => {
					const user = resp[3]
					resolve(user)
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	associatePlan() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			let uri = ''
			let object = {}
			let Authorization = ''
			this.findUserById()
				.then((resp) => {
					const usr = resp[3]
					const userAssociate = (data) => {
						user.updateOne(
							{ _id: this.merchant.sub },
							{
								plan: this.plan
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
									params[3] = data
									params[4] = success
									resolve(params)
								}
							}
						)
					}
					if (this.plan.method === 'CASH') {
						userAssociate({})
					} else {
						if (config.payment_gateway == 'PAYU') {
							uri = `${config.payu_uri_prod_subscriptions}/rest/v4.9/subscriptions`
							object = {
								quantity: 1,
								installments: 1,
								trialDays: 0,
								customer: {
									id: usr.customer_id,
									creditCards: [
										{
											token: this.billing.token_id
										}
									]
								},
								plan: {
									planCode: this.plan.plan_id
								}
							}
						} else {
							uri = `${config.culqi_uri}/subscriptions`
							object = {
								card_id: this.billing.card_id,
								plan_id: this.plan.plan_id
							}
							Authorization = `Bearer ${config.culqi_private_key}`
						}
						axios
							.post(uri, object, {
								headers: {
									Authorization: Authorization
								}
							})
							.then((resp) => {
								const data = resp.data
								this.plan.subscription_id = data.id
								userAssociate(data)
							})
							.catch((err) => {
								params[0] = lang.mstrSavingError.code
								params[1] = constant.ResponseCode.error
								params[2] = lang.mstrSavingError.message
								params[3] = err
								reject(params)
							})
					}
				})
				.catch((err) => {
					// console.log(err)
					reject(err)
				})
		})
		return promise
	}
	assignPermissions() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: this._id },
				{
					permissions: this.permissions,
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
	addMedicalHistory() {
		let params = {}
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: this._id },
				{
					medical_history: this.medical_history,
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
	registerUserSystem() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			this.findUserByEmail()
				.then((resp) => {
					let user = resp[3]
					if (user === null) {
						if (this.profile !== 'USR') {
							this.registerUser()
								.then((resp) => {
									resolve(resp)
								})
								.catch((err) => {
									reject(err)
								})
						} else {
							params[0] = lang.mstrInvalidProfile.code
							params[1] = constant.ResponseCode.error
							params[2] = lang.mstrInvalidProfile.message
							reject(params)
						}
					} else {
						params[0] = lang.mstrUserAlreadyExists.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrUserAlreadyExists.message
						reject(params)
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	updateUserSystem() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			this.findUserById(this._id)
				.then((resp) => {
					let user = resp[3]
					if (user === null) {
						params[0] = lang.mstrUserNotFound.code
						params[1] = constant.ResponseCode.error
						params[2] = lang.mstrUserNotFound.message
						reject(params)
					} else {
						const exclude = ['name', 'profile', 'inactive']
						// Asignamos los valores de usuario a la clase
						for (let prop in user) {
							if (exclude.indexOf(prop) <= -1) {
								this[prop] = user[prop]
							}
						}
						this.updateUser(this._id)
							.then((resp) => {
								resolve(resp)
							})
							.catch((err) => {
								reject(err)
							})
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
		return promise
	}
	deleteUser() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.deleteOne({ _id: this._id }, (err) => {
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
	getRoutes() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			route.find({ profile: this.profile }, (err, oRoutes) => {
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
	getPendingPlans() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.find(
				{
					'plan.state': {
						$in: ['PENDING', 'ASSOCIATED', 'CANCELLED']
					},
					inactive: false
				},
				(err, oUsers) => {
					if (err) {
						params[0] = lang.mstrSearchError.code
						params[1] = constant.ResponseCode.error
						params[2] = `${lang.mstrSearchError.message}: ${err}`
						reject(params)
					} else {
						const plans = []
						oUsers.forEach((objUser) => {
							let plan = {}
							plan = Object.assign({}, objUser.plan._doc)
							plan.user = {
								_id: objUser._id,
								name: objUser.name,
								email: objUser.email,
								document: objUser.document,
								phone: objUser.phone
							}
							plans.push(plan)
						})
						params[0] = lang.mstrRecordFound.code
						params[1] = constant.ResponseCode.success
						params[2] = lang.mstrRecordFound.message
						params[3] = plans
						resolve(params)
					}
				}
			)
		})
		return promise
	}
	updatePlanStatus() {
		let params = []
		const promise = new Promise((resolve, reject) => {
			user.updateOne(
				{ _id: this._id },
				{
					'plan.state': this.plan.state
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
	suspendPlan() {
		let params = []
		let plan = {}
		//let total_days = 0
		const promise = new Promise((resolve, reject) => {
			user.find({ _id: this.merchant.sub }, (err, oUser) => {
				if (err) {
					params[0] = lang.mstrSearchError.code
					params[1] = constant.ResponseCode.error
					params[2] = `${lang.mstrSearchError.message}: ${err}`
					reject(params)
				} else {
					plan = oUser[0].plan
					/* GERAL */
					let arrSuspended = plan.suspended
					arrSuspended = arrSuspended.concat(this.suspended)
					/* GERAL */

					//total_days = Number(plan.duration) + Number(this.duration)
					let objUser = {
						photos: plan.photos,
						includes: plan.includes,
						_id: plan._id,
						name: plan.name,
						duration: plan.duration,
						description: plan.description,
						price: plan.price,
						maximum_appointments: plan.maximum_appointments,
						suspended: arrSuspended,
						plan_id: plan.plan_id,
						state: plan.state,
						method: plan.method,
						operation_number: plan.operation_number,
						subscription_id: plan.subscription_id
					}
					user.updateOne(
						{ _id: this.merchant.sub },
						{ plan: objUser },
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
					params[0] = lang.mstrRecordFound.code
					params[1] = constant.ResponseCode.success
					params[2] = lang.mstrRecordFound.message
					resolve(params)
				}
			})
		})
		return promise
	}
}

module.exports = User
