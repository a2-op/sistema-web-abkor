'use strict'

const intMyWeek = require('../interfaces/myweek')
const comun = require(`../util/comun`)
const request = require(`../util/request`)

const myWeek = {
	get: (req, res) => {
		request
			.executePetition('GET', intMyWeek, req, false)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	post: (req, res) => {
		request
			.executePetition('POST', intMyWeek, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	put: (req, res) => {
		request
			.executePetition('PUT', intMyWeek, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	patch: (req, res) => {
		request
			.executePetition('PATCH', intMyWeek, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	delete: (req, res) => {
		request
			.executePetition('DELETE', intMyWeek, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	}
}

module.exports = myWeek
