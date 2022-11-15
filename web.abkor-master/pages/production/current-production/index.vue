<template lang="pug">
	div
		v-container
			v-card.mx-auto()
				v-card-text
					div.headline Pedidos
					v-divider
					v-tabs(style="margin-top:10px" v-model='viewCalendar' align-with-title='')
						v-tabs-slider(color='')
						v-tab(href="#calendar")
							v-icon fas fa-calendar
						v-tab(style="margin-left:0px;" href="#datatable")
							v-icon fas fa-th-list
					v-tabs-items(v-model='viewCalendar')
						v-tab-item(value="datatable")
							v-data-table(:headers="headers" :search="search" :items="orders")
								template(v-slot:top)
									v-toolbar(flat color="white")
										v-text-field(v-model="search" append-icon="fas fa-search" label="Busqueda general" single-line hide-details)
										v-spacer
										v-menu(v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px")
											template(v-slot:activator="{ on }")
												v-text-field(v-model="current_date" prepend-icon="fas fa-search" label="Buscar por fecha" single-line hide-details readonly v-on="on")
											v-date-picker(v-model="current_date" @input="getOrders(current_date)")
				
								template(v-slot:item.user.allergies="{ item }")
									| {{ seeName(item.user.allergies) }}
								template(v-slot:item.products="{ item }")
									| {{ seeName(item.products) }}
								template(v-slot:item.total_price="{ item }")
									| S/ {{ item.total_price }}
								template(v-slot:item.billing.type="{ item }")
									| {{ item.method === 'CASH' ? 'TRANSFERENCIA' : item.billing.type }}
								template(v-slot:item.create_at="{ item }")
									| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
								template(v-slot:item.modified_at="{ item }")
									| {{ item.modified_at ? item.modified_at.substring(0, 10) : '' }}
								template(v-slot:item.modified_by="{ item }")
									| {{ item.modified_by ? item.modified_by.name : '' }}
								template(v-slot:item.status="{ item }")
									v-chip(:color="item.status === 'PENDING' ? 'info' : item.status === 'ATTEND' ? 'success' : 'error'" dark) {{ item.status === 'PENDING' ? 'Pendiente' : item.status === 'ATTEND' ? 'Atendido' : 'Cancelada' }}
							
						v-tab-item(value="calendar")
							v-row.fill-height()
								v-col
									v-sheet(height='64')
										v-toolbar(flat='')
											v-btn.mr-4(outlined='' color='grey darken-2' @click='setToday') Hoy
											v-btn(fab='' text='' small='' color='grey darken-2' @click='prev')
												v-icon(small='') mdi-chevron-left
											v-btn(fab='' text='' small='' color='grey darken-2' @click='next')
												v-icon(small='') mdi-chevron-right
											v-spacer
											v-menu(bottom='' right='')
												template(v-slot:activator='{ on, attrs }')
													v-btn(outlined='' color='grey darken-2' v-bind='attrs' v-on='on')
														span {{ typeToLabel[type] }}
														v-icon(right) mdi-menu-down
												v-list
													v-list-item(@click="type = 'day'")
														v-list-item-title Día
													v-list-item(@click="type = 'week'")
														v-list-item-title Semana
													v-list-item(@click="type = 'month'")
														v-list-item-title Mes
													v-list-item(@click="type = '4day'")
														v-list-item-title 4 días
									v-sheet(height='600')
										v-calendar(ref='calendar' locale="es-PE" v-model='focus' color='' :events='events' :event-color='getEventColor' :type='type' @click:event='showEvent' @click:more='viewDay' @click:date="clickCalendar" )
										v-menu(v-model='selectedOpen' :close-on-content-click='false' :activator='selectedElement' offset-x='')
											v-card(color='grey lighten-4' min-width='350px' flat='')
												v-toolbar(:color="selectedEvent.color" dark)
													v-toolbar-title {{selectedEvent.title_large}}
												v-card-text
													v-chip(color="info" label style="margin-bottom:7px") 
														v-icon(left ) fas fa-user-circle 
														strong Usuario:&nbsp;
														span {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.data.user.name}}
													br
													v-chip(color="info" label style="margin-bottom:7px") 
														v-icon(left) fas fa-clipboard-list
														strong Orden:&nbsp;
														span {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.products}}
													br
													v-chip(color="info" label style="margin-bottom:7px") 
														v-icon(left) fas fa-allergies
														strong Alergias:&nbsp;
														span {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.allergies}}
													br
													v-chip(color="info" label style="margin-bottom:7px") 
														v-icon(left) fas fa-credit-card
														strong Pago:&nbsp;
														span S/ {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.data.total_price}}  {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.data.method === 'CASH' ? 'TRANSFERENCIA' : selectedEvent.data.billing.type}} 
													br
													v-chip(color="info" label style="margin-bottom:7px") 
														strong Nro Operación:&nbsp;
														span {{typeof selectedEvent.data==='undefined' ? "" : selectedEvent.data.operation_number}}
												v-card-actions
													v-btn(text='' color='primary' @click='selectedOpen = false') Cerrar

			
			

