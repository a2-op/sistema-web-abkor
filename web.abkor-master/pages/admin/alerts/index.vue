<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="alerts" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Alertas
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar categoria" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dAlert', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva Alerta
						v-dialog(v-model="dAlert.status" scrollable persistent max-width="800px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text(style="height: 600px")
									v-container
										v-form
											v-row
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedAlert.title" prepend-icon="fas fa-signature" label="Titúlo" required :error-messages="titleErrors" @input="$v.editedAlert.title.$touch()" @blur="$v.editedAlert.title.$touch()" @keyup.enter="toggleDialog('dAlert', false, saveCategory)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedAlert.icon" :items="icons" item-text="text" item-value="value" prepend-icon="fas fa-icons" label="Icono" @keyup.enter="toggleDialog('dAlert', false, saveCategory)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedAlert.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedAlert.inactive.$touch()" @blur="$v.editedAlert.inactive.$touch()" @keyup.enter="toggleDialog('dAlert', false, saveCategory)")
												v-col(cols="12" sm="6" md="6")
													v-dialog(ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedAlert.end" label="Expiración del Alerta" readonly v-on="on" required)
														v-date-picker(v-model="editedAlert.end" scrollable)
															v-spacer
															v-btn(text @click="modal = false" small) Cancelar
															v-btn(text @click="$refs.dialog.save(date)" small) Ok
												v-col(cols="12" sm="12" md="12")
													span Contenido
													Editor.mt-5(v-model="editedAlert.content")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dAlert', false, () => {})" color="primary" small) Cancelar
									v-btn(text @click="toggleDialog('dAlert', false, saveCategory)" :loading="dAlert.loading" :disabled="dAlert.loading" small) Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dAlert', true, editAlert(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteAlert(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
				template(v-slot:item.end="{ item }")
					| {{ item.end ? item.end.substring(0, 10) : '' }}
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
import Editor from '@/components/Editor'
import Util from '@/assets/js/util'
export default {
	components: {
		Editor
	},
	layout: 'dashboard',
	validations: {
		editedAlert: {
			title: { required, maxLength: maxLength(30) },
			inactive: { required }
		}
	},
	data() {
		return {
			alerts: [],
			states: [],
			modal: false,
			date: '',
			headers: [
				{ text: 'Titúlo Alerta', value: 'title' },
				{ text: 'Finaliza', value: 'end' },
				{ text: 'Creado por', value: 'create_by' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			icons: [
				{ text: 'Alerta', value: 'fas fa-exclamation-triangle' },
				{ text: 'Información', value: 'fas fa-info' },
				{ text: 'Error', value: 'fas fa-times' }
			],
			search: '',
			dAlert: {
				status: false,
				loading: false
			},
			editedAlert: {
				title: '',
				content: '',
				icon: '',
				end: '',
				inactive: false
			},
			defaultAlert: {
				title: '',
				content: '',
				icon: '',
				end: '',
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
			return this.editedIndex === -1 ? 'Nueva alerta' : 'Editar alerta'
		},
		titleErrors() {
			const errors = []
			if (!this.$v.editedAlert.title.$dirty) return errors
			!this.$v.editedAlert.title.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedAlert.title.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedAlert.inactive.$dirty) return errors
			!this.$v.editedAlert.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		'editedAlert.end'(val) {
			if (this.editedAlert.end.length > 10) {
				this.editedAlert.end = new Date().toISOString().substr(0, 10)
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
			this.getAlerts()
			this.getStates()
		},
		getAlerts() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Alertas...'
			this.methods
				.requestApi(
					'/api/alert/',
					'GET',
					{
						command: 'GET_ALERTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.alerts = resp.Response
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
		editAlert(item) {
			this.editedIndex = this.alerts.indexOf(item)
			this.editedAlert = Object.assign({}, item)
		},
		deleteAlert(item) {
			this.editedIndex = this.alerts.indexOf(item)
			this.editedAlert = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta alerta?'
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
						`/api/alert/${this.editedAlert._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_ALERT'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.alerts.splice(this.editedIndex, 1)
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
		saveCategory() {
			this.$v.editedAlert.$touch()
			if (!this.$v.editedAlert.$invalid) {
				this.dAlert.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_ALERT'
					pmethod = 'PATCH'
					puri = `/api/alert/${this.editedAlert._id}`
				} else {
					pcommand = 'REGISTER_ALERT'
					pmethod = 'POST'
					puri = '/api/alert/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedAlert
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dAlert.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.alerts[this.editedIndex],
									this.editedAlert
								)
							} else {
								const category = resp.Response
								this.alerts.push(category)
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
			this.editedAlert = Object.assign({}, this.defaultAlert)
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
