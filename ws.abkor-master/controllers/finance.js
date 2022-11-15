'use strict'

const intFinance = require('../interfaces/finance')
const comun = require(`../util/comun`)
const request = require(`../util/request`)

const finance = {
	get: (req, res) => {
		request
			.executePetition('GET', intFinance, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	post: (req, res) => {
		request
			.executePetition('POST', intFinance, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	put: (req, res) => {
		request
			.executePetition('PUT', intFinance, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	patch: (req, res) => {
		request
			.executePetition('PATCH', intFinance, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	delete: (req, res) => {
		request
			.executePetition('DELETE', intFinance, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	}
}
module.exports = finance
