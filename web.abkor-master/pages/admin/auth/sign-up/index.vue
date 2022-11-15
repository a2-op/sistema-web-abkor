<template lang="pug">
	div
		v-card.elevation-12
			v-toolbar(color='primary', dark='', flat='')
				v-toolbar-title
					img.mb-6(:src="configuration.company.logo" style="width: 250px;")
				v-spacer
			v-card-text
				v-form
					v-text-field#name(v-model.trim="user.name" label='Nombre', name='name', prepend-icon='fas fa-signature', type='text' required :error-messages="nameErrors" @input="$v.user.name.$touch()" @blur="$v.user.name.$touch()" @keyup.enter="register()")
					v-text-field#email(v-model.trim="user.email" label='Usuario', name='login', prepend-icon='fas fa-user', type='email' required :error-messages="emailErrors" @input="$v.user.email.$touch()" @blur="$v.user.email.$touch()" @keyup.enter="register()")
					v-text-field#password(v-model.trim="user.password" :append-icon="showlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showlogin = !showlogin" label='Contraseña', name='password', prepend-icon='fas fa-lock', :type="showlogin ? 'text' : 'password'" required :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" @keyup.enter="register()")
					v-text-field#repassword(v-model.trim="user.repassword" :append-icon="reshowlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="reshowlogin = !reshowlogin" label='Repetir Contraseña', name='password', prepend-icon='fas fa-lock', :type="reshowlogin ? 'text' : 'password'" required :error-messages="repasswordErrors" @input="$v.user.repassword.$touch()" @blur="$v.user.repassword.$touch()" @keyup.enter="register()")
					v-text-field#token(v-model.trim="user.token" label='Token de seguridad', name='token', prepend-icon='fas fa-key', type='text' required :error-messages="tokenErrors" @input="$v.user.token.$touch()" @blur="$v.user.token.$touch()" @keyup.enter="register()")
			v-card-actions
				nuxt-link(to='/account/auth/sign-in') Acceder
				v-spacer
				v-btn(color='primary', @click="register()") Registrarse
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'centered',
	validations: {
		user: {
			name: { required, minLength: minLength(3) },
			email: { required, email },
			password: { required, minLength: minLength(6) },
			repassword: { required, minLength: minLength(6) },
			token: { required }
		}
	},
	props: {
		source: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			user: {
				name: '',
				email: '',
				password: '',
				entity: 'GETUP',
				profile: 'ADM',
				token: ''
			},
			dLoading: {
				status: false,
				message: ''
			},
			showlogin: false,
			reshowlogin: false,
			methods: null
		}
	},
	computed: {
		nameErrors() {
			const errors = []
			if (!this.$v.user.name.$dirty) return errors
			!this.$v.user.name.required && errors.push('Se requiere el nombre!')
			!this.$v.user.name.minLength &&
				errors.push('Debe tener un minimo de 3 letras!')
			return errors
		},
		emailErrors() {
			const errors = []
			if (!this.$v.user.email.$dirty) return errors
			!this.$v.user.email.required &&
				errors.push('Se requiere el correo electronico!')
			!this.$v.user.email.email &&
				errors.push('Se requiere un correo valido!')
			return errors
		},
		passwordErrors() {
			const errors = []
			if (!this.$v.user.password.$dirty) return errors
			!this.$v.user.password.required &&
				errors.push('Se requiere la contraseña!')
			!this.$v.user.password.minLength &&
				errors.push('Debe tener un  minimo de 6 digitos!')
			return errors
		},
		repasswordErrors() {
			const errors = []
			if (!this.$v.user.repassword.$dirty) return errors
			!this.$v.user.repassword.required &&
				errors.push('Se requiere la contraseña!')
			!this.$v.user.repassword.minLength &&
				errors.push('Debe tener un  minimo de 6 digitos!')
			return errors
		},
		tokenErrors() {
			const errors = []
			if (!this.$v.user.token.$dirty) return errors
			!this.$v.user.token.required &&
				errors.push('Se requiere el token de seguridad!')
			return errors
		},
		...mapState(['token', 'configuration'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getConfigurations()
		},
		getConfigurations() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo configuraciones...'
			this.methods
				.requestApi(
					'/api/configuration/',
					'GET',
					{
						command: 'GET_CONFIGURATIONS',
						transaction: {
							inactive: false
						}
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						const configurations = resp.Response
						configurations.forEach((config) => {
							this.setConfiguration(config)
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
		register() {
			this.$v.$touch()
			if (!this.$v.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando...'
				if (this.user.password === this.user.repassword) {
					this.methods
						.requestApi(
							'/api/access/',
							'POST',
							{},
							{
								command: 'REGISTER',
								transaction: this.user
							}
						)
						.then((resp) => {
							this.dLoading.status = false
							if (resp.status === 'SUCCESS') {
								localStorage.setItem(
									'token',
									resp.Response.token
								)
								this.setToken()
								this.$router.push('/admin')
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
				} else {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: 'Las contraseñas no coinciden',
						type: 'error'
					})
				}
			}
		},
		...mapMutations(['setToken', 'delToken', 'setConfiguration'])
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
