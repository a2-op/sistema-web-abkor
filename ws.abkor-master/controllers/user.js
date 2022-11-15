'use strict'

const intUser = require('../interfaces/user')
const comun = require(`../util/comun`)
const request = require(`../util/request`)

const user = {
	get: (req, res) => {
		request
			.executePetition('GET', intUser, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	post: (req, res) => {
		request
			.executePetition('POST', intUser, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	put: (req, res) => {
		request
			.executePetition('PUT', intUser, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	patch: (req, res) => {
		request
			.executePetition('PATCH', intUser, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	delete: (req, res) => {
		request
			.executePetition('DELETE', intUser, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	}
}
module.exports = user
