<template lang="pug">
	.text-center
		v-dialog(v-model="dManagePlan" fullscreen scrollable transition="dialog-bottom-transition" hide-overlay persistent)
			v-card(tile)
				v-toolbar(flat dark color="grey lighten-2")
					v-btn(icon dark @click="dManagePlan = false")
						v-icon(class="black--text") mdi-close
					v-toolbar-title.headline(class="black--text" ) Gestionar Plan
					v-spacer
					v-toolbar-items
						v-btn(dark text class="black--text") Plan
				v-card-text(style="height: 800px")
					v-container
						v-container
							v-layout(row wrap)
								template(v-if="lstSuspended.length > 0")
									v-flex(xs12)
										h4 Días suspendidos
										v-chip(small color="info" style="margin:7px" v-for="(item,index) in lstSuspended" :key="index") {{item}}
								template(v-else)
									h4(style="text-align: center;") No tiene suspenciones
							v-divider
							br
							v-alert(border='left' colored-border='' color='blue' elevation='2') Seleccione el número del día que quiere suspender

							v-layout(row wrap)
								v-flex(xs12)
									template
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
																v-btn(outlined v-on="on")
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
													v-calendar(ref="calendar" v-model="today" locale="es-PE" :events="events" :type="type" :event-color="getEventColor" :event-margin-bottom="3" :now="today" @click:event="showEvent" @click:more="viewDay" @change="updateRange" @click:date="clickCalendar")
													v-menu(v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x)
														v-card(color="dark lighten-4" min-width="200px" flat)
															v-toolbar(:color="selectedEvent.color" dark)
																v-toolbar-title(v-html="selectedEvent.name")
															v-card-text de {{selectedEvent.start}} hasta {{selectedEvent.end}}
															v-card-actions
																v-btn(text color="primary" @click="selectedOpen = false") Cerrar
						v-dialog(v-model="dSuspend"  persistent max-width="290")
							v-card
								v-card-title.headline {{ plans.name }}
								v-divider
								v-spacer
								v-card-text Precio: {{ plans.price }} #[v-spacer] #[span Duración: {{ plans.duration }}] #[v-spacer] #[span Suspendidos: {{ lstSuspended.length }} Días]
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="dSuspend = false") Cancelar
									v-btn(text @click="selectDays") Suspender
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="dManagePlan = false") Cerrar
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
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: Boolean,
			default: true,
			required: true
		}
	},
	data() {
		return {
			dManagePlan: false,
			dSuspend: false,
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
			focus: '',
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
			plans: [],
			suspended: [],
			lstSuspended: []
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
	watch: {
		dManagePlan(val) {
			this.$emit('change', val)
		},
		value(val) {
			this.dManagePlan = val
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getProfile()
			this.getPlans()
			this.$refs.calendar.checkChange()
		},
		clickCalendar(item) {
			this.dSuspend = this.events.some((_item, index) => {
				return item.date === _item.start
			})
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
		eachDays(_start, planSuspended, plan) {
			const start = this.$moment(_start)
			const end = this.$moment(
				this.addDays(
					planSuspended[planSuspended.length - 1] || start,
					plan.duration
				)
			)
			let loop = start
			let newDate
			let dateFormat
			let countDuration = 0
			const valueRnd = this.rnd(0, this.colors.length - 1)
			while (loop < end) {
				if (countDuration >= 4) break
				newDate = loop.add(1, 'days')
				loop = this.$moment(newDate)
				dateFormat = loop.format('YYYY-MM-DD')

				if (!this.lstSuspended.includes(dateFormat)) {
					this.events.push({
						name: plan.name,
						start: dateFormat,
						end: dateFormat,
						color: this.colors[valueRnd]
					})
					countDuration++
				}
			}
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
						const plan = resp.Response
						this.lstSuspended = this.plans.suspended.sort(
							(a, b) =>
								this.$moment(a).valueOf() -
								this.$moment(b).valueOf()
						)

						this.events = []
						this.eachDays(
							plan.start.substr(0, 10),
							plan.suspended,
							plan
						)
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
		selectDays() {
			const dateSuspended = this.$refs.calendar.now
			const date = this.$moment()
			const dateNow = date.format('YYYY-MM-DD')
			if (this.$moment(dateSuspended) < this.$moment(dateNow)) {
				this.message({
					title: 'Aviso',
					message: 'fecha inferior o igual a la actual',
					type: 'warn'
				})
			} else if (this.lstSuspended.includes(dateSuspended)) {
				this.message({
					title: 'Aviso',
					message: 'Día ya fue suspendido',
					type: 'warn'
				})
			} else {
				this.suspended.push(dateSuspended)
				this.dSuspend = false
				this.suspendPlan()
			}
		},
		suspendPlan() {
			if (this.suspended.length === 0) {
				return this.message({
					title: 'Aviso',
					message: 'Tiene que seleccionar almenos un día',
					type: 'info'
				})
			}
			const countDays = this.suspended.length
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			this.methods
				.requestApi(
					`/api/user/${this.profile._id}`,
					'PATCH',
					{},
					{
						command: 'SUSPEND_PLAN',
						transaction: {
							suspended: this.suspended,
							duration: countDays
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.getPlans()
						this.suspended = []
						this.message({
							title: 'Excelente',
							message:
								'Se ha registrado la información correctamente',
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
		addDays(date, day) {
			date = this.$moment(date).add(day, 'days')
			return date.format('YYYY-MM-DD')
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
