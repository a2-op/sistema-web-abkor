'use strict'
const fs = require('fs')
const config = require('../config')
const sgMail = require('@sendgrid/mail')
const axios = require('axios').default

sgMail.setApiKey(config.sendgrid_api_key)

// Prototypes
Array.prototype.unique = ((a) => {
	return () => {
		return this.filter(a)
	}
})((a, b, c) => {
	return c.indexOf(a, b + 1) < 0
})

function getDateTime(format = 'dd-MM-yyyy', longdate = '') {
	var date = longdate != '' ? new Date(longdate) : new Date()
	var hour = date.getHours()
	hour = (hour < 10 ? '0' : '') + hour
	var min = date.getMinutes()
	min = (min < 10 ? '0' : '') + min
	var sec = date.getSeconds()
	sec = (sec < 10 ? '0' : '') + sec
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	month = (month < 10 ? '0' : '') + month
	var day = date.getDate()
	day = (day < 10 ? '0' : '') + day
	var date_result = format.replace('dd', day)
	date_result = date_result.replace('MM', month)
	date_result = date_result.replace('yyyy', year)
	date_result = date_result.replace('hh', hour)
	date_result = date_result.replace('mm', min)
	date_result = date_result.replace('ss', sec)
	return date_result
}

function containProps(obj, props) {
	let cont = 0
	for (const prop in obj) {
		if (props.indexOf(prop) > -1) {
			cont += 1
		}
	}
	return cont === props.length
}

function removeDuplicates(originalArray, prop) {
	var newArray = []
	var lookupObject = {}

	for (var i in originalArray) {
		lookupObject[originalArray[i][prop]] = originalArray[i]
	}

	for (i in lookupObject) {
		newArray.push(lookupObject[i])
	}
	return newArray
}

function isEmptyObject(obj) {
	return !Object.keys(obj).length
}

function ObjectResponse(params) {
	var dataResponse = {
		code: params[0],
		status: params[1],
		message: params[2],
		Response: params[3],
		ExtraParameters: params[4]
	}
	return dataResponse
}

function validateLanguage(lang) {
	if (!lang) return false
	if (lang.trim() === '') return false
	if (fs.existsSync(`./lang/${lang}.json`)) {
		return true
	} else {
		return false
	}
}

function sumDays(date, days) {
	date.setDate(date.getDate() + days)
	return date
}

function getLanguage(lang) {
	if (validateLanguage(lang)) return lang
	else return 'en'
}
/* function sendMail(to_email, subject, type, content, attachments = []) {
	let from_email = new helper.Email(config.sendgrid_from)
	let to_email = new helper.Email(to_email)
	let subject = subject
	let content = new helper.Content(type, content)
	let mail = new helper.Mail(from_email, subject, to_email, content)
	attachments.forEach((fileattach) => {
		let attachment = new helper.Attachment()
		attachment.setContent(fileattach.file)
		attachment.setType(fileattach.mime)
		attachment.setFilename(fileattach.filename)
		attachment.setDisposition('attachment')

		mail.addAttachment(attachment)
	})

	let sg = require('sendgrid')(config.sendgrid_api_key)
	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	})

	sg.API(request, function(response) {
		console.log(response.statusCode)
		console.log(response.body)
		console.log(response.headers)
	})
} */
function sendMailTemplate(to, subject, content, templateId, attachments = []) {
	const promise = new Promise((resolve, reject) => {
		content = content.trim() === '' ? '<span>Vive GetUp</span>' : content
		const msg = {
			personalizations: [],
			template_id: templateId,
			html: content
		}
		// Add from
		msg.from = {
			email: config.sendgrid_from,
			name: 'Vive GetUp'
		}
		// Add personalizations
		msg.personalizations = []
		to.forEach((recipient) => {
			const oRecipient = {
				to: [
					{
						email: recipient.data.email,
						name: recipient.data.name
					}
				],
				subject: subject,
				dynamic_template_data: recipient.substitution
			}
			msg.personalizations.push(oRecipient)
		})
		attachments.forEach((attachment) => {
			msg.attachments.push({
				content: attachment.content,
				type: attachment.type,
				filename: attachment.filename
			})
		})
		sgMail
			.send(msg)
			.then((resp) => {
				resolve(resp)
			})
			.catch((err) => {
				reject(err)
			})
	})
	return promise
}