</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			tabsViews: ['datatable', 'calendar'],
			viewCalendar: 'calendar',
			search: '',
			headers: [
				{ text: 'Usuario', value: 'user.name', width: '150px' },
				{ text: 'Orden', value: 'products', width: '150px' },
				{ text: 'Fecha de pedido', value: 'create_at', width: '150px' },
				{ text: 'Alergias', value: 'user.allergies', width: '150px' },
				{
					text: 'Fecha de Modificación',
					value: 'modified_at',
					width: '150px'
				},
				{ text: 'Atendido por', value: 'modified_by', width: '150px' },
				{
					text: 'Cant. Productos',
					value: 'total_quantity',
					width: '100px'
				},
				{
					text: 'Importe Pagado',
					value: 'total_price',
					width: '100px'
				},
				{ text: 'Pagado con', value: 'billing.type', width: '100px' },
				{
					text: 'N° Operación',
					value: 'operation_number',
					width: '100px'
				},
				{ text: 'Estado de orden', value: 'status', width: '150px' }
			],
			dLoading: {
				status: false,
				message: ''
			},
			orders: [],
			ordersCalendar: [],
			methods: null,
			menu: false,
			current_date: new Date().toISOString().substr(0, 10),

			focus: '',
			type: 'month',
			typeToLabel: {
				month: 'Mes',
				week: 'Semana',
				day: 'Día',
				'4day': '4 Dias'
			},
			selectedEvent: {},
			selectedElement: null,
			selectedOpen: false,
			events: [],
			colors: ['pink'],
			names: [
				'Meeting',
				'Holiday',
				'PTO',
				'Travel',
				'Event',
				'Birthday',
				'Conference',
				'Party'
			]
		}
	},
	computed: {
		...mapState(['token'])
	},
	mounted() {
		this.$refs.calendar.checkChange()
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getOrders(this.current_date) // carga para datatable
			this.getOrders() // carga para calendario
		},
		getOrders(date) {
			// date = this.current_date
			const transactionParams = {}
			if (date) {
				transactionParams.current_date = new Date(date)
			}
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDERS_PROD',
						transaction: transactionParams
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					this.menu = false
					if (resp.status === 'SUCCESS') {
						// GERAL
						if (date) {
							this.orders = resp.Response
						} else {
							this.ordersCalendar = resp.Response
							this.updateCalendar()
						}
						// GERAL
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
		clickCalendar(item) {
			this.getOrders(item.date)
			this.current_date = item.date
			this.viewCalendar = 'datatable'
		},
		updateCalendar() {
			this.events = []
			const valueRnd = this.rnd(0, this.colors.length - 1)
			for (let index = 0; index < this.ordersCalendar.length; index++) {
				const element = this.ordersCalendar[index]
				this.events.push({
					id: element._id,
					products: element.products
						.map((item) => item.name)
						.join(', '),
					allergies: element.user.allergies
						.map((item) => item.name)
						.join(', '),
					title_large:
						element.products.map((item) => item.name).join() +
						' cantidad: ' +
						element.total_quantity,
					name:
						element.products.map((item) => item.name).join() +
						' cant. ' +
						element.total_quantity,
					start: new Date(element.create_at),
					end: new Date(element.create_at),
					color: this.colors[valueRnd]
				})
			}
		},
		seeName(data) {
			let name = ''
			data.forEach((value) => {
				name += value.name + ',' + '\t'
			})
			return name
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		...mapMutations(['setToken', 'delToken']),

		viewDay({ date }) {
			this.focus = date
			this.type = 'day'
		},
		getEventColor(event) {
			return event.color
		},
		setToday() {
			this.focus = ''
		},
		prev() {
			this.$refs.calendar.prev()
		},
		next() {
			this.$refs.calendar.next()
		},
		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				this.selectedEvent.data = this.orders.filter((item) => {
					return item._id === event.id
				})[0]
				this.selectedElement = nativeEvent.target
				setTimeout(() => {
					this.selectedOpen = true
				}, 10)
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
					start: first,
					end: second,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
					timed: !allDay
				})
			}

			this.events = events
		},
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a
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
