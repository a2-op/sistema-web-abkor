<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :search="search" :items="orders")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Pedidos
						v-divider.mv-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						v-dialog(v-model="dOrder.status" scrollable persistent max-width="400px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) Cambiar Estado
								v-card-text
									v-row
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-4 Pedido: {{ editedOrder.create_at ? editedOrder.create_at.substring(0, 10) : '' }}
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-4 Usuario: {{ editedOrder.user.name }}
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-6 Cantidad: {{ editedOrder.total_quantity }}
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-6 Importe: S/ {{ editedOrder.total_price }}
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dOrder', false, () => {})" color="primary") Cerrar
									v-btn(text @click="attendOrder" :loading="dOrder.loading" :disabled="dOrder.loading") Atender
									v-btn(text @click="cancelOrder" :loading="dOrder.loading" :disabled="dOrder.loading") Cancelar Orden
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dOrder', true, editOrder(item))")
								v-icon fas fa-edit
						span Cambiar Estado
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
			v-data-table.elevation-1(:headers="headersPlans" :search="searchPlan" :items="plans")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Planes
						v-divider.mv-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="searchPlan" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						v-dialog(v-model="dPlan.status" scrollable persistent max-width="400px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) Cambiar Estado
								v-card-text
									v-row
										v-col(cols="12" xs="12" sm="12" md="12" lg="12").text-center
											h3.mt-4 Plan: {{ editedPlan.name }}
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-4 Usuario: {{ editedPlan.user.name }}
										v-col(cols="12" xs="12" sm="12" md="6" lg="6").text-center
											h3.mt-4 Precio: S/ {{ editedPlan.price }}
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dPlan', false, () => {})" color="primary") Cerrar
									v-btn(text @click="associatePlan" :loading="dPlan.loading" :disabled="dPlan.loading") Asociar
									v-btn(text @click="cancelPlan" :loading="dPlan.loading" :disabled="dPlan.loading") Cancelar solicitud
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dPlan', true, editPlan(item))")
								v-icon fas fa-edit
						span Cambiar Estado
				template(v-slot:item.price="{ item }")
					| S/ {{ item.price }}
				template(v-slot:item.state="{ item }")
					v-chip(:color="item.state === 'PENDING' ? 'info' : item.state === 'ASSOCIATED' ? 'success' : 'error'" dark) {{ item.state === 'PENDING' ? 'Pendiente' : item.state === 'ASSOCIATED' ? 'Asociado' : 'Cancelada' }}
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			search: '',
			searchPlan: '',
			headers: [
				{ text: 'Usuario', value: 'user.name', width: '150px' },
				{ text: 'Orden', value: 'products[0].name', width: '150px' },
				{ text: 'Fecha de pedido', value: 'create_at', width: '150px' },
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
				{ text: 'Estado de orden', value: 'status', width: '150px' },
				{ text: 'Acción', value: 'action', width: '150px' }
			],
			headersPlans: [
				{ text: 'Usuario', value: 'user.name', width: '150px' },
				{ text: 'Documento', value: 'user.document', width: '150px' },
				{ text: 'Correo', value: 'user.email', width: '150px' },
				{ text: 'Celular', value: 'user.phone', width: '150px' },
				{ text: 'Plan', value: 'name', width: '150px' },
				{ text: 'Precio', value: 'price', width: '150px' },
				{ text: 'Estado', value: 'state', width: '150px' },
				{
					text: 'Acción',
					value: 'action',
					width: '150px',
					sortable: false
				}
			],
			dLoading: {
				status: false,
				message: ''
			},
			dOrder: {
				status: false,
				loading: false
			},
			dPlan: {
				status: false,
				loading: false
			},
			editedOrder: {
				user: [],
				products: [],
				billing: [],
				total_price: '',
				total_quantity: '',
				status: '',
				inactive: false
			},
			defaultOrder: {
				user: [],
				products: [],
				billing: [],
				total_price: '',
				total_quantity: '',
				status: '',
				inactive: false
			},
			editedPlan: {
				_id: '',
				name: '',
				price: 0,
				state: 'PENDING',
				inactive: false,
				user: {
					_id: '',
					name: '',
					document: '',
					email: '',
					phone: ''
				}
			},
			defaultPlan: {
				_id: '',
				name: '',
				price: 0,
				state: 'PENDING',
				inactive: false,
				user: {
					_id: '',
					name: '',
					document: '',
					email: '',
					phone: ''
				}
			},
			orders: [],
			plans: [],
			editedIndex: -1,
			editedPlanIndex: -1,
			methods: null
		}
	},
	computed: {
		...mapState(['token'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getOrders()
			this.getPlansPending()
		},
		getOrders() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDERS',
						transaction: {
							inactive: false
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.orders = resp.Response
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
		getPlansPending() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_PENDING_PLANS'
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
		attendOrder() {
			this.dOrder.status = true
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			const pcommand = 'UPDATE_ORDER_STATUS'
			if (this.editedOrder.status === 'CANCEL') {
				this.dLoading.status = false
				this.dOrder.status = false
				this.dOrder.loading = false
				this.message({
					title: 'Atención',
					message: 'La orden ya ha sido cancelada!',
					type: 'warn'
				})
			}
			if (this.editedOrder.status === 'ATTEND') {
				this.dLoading.status = false
				this.dOrder.status = false
				this.dOrder.loading = false
				this.message({
					title: 'Atención',
					message: 'La orden ya fue atendida!',
					type: 'warn'
				})
			}
			this.methods
				.requestApi(
					`/api/order/${this.editedOrder._id}`,
					'PATCH',
					{},
					{
						command: pcommand,
						transaction: {
							user: this.editedOrder.user,
							products: this.editedOrder.products,
							billing: this.editedOrder.billing,
							total_price: this.editedOrder.total_price,
							total_quantity: this.editedOrder.total_quantity,
							status: 'ATTEND',
							inactive: false
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dOrder.status = false
					this.dOrder.loading = false
					if (resp.status === 'SUCCESS') {
						if (this.editedIndex > -1) {
							Object.assign(
								this.orders[this.editedIndex],
								this.editedOrder
							)
						} else {
							const order = resp.Response
							this.orders.push(order)
						}
						this.message({
							title: 'Excelente',
							message: resp.message,
							type: 'success'
						})
						this.getOrders()
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
		cancelOrder() {
			this.dOrder.status = true
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			const pcommand = 'UPDATE_ORDER_STATUS'
			if (this.editedOrder.status === 'ATTEND') {
				this.dLoading.status = false
				this.dOrder.status = false
				this.dOrder.loading = false
				this.message({
					title: 'Atención',
					message: 'La orden ya fue atendida!',
					type: 'warn'
				})
				return
			}
			if (this.editedOrder.status === 'CANCEL') {
				this.dLoading.status = false
				this.dOrder.status = false
				this.dOrder.loading = false
				this.message({
					title: 'Atención',
					message: 'La orden ha sido cancelada!',
					type: 'warn'
				})
				return
			}
			this.methods
				.requestApi(
					`/api/order/${this.editedOrder._id}`,
					'PATCH',
					{},
					{
						command: pcommand,
						transaction: {
							user: this.editedOrder.user,
							products: this.editedOrder.products,
							billing: this.editedOrder.billing,
							total_price: this.editedOrder.total_price,
							total_quantity: this.editedOrder.total_quantity,
							status: 'CANCEL',
							inactive: false
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dOrder.status = false
					this.dOrder.loading = false
					if (resp.status === 'SUCCESS') {
						if (this.editedIndex > -1) {
							Object.assign(
								this.orders[this.editedIndex],
								this.editedOrder
							)
						} else {
							const order = resp.Response
							this.orders.push(order)
						}
						this.message({
							title: 'Excelente',
							message: resp.message,
							type: 'success'
						})
						this.getOrders()
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
		editOrder(item) {
			this.editedIndex = this.orders.indexOf(item)
			this.editedOrder = Object.assign({}, item)
		},
		editPlan(item) {
			this.editedPlanIndex = this.plans.indexOf(item)
			this.editedPlan = Object.assign({}, item)
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		associatePlan() {
			this.dPlan.status = true
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			const pcommand = 'UPDATE_PLAN_STATUS'
			if (this.editedPlan.state === 'CANCELLED') {
				this.dLoading.status = false
				this.dPlan.status = false
				this.dPlan.loading = false
				this.message({
					title: 'Atención',
					message: 'El plan ya ha sido cancelado!',
					type: 'warn'
				})
				return
			}
			if (this.editedPlan.state === 'ASSOCIATED') {
				this.dLoading.status = false
				this.dPlan.status = false
				this.dPlan.loading = false
				this.message({
					title: 'Atención',
					message: 'El plan ya ha sido asociado!',
					type: 'warn'
				})
				return
			}
			this.methods
				.requestApi(
					`/api/user/${this.editedPlan.user._id}`,
					'PATCH',
					{},
					{
						command: pcommand,
						transaction: {
							plan: {
								state: 'ASSOCIATED'
							}
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dPlan.status = false
					this.dPlan.loading = false
					if (resp.status === 'SUCCESS') {
						if (this.editedPlanIndex > -1) {
							Object.assign(
								this.plans[this.editedPlanIndex],
								this.editedPlan
							)
						} else {
							const plan = resp.Response
							this.plans.push(plan)
						}
						this.message({
							title: 'Excelente',
							message: resp.message,
							type: 'success'
						})
						this.getPlansPending()
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
		cancelPlan() {
			this.dPlan.status = true
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			const pcommand = 'UPDATE_PLAN_STATUS'
			if (this.editedPlan.status === 'ASSOCIATED') {
				this.dLoading.status = false
				this.dPlan.status = false
				this.dPlan.loading = false
				this.message({
					title: 'Atención',
					message: 'El plan ya ha sido asociado!',
					type: 'warn'
				})
				return
			}
			if (this.editedPlan.status === 'CANCELLED') {
				this.dLoading.status = false
				this.dPlan.status = false
				this.dPlan.loading = false
				this.message({
					title: 'Atención',
					message: 'El plan ha sido cancelado!',
					type: 'warn'
				})
				return
			}
			this.methods
				.requestApi(
					`/api/user/${this.editedPlan.user._id}`,
					'PATCH',
					{},
					{
						command: pcommand,
						transaction: {
							plan: {
								state: 'CANCELLED'
							},
							inactive: false
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dPlan.status = false
					this.dPlan.loading = false
					if (resp.status === 'SUCCESS') {
						if (this.editedPlanIndex > -1) {
							Object.assign(
								this.plans[this.editedPlanIndex],
								this.editedPlan
							)
						} else {
							const plan = resp.Response
							this.plans.push(plan)
						}
						this.message({
							title: 'Excelente',
							message: resp.message,
							type: 'success'
						})
						this.getPlansPending()
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
		...mapMutations(['setToken', 'delToken'])
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
