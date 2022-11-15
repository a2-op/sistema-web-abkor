<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="visits" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Visitas
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						// v-spacer
						// v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dVisit', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva visita
						v-dialog(v-model="dVisit.status" persistent max-width="1000px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-text-field(v-model.trim="editedVisit.title" prepend-icon="fas fa-signature" label="Titúlo" required :error-messages="titleErrors" @input="$v.editedVisit.title.$touch()" @blur="$v.editedVisit.title.$touch()" @keyup.enter="toggleDialog('dVisit', false, saveVisit)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="contact" :items="clients" ref="userContact" item-text="name" item-value="_id" prepend-icon="fas fa-flag" label="Contacto")
												v-col(cols="12" sm="6" md="6")
													v-dialog(ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedVisit.planned_date" label="Cita planeada" readonly v-on="on" required)
														v-date-picker(v-model="editedVisit.planned_date" scrollable)
															v-spacer
															v-btn(text @click="modal = false" small) Cancelar
															v-btn(text @click="$refs.dialog.save(date)" small) Ok
												v-col(cols="12" sm="6" md="6")
													v-textarea(v-model.trim="editedVisit.notes" prepend-icon="fas fa-signature" label="Notas")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dVisit', false, () => {})" color="primary" small) Cancelar
									v-btn(text @click="toggleDialog('dVisit', false, saveVisit)" :loading="dVisit.loading" :disabled="dVisit.loading" small) Guardar
				// template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dVisit', true, editVisit(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteVisit(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.created="{ item }")
					| {{ item.created ? item.created.substring(0, 10) : '' }}
				template(v-slot:item.modified="{ item }")
					| {{ item.modified ? item.modified.substring(0, 10) : '' }}
				template(v-slot:item.checkin_time="{ item }")
					| {{ item.checkin_time ? item.checkin_time.substring(11, 16) : '' }}
				template(v-slot:item.checkout_time="{ item }")
					| {{ item.checkout_time ? item.checkout_time.substring(11, 16) : '' }}
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
		editedVisit: {
			title: { required, maxLength: maxLength(30) }
		}
	},
	data() {
		return {
			visits: [],
			contacts: [],
			clients: [],
			modal: false,
			date: '',
			headers: [
				{ text: 'Titúlo', value: 'title', width: '300px' },
				{ text: 'Direción', value: 'address', width: '300px' },
				{
					text: 'Nombre de contacto',
					value: 'contact_name',
					width: '300px'
				},
				{
					text: 'Telefono de contacto',
					value: 'contact_phone',
					width: '100px'
				},
				{
					text: 'Email de contacto',
					value: 'contact_email',
					width: '100px'
				},
				{ text: 'Fecha de creación', value: 'created', width: '150px' },
				{
					text: 'Fecha de modificación',
					value: 'modified',
					width: '150px'
				},
				{
					text: 'Ruta: Tiempo estimado de inicio',
					value: 'route_estimated_time_start',
					width: '100px'
				},
				{
					text: 'tiempo estimado de llegada',
					value: 'estimated_time_arrival',
					width: '100px'
				},
				{
					text: 'Hora estimada de salida',
					value: 'estimated_time_departure',
					width: '100px'
				}
				/* {
					text: 'Acción',
					value: 'action',
					width: '150px',
					sortable: false
				} */
			],
			search: '',
			dVisit: {
				status: false,
				loading: false
			},
			editedVisit: {
				title: '',
				address: '',
				latitude: -12.105926,
				longitude: -77.038807,
				contact_name: '',
				contact_email: '',
				contact_phone: 995399716,
				reference: '',
				notes: '',
				planned_date: ''
			},
			defaultVisit: {
				title: '',
				address: '',
				latitude: 0,
				longitude: 0,
				contact_name: '',
				contact_email: '',
				contact_phone: 0,
				reference: '',
				notes: '',
				planned_date: ''
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
			contact: []
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva Vista' : 'Editar Vista'
		},
		titleErrors() {
			const errors = []
			if (!this.$v.editedVisit.title.$dirty) return errors
			!this.$v.editedVisit.title.required &&
				errors.push('Se requiere el titúlo!')
			!this.$v.editedVisit.title.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
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
			this.getVisits()
			this.getContacts()
			this.getClients()
		},
		getVisits() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo visitas...'
			this.methods
				.requestApi(
					'/api/visit/',
					'GET',
					{
						command: 'GET_VISITS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.visits = resp.Response
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
		getContacts() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo contactos...'
			this.methods
				.requestApi(
					'/api/visit/',
					'GET',
					{
						command: 'GET_USERS_SIMPLIROUTE'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.contacts = resp.Response
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
		editVisit(item) {
			this.editedIndex = this.visits.indexOf(item)
			this.editedVisit = Object.assign({}, item)
		},
		deleteVisit(item) {
			this.editedIndex = this.visits.indexOf(item)
			this.editedVisit = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta visita?'
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
						`/api/visit/${this.editedVisit.id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_VISIT',
							transaction: {
								id: this.editedVisit.id
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.visits.splice(this.editedIndex, 1)
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
		saveVisit() {
			const userContact = this.$refs.userContact._data.selectedItems[0]
			this.$v.editedVisit.$touch()
			if (!this.$v.editedVisit.$invalid) {
				this.dVisit.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_VISIT'
					pmethod = 'PATCH'
					puri = `/api/visit/${this.editedVisit.id}`
				} else {
					pcommand = 'REGISTER_VISIT'
					pmethod = 'POST'
					puri = '/api/visit/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: {
								id: this.editedVisit.id,
								title: this.editedVisit.title,
								address: userContact.addresses[0].name,
								latitude:
									userContact.addresses[0].coordinates
										.latitude,
								longitude:
									userContact.addresses[0].coordinates
										.longitude,
								contact_name: userContact.name,
								contact_phone: Number(
									userContact.addresses[0].mobile
								),
								contact_email: userContact.email,
								reference: userContact.addresses[0].reference,
								notes: this.editedVisit.notes,
								planned_date: this.editedVisit.planned_date
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dVisit.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.visits[this.editedIndex],
									this.editedVisit
								)
							} else {
								const visit = resp.Response
								this.visits.push(visit)
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
			this.editedVisit = Object.assign({}, this.defaultVisit)
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
