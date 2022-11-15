<template lang="pug">
	v-container
		v-layout(row wrap)
			v-flex(xs2)
				v-subheader Nutricionista
			v-flex(xs6)
				v-select(v-model="selectedNutritionist" @change="getSchedule" menu-props="auto" prepend-icon="fa fa-user" :items="nutritionists" item-text="name" item-value="_id")
			v-spacer
			//-v-flex(xs2)
				v-btn(text @click="getSchedule") Filtrar Datos
			v-flex(xs2)
				template(v-if="citas")
					v-btn(text @click="" to="/shop/process-appointment") Comprar citas
				template(v-else)
		v-divider
		v-spacer
		v-layout(row wrap)
			v-flex(xs12)
				template(v-if="schedules.length <= 0")
					h4(style="text-align: center;") No hay datos
				template(v-else)
					v-row(class="fill-height")
						v-col
							v-sheet(height="64")
								v-toolbar(flat color="white")
									v-btn(outlined class="mr-4" @click="viewDay") Hoy
									v-btn(fab text small @click="prev")
										v-icon(small) mdi-chevron-left
									v-btn(fab text small @click="next")
										v-icon(small) mdi-chevron-right
									v-toolbar-title {{ title }}
									v-spacer
									v-menu(bottom right)
										template(v-slot:activator="{ on }")
											v-btn(outlined v-on="on" small)
												span {{ typeToLabel[type] }}
												v-icon(right) mdi-menu-down
										v-list
											v-list-item(@click="type = 'day'")
												v-list-item-title Día
											v-list-item(@click="type = 'week'")
												v-list-item-title Semana
											v-list-item(@click="type = 'month'")
												v-list-item-title Mes
							v-sheet(height="600")
								v-calendar(ref="calendar" v-model="today" locale="es-PE" :events="events" :type="type" :event-color="getEventColor" :event-margin-bottom="3" :now="today" @click:event="showEvent" @click:more="viewDay" @change="updateRange" @click:date="")
								v-menu(v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x)
									v-card(color="dark lighten-4" min-width="200px" flat)
										v-toolbar(:color="selectedEvent.color" dark)
											v-toolbar-title(v-html="selectedEvent.name")
										v-card-text de {{editedSchedule.sinceTime}} a {{editedSchedule.untilTime}}
										v-card-actions
											v-btn(text color="primary" @click="selectedOpen = false") Cerrar
											v-spacer
											v-btn(text @click="saveAppointment") Separar cita
