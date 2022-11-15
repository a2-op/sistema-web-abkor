// Iniciamos las rutas de nuestro servidor/API
const express = require('express')
const api = express.Router()
const controllers = require('../controllers')
const auth = require('../middleware/auth')

//Controllers

api.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	res.header('Access-Control-Allow-Credentials', true)
	next()
})

api.get('/', (req, res) => {
	res.send('Web Service GetUp')
})

// Access
api.get('/access', controllers.access.get)
api.get('/access/:id', controllers.access.get)
api.post('/access', controllers.access.post)
api.delete('/access/:id', controllers.access.delete)
api.patch('/access/:id', controllers.access.patch)

// User
api.get('/user', auth, controllers.user.get)
api.get('/user/:id', auth, controllers.user.get)
api.post('/user', auth, controllers.user.post)
api.delete('/user/:id', auth, controllers.user.delete)
api.patch('/user/:id', auth, controllers.user.patch)

// Master
api.get('/master', auth, controllers.master.get)
api.get('/master/:id', auth, controllers.master.get)
api.post('/master', auth, controllers.master.post)
api.delete('/master/:id', auth, controllers.master.delete)
api.patch('/master/:id', auth, controllers.master.patch)

// Category
api.get('/category', controllers.category.get)
api.get('/category/:id', controllers.category.get)
api.post('/category', auth, controllers.category.post)
api.delete('/category/:id', auth, controllers.category.delete)
api.patch('/category/:id', auth, controllers.category.patch)

// Product
api.get('/product', controllers.product.get)
api.get('/product/:id', controllers.product.get)
api.post('/product', auth, controllers.product.post)
api.delete('/product/:id', auth, controllers.product.delete)
api.patch('/product/:id', auth, controllers.product.patch)

// Order
api.get('/order', auth, controllers.order.get)
api.get('/order/:id', auth, controllers.order.get)
api.post('/order', controllers.order.post)
api.delete('/order/:id', auth, controllers.order.delete)
api.patch('/order/:id', auth, controllers.order.patch)

// Plan
api.get('/plan', controllers.plan.get)
api.get('/plan/:id', controllers.plan.get)
api.post('/plan', auth, controllers.plan.post)
api.delete('/plan/:id', auth, controllers.plan.delete)
api.patch('/plan/:id', auth, controllers.plan.patch)

// Finance
api.get('/finance', auth, controllers.finance.get)
api.get('/finance/:id', auth, controllers.finance.get)
api.post('/finance', auth, controllers.finance.post)
api.delete('/finance/:id', auth, controllers.finance.delete)
api.patch('/finance/:id', auth, controllers.finance.patch)

// Serivice
api.get('/service', auth, controllers.service.get)
api.get('/service/:id', auth, controllers.service.get)
api.post('/service', auth, controllers.service.post)
api.delete('/service/:id', auth, controllers.service.delete)
api.patch('/service/:id', auth, controllers.service.patch)

// Menú
api.get('/menu', auth, controllers.menu.get)
api.get('/menu/:id', auth, controllers.menu.get)
api.post('/menu', auth, controllers.menu.post)
api.delete('/menu/:id', auth, controllers.menu.delete)
api.patch('/menu/:id', auth, controllers.menu.patch)

// Week Menú
api.get('/weekmenu', auth, controllers.weekMenu.get)
api.get('/weekmenu/:id', auth, controllers.weekMenu.get)
api.post('/weekmenu', auth, controllers.weekMenu.post)
api.delete('/weekmenu/:id', auth, controllers.weekMenu.delete)
api.patch('/weekmenu/:id', auth, controllers.weekMenu.patch)

// My Week
api.get('/myweek', auth, controllers.myweek.get)
api.get('/myweek/:id', auth, controllers.myweek.get)
api.post('/myweek', auth, controllers.myweek.post)
api.delete('/myweek/:id', auth, controllers.myweek.delete)
api.patch('/myweek/:id', auth, controllers.myweek.patch)

//feedback
api.get('/feedback', auth, controllers.feedback.get)
api.get('/feedback/:id', auth, controllers.feedback.get)
api.post('/feedback', auth, controllers.feedback.post)
api.delete('/feedback/:id', auth, controllers.feedback.delete)
api.patch('/feedback/:id', auth, controllers.feedback.patch)

