<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="supplies" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Insumos
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar insumo" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dSupply', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva Insumo
						v-dialog(v-model="dSupply.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedSupply.name" prepend-icon="fas fa-signature" label="Nombre de Insumo" required :error-messages="nameErrors" @input="$v.editedSupply.name.$touch()" @blur="$v.editedSupply.name.$touch()" @keyup.enter="toggleDialog('dSupply', false, saveSupply)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedSupply.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedSupply.inactive.$touch()" @blur="$v.editedSupply.inactive.$touch()" @keyup.enter="toggleDialog('dSupply', false, saveSupply)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dSupply', false, () => {})" color="primary" small) Cancelar
									v-btn(text @click="toggleDialog('dSupply', false, saveSupply)" :loading="dSupply.loading" :disabled="dSupply.loading" small) Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dSupply', true, editSuply(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteSupply(item)")
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
					v-btn(text @click="dConfirm.event_cancel" small) Cancelar
					v-btn(text @click="dConfirm.event_accept" small) Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	validations: {
		editedSupply: {
			name: { required, maxLength: maxLength(30) },
			inactive: { required }
		}
	},
	data() {
		return {
			supplies: [],
			states: [],
			headers: [
				{ text: 'Nombre insumo', value: 'name' },
				{ text: 'Creado por', value: 'create_by' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			search: '',
			dSupply: {
				status: false,
				loading: false
			},
			editedSupply: {
				name: '',
				inactive: false
			},
			defaultSupply: {
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
			return this.editedIndex === -1 ? 'Nuevo Insumo' : 'Editar Insumo'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedSupply.name.$dirty) return errors
			!this.$v.editedSupply.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedSupply.name.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedSupply.inactive.$dirty) return errors
			!this.$v.editedSupply.inactive.required &&
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
			this.getSupplies()
			this.getStates()
		},
		getSupplies() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Insumos...'
			this.methods
				.requestApi(
					'/api/supply/',
					'GET',
					{
						command: 'GET_SUPPLIES'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.supplies = resp.Response
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
		editSuply(item) {
			this.editedIndex = this.supplies.indexOf(item)
			this.editedSupply = Object.assign({}, item)
		},
		deleteSupply(item) {
			this.editedIndex = this.supplies.indexOf(item)
			this.editedSupply = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta insumo?'
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
						`/api/supply/${this.editedSupply._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_SUPPLY'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.supplies.splice(this.editedIndex, 1)
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
		saveSupply() {
			this.$v.editedSupply.$touch()
			if (!this.$v.editedSupply.$invalid) {
				this.dSupply.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_SUPPLY'
					pmethod = 'PATCH'
					puri = `/api/supply/${this.editedSupply._id}`
				} else {
					pcommand = 'REGISTER_SUPPLY'
					pmethod = 'POST'
					puri = '/api/supply/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedSupply
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dSupply.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.supplies[this.editedIndex],
									this.editedSupply
								)
							} else {
								const supply = resp.Response
								this.supplies.push(supply)
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
			this.editedSupply = Object.assign({}, this.defaultSupply)
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