</template>
<style>
.gu-toolbar-category .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
<script>
import { mapState } from 'vuex'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			citas: false,
			profile: {
				_id: '',
				photo: '',
				email: '',
				name: '',
				gender: '',
				birthday: '',
				document: '',
				phone: '',
				allergies: [],
				occupation: '',
				addresses: []
			},
			nutritionists: [],
			appointments: [],
			selectedNutritionist: '',
			schedules: [],
			dLoading: {
				status: false,
				message: ''
			},
			editedIndex: -1,
			events: [],
			colors: [
				'blue',
				'indigo',
				'deep-purple',
				'cyan',
				'green',
				'orange',
				'grey darken-1'
			],
			names: [],
			today: new Date().toISOString().substr(0, 10),
			focus: '2019-01-01',
			type: 'month',
			typeToLabel: {
				month: 'Mes',
				week: 'Semana',
				day: 'Día'
			},
			start: null,
			end: null,
			selectedEvent: {},
			selectedElement: null,
			selectedOpen: false,
			date: new Date(),
			day: null,
			editedAppointment: {
				alias: '',
				sinceTime: '',
				untilTime: '',
				date: '',
				nutritionist: '',
				code: 'CITA#USR',
				inactive: false
			},
			defaultAppointment: {
				alias: '',
				sinceTime: '',
				untilTime: '',
				date: '',
				nutritionist: '',
				code: 'CITA#USR',
				inactive: false
			},
			editedSchedule: {
				alias: '',
				sinceTime: null,
				untilTime: null,
				date: new Date().toISOString().substr(0, 10),
				inactive: false
			},
			defaultSchedule: {
				alias: '',
				sinceTime: null,
				untilTime: null,
				date: new Date().toISOString().substr(0, 10),
				inactive: false
			},
			plans: []
		}
	},
	computed: {
		fas() {
			return fas
		},
		faGithub() {
			return faGithub
		},
		title() {
			const { start, end } = this
			if (!start || !end) {
				return ''
			}
			const startMonth = this.monthFormatter(start)
			const endMonth = this.monthFormatter(end)
			const suffixMonth = startMonth === endMonth ? '' : endMonth
			const startYear = start.year
			const endYear = end.year
			const suffixYear = startYear === endYear ? '' : endYear
			const startDay = start.day + this.nth(start.day)
			const endDay = end.day + this.nth(end.day)
			let value = ''
			switch (this.type) {
				case 'months':
					value = `${startMonth} ${startYear}`
					break
				case 'month':
					value = `${startMonth} ${startYear}`
					break
				case 'week':
					break
				case '4day':
					value = `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
					break
				case 'day':
					value = `${startMonth} ${startDay} ${startYear}`
					break
			}
			return value
		},
		monthFormatter() {
			return this.$refs.calendar.getFormatter({
				timeZone: 'UTC',
				month: 'long'
			})
		},
		...mapState(['token'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getProfile()
			this.getNutritionists()
			this.getAppointments()
			this.getPlans()
		},
		getProfile() {
			this.dLoading.message = 'Obteniendo información...'
			this.dLoading.status = true
			this.methods
				.requestApi('/api/user/', 'GET', {
					command: 'GET_PROFILE'
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.profile = resp.Response
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		getPlans() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo planes...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_USER_PLAN'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.plans = resp.Response
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		getSchedule() {
			if (this.selectedNutritionist.length === 0) {
				return this.message({
					title: 'Aviso',
					message: 'Seleccionar nutricionista',
					type: 'warn'
				})
			}
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo horarios...'
			this.validateAppointments()
			this.methods
				.requestApi(
					'/api/schedule/',
					'GET',
					{
						command: 'GET_SCHEDULE_USER',
						transaction: {
							filter: this.selectedNutritionist
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.schedules = resp.Response
						this.events = []
						const valueRnd = this.rnd(0, this.colors.length - 1)
						this.schedules.forEach((value) => {
							this.events.push({
								name: value.alias,
								start:
									value.date.substr(0, 10) +
									`T${value.sinceTime}:00`,
								end:
									value.date.substr(0, 10) +
									`T${value.untilTime}:00`,
								color: this.colors[valueRnd]
							})
						})
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		getNutritionists() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_NUTRITIONISTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.nutritionists = resp.Response
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		getAppointments() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis citas...'
			this.methods
				.requestApi(
					'/api/appointment/',
					'GET',
					{
						command: 'GET_APPOINTMENTS_CLIENT',
						transaction: {
							code: this.editedAppointment.code
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.appointments = resp.Response
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		saveAppointment() {
			this.validateAppointments()
			// GERAL
			if (this.citas) return
			// GERAL
			if (new Date(this.editedSchedule.date) <= new Date()) {
				return this.message({
					title: 'Aviso',
					message:
						'No puede solicitar citas con fechas pasadas o de hoy',
					type: 'warn'
				})
			}
			this.editedAppointment.alias = this.editedSchedule.alias
			this.editedAppointment.sinceTime = this.editedSchedule.sinceTime
			this.editedAppointment.untilTime = this.editedSchedule.untilTime
			this.editedAppointment.date = this.editedSchedule.date.substr(0, 10)
			this.editedAppointment.nutritionist = this.selectedNutritionist
			this.editedAppointment.inactive = false
			this.dLoading.status = true
			this.dLoading.message = 'Actualizando...'
			let pcommand = ''
			let pmethod = ''
			let puri = ''
			if (this.editedIndex !== -1) {
				pcommand = 'UPDATE_APPOINTMENT'
				pmethod = 'PATCH'
				puri = `/api/appointment/${this.editedAppointment._id}`
			} else {
				pcommand = 'REGISTER_APPOINTMENT'
				pmethod = 'POST'
				puri = '/api/appointment/'
			}
			this.methods
				.requestApi(
					puri,
					pmethod,
					{},
					{
						command: pcommand,
						transaction: this.editedAppointment
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (this.editedIndex > -1) {
							Object.assign(
								this.appointments[this.editedIndex],
								this.editedAppointment
							)
						} else {
							const appointment = resp.Response
							this.appointments.push(appointment)
						}
						this.selectedOpen = false
						this.message({
							title: 'Excelente',
							message: 'registro guardado correctamente',
							type: 'success'
						})
					}
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		validateAppointments() {
			// GERAL
			if (this.appointments.length >= this.plans.maximum_appointments) {
				this.citas = true
				return this.message({
					title: 'Información',
					message:
						'Número de citas supera al permitido por su plan, si quiere adquirir mas citas haga click en comprar citas',
					type: 'info'
				})
			}
		},
		selectSchedule(item) {
			this.editedIndex = this.schedules.indexOf(item)
			this.editedSchedule = Object.assign({}, item)
		},
		getExpirationDate(date, day) {
			date = new Date()
			date.setDate(date.getDate() + day)
			return date
		},
		setToday() {
			this.focus = this.today
		},
		prev() {
			this.$refs.calendar.prev()
		},
		next() {
			this.$refs.calendar.next()
		},
		viewDay({ date }) {
			this.focus = date
			this.type = 'day'
		},
		getEventColor(event) {
			return event.color
		},
		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				// Llenar datos al horario
				this.editedSchedule.alias = this.selectedEvent.name
				this.editedSchedule.sinceTime = this.selectedEvent.start.substr(
					11,
					5
				)
				this.editedSchedule.untilTime = this.selectedEvent.end.substr(
					11,
					5
				)
				this.editedSchedule.date = this.selectedEvent.start.substr(
					0,
					10
				)
				this.editedSchedule.inactive = false
				this.selectSchedule(this.editedSchedule)
				// Fin llenar datos
				this.selectedElement = nativeEvent.target
				setTimeout(() => (this.selectedOpen = true), 10)
			}
			if (this.selectedOpen) {
				this.selectedOpen = false
				setTimeout(open, 10)
			} else {
				open()
			}
			nativeEvent.stopPropagation()
		},
		updateRange({ start, end }) {
			const events = []
			const min = new Date(`${start.date}T00:00:00`)
			const max = new Date(`${end.date}T23:59:59`)
			const days = (max.getTime() - min.getTime()) / 86400000
			const eventCount = this.rnd(days, days + 20)
			for (let i = 0; i < eventCount; i++) {
				const allDay = this.rnd(0, 3) === 0
				const firstTimestamp = this.rnd(min.getTime(), max.getTime())
				const first = new Date(
					firstTimestamp - (firstTimestamp % 900000)
				)
				const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
				const second = new Date(first.getTime() + secondTimestamp)
				events.push({
					name: this.names[this.rnd(0, this.names.length - 1)],
					start: this.formatDate(first, !allDay),
					end: this.formatDate(second, !allDay),
					color: this.colors[this.rnd(0, this.colors.length - 1)]
				})
			}
			// this.start = start
			// this.end = end
			// this.events = events
		},
		nth(d) {
			const arr = [
				'th',
				'st',
				'nd',
				'rd',
				'th',
				'th',
				'th',
				'th',
				'th',
				'th'
			]
			return d > 3 && d < 21 ? 'th' : arr[d % 10]
		},
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a
		},
		formatDate(a, withTime) {
			return withTime
				? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}
					${a.getHours()}:${a.getMinutes()}`
				: `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
		}
	},
	notifications: {
		message: {
			title: '',
			message: '',
			type: ''
		}
	}
}
</script>
