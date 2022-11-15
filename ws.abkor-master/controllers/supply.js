'use strict'

const intSupply = require('../interfaces/supply')
const comun = require(`../util/comun`)
const request = require(`../util/request`)

const supply = {
	get: (req, res) => {
		request
			.executePetition('GET', intSupply, req, false)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	post: (req, res) => {
		request
			.executePetition('POST', intSupply, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	put: (req, res) => {
		request
			.executePetition('PUT', intSupply, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	patch: (req, res) => {
		request
			.executePetition('PATCH', intSupply, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	},
	delete: (req, res) => {
		request
			.executePetition('DELETE', intSupply, req)
			.then((resp) => {
				return res.status(200).send(comun.ObjectResponse(resp))
			})
			.catch((err) => {
				return res.status(200).send(comun.ObjectResponse(err))
			})
	}
}
module.exports = supply
