<template lang="pug">
	v-layout(row wrap)
		v-container(grid-list-lg)
			v-flex(xs12)
				v-card
					v-card-title
						v-toolbar(flat color="white")
							v-toolbar-title Mis Eventos
							v-divider.mx-4(inset vertical)
							v-spacer
					v-card-text
						v-layout(row wrap)
							v-flex(xs12)
								template
									v-row(class="fill-height")
										v-col
											v-sheet(height="64")
												v-toolbar(flat color="white")
													v-btn(outlined class="mr-4" @click="viewDay" small) Hoy
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
															v-btn(icon @click="" small)
																v-icon mdi-pencil
															v-toolbar-title(v-html="selectedEvent.name")
															v-spacer
															v-btn(icon @click="" small)
																v-icon mdi-dots-vertical
														v-card-text
															span(v-html="selectedEvent.details")
														v-card-actions
															v-btn(text color="primary" @click="selectedOpen = false" small) Cerrar
</template>
<style>
.gu-toolbar-service .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
<script>
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Util from '@/assets/js/util'

export default {
	layout: 'dashboard',
	data() {
		return {
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
			names: ['hola'],
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
			editedIndex: -1,
			date: new Date(),
			day: null,
			appointments: [],
			dLoading: {
				status: false,
				message: ''
			},
			code: 'CITA#USR'
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
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getAppointments()
		},
		getAppointments() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis citas...'
			this.methods
				.requestApi(
					'/api/appointment/',
					'GET',
					{
						command: 'GET_APPOINTMENTS_NUTRITIONIST',
						transaction: {
							code: this.code
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.appointments = resp.Response
						const valueRnd = this.rnd(0, this.colors.length - 1)
						this.appointments.forEach((value) => {
							this.events = []
							this.events.push({
								name: `${value.alias} - ${value.create_by.name}`,
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
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
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