function getTemplate(id) {
	const promise = new Promise((resolve, reject) => {
		axios
			.get(`https://api.sendgrid.com/v3/templates/${id}`, {
				headers: {
					Authorization: `Bearer ${config.sendgrid_api_key}`
				}
			})
			.then((resp) => {
				resolve(resp)
			})
			.catch((err) => {
				reject(err)
			})
	})
	return promise
}

function evalObjectValue(object) {
	let keys = Object.keys(object)
	let aux = false
	keys.forEach((key) => {
		if (object[key] !== '') {
			return (aux = true)
		}
	})

	return aux
}

function redefineProperty(object, oldKey, newKey) {
	Object.defineProperty(
		object,
		newKey,
		Object.getOwnPropertyDescriptor(object, oldKey)
	)
	delete object[oldKey]
}

function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file)
	// convert binary data to base64 encoded string
	return new Buffer.from(bitmap).toString('base64')
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
	// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
	var bitmap = new Buffer.from(base64str, 'base64')
	// write buffer to file
	fs.writeFileSync(file, bitmap)
	console.log('******** File created from base64 encoded string ********')
}

function writeFile(file, string) {
	fs.writeFileSync(file, string)
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

function validateUrl(url) {
	var re = /^(http|https):\/\/[a-z0-9.-]+\.[a-z]{2,4}/gi
	return re.test(String(url))
}

function zfill(number, width) {
	var numberOutput = Math.abs(number) /* Valor absoluto del número */
	var length = number.toString().length /* Largo del número */
	var zero = '0' /* String de cero */

	if (width <= length) {
		if (number < 0) {
			return '-' + numberOutput.toString()
		} else {
			return numberOutput.toString()
		}
	} else {
		if (number < 0) {
			return '-' + zero.repeat(width - length) + numberOutput.toString()
		} else {
			return zero.repeat(width - length) + numberOutput.toString()
		}
	}
}

function pad(input, length, padding) {
	let str = input + ''
	return length <= str.length ? str : pad(str + padding, length, padding)
}

function QueryStringToJSON(location) {
	var pairs = location.search.slice(1).split('&')

	var result = {}
	pairs.forEach(function(pair) {
		pair = pair.split('=')
		result[pair[0]] = decodeURIComponent(pair[1] || '')
	})

	return JSON.parse(JSON.stringify(result))
}

function isValidUrl(url, obligatory, ftp) {
	// Si no se especifica el paramatro "obligatory", interpretamos
	// que no es obligatorio
	if (obligatory == undefined) obligatory = 0
	// Si no se especifica el parametro "ftp", interpretamos que la
	// direccion no puede ser una direccion a un servidor ftp
	if (ftp == undefined) ftp = 0

	if (url == '' && obligatory == 0) return true

	let pattern = ''

	if (ftp) {
		pattern = /^(http|https|ftp):\/\/[a-z0-9.-]+\.[a-z]{2,4}/gi
	} else {
		pattern = /^(http|https):\/\/[a-z0-9.-]+\.[a-z]{2,4}/gi
	}

	if (url.match(pattern)) return true
	else return false
}

module.exports = {
	containProps,
	getDateTime,
	removeDuplicates,
	isEmptyObject,
	ObjectResponse,
	validateLanguage,
	getLanguage,
	sumDays,
	sendMailTemplate,
	getTemplate,
	base64_encode,
	base64_decode,
	evalObjectValue,
	redefineProperty,
	validateEmail,
	validateUrl,
	zfill,
	pad,
	writeFile,
	QueryStringToJSON,
	isValidUrl
}