// Product
api.get('/notice', controllers.notice.get)
api.get('/notice/:id', controllers.notice.get)
api.post('/notice', auth, controllers.notice.post)
api.delete('/notice/:id', auth, controllers.notice.delete)
api.patch('/notice/:id', auth, controllers.notice.patch)

// Master
api.get('/route', auth, controllers.route.get)
api.get('/route/:id', auth, controllers.route.get)
api.post('/route', auth, controllers.route.post)
api.delete('/route/:id', auth, controllers.route.delete)
api.patch('/route/:id', auth, controllers.route.patch)

// Supply
api.get('/supply', auth, controllers.supply.get)
api.get('/supply/:id', auth, controllers.supply.get)
api.post('/supply', auth, controllers.supply.post)
api.delete('/supply/:id', auth, controllers.supply.delete)
api.patch('/supply/:id', auth, controllers.supply.patch)

// Visits
api.get('/visit', auth, controllers.visit.get)
api.get('/visit/:id', auth, controllers.visit.get)
api.post('/visit', auth, controllers.visit.post)
api.delete('/visit/:id', auth, controllers.visit.delete)
api.patch('/visit/:id', auth, controllers.visit.patch)

// Schedule
api.get('/schedule', auth, controllers.schedule.get)
api.get('/schedule/:id', auth, controllers.schedule.get)
api.post('/schedule', auth, controllers.schedule.post)
api.delete('/schedule/:id', auth, controllers.schedule.delete)
api.patch('/schedule/:id', auth, controllers.schedule.patch)

// Reminders
api.get('/reminder', auth, controllers.reminder.get)
api.get('/reminder/:id', auth, controllers.reminder.get)
api.post('/reminder', auth, controllers.reminder.post)
api.delete('/reminder/:id', auth, controllers.reminder.delete)
api.patch('/reminder/:id', auth, controllers.reminder.patch)

// Alerts
api.get('/alert', auth, controllers.alert.get)
api.get('/alert/:id', auth, controllers.alert.get)
api.post('/alert', auth, controllers.alert.post)
api.delete('/alert/:id', auth, controllers.alert.delete)
api.patch('/alert/:id', auth, controllers.alert.patch)

// Polls
api.get('/poll', auth, controllers.poll.get)
api.get('/poll/:id', auth, controllers.poll.get)
api.post('/poll', auth, controllers.poll.post)
api.delete('/poll/:id', auth, controllers.poll.delete)
api.patch('/poll/:id', auth, controllers.poll.patch)

// Polls
api.get('/poll_unsec', controllers.poll.get)
api.get('/poll_unsec/:id', controllers.poll.get)
api.post('/poll_unsec', controllers.poll.post)
api.post('/poll_unsec/:id', controllers.poll.post)
api.delete('/poll_unsec/:id', controllers.poll.delete)
api.patch('/poll_unsec/:id', controllers.poll.patch)

// Templates email
api.get('/template-email', auth, controllers.templateEmail.get)
api.get('/template-email/:id', auth, controllers.templateEmail.get)
api.post('/template-email', auth, controllers.templateEmail.post)
api.delete('/template-email/:id', auth, controllers.templateEmail.delete)
api.patch('/template-email/:id', auth, controllers.templateEmail.patch)

// Configuration
api.get('/configuration', controllers.configuration.get)
api.get('/configuration/:id', controllers.configuration.get)
api.post('/configuration', auth, controllers.configuration.post)
api.delete('/configuration/:id', auth, controllers.configuration.delete)
api.patch('/configuration/:id', auth, controllers.configuration.patch)

// Appointments
api.get('/appointment', auth, controllers.appointment.get)
api.get('/appointment/:id', auth, controllers.appointment.get)
api.post('/appointment', auth, controllers.appointment.post)
api.delete('/appointment/:id', auth, controllers.appointment.delete)
api.patch('/appointment/:id', auth, controllers.appointment.patch)

// History
api.get('/history', controllers.history.get)
api.get('/history/:id', auth, controllers.history.get)
api.post('/history', auth, controllers.history.post)
api.delete('/history/:id', auth, controllers.history.delete)
api.patch('/history/:id', auth, controllers.history.patch)

module.exports = api
