<template lang="pug">
	div
		v-container
			template
				div(class="text-center")
					v-chip(class="ma-2" color="indigo" text-color="white") Esta semana {{appointments.length}} Pacientes
			v-spacer
			template
				v-expansion-panels
					v-expansion-panel(@click="fillDataBar()")
						v-expansion-panel-header
							h4 Reportes de semana actual
						v-expansion-panel-content
							div(class="text-center")
								v-chip(class="ma-2" color="orange" text-color="white") Esta semana {{appointments.length}} Pacientes
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
import BarChart from '@/assets/js/BarChart.js'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		BarChart
	},
	data() {
		return {
			show: false,
			datacollectionBar: null,
			dLoading: {
				status: false,
				message: ''
			},
			appointments: [],
			methods: null,
			code: 'CITA#USR',
			dias: [0, 1, 2, 3, 4, 5, 6],
			date: new Date(),
			day: null,
			firstday: new Date(),
			lastday: new Date(),
			valueAppoinments: [0, 0, 0, 0, 0, 0, 0],
			labels: [
				'Domingo',
				'Lunes',
				'Martes',
				'Miércoles',
				'Jueves',
				'Viernes',
				'Sábado'
			]
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.fillDataBar()
			this.getAppointments()
			this.day = this.dias[this.date.getUTCDay()]
			this.firstday.setDate(this.date.getDate() + (0 - this.day))
			this.lastday.setDate(this.date.getDate() + (6 - this.day))
		},
		getAppointments() {
			const dias = [0, 1, 2, 3, 4, 5, 6]
			const date = new Date()
			const day = dias[date.getUTCDay()]
			const firstday = new Date()
			const lastday = new Date()
			firstday.setDate(date.getDate() + (1 - day))
			lastday.setDate(date.getDate() + (7 - day))
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis datos...'
			this.methods
				.requestApi(
					'/api/appointment/',
					'GET',
					{
						command: 'GET_APPOINTMENTS_NUTRITIONIST_RANGE',
						transaction: {
							firstday: this.firstday,
							lastday: this.lastday,
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
						this.appointments.forEach((element) => {
							const day = element._id.day
							const month = element._id.month
							const year = element._id.year
							const date = new Date(`${year}-${month}-${day}`)
							this.valueAppoinments[date.getUTCDay()] =
								element.count
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
		fillDataBar() {
			this.datacollectionBar = {
				labels: this.labels,
				datasets: [
					{
						label: 'Reportes semanales',
						backgroundColor: 'indigo',
						pointBackgroundColor: 'white',
						borderWidth: 1,
						pointBorderColor: '#249EBF',
						data: this.valueAppoinments
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
