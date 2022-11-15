const services = require('../services/index')
const comun = require('../util/comun')
const constant = require('../util/constant')

let ensureAuthenticated = (req, res, next) => {
	let lang = require('../lang/es')
	let params = []
	if (!req.headers.authorization) {
		params[0] = lang.mstrNotAuthorizationHeader.code
		params[1] = constant.ResponseCode.error
		params[2] = lang.mstrNotAuthorizationHeader.message
		return res
			.status(401) //Unauthorized
			.send(comun.ObjectResponse(params))
	}
	const token = req.headers.authorization.split(' ')[1]
	services
		.decodeToken(token)
		.then((response) => {
			req.user = response
			next()
		})
		.catch((response) => {
			params[0] = response.code
			params[1] = constant.ResponseCode.error
			params[2] = `${response.message}`
			return res.status(401).send(comun.ObjectResponse(params))
		})
}

module.exports = ensureAuthenticated
