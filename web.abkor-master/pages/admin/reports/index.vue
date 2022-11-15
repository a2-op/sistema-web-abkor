<template lang="pug">
	div
		v-container
			template
				div(class="text-center")
				<!-- GERAL-->
					v-row
						v-col(cols="12" md="6" lg="3" xl="3")
							v-card(class="" color="indigo" style="height:95px;border-radius:15px;")
								div(style=" display: flex;flex: 1; position: relative;align-items: center;")
									v-row(style="margin-top:25px;margin-left:10px")
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											span(style="font-size: 15px;color:white") Total de ordenes
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											v-icon(color="white" style="margin-top:-5px") fas fa-clipboard-list
											span(style="font-size: 15px;color:white;margin-left:10px") {{orders.length || 0}}
						v-col(cols="12" md="6" lg="3" xl="3")
							v-card(class="" color="green" style="height:95px;border-radius:15px;")
								div(style=" display: flex;flex: 1; position: relative;align-items: center;")
									v-row(style="margin-top:25px;margin-left:10px")
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											span(style="font-size: 15px;color:white") Ordenes atendidas
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											v-icon(color="white") fas fa-clipboard-check
											span(style="font-size: 15px;color:white;margin-left:10px") {{ordersServed.length || 0}}
						v-col(cols="12" md="6" lg="3" xl="3")
							v-card(class="" color="red" style="height:95px;border-radius:15px;")
								div(style=" display: flex;flex: 1; position: relative;align-items: center;")
									v-row(style="margin-top:25px;margin-left:10px")
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											span(style="font-size: 15px;color:white") Ordenes canceladas
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											v-icon(color="white") fas fa-times
											span(style="font-size: 15px;color:white;margin-left:10px") {{ordersCancel.length || 0}}
						v-col(cols="12" md="6" lg="3" xl="3")
							v-card(class="" color="orange" style="height:95px;border-radius:15px;")
								div(style=" display: flex;flex: 1; position: relative;align-items: center;")
									v-row(style="margin-top:25px;margin-left:10px")
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											span(style="font-size: 15px;color:white") Ordenes pendientes
										v-col(cols="6" sm="6" md="6" style="line-height: 1;")
											v-icon(color="white") fas fa-stopwatch
											span(style="font-size: 15px;color:white;margin-left:10px") {{ordersPending.length || 0}}
				<!-- GERAL-->
			v-spacer
			template
				v-row
					v-col(cols="12" sm="12" md="6" lg="6")
						v-expansion-panels(v-model="panelGraficoPastel" multiple)
							v-expansion-panel(@click="fillDataDoughnut()")
								v-expansion-panel-header
									h4 I. Gráfico Pastel
								v-expansion-panel-content
									div(class="text-center")
										v-chip(class="ma-2" color="indigo" text-color="white") Ingresos Esperados: S/ {{ expected_income }}
										v-chip(class="ma-2" color="orange" text-color="white") Ingresos Totales: S/ {{ total_orders }}
									div(class="small")
										doughnut-chart(:chart-data="datacollectionDoughnut")
					v-col(cols="12" sm="12" md="6" lg="6")
						v-expansion-panels(v-model="panelGraficoBarras" multiple)
							v-expansion-panel(@click="fillDataBar()")
								v-expansion-panel-header
									h4 II. Gráfico barras
								v-expansion-panel-content
									div(class="text-center")
										v-chip(class="ma-2" color="indigo" text-color="white") Ingresos Esperados: S/ {{ expected_income }}
										v-chip(class="ma-2" color="orange" text-color="white") Ingresos Totales: S/ {{ total_orders }}
									div(class="long")
										bar-chart(:chart-data="datacollectionBar")
			 
				
</template>
<style>
.small {
	max-width: 600px;
	margin: 150px auto;
}
.long {
	max-width: 800px;
	margin: 150px auto;
}
</style>
<script>
import DoughnutChart from '@/assets/js/DoughnutChart.js'
import BarChart from '@/assets/js/BarChart.js'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		DoughnutChart,
		BarChart
	},
	data() {
		return {
			panelGraficoPastel: [0],
			panelGraficoBarras: [0],
			show: false,
			datacollectionDoughnut: null,
			datacollectionBar: null,
			dLoading: {
				status: false,
				message: ''
			},
			orders: [],
			ordersServed: [],
			ordersCancel: [],
			ordersPending: [],
			methods: null,
			total_orders: 0,
			expected_income: 0
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		async init() {
			this.methods = new Util(this)
			await this.getOrders()
			this.fillDataDoughnut()
			this.fillDataBar()
		},
		async getOrders() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis pedidos...'
			await this.methods
				.requestApi(
					'/api/order/',
					'GET',
					{
						command: 'GET_ORDERS_STATUS',
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
						const data = resp.Response
						let result1 = 0
						let result2 = 0
						data.forEach((value, index) => {
							if (value.status === 'ATTEND') {
								result1 += value.total_price
								this.ordersServed.push(value)
							} else if (value.status === 'PENDING') {
								this.ordersPending.push(value)
							} else if (value.status === 'CANCEL') {
								this.ordersCancel.push(value)
							}
							this.orders.push(value)
							result2 += value.total_price
						})
						this.total_orders = result1
						this.expected_income = result2
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
		fillDataDoughnut() {
			this.datacollectionDoughnut = {
				labels: ['Ingresos Totales', 'Ingresos esperados'],
				datasets: [
					{
						label: 'Ingresos',
						backgroundColor: 'indigo',
						data: [this.total_orders, this.expected_income]
					}
				]
			}
		},
		fillDataBar() {
			this.datacollectionBar = {
				labels: ['Ingresos'],
				datasets: [
					{
						label: 'Totales',
						backgroundColor: 'indigo',
						data: [this.total_orders]
					},
					{
						label: 'Esperados',
						backgroundColor: 'orange',
						data: [this.expected_income]
					}
				]
			}
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
