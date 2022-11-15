import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

const toastTypes = {
	success: 'success',
	error: 'error',
	info: 'info',
	warn: 'warn'
}

miniToastr.setIcon('error', 'i', { class: 'fas fa-exclamation-triangle' })
miniToastr.setIcon('info', 'i', { class: 'fas fa-info-circle' })
miniToastr.setIcon('success', 'i', { class: 'fas fa-check-circle' })
miniToastr.setIcon('warn', 'i', { class: 'fas fa-exclamation' })

miniToastr.init({ types: toastTypes })

const toast = ({ title, message, type, timeout, cb }) => {
	return miniToastr[type](message, title, timeout, cb)
}

const options = {
	success: toast,
	error: toast,
	info: toast,
	warn: toast
}

Vue.use(VueNotifications, options)
