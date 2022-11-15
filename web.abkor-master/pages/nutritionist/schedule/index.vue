<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="schedules" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Elaborar Horario
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dSchedule', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva Horario
						v-dialog(v-model="dSchedule.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedSchedule.alias" prepend-icon="fas fa-signature" label="Alias" required :error-messages="aliasErrors" @input="$v.editedSchedule.alias.$touch()" @blur="$v.editedSchedule.alias.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
												v-col(cols="12" sm="6" md="6")
													v-menu(v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedSchedule.date" readonly v-on="on" prepend-icon="fas fa-flag" label="Día" required :error-messages="dateErrors" @input="$v.editedSchedule.date.$touch()" @blur="$v.editedSchedule.date.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
														v-date-picker(v-model="editedSchedule.date" @input="menu2 = false")
												v-col(cols="12" sm="6" md="6")
													v-dialog(ref="since" v-model="modal1" :return-value.sync="time" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedSchedule.sinceTime" label="Desde" prepend-icon="fas fa-clock" readonly v-on="on" required :error-messages="sinceErrors" @input="$v.editedSchedule.sinceTime.$touch()" @blur="$v.editedSchedule.sinceTime.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
														v-time-picker(v-if="modal1" v-model="editedSchedule.sinceTime" color="green lighten-1" header-color="primary")
															v-spacer
															v-btn(text @click="modal1 = false") Cancel
															v-btn(text @click="$refs.since.save(time)") OK
												v-col(cols="12" sm="6" md="6")
													v-dialog(ref="until" v-model="modal2" :return-value.sync="time" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedSchedule.untilTime" label="Hasta" prepend-icon="fas fa-clock" readonly v-on="on" required :error-messages="untilErrors" @input="$v.editedSchedule.untilTime.$touch()" @blur="$v.editedSchedule.untilTime.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
														v-time-picker(v-if="modal2" v-model="editedSchedule.untilTime" color="green lighten-1" header-color="primary")
															v-spacer
															v-btn(text @click="modal2 = false") Cancel
															v-btn(text @click="$refs.until.save(time)") OK
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedSchedule.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedSchedule.inactive.$touch()" @blur="$v.editedSchedule.inactive.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dSchedule', false, () => {})" color="primary") Cancelar
									v-btn(text @click="toggleDialog('dSchedule', false, saveSchedule)" :loading="dSchedule.loading" :disabled="dSchedule.loading") Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dSchedule', true, editSchedule(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteSchedule(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
				template(v-slot:item.date="{ item }")
					| {{ item.date ? item.date.substring(0, 10) : '' }}
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.modified_by="{ item }")
					| {{ item.modified_by ? item.modified_by.name : '' }}
				template(v-slot:item.modified_at="{ item }")
					| {{ item.modified_at ? item.modified_at.substring(0, 10) : '' }}
				template(v-slot:item.inactive="{ item }")
					v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
		v-dialog(v-model="dConfirm.status" persistent max-width="290")
			v-card
				v-card-title.headline {{ dConfirm.title }}
				v-card-text {{ dConfirm.message }}
				v-card-actions
					v-spacer
					v-btn(text @click="dConfirm.event_cancel") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	validations: {
		editedSchedule: {
			alias: { required, maxLength: maxLength(30) },
			sinceTime: { required },
			untilTime: { required },
			date: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			schedules: [],
			states: [],
			time: null,
			modal1: false,
			modal2: false,
			headers: [
				{ text: 'Alias', value: 'alias', width: '150px' },
				{ text: 'Hora Inicio', value: 'sinceTime', width: '100px' },
				{ text: 'Hora Fin', value: 'untilTime', width: '100px' },
				{ text: 'Día', value: 'date', width: '150px' },
				{ text: 'Creado por', value: 'create_by', width: '300px' },
				{
					text: 'Fecha de creación',
					value: 'create_at',
					width: '150px'
				},
				{
					text: 'Modificado por',
					value: 'modified_by',
					width: '300px'
				},
				{
					text: 'Fecha de modificación',
					value: 'modified_at',
					width: '150px'
				},
				{ text: 'Estado', value: 'inactive', width: '150px' },
				{
					text: 'Acción',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			],
			headerOptions: [
				{ text: 'Lunes', value: 'lunes' },
				{ text: 'Martes', value: 'martes' },
				{ text: 'Miércoles', value: 'miercoles' },
				{ text: 'Jueves', value: 'jueves' },
				{ text: 'Viernes', value: 'viernes' },
				{ text: 'Sábado', value: 'sabado' }
			],
			search: '',
			dSchedule: {
				status: false,
				loading: false
			},
			editedSchedule: {
				alias: '',
				sinceTime: null,
				untilTime: null,
				date: new Date().toISOString().substr(0, 10),
				inactive: false
			},
			defaultSchedule: {
				alias: '',
				sinceTime: null,
				untilTime: null,
				date: new Date().toISOString().substr(0, 10),
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
			methods: null,
			menu2: false
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Horario' : 'Editar Horario'
		},
		aliasErrors() {
			const errors = []
			if (!this.$v.editedSchedule.alias.$dirty) return errors
			!this.$v.editedSchedule.alias.required &&
				errors.push('Se requiere el alias!')
			!this.$v.editedSchedule.alias.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		sinceErrors() {
			const errors = []
			if (!this.$v.editedSchedule.sinceTime.$dirty) return errors
			!this.$v.editedSchedule.sinceTime.required &&
				errors.push('Se requiere la hora!')
			return errors
		},
		untilErrors() {
			const errors = []
			if (!this.$v.editedSchedule.untilTime.$dirty) return errors
			!this.$v.editedSchedule.untilTime.required &&
				errors.push('Se requiere la hora!')
			return errors
		},
		dateErrors() {
			const errors = []
			if (!this.$v.editedSchedule.date.$dirty) return errors
			!this.$v.editedSchedule.date.required &&
				errors.push('Se requiere el dia!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedSchedule.inactive.$dirty) return errors
			!this.$v.editedSchedule.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		'editedSchedule.date'(val) {
			if (this.editedSchedule.date.length > 10) {
				this.editedSchedule.date = new Date()
					.toISOString()
					.substr(0, 10)
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getSchedule()
			this.getStates()
		},
		getSchedule() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo horarios...'
			this.methods
				.requestApi(
					'/api/schedule/',
					'GET',
					{
						command: 'GET_SCHEDULE'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.schedules = resp.Response
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
		getStates() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo estados...'
			this.methods
				.requestApi(
					'/api/master/',
					'GET',
					{
						command: 'GET_MASTER',
						transaction: {
							code: 'STATE'
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.states = resp.Response
						this.states.forEach((state) => {
							state.value3 = state.value3 === '1'
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
		editSchedule(item) {
			this.editedIndex = this.schedules.indexOf(item)
			this.editedSchedule = Object.assign({}, item)
		},
		deleteSchedule(item) {
			this.editedIndex = this.schedules.indexOf(item)
			this.editedSchedule = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este horario?'
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
						`/api/category/${this.editedSchedule._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_CATEGORY'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.schedules.splice(this.editedIndex, 1)
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
		saveSchedule() {
			this.$v.editedSchedule.$touch()
			if (!this.$v.editedSchedule.$invalid) {
				this.dSchedule.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_SCHEDULE'
					pmethod = 'PATCH'
					puri = `/api/schedule/${this.editedSchedule._id}`
				} else {
					pcommand = 'REGISTER_SCHEDULE'
					pmethod = 'POST'
					puri = '/api/schedule/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedSchedule
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dSchedule.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.schedules[this.editedIndex],
									this.editedSchedule
								)
							} else {
								const category = resp.Response
								this.schedules.push(category)
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
			}
		},
		resetForm() {
			this.editedSchedule = Object.assign({}, this.defaultSchedule)
			this.editedIndex = -1
			this.dConfirm = Object.assign({}, this.dConfirmDefault)
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
