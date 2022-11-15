<template lang="pug">
	div
		v-container
			v-card.md-12
				v-toolbar(flat color="white")
					v-toolbar-title Menús de la semana
					v-divider.mx-4(inset vertical)
					v-spacer
					v-toolbar-title @GETUP {{ new Date().getFullYear() }}
					v-spacer
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dWeekMenu', true, resetForm)") #[v-icon fas fa-plus]
						span Organizar Menú de la semana
					v-dialog(v-model="dWeekMenu.status" scrollable persistent max-width="1000px")
						v-card
							v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
							v-card-text(style="height: 600px")
								v-container
									v-data-table.elevation-10(v-model="selectedMenu" :headers="headers" :items="menus" :search="search" item-key="_id" single-select show-select)
										template(v-slot:top)
											v-toolbar(flat color="white" style="margin-top: 20px")
												v-col(cols="4" sm="3")
													v-select(v-model.trim="editedWeekMenu.day" :items="days" label="Día" outlined required)
												v-divider.mx-2(inset vertical)
												v-spacer
												v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar menu" single-line hide-details)
												v-spacer
												v-col(cols="4" sm="3")
													v-select(v-model.trim="editedWeekMenu.schedule" :items="schedules" label="Horario del día" outlined required)
							v-divider
							v-card-actions
								v-spacer
								v-btn(text @click="toggleDialog('dWeekMenu', false, () => {})" color="primary") Cancelar
								v-btn(text @click="saveWeekMenu" :loading="dWeekMenu.loading" :disabled="dWeekMenu.loading") Guardar
		v-container(grid-list-lg)
			v-spacer
			v-layout(row wrap)
				v-flex(xs12 sm6 md3 lg3 v-for="(menu, i) in weekmenus" :key="menu._id")
					v-hover
						v-card.mx-auto(slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`")
							v-carousel(height="150" cycle hide-delimiters :show-arrows="false")
								v-img(class="white--text align-end" height="200px" :src="menu.menu[0].photos[0]")
							v-card-title(style="height: 80px")
								span.title {{ menu.menu[0].name }}
							v-card-text.pt-6(style="position: relative;")
								v-row(align="center")
								.my-4.subtitle-1.red--text Fecha Expiración: {{ menu.expiration_date.substr(0, 10) }}
							v-card-text.pt-6(style="position: relative;")
								v-row(align="center")
								.my-4.subtitle-1.black--text {{ menu.schedule }} || {{ menu.day }}
							v-card-actions
								v-spacer
								v-btn(color="deep-purple accent-4" dark)
									v-icon fas fa-edit
								v-spacer
								v-btn(color="deep-purple accent-4" dark)
									v-icon fas fa-trash
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import Editor from '@/components/Editor'
import StateAutocomplete from '@/components/global/states/autocomplete'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		StateAutocomplete,
		Editor
	},
	validations: {
		editedWeekMenu: {
			day: { required },
			schedule: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			menus: [],
			weekmenus: [],
			states: [],
			ingredients: [],
			headers: [
				{ text: 'Nombre Menú', value: 'name', width: '150px' },
				{ text: 'Ingredients', value: 'ingredients', width: '300px' },
				{ text: 'Creado por', value: 'create_by.name', width: '150px' },
				{
					text: 'Fecha de creación',
					value: 'create_at',
					width: '150px'
				}
			],
			days: [
				{ text: 'Lunes', value: 'LUNES' },
				{ text: 'Martes', value: 'MARTES' },
				{ text: 'Miércoles', value: 'MIERCOLES' },
				{ text: 'Jueves', value: 'JUEVES' },
				{ text: 'Viernes', value: 'VIERNES' },
				{ text: 'Sábado', value: 'SABADO' }
			],
			schedules: [
				{ text: 'Desayuno', value: 'DESAYUNO' },
				{ text: 'Almuerzo', value: 'ALMUERZO' },
				{ text: 'Cena', value: 'CENA' }
			],
			search: '',
			searchTag: null,
			dWeekMenu: {
				status: false,
				loading: false
			},
			editedWeekMenu: {
				day: '',
				schedule: '',
				expiration_date: null,
				menu: null,
				inactive: false
			},
			defaultWeekMenu: {
				day: '',
				schedule: '',
				expiration_date: null,
				menu: null,
				inactive: false
			},
			dLoading: {
				status: false,
				message: ''
			},
			dConfirm: {
				status: false,
				title: '',
				message: '',
				event_cancel: () => {},
				event_accept: () => {}
			},
			dConfirmDefault: {
				status: false,
				title: '',
				message: '',
				event_cancel: () => {},
				event_accept: () => {}
			},
			editedIndex: -1,
			sizeImage: 5120,
			methods: null,
			selectedMenu: []
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1
				? 'Crear Menú de la Semana'
				: 'Editar Menú de la semana'
		},
		dayErrors() {
			const errors = []
			if (!this.$v.editedWeekMenu.day.$dirty) return errors
			!this.$v.editedWeekMenu.day.required &&
				errors.push('Se requiere el Día!')
			return errors
		},
		scheduleErrors() {
			const errors = []
			if (!this.$v.editedWeekMenu.schedule.$dirty) return errors
			!this.$v.editedWeekMenu.schedule.required &&
				errors.push('Se requiere el Horario!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedWeekMenu.inactive.$dirty) return errors
			!this.$v.editedWeekMenu.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getMenus()
			this.getWeekMenus()
		},
		getMenus() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo menús...'
			this.methods
				.requestApi(
					'/api/menu/',
					'GET',
					{
						command: 'GET_WEEK_MENUS'
					},
					{},
					'/account/auth/sign-in'
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
		},
		getWeekMenus() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo menús Actuales...'
			this.methods
				.requestApi(
					'/api/weekmenu/',
					'GET',
					{
						command: 'GET_WEEK_MENU_CURRENTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.weekmenus = resp.Response
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
		editMenu(item) {
			this.editedIndex = this.menus.indexOf(item)
			this.editedWeekMenu = Object.assign({}, item)
		},
		deleteMenu(item) {
			this.editedIndex = this.menus.indexOf(item)
			this.editedWeekMenu = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este menú?'
			this.dConfirm.message =
				'Tip: Recuerde que tambien puede inhabilitar los registros'
			this.dConfirm.event_cancel = () => {
				this.resetForm()
			}
			this.dConfirm.event_accept = () => {
				this.dConfirm.status = false
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				this.methods
					.requestApi(
						`/api/weekmenu/${this.editedWeekMenu._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_WEEK_MENU_CURRENT'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.menus.splice(this.editedIndex, 1)
							this.message({
								title: 'Excelente',
								message:
									'Se ha eliminado la información correctamente',
								type: 'success'
							})
							this.resetForm()
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
		getExpirationDate(date, day) {
			date = new Date()
			date.setDate(date.getDate() + day)
			return date
		},
		saveWeekMenu() {
			this.dWeekMenu.loading = true
			this.dLoading.status = true
			this.dLoading.message = 'Guardando...'
			let pcommand = ''
			let pmethod = ''
			let puri = ''
			if (this.editedIndex !== -1) {
				pcommand = 'UPDATE_WEEK_MENU_CURRENT'
				pmethod = 'PATCH'
				puri = `/api/weekmenu/${this.editedWeekMenu._id}`
			} else {
				pcommand = 'REGISTER_WEEK_MENU_CURRENT'
				pmethod = 'POST'
				puri = '/api/weekmenu/'
			}
			this.methods
				.requestApi(
					puri,
					pmethod,
					{},
					{
						command: pcommand,
						transaction: {
							day: this.editedWeekMenu.day,
							schedule: this.editedWeekMenu.schedule,
							menu: this.selectedMenu,
							expiration_date: this.getExpirationDate(
								new Date(),
								7
							),
							inactive: true
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dWeekMenu.status = false
					this.dWeekMenu.loading = false
					if (resp.status === 'SUCCESS') {
						if (this.editedIndex > -1) {
							Object.assign(
								this.weekmenus[this.editedIndex],
								this.editedWeekMenu
							)
						} else {
							const weekmenu = resp.Response
							this.weekmenus.push(weekmenu)
						}
						this.message({
							title: 'Excelente',
							message:
								'Se ha registrado la información correctamente',
							type: 'success'
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
		resetForm() {
			this.editedWeekMenu = this.methods.clonex(this.defaultWeekMenu)
			this.editedIndex = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.$reset()
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
