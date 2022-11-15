<template lang="pug">
	div
		v-card.elevation-12
			v-toolbar(color='primary', dark='', flat='')
				v-toolbar-title
					img.mb-6(:src="configuration.company.logo" style="width: 250px;")
				v-spacer
			v-card-text
				v-form
					v-text-field#user(v-model.trim="user.email" label='Usuario', name='login', prepend-icon='fas fa-user', type='email' required :error-messages="emailErrors" @input="$v.user.email.$touch()" @blur="$v.user.email.$touch()" @keyup.enter="login()")
					v-text-field#password(v-model.trim="user.password" :append-icon="showlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showlogin = !showlogin" label='Contraseña', name='password', prepend-icon='fas fa-lock', :type="showlogin ? 'text' : 'password'" required :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" @keyup.enter="login()")
					v-select(label="Perfil" :items="opts" prepend-icon="fas fa-id-card-alt" v-model="user.profile")
			v-card-actions
				nuxt-link(to='/admin/auth/sign-up') Registrarse
				v-spacer
				v-btn(color='primary', @click="login()") Acceder
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
			email: { required, email },
			password: { required, minLength: minLength(6) },
			profile: { required, minLength: minLength(3) }
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
				email: '',
				password: '',
				entity: 'GETUP',
				profile: 'ADM'
			},
			dLoading: {
				status: false,
				message: ''
			},
			showlogin: false,
			opts: [
				{ text: 'Administrador', value: 'ADM' },
				{ text: 'Nutricionista', value: 'NUT' },
				{ text: 'Producción', value: 'PRO' }
			],
			methods: null
		}
	},
	computed: {
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
		login() {
			this.$v.$touch()
			if (!this.$v.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Accediendo...'
				this.methods
					.requestApi(
						'/api/access/',
						'POST',
						{},
						{
							command: 'LOGIN',
							transaction: this.user
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							localStorage.setItem('token', resp.Response.token)
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
