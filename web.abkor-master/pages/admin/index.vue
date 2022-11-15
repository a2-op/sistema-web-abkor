<template lang="pug">
	div
		v-container
			v-row
				v-col
					v-card.mt-4.mx-auto
						template(v-if="nProduct")
							v-sheet.v-sheet--offset.mx-auto(color="error" elevation="12" max-width="calc(100% - 32px)")
								v-sparkline(:labels="labels" :value="valueProducts" color="white" line-width="2" padding="16")
						v-progress-linear(v-if="!nProduct" :indeterminate="true")
						v-card-text.pt-0
							.title.font-weight-light.mb-2 Productos registrados
							.subheading.font-weight-light.grey--text Ultima semana
							v-divider.my-2
							v-icon.mr-2(small) fas fa-stopwatch
							span(v-if="product.create_at !== ''").caption.grey--text.font-weight-light Ultimo producto registrado el {{ product.create_at.substring(0, 10) }}
							span(v-else).caption.grey--text.font-weight-light Aun no se han registrado productos
				v-col
					v-card.mt-4.mx-auto
						template(v-if="nPlan")
							v-sheet.v-sheet--offset.mx-auto(color="warning" elevation="12" max-width="calc(100% - 32px)")
								v-sparkline(:labels="labels" :value="valuePlans" color="white" line-width="2" padding="16")
						v-progress-linear(v-if="!nPlan" :indeterminate="true")
						v-card-text.pt-0
							.title.font-weight-light.mb-2 Planes registrados
							.subheading.font-weight-light.grey--text Ultima semana
							v-divider.my-2
							v-icon.mr-2(small) fas fa-stopwatch
							span(v-if="plan.create_at !== ''").caption.grey--text.font-weight-light Ultimo plan registrado el {{ product.create_at.substring(0, 10) }}
							span(v-else).caption.grey--text.font-weight-light Aun no se han registrado planes
				v-col
					v-card.mt-4.mx-auto
						template(v-if="nClient")
							v-sheet.v-sheet--offset.mx-auto(color="success" elevation="12" max-width="calc(100% - 32px)")
								v-sparkline(:labels="labels" :value="valueClients" color="white" line-width="2" padding="16")
						v-progress-linear(v-if="!nClient" :indeterminate="true")
						v-card-text.pt-0
							.title.font-weight-light.mb-2 Clientes registrados
							.subheading.font-weight-light.grey--text Ultima semana
							v-divider.my-2
							v-icon.mr-2(small) fas fa-stopwatch
							span(v-if="client.create_at !== ''").caption.grey--text.font-weight-light Ultimo cliente registrado el {{ product.create_at.substring(0, 10) }}
							span(v-else).caption.grey--text.font-weight-light Aun no se han registrado clientes
			v-flex(xs12)
				v-card.mx-auto
					v-card-title.primary.white--text
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
			labels: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
			valueProducts: [0, 0, 0, 0, 0, 0, 0],
			valuePlans: [0, 0, 0, 0, 0, 0, 0],
			valueClients: [0, 0, 0, 0, 0, 0, 0],
			history: [],
			dLoading: {
				status: false,
				message: ''
			},
			clients: [],
			plans: [],
			products: [],
			dias: [0, 1, 2, 3, 4, 5, 6],
			date: new Date(),
			day: null,
			firstday: new Date(),
			lastday: new Date(),
			nProduct: false,
			nPlan: false,
			nClient: false,
			client: {
				create_at: ''
			},
			product: {
				create_at: ''
			},
			plan: {
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
			this.getClientRange()
			this.getPlanRange()
			this.getProductsRange()
			this.getHistory()
			this.lastProduct()
			this.lastPlan()
			this.lastClient()
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
		getClientRange() {
			const dias = [0, 1, 2, 3, 4, 5, 6]
			const date = new Date()
			const day = dias[date.getUTCDay()]
			const firstday = new Date()
			const lastday = new Date()
			firstday.setDate(date.getDate() + (1 - day))
			lastday.setDate(date.getDate() + (7 - day))
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_CLIENT_RANGE',
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
						this.clients = resp.Response
						this.clients.forEach((element) => {
							const day = element._id.day
							const month = element._id.month
							const year = element._id.year
							const date = new Date(`${year}-${month}-${day}`)
							this.valueClients[date.getUTCDay()] = element.count
						})
						this.nClient = true
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
		lastClient() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo último cliente...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_LAST_CLIENT'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response !== null) {
							this.client = resp.Response
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
							module: 'ADMIN'
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
		getPlanRange() {
			const dias = [0, 1, 2, 3, 4, 5, 6]
			const date = new Date()
			const day = dias[date.getUTCDay()]
			const firstday = new Date()
			const lastday = new Date()
			firstday.setDate(date.getDate() + (1 - day))
			lastday.setDate(date.getDate() + (7 - day))
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Planes...'
			this.methods
				.requestApi(
					'/api/plan/',
					'GET',
					{
						command: 'GET_PLAN_RANGE',
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
						this.plans = resp.Response
						this.plans.forEach((element) => {
							const day = element._id.day
							const month = element._id.month
							const year = element._id.year
							const date = new Date(`${year}-${month}-${day}`)
							this.valuePlans[date.getUTCDay()] = element.count
						})
						this.nPlan = true
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
		lastPlan() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo último plan...'
			this.methods
				.requestApi(
					'/api/plan/',
					'GET',
					{
						command: 'GET_LAST_PLAN'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response !== null) {
							this.plan = resp.Response
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
		getProductsRange() {
			const dias = [0, 1, 2, 3, 4, 5, 6]
			const date = new Date()
			const day = dias[date.getUTCDay()]
			const firstday = new Date()
			const lastday = new Date()
			firstday.setDate(date.getDate() + (1 - day))
			lastday.setDate(date.getDate() + (7 - day))
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Productos...'
			this.methods
				.requestApi(
					'/api/product/',
					'GET',
					{
						command: 'GET_PRODUCT_RANGE',
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
						this.products = resp.Response.products
						this.products.forEach((element) => {
							const day = element._id.day
							const month = element._id.month
							const year = element._id.year
							const date = new Date(`${year}-${month}-${day}`)
							this.valueProducts[date.getUTCDay()] = element.count
						})
						this.nProduct = true
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
		lastProduct() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo último producto...'
			this.methods
				.requestApi(
					'/api/product/',
					'GET',
					{
						command: 'GET_LAST_PRODUCT'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response !== null) {
							this.product = resp.Response
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
