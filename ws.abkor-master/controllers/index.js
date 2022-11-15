'use strict'

const controllers = {
	access: require('../controllers/access'),
	user: require('../controllers/user'),
	template: require('../controllers/template'),
	master: require('../controllers/master'),
	category: require('../controllers/category'),
	product: require('../controllers/product'),
	order: require('../controllers/order'),
	plan: require('../controllers/plan'),
	finance: require('../controllers/finance'),
	service: require('../controllers/service'),
	menu: require('../controllers/menu'),
	weekMenu: require('../controllers/weekmenu'),
	myweek: require('../controllers/myweek'),
	feedback: require('../controllers/feedback'),
	notice: require('../controllers/notice'),
	route: require('../controllers/route'),
	supply: require('../controllers/supply'),
	visit: require('../controllers/visit'),
	schedule: require('../controllers/schedule'),
	reminder: require('../controllers/reminder'),
	alert: require('../controllers/alert'),
	poll: require('../controllers/poll'),
	templateEmail: require('../controllers/templateEmail'),
	configuration: require('../controllers/configuration'),
	appointment: require('../controllers/appointment'),
	history: require('../controllers/history')
}

module.exports = controllers
