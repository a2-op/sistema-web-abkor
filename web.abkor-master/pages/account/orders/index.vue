<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :search="search" :items="orders")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Mis pedidos
						v-divider.mv-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
				template(v-slot:item.billing.type="{ item }")
					| {{ item.method === 'CASH' ? 'TRANSFERENCIA' : item.billing.type }}
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.modified_at="{ item }")
					| {{ item.modified_at ? item.modified_at.substring(0, 10) : '' }}
				template(v-slot:item.status="{ item }")
					v-chip(:color="item.status === 'PENDING' ? 'info' : item.status === 'ATTEND' ? 'success' : 'error'" dark) {{ item.status === 'PENDING' ? 'Pendiente' : item.status === 'ATTEND' ? 'Atendido' : 'Cancelado' }}
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
				{ text: 'Orden', value: 'products[0].name', width: '300px' },
				{ text: 'Fecha de pedido', value: 'create_at', width: '150px' },
				{ text: 'Modificado', value: 'modified_at', width: '150px' },
				{
					text: 'Cant. Productos',
					value: 'total_quantity',
					width: '150px'
				},
				{
					text: 'Importe Pagado',
					value: 'total_price',
					width: '150px'
				},
				{ text: 'Pagado con', value: 'billing.type', width: '150px' },
				{ text: 'Estado de orden', value: 'status', width: '150px' }
			],
			dLoading: {
				status: false,
				message: ''
			},
			orders: [],
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
		},
		getOrders() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDERS_USER',
						transaction: {
							inactive: false
						}
					},
					{},
					'/'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.orders = resp.Response
						// GERAL
						this.orders.sort(function(a, b) {
							return new Date(b.create_at) - new Date(a.create_at)
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
		...mapMutations(['setToken', 'delToken'])
	}
}
</script>
