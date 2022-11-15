'use strict'

const intAlert = require('../interfaces/alert')
const comun = require(`../util/comun`)
const request = require(`../util/request`)

const alert = {
	get: (req, res) => {
		request
			.executePetition('GET', intAlert, req, false)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	post: (req, res) => {
		request
			.executePetition('POST', intAlert, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	put: (req, res) => {
		request
			.executePetition('PUT', intAlert, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	patch: (req, res) => {
		request
			.executePetition('PATCH', intAlert, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	delete: (req, res) => {
		request
			.executePetition('DELETE', intAlert, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	}
}
module.exports = alert
