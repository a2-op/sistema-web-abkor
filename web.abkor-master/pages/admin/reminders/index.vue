<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="reminders" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Recordatorios
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dReminder', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Recordatorio
						v-dialog(v-model="dReminder.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-autocomplete(v-model="editedReminder.send_to" :items="users" multiple :search-input.sync="searchUsers" item-text="name" item-value="_id" return-object prepend-icon="fas fa-users" label="Usuarios")
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedReminder.name" prepend-icon="fas fa-signature" label="Nombre" required :error-messages="nameErrors" @input="$v.editedReminder.name.$touch()" @blur="$v.editedReminder.name.$touch()" @keyup.enter="toggleDialog('dReminder', false, saveReminder)")
												v-col(cols="12" sm="6" md="6")
													v-menu(v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedReminder.date" label="Fecha" prepend-icon="fa fa-time" readonly v-on="on" required :error-messages="dateErrors" @input="$v.editedReminder.date.$touch()" @blur="$v.editedReminder.date.$touch()" @keyup.enter="toggleDialog('dReminder', false, saveReminder)")
														v-date-picker(v-model="editedReminder.date" @input="menu = false")
												v-col(cols="12" sm="6" md="6")
													v-dialog(ref="hourRef" v-model="modal2" :return-value.sync="time" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedReminder.hour" label="Hora" prepend-icon="fas fa-clock" readonly v-on="on" required :error-messages="hourErrors" @input="$v.editedReminder.hour.$touch()" @blur="$v.editedReminder.hour.$touch()" @keyup.enter="toggleDialog('dSchedule', false, saveSchedule)")
														v-time-picker(v-if="modal2" v-model="editedReminder.hour" color="green lighten-1" header-color="primary")
															v-spacer
															v-btn(text @click="modal2 = false" small) Cancel
															v-btn(text @click="$refs.hourRef.save(time)" small) OK
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedReminder.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedReminder.inactive.$touch()" @blur="$v.editedReminder.inactive.$touch()" @keyup.enter="toggleDialog('dReminder', false, saveReminder)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dReminder', false, () => {})" color="primary" small) Cancelar
									v-btn(text @click="toggleDialog('dReminder', false, saveReminder)" :loading="dReminder.loading" :disabled="dReminder.loading" small) Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dReminder', true, editReminder(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteReminder(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.send_to="{ item }")
					| {{ item.send_to ? item.send_to.name : '' }}
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by ? item.create_by.name : '' }}
				template(v-slot:item.modified_by="{ item }")
					| {{ item.modified_by ? item.modified_by.name : '' }}
				template(v-slot:item.send_to="{ item }")
					| {{ item.send_to ? seeName(item.send_to) : '' }}
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
		editedReminder: {
			name: { required, maxLength: maxLength(30) },
			hour: { required },
			date: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			time: null,
			modal2: false,
			menu: false,
			reminders: [],
			users: [],
			states: [],
			headers: [
				{ text: 'Recordatorio', value: 'name', width: '300px' },
				{ text: 'Enviado a', value: 'send_to', width: '300px' },
				{ text: 'Fecha Envio', value: 'date', width: '100px' },
				{ text: 'Hora Envio', value: 'hour', width: '100px' },
				{ text: 'Creado por', value: 'create_by', width: '150px' },
				{
					text: 'Modificado por',
					value: 'modified_by',
					width: '150px'
				},
				{
					text: 'Acción',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			],
			searchUsers: '',
			search: '',
			dReminder: {
				status: false,
				loading: false
			},
			editedReminder: {
				name: '',
				send_to: [],
				date: new Date().toISOString().substr(0, 10),
				hour: '',
				inactive: false
			},
			defaultReminder: {
				name: '',
				send_to: [],
				date: new Date().toISOString().substr(0, 10),
				hour: '',
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
				? 'Nuevo recordatorio'
				: 'Editar recordatorio'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedReminder.name.$dirty) return errors
			!this.$v.editedReminder.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedReminder.name.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		dateErrors() {
			const errors = []
			if (!this.$v.editedReminder.date.$dirty) return errors
			!this.$v.editedReminder.date.required &&
				errors.push('Se requiere la Fecha!')
			return errors
		},
		hourErrors() {
			const errors = []
			if (!this.$v.editedReminder.hour.$dirty) return errors
			!this.$v.editedReminder.hour.required &&
				errors.push('Se requiere la hora!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedReminder.inactive.$dirty) return errors
			!this.$v.editedReminder.inactive.required &&
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
			this.getReminders()
			this.getStates()
			this.getUsers()
		},
		getUsers() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_USERS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.users = resp.Response
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
		getReminders() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Recordatorios...'
			this.methods
				.requestApi(
					'/api/reminder/',
					'GET',
					{
						command: 'GET_REMINDERS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.reminders = resp.Response
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
		editReminder(item) {
			this.editedIndex = this.reminders.indexOf(item)
			this.editedReminder = Object.assign({}, item)
		},
		deleteReminder(item) {
			this.editedIndex = this.reminders.indexOf(item)
			this.editedReminder = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta categoria?'
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
						`/api/reminder/${this.editedReminder._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_REMINDER'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.reminders.splice(this.editedIndex, 1)
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
		saveReminder() {
			this.$v.editedReminder.$touch()
			if (!this.$v.editedReminder.$invalid) {
				this.dReminder.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_REMINDER'
					pmethod = 'PATCH'
					puri = `/api/reminder/${this.editedReminder._id}`
				} else {
					pcommand = 'REGISTER_REMINDER'
					pmethod = 'POST'
					puri = '/api/reminder/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedReminder
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dReminder.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.reminders[this.editedIndex],
									this.editedReminder
								)
							} else {
								const reminder = resp.Response
								this.reminders.push(reminder)
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
		seeName(data) {
			let name = ''
			data.forEach((value) => {
				name += value.name + ',' + '\t'
			})
			return name
		},
		resetForm() {
			this.editedReminder = Object.assign({}, this.defaultReminder)
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
