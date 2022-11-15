<template lang="pug">
	v-container
		v-layout(row wrap)
			v-flex(xs12)
				v-container(grid-list-lg)
					v-layout(row wrap)
						v-data-table.elevation-10(:items="menus" :headers="headers" items-per-page.sync="4" :search="search")
							template(v-slot:top)
								v-toolbar(flat color="white")
									v-toolbar-title Menús
									v-divider.mx-4(inset vertical)
									v-spacer
									v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Menú" single-line hide-details)
									v-spacer
							template(v-slot:item.action="{ item }")
								v-tooltip(bottom)
									template(v-slot:activator="{ on }")
										v-btn(icon small v-on="on" to="/account/calendar")
											v-icon fas fa-edit
									span Recuerde solo puede cambiar la semana actual
							template(v-slot:item.start_date="{ item }")
								| {{ item.start_date ? item.start_date.substring(0, 10) : '' }}
							template(v-slot:item.expiration_date="{ item }")
								| {{ item.expiration_date ? item.expiration_date.substring(0, 10) : '' }}
</template>
<style>
.gu-toolbar-category .v-toolbar__content {
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
			ndCategories: false,
			menus: [],
			search: '',
			dLoading: {
				status: false,
				message: ''
			},
			headers: [
				{
					text: 'Plato',
					value: 'weekmenu[0].menu[0].name',
					width: '150px'
				},
				{ text: 'Fecha', value: 'start_date', width: '300px' },
				{ text: 'Día', value: 'day', width: '150px' },
				{ text: 'Horarios', value: 'schedule', width: '300px' },
				{ text: 'Expiró', value: 'expiration_date', width: '150px' },
				{
					text: 'Action',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			]
		}
	},
	computed: {
		fas() {
			return fas
		},
		faGithub() {
			return faGithub
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getMenus()
		},
		getMenus() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis menús...'
			this.methods
				.requestApi(
					'/api/myweek/',
					'GET',
					{
						command: 'GET_MY_WEEK_CURRENT'
					},
					{},
					'/'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.menus = resp.Response
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
