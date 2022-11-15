<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="appointments" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Citas
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar cita" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dAppointment', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva cita
						v-dialog(v-model="dAppointment.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedAppointment.alias" prepend-icon="fas fa-signature" label="Nombre de la Cita" required :error-messages="aliasErrors" @input="$v.editedAppointment.alias.$touch()" @blur="$v.editedAppointment.alias.$touch()" @keyup.enter="toggleDialog('dAppointment', false, saveAppointment)")
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedAppointment.price" prepend-icon="fas fa-money-bill-alt" label="Precio" required :error-messages="priceErrors" @input="$v.editedAppointment.price.$touch()" @blur="$v.editedAppointment.price.$touch()" @keyup.enter="toggleDialog('dAppointment', false, saveAppointment)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedAppointment.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedAppointment.inactive.$touch()" @blur="$v.editedAppointment.inactive.$touch()" @keyup.enter="toggleDialog('dAppointment', false, saveAppointment)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dAppointment', false, () => {})" color="primary") Cancelar
									v-btn(text @click="toggleDialog('dAppointment', false, saveAppointment)" :loading="dAppointment.loading" :disabled="dAppointment.loading") Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dAppointment', true, editAppointment(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteAppointment(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
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
		editedAppointment: {
			alias: { required, maxLength: maxLength(30) },
			price: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			appointments: [],
			states: [],
			headers: [
				{ text: 'Nombre', value: 'alias' },
				{ text: 'Precio', value: 'price' },
				{ text: 'Creado por', value: 'create_by' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			search: '',
			dAppointment: {
				status: false,
				loading: false
			},
			editedAppointment: {
				alias: '',
				price: 0,
				code: 'CITA#ADM',
				inactive: false
			},
			defaultAppointment: {
				alias: '',
				price: 0,
				code: 'CITA#ADM',
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
			methods: null
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva cita' : 'Editar cita'
		},
		aliasErrors() {
			const errors = []
			if (!this.$v.editedAppointment.alias.$dirty) return errors
			!this.$v.editedAppointment.alias.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedAppointment.alias.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		priceErrors() {
			const errors = []
			if (!this.$v.editedAppointment.price.$dirty) return errors
			!this.$v.editedAppointment.price.required &&
				errors.push('Se requiere el precio!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedAppointment.inactive.$dirty) return errors
			!this.$v.editedAppointment.inactive.required &&
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
			this.getAppointments()
			this.getStates()
		},
		getAppointments() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo citas...'
			this.methods
				.requestApi(
					'/api/appointment/',
					'GET',
					{
						command: 'GET_ADMIN_APPOINTMENTS',
						transaction: {
							code: this.editedAppointment.code
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.appointments = resp.Response
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
		editAppointment(item) {
			this.editedIndex = this.appointments.indexOf(item)
			this.editedAppointment = Object.assign({}, item)
		},
		deleteAppointment(item) {
			this.editedIndex = this.appointments.indexOf(item)
			this.editedAppointment = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta cita?'
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
						`/api/appointment/${this.editedAppointment._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_APPOINTMENT'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.appointments.splice(this.editedIndex, 1)
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
		saveAppointment() {
			this.$v.editedAppointment.$touch()
			if (!this.$v.editedAppointment.$invalid) {
				this.dAppointment.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_APPOINTMENT_ADMIN'
					pmethod = 'PATCH'
					puri = `/api/appointment/${this.editedAppointment._id}`
				} else {
					pcommand = 'REGISTER_APPOINTMENT_ADMIN'
					pmethod = 'POST'
					puri = '/api/appointment/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedAppointment
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dAppointment.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.appointments[this.editedIndex],
									this.editedAppointment
								)
							} else {
								const appointment = resp.Response
								this.appointments.push(appointment)
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
			this.editedAppointment = Object.assign({}, this.defaultAppointment)
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
