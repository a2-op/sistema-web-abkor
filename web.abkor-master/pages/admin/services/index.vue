<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :search="search" :items="services")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Servicios
						v-divider.mv-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						v-spacer
						v-tooltip(botton)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dService', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo servicio
						v-dialog(v-model="dService.status" persistent max-width="500px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-text-field(v-model.trim="editedService.name" label="Servicio" prepend-icon="fas fa-signature" required :error-messages="nameErrors" @input="$v.editedService.name.$touch()" @blur="$v.editedService.name.$touch()" @keyup.enter="saveService()")
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													StateAutocomplete(v-model="editedService.inactive")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dService', false, () => {})" small) Cancelar
									v-btn(text  :loading="dService.loading" :disabled="dService.loading" @click="saveService" small) Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(botton)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dService', true, editService(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(botton)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteService(item)")
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
					v-btn(text @click="dConfirm.event_cancel" color="primary" small) Cancelar
					v-btn(text @click="dConfirm.event_accept" small) Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import StateAutocomplete from '@/components/global/states/autocomplete'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		StateAutocomplete
	},
	validations: {
		editedService: {
			name: {
				required
			}
		}
	},
	data() {
		return {
			search: '',
			headers: [
				{ text: 'Servicio', value: 'name' },
				{ text: 'Creado por', value: 'create_by.name' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by.name' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			services: [],
			dService: {
				status: false,
				loading: false
			},
			editedService: {
				name: '',
				inactive: false
			},
			defaultService: {
				name: '',
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
			return this.editedIndex === -1
				? 'Nuevo servicio'
				: 'Editar servicio'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedService.name.$dirty) return errors
			!this.$v.editedService.name.required &&
				errors.push('Se requiere el nombre!')
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
			this.getStates()
			this.getServices()
		},
		getServices() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo servicios...'
			this.methods
				.requestApi(
					'/api/service/',
					'GET',
					{
						command: 'GET_SERVICES'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.services = resp.Response
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
		saveService() {
			this.$v.editedService.$touch()
			if (!this.$v.editedService.$invalid) {
				this.dService.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Agregando Servicio...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_SERVICE'
					pmethod = 'PATCH'
					puri = `/api/service/${this.editedService._id}`
				} else {
					pcommand = 'REGISTER_SERVICE'
					pmethod = 'POST'
					puri = '/api/service/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedService
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dService.status = false
						this.dService.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.services[this.editedIndex],
									this.editedService
								)
							} else {
								const service = resp.Response
								this.services.push(service)
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
			this.editedService = this.methods.clonex(this.defaultService)
			this.editedIndex = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.$reset()
		},
		editService(item) {
			this.editedIndex = this.services.indexOf(item)
			this.editedService = Object.assign({}, item)
		},
		deleteService(item) {
			this.editedIndex = this.services.indexOf(item)
			this.editedService = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este servicio?'
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
						`/api/service/${this.editedService._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_SERVICE'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.services.splice(this.editedIndex, 1)
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
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		resetFrom() {},
		...mapMutations(['setToken', 'delToken'])
	}
}
</script>
