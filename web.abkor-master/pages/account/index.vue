<template lang="pug">
	div
		v-container
			v-row
				v-col
					v-card.mt-4.mx-auto
						template(v-if="nOrder")
							v-sheet.v-sheet--offset.mx-auto(color="#c4db88" elevation="12" max-width="calc(100% - 32px)")
								v-sparkline(:labels="labels" :value="valuesOrders" height="30" color="white" label-size="5" line-width="1" padding="12")
						v-progress-linear(v-if="!nOrder" :indeterminate="true")
						v-card-text.pt-0
							.title.font-weight-light.mb-2 Pedidos registrados
							.subheading.font-weight-light.grey--text Ultima semana
							v-divider.my-2
							v-icon.mr-2(small) fas fa-stopwatch
							span(v-if="order.create_at !== ''").caption.grey--text.font-weight-light Ultimo pedido registrado el {{ order.create_at.substring(0, 10) }}
							span(v-else).caption.grey--text.font-weight-light Aun no se han registrado pedidos
				v-flex(xs12)
					v-card.mx-auto
						v-card-title.white--text.secondary
							span.title Historial
							v-spacer
						v-card-text.py-0
							v-timeline(dense)
								v-timeline-item
									template(v-slot:icon)
										span.white--text.title {{profile.name.substring(0, 1)}}
								v-slide-x-transition(group)
								v-slide-x-reverse-transition(group hide-on-leave)
									v-timeline-item.mb-3(color="pink" v-for="event in history" :key="event._id" small :color="event.color")
										h2.title.font-weight-light.mb-3 {{ event.title }}
										v-layout(justify-space-between)
											v-flex(xs7)
												v-chip.white--text.ml-0(:color="event.color" label small) {{ event.origin }}
												span {{ event.content }}
											v-flex(xs5 text-xs-right v-text="valueDate(event.create_at)")
</template>
<style scoped>
.v-sheet--offset {
	top: -24px;
	position: relative;
}
</style>
<script>
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
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
			labels: [
				'Domingo',
				'Lunes',
				'Martes',
				'Miércoles',
				'Jueves',
				'Viernes',
				'Sábado'
			],
			valuesOrders: [0, 0, 0, 0, 0, 0, 0],
			history: [],
			dLoading: {
				status: false,
				message: ''
			},
			orders: [],
			dias: [0, 1, 2, 3, 4, 5, 6],
			date: new Date(),
			day: null,
			firstday: new Date(),
			lastday: new Date(),
			nOrder: false,
			order: {
				create_at: ''
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getOrderRange()
			this.lastOrder()
			this.getHistory()
			this.getProfile()
			this.day = this.dias[this.date.getUTCDay()]
			this.firstday.setDate(this.date.getDate() + (0 - this.day))
			this.lastday.setDate(this.date.getDate() + (6 - this.day))
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
		getHistory() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo HIstorial...'
			this.methods
				.requestApi(
					'/api/history/',
					'GET',
					{
						command: 'GET_HISTORY',
						transaction: {
							module: 'ACCOUNT'
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.history = resp.Response
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
		getOrderRange() {
			const dias = [0, 1, 2, 3, 4, 5, 6]
			const date = new Date()
			const day = dias[date.getUTCDay()]
			const firstday = new Date()
			const lastday = new Date()
			firstday.setDate(date.getDate() + (1 - day))
			lastday.setDate(date.getDate() + (7 - day))
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Orders...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDER_RANGE_USER',
						transaction: {
							firstday: this.firstday,
							lastday: this.lastday
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.orders = resp.Response
						this.orders.forEach((element) => {
							const day = element._id.day
							const month = element._id.month
							const year = element._id.year
							const date = new Date(`${year}-${month}-${day}`)
							this.valuesOrders[date.getUTCDay()] = element.count
						})
						this.nOrder = true
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
		lastOrder() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo último Orden...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_LAST_ORDER'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response !== null) {
							this.order = resp.Response
						}
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
		valueDate(val) {
			return this.methods.getDateTime('yyyy-MM-dd hh:mm.ss', val)
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
