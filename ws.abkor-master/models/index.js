'use strict'

const models = {
	user: require('../models/user'),
	template: require('../models/template'),
	master: require('../models/master'),
	category: require('../models/category'),
	product: require('../models/product'),
	order: require('../models/order'),
	plan: require('../models/plan'),
	service: require('../models/service'),
	menu: require('../models/menu'),
	weekMenu: require('../models/weekmenu'),
	myweek: require('../models/myweek'),
	feedback: require('../models/feedback'),
	notice: require('../models/notice'),
	route: require('../models/route'),
	supply: require('../models/supply'),
	visit: require('../models/visit'),
	schedule: require('../models/schedule'),
	reminder: require('../models/reminder'),
	alert: require('../models/alert'),
	poll: require('../models/poll'),
	templateEmail: require('./templateEmail'),
	configuration: require('./configuration'),
	appointment: require('../models/appointment'),
	history: require('../models/history')
}

module.exports = models
