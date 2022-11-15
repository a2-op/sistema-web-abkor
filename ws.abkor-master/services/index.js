let jwt = require('jsonwebtoken')
let moment = require('moment')
let config = require('../config')

function createToken(user) {
	const payload = {
		exp: moment()
			.add(1, 'days')
			.unix(),
		sub: user._id,
		profile: user.profile,
		name: user.name,
		email: user.email,
		iat: moment().unix()
	}
	return jwt.sign(payload, config.token_secret)
}

function decodeToken(token) {
	let params = []
	const decoded = new Promise((resolve, reject) => {
		jwt.verify(token, config.token_secret, (err, user) => {
			if (err) {
				params.message = err
				params.status = 401
				params.code = '0003'
				reject(params)
			} else {
				params.message = ''
				params.status = 200
				params.code = '0004'
				params.response = {
					user: user
				}
				resolve(params)
			}
		})
	})

	return decoded
}
function createTokenPoll(sub, poll, receiver) {
	const payload = {
		sub: sub,
		poll: poll,
		receiver: receiver,
		iat: moment().unix()
	}
	return jwt.sign(payload, config.token_secret)
}

function decodeTokenPoll(token) {
	let params = []
	params.code = 'ERROR'
	const decoded = new Promise((resolve, reject) => {
		try {
			const payload = jwt.decode(token, config.token_secret)
			if (payload.exp <= moment().unix()) {
				params.message = ''
				params.status = 401
				params.code = '0002'
				reject(params)
			}
			params.message = ''
			params.status = 200
			params.code = '0004'
			params.response = {
				poll: payload.poll,
				receiver: payload.receiver
			}
			resolve(params)
		} catch (err) {
			params.message = err
			params.status = 403
			params.code = '0003'
			reject(params)
		}
	})
	return decoded
}
module.exports = {
	createToken,
	decodeToken,
	createTokenPoll,
	decodeTokenPoll
}
