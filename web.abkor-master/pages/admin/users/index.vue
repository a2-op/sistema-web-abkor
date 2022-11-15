<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="users" :search="search" sort-by="calories")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Usuarios
						v-divider.mv-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Usario" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dUser', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Usuario
						v-dialog(v-model="dUser.status" scrollable persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-text-field(v-model.trim="editedUser.name" label="Nombres" prepend-icon="fas fa-user" required :error-messages="nameErrors" @input="$v.editedUser.name.$touch()" @blur="$v.editedUser.name.$touch()" @keyup.enter="saveUser()")
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-text-field(v-model.trim="editedUser.email" type="email" label="Correo electronico" autocomplete="email" prepend-icon="fas fa-envelope" :disabled="editedIndex !== -1" required :error-messages="emailErrors" @input="$v.editedUser.email.$touch()" @blur="$v.editedUser.email.$touch()")
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													v-select(label="Perfil" :items="opts" prepend-icon="fas fa-id-card-alt" v-model.trim="editedUser.profile" :disabled="editedIndex !== -1" required)
												v-col(v-if="editedIndex === -1" cols="12" xs="12" sm="6" md="6" lg="6")
													v-text-field(v-model.trim="editedUser.password" :append-icon="showregister ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showregister = !showregister" :type="showregister ? 'text' : 'password'" label="Contraseña" autocomplete="new-password" prepend-icon="fas fa-lock" required :error-messages="passwordErrors" @input="$v.editedUser.password.$touch()" @blur="$v.editedUser.password.$touch()")
												v-col(cols="12" xs="12" sm="6" md="6" lg="6")
													StateAutocomplete(v-model="editedUser.inactive")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dUser', false, () => {})") Cancelar
									v-btn(text @click="saveUser" :loading="dUser.loading" :disabled="dUser.loading") Guardar
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.modified_at="{ item }")
					| {{ item.modified_at ? item.modified_at.substring(0, 10) : '' }}
				template(v-slot:item.inactive="{ item }")
					v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dUser', true, editUser(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteUser(item)")
								v-icon fas fa-trash
						span Eliminar
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
import {
	requiredIf,
	required,
	maxLength,
	email
} from 'vuelidate/lib/validators'
import Util from '@/assets/js/util'
import StateAutocomplete from '@/components/global/states/autocomplete'
export default {
	layout: 'dashboard',
	name: 'Users',
	components: {
		StateAutocomplete
	},
	model: {
		prop: 'model',
		event: 'change'
	},
	props: {
		model: {
			type: Boolean,
			default: false
		}
	},
	validations: {
		editedUser: {
			name: {
				required: requiredIf((model) => {
					return model.tab === 'tab-signup'
				})
			},
			email: {
				required,
				email
			},
			password: { required },
			profile: { required, maxLength: maxLength(3) }
		},
		recover: {
			email: { required, email }
		}
	},
	data() {
		return {
			users: [],
			states: [],
			headers: [
				{ text: 'Nombre Usuario', value: 'name', width: '150px' },
				{ text: 'Correo Usuario', value: 'email', width: '150px' },
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
			opts: [
				{ text: 'Administrador', value: 'ADM' },
				{ text: 'Nutricionista', value: 'NUT' },
				{ text: 'Producción', value: 'PRO' }
			],
			search: '',
			editedUser: {
				photo: '',
				name: '',
				email: '',
				password: '',
				repassword: '',
				entity: 'GETUP',
				profile: 'ADM',
				reference: '',
				tab: 'tab-signin',
				inactive: false
			},
			defaultUser: {
				photo: '',
				name: '',
				email: '',
				password: '',
				repassword: '',
				entity: 'GETUP',
				profile: 'ADM',
				reference: '',
				tab: 'tab-signin'
			},
			recover: {
				email: ''
			},
			status: {
				connected: 'connected',
				not_authorized: 'not_authorized',
				unknown: 'unknown'
			},
			dUser: {
				status: false,
				loading: false
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
			showregister: false,
			showregister2: false
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedUser.name.$dirty) return errors
			!this.$v.editedUser.name.required &&
				errors.push('Se requiere el nombre!')
			return errors
		},
		emailErrors() {
			const errors = []
			if (!this.$v.editedUser.email.$dirty) return errors
			!this.$v.editedUser.email.required &&
				errors.push('Se requiere el correo electronico!')
			!this.$v.editedUser.email.email &&
				errors.push('Se requiere un correo valido!')
			return errors
		},
		passwordErrors() {
			const errors = []
			if (!this.$v.editedUser.password.$dirty) return errors
			!this.$v.editedUser.password.required &&
				errors.push('Se requiere la contraseña!')
			return errors
		},
		recoverErrors() {
			const errors = []
			if (!this.$v.recover.email.$dirty) return errors
			!this.$v.recover.email.required &&
				errors.push('Se requiere el correo electronico!')
			!this.$v.recover.email.email &&
				errors.push('Se requiere un correo valido!')
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
			this.getUsers()
			this.getStates()
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
		editUser(item) {
			this.editedIndex = this.users.indexOf(item)
			this.editedUser = Object.assign({}, item)
		},
		deleteUser(item) {
			this.editedIndex = this.users.indexOf(item)
			this.editedUser = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar realmente este usuario?'
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
						'/api/user/',
						'POST',
						{},
						{
							command: 'DELETE_USER',
							transaction: this.editedUser
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.users.splice(this.editedIndex, 1)
							this.methods.setHistory({
								origin: 'USERS',
								title: 'Eliminación de Usuarios',
								content: `Se ha eliminado el usuario: ${this.editedUser.name} del sistema`,
								module: 'ADMIN',
								color: 'purple'
							})
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
		saveUser() {
			this.$v.editedUser.$touch()
			if (!this.$v.editedUser.$invalid) {
				this.dUser.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_USER'
					pmethod = 'PATCH'
					puri = `/api/user/${this.editedUser._id}`
				} else {
					pcommand = 'REGISTER_USER'
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
							transaction: this.editedUser
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dUser.status = false
						this.dUser.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.users[this.editedIndex],
									this.editedUser
								)
							} else {
								const user = resp.ExtraParameters
								this.users.push(user)
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
			this.editedUser = this.methods.clonex(this.defaultUser)
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
