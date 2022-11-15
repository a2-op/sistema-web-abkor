<template lang="pug">
	div
		v-container
			template(v-if="orders.length <= 0")
				h4(style="text-align: center;") No tiene pedidos registrados
			template(v-else)
				v-data-table.elevation-1(:headers="headers" :search="search" :items="orders")
					template(v-slot:top)
						v-toolbar(flat color="white")
							v-toolbar-title Pedidos
							v-divider.mv-divider.mx-4(inset vertical)
							v-spacer
							v-text-field(v-model="search" append-icon="fas fa-search" label="Busqueda general" single-line hide-details)
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
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
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
			methods: null,
			menu: false,
			current_date: new Date().toISOString().substr(0, 10)
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
		},
		getOrders(userID) {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDERS_USER_ID',
						transaction: {
							userId: userID
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					this.menu = false
					if (resp.status === 'SUCCESS') {
						this.orders = resp.Response
						if (this.orders.length <= 0) {
							this.message({
								title: 'Informacóon',
								message: 'No cuenta con ningún pedido',
								type: 'info'
							})
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
