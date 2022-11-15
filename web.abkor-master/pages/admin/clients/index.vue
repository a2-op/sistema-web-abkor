<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="clients" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Clientes
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Cliente" single-line hide-details)
						v-dialog(v-model="dClient.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) Editar Cliente
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-img(:src="editedClient.photo")
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-text-field(v-model.trim="editedClient.name" prepend-icon="fas fa-signature" label="Nombre" disabled)
															v-text-field(v-model.trim="editedClient.document" prepend-icon="fas fa-id-card" label="Documento" disabled)
															v-text-field(v-model.trim="editedClient.birthday" prepend-icon="fas fa-calendar-week" label="Fecha de nacimiento" disabled)
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-text-field(v-model.trim="editedClient.email" type="text" label="email" disabled)
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-select(v-model="editedClient.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedClient.inactive.$touch()" @blur="$v.editedClient.inactive.$touch()" @keyup.enter="toggleDialog('dClient', false, saveClient)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dClient', false, () => {})") Cancelar
									v-btn(text dark @click="saveClient" :loading="dClient.loading" :disabled="dClient.loading")  Guardar
						v-dialog(v-model="dPlan" persistent max-width="600px" ref="planed")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ plan.name }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-carousel(height="200" v-if="!plan.photos")
														v-carousel-item(v-for="(photo, i) in plan.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-text-field(v-model.trim="plan.name" prepend-icon="fas fa-signature" label="Nombre" disabled)
															v-text-field(v-model.trim="plan.price" prepend-icon="fas fa-signature" label="Precio" disabled)
															v-text-field(v-model.trim="plan.duration" prepend-icon="fas fa-signature" label="Duración" disabled)
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-select(v-if="suspensions.length > 0" :items="suspensions" type="text" label="Suspenciones")
													h4(v-else) No tiene suspenciones
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="dPlan = false") Cerrar
						v-dialog(v-model="dOrderPage" fullscreen scrollable transition="dialog-bottom-transition" hide-overlay persistent ref="seguro")
							v-card(tile)
								v-toolbar(flat dark color="pink")
									v-btn(icon dark @click="dOrderPage = false")
										v-icon mdi-close
									v-toolbar-title Pedidos
									v-spacer
									v-toolbar-items
										v-btn(dark text @click="") {{ editedClient.name }}
								v-card-text(style="height: 800px")
									v-container
										OrderPage(v-if="dOrderPage" ref="orderPage")
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="dOrderPage = false") Cerrar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dClient', true, editClient(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="seePlan(item)")
								v-icon fas fa-eye
						span Ver plan
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="getOrders(item)")
								v-icon fas fa-paper-plane
						span Ver pedidos
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
					v-btn(text @click="dConfirm.event_cancel" color="primary") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import OrderPage from '@/components/admin/orders/Page'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		OrderPage
	},
	validations: {
		editedClient: {
			name: { required },
			email: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			clients: [],
			states: [],
			headers: [
				{ text: 'Nombre Usuario', value: 'name', width: '150px' },
				{ text: 'Correo Usuario', value: 'email', width: '150px' },
				{ text: 'Referencia', value: 'reference', width: '150px' },
				{ text: 'Creado por', value: 'create_by.sub', width: '150px' },
				{
					text: 'Fecha de creación',
					value: 'create_at',
					width: '150px'
				},
				{
					text: 'Modificado por',
					value: 'modified_by.name',
					width: '150px'
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
			search: '',
			editedPhoto: null,
			dClient: {
				status: false,
				loading: false
			},
			editedClient: {
				photos: [],
				name: '',
				email: '',
				entity: 'GETUP',
				profile: 'USR',
				plan: {},
				inactive: true
			},
			defaultClient: {
				photos: [],
				name: '',
				email: '',
				entity: 'GETUP',
				profile: 'USR',
				plan: {},
				inactive: true
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
			suspensions: [],
			plan: {},
			dPlan: false,
			dOrderPage: false
		}
	},
	computed: {
		nameErrors() {
			const errors = []
			if (!this.$v.editedClient.name.$dirty) return errors
			!this.$v.editedClient.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedClient.name.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedClient.inactive.$dirty) return errors
			!this.$v.editedClient.inactive.required &&
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
			this.getClients()
			this.getStates()
		},
		getClients() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_CLIENTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.clients = resp.Response
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
		seePlan(item) {
			if (!item.plan) {
				return this.message({
					title: 'Aviso',
					message: 'Usuario no esta suscrito a ningún plan',
					type: 'warn'
				})
			} else {
				this.dPlan = true
				this.plan = item.plan
				this.suspensions = this.plan.suspended
			}
		},
		getOrders(item) {
			this.dOrderPage = true
			this.editedClient = item
			setTimeout(() => {
				this.$refs.orderPage.getOrders(item._id)
			}, 100)
		},
		editClient(item) {
			this.editedIndex = this.clients.indexOf(item)
			this.editedClient = Object.assign({}, item)
		},
		saveClient() {
			this.$v.editedClient.$touch()
			if (!this.$v.editedClient.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Actualizando estado...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_CLIENT'
					pmethod = 'PATCH'
					puri = `/api/user/${this.editedClient._id}`
				} else {
					pcommand = 'REGISTER'
					pmethod = 'POST'
					puri = '/api/user/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedClient
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dClient.status = false
						this.dClient.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.clients[this.editedIndex],
									this.editedClient
								)
							} else {
								const client = resp.Response
								this.clients.push(client)
							}
							this.message({
								title: 'Excelente',
								message: 'registro guardado correctamente',
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
			this.editedClient = Object.assign({}, this.defaultClient)
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
