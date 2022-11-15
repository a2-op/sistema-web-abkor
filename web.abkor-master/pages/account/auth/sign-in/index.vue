<template lang="pug">
	div
		v-card.elevation-12
			v-toolbar
				v-toolbar-title
					img.mb-6(:src="configuration.company.logo" style="width: 250px;")
				v-spacer
			v-card-text(style="padding: 0px; min-height: 500px")
				v-form(v-on:submit.prevent)
					v-tabs(v-model="user.tab" grow centered slider-color="white" dark background-color="primary")
						v-tab(href="#tab-signin" @click="resetForm") Acceder
						v-tab(href="#tab-signup" @click="resetForm") Registrarse
					v-container
						v-layout(column align-center)
							v-tabs-items(v-model="user.tab")
								v-tab-item(value="tab-signin")
									v-flex.mt-5(xs12)
										v-text-field(v-model.trim="user.email" type="email" autocomplete="username" label="Correo electronico" prepend-icon="fas fa-envelope" solo required :error-messages="emailErrors" @input="$v.user.email.$touch()" @blur="$v.user.email.$touch()" @keyup.enter="login()")
										v-text-field(v-model.trim="user.password" :append-icon="showlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showlogin = !showlogin" label="Contraseña" autocomplete="current-password" prepend-icon="fas fa-lock" :type="showlogin ? 'text' : 'password'" solo required :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" @keyup.enter="login()")
									v-layout(row wrap)
										v-flex.text-center(xs12)
											span.caption
												a.color-link(href="#" @click="toggleDialog('dRecover', true, resetForm)") ¿Tienes problemas para iniciar sesión?
										v-flex.text-center(xs12)
											span.caption
												a.color-link(href="/admin/auth/sign-in") Soy administrador
									v-btn.mb-5.mt-5(color="primary" dark block rounded small @click="login()") Iniciar Sesión
									v-divider
									v-flex.text-center(xs12)
										span.caption ó
									v-divider
									v-btn.mt-3(color="blue darken-3" dark block @click="loginFB" rounded small) Conectar con Facebook
										v-icon(right dark) fab fa-facebook
									div.mt-3(ref="btnGoogle" id="btnGoogle")
										v-btn(color="red lighten-1" dark block rounded small @click="") Conectar con Google
											v-icon(right dark) fab fa-google-plus
										.spacer
									v-flex.text-center(xs12)
										#getup-signin2
								v-tab-item(value="tab-signup")
									v-flex.mt-5(xs12)
										v-text-field(v-model.trim="user.name" label="Nombres" prepend-icon="fas fa-user" solo :error-messages="nameErrors" @input="$v.user.name.$touch()" @blur="$v.user.name.$touch()" required @keyup.enter="register()")
										v-text-field(v-model.trim="user.email" type="email" label="Correo electronico" autocomplete="email" prepend-icon="fas fa-envelope" solo :error-messages="emailErrors" @input="$v.user.email.$touch()" @blur="$v.user.email.$touch()" required @keyup.enter="register()")
										v-text-field(v-model.trim="user.password" :append-icon="showregister ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showregister = !showregister" :type="showregister ? 'text' : 'password'" label="Contraseña" autocomplete="new-password" prepend-icon="fas fa-lock" solo :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" required @keyup.enter="register()")
										v-text-field(v-model.trim="user.repassword" :append-icon="showregister2 ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showregister2 = !showregister2" :type="showregister2 ? 'text' : 'password'" label="Repetir contraseña" autocomplete="new-password" prepend-icon="fas fa-lock" solo :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" required @keyup.enter="register()")
									v-divider
									v-flex.text-center(xs12)
										span.caption Al hacer clic en Registrarse, indicas que has leído y aceptas los Términos del servicio y la Política de privacidad.
									v-divider
									v-btn(dark block rounded small @click="register()") Registrarse
		v-dialog(v-model="dRecover" persistent width="600")
			v-card
				v-card-title.headline.grey.lighten-2(primary-title) Recuperar contraseña
				v-card-text
					v-text-field(v-model.trim="recover.email" label="email" type="email" required :error-messages="recoverErrors" @input="$v.recover.email.$touch()" @blur="$v.recover.email.$touch()" @keyup.enter="toggleDialog('dRecover', false, sendLinkRecover)")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="toggleDialog('dRecover', false)" small) Cancelar
					v-btn(text @click="toggleDialog('dRecover', false, sendLinkRecover)" small) Aceptar
</template>
<style scoped>
a.color-link {
	color: #727272 !important;
}
</style>
<script>
import {
	required,
	requiredIf,
	email,
	maxLength
} from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'centered',
	name: 'SignIn',
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
		user: {
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
			value: this.model,
			FB: null,
			gapi: null,
			user: {
				photo: '',
				name: '',
				email: '',
				password: '',
				repassword: '',
				entity: 'GETUP',
				profile: 'USR',
				reference: '',
				tab: 'tab-signin'
			},
			defaultUser: {
				photo: '',
				name: '',
				email: '',
				password: '',
				repassword: '',
				entity: 'GETUP',
				profile: 'USR',
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
			dLoading: {
				status: false,
				message: ''
			},
			clientGoogleID:
				'856750831124-7g61ng3b90hl8k7ltmcbeq0tngq43vot.apps.googleusercontent.com',
			googleUser: {},
			routes: [],
			auth2: null,
			showlogin: false,
			showregister: false,
			showregister2: false,
			dRecover: false,
			methods: null
		}
	},
	head() {
		return {
			meta: [
				{
					name: 'google-signin-client_id',
					content: this.clientGoogleID
				}
			]
		}
	},
	computed: {
		nameErrors() {
			const errors = []
			if (!this.$v.user.name.$dirty) return errors
			!this.$v.user.name.required && errors.push('Se requiere el nombre!')
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
		...mapState(['token', 'profile', 'configuration'])
	},
	mounted() {
		this.$initFbSDK()
		this.FB = window.FB
		this.gapi = window.gapi
		this.init()
	},
	methods: {
		init() {
			this.startGoogle()
			this.methods = new Util(this)
			this.setToken()
			if (this.token !== null) {
				this.getProfile()
			}
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
		startGoogle() {
			this.gapi.load('auth2', () => {
				this.auth2 = this.gapi.auth2.init({
					client_id: this.clientGoogleID,
					cookiepolicy: 'single_host_origin'
				})
				this.attachSigninGoogle(this.$refs.btnGoogle)
			})
		},
		attachSigninGoogle(element) {
			this.auth2.attachClickHandler(
				element,
				{},
				this.onSuccess,
				this.onFailure
			)
		},
		onSuccess(googleUser) {
			const profile = googleUser.getBasicProfile()
			this.methods
				.requestApi(
					'/api/access/',
					'POST',
					{},
					{
						command: 'REGISTER',
						transaction: {
							photo: profile.getImageUrl(),
							name: profile.getName(),
							email: profile.getEmail(),
							entity: 'GOOGLE',
							profile: this.user.profile,
							reference: profile.getId()
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						localStorage.setItem('token', resp.Response.token)
						this.setToken()
						this.getProfile()
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
		onFailure(error) {
			console.log(error)
		},
		loginFB() {
			this.dLoading.status = true
			this.dLoading.message = 'Accediendo con facebook...'
			this.FB.getLoginStatus((response) => {
				this.dLoading.status = false
				if (response.status === this.status.unknown) {
					this.FB.login(
						(resp) => {
							if (resp.status === this.status.connected) {
								this.getProfileFB()
							}
						},
						{ scope: 'public_profile, email' }
					)
				} else {
					this.getProfileFB()
				}
			})
		},
		login() {
			this.$v.user.$touch()
			if (!this.$v.user.$invalid) {
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
							this.getProfile()
							this.$router.replace('/')
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
		register() {
			this.$v.user.$touch()
			if (!this.$v.user.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando nueva cuenta...'
				if (this.user.password === this.user.repassword) {
					this.methods
						.requestApi(
							'/api/access/',
							'POST',
							{},
							{
								command: 'REGISTER',
								transaction: {
									photo: this.user.photo,
									name: this.user.name,
									email: this.user.email,
									password: this.user.password,
									entity: 'GETUP',
									profile: this.user.profile
								}
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
								this.getProfile()
								this.methods.setHistory({
									origin: 'CLIENTS',
									title: 'Creación de Clientes',
									content: `último registro ${this.user.name}`,
									module: 'ADMIN',
									color: 'green'
								})
								this.$router.replace('/')
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
		getProfileFB() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo información...'
			this.FB.api(
				'/me?fields=id,name,email,picture.type(large)',
				(userData) => {
					userData.photo = userData.picture.data.url
					userData.entity = 'FACEBOOK'
					userData.profile = this.user.profile
					userData.reference = userData.id
					this.dLoading.status = false
					this.methods
						.requestApi(
							'/api/access/',
							'POST',
							{},
							{
								command: 'REGISTER',
								transaction: userData
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
								this.getProfile()
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
			)
		},
		getProfile() {
			// Se obtiene el perfil del usuario
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo información...'
			this.methods
				.requestApi('/api/user/', 'GET', {
					command: 'GET_PROFILE'
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.user = Object.assign({}, resp.Response)
						this.routes = this.user.permissions
						this.setProfile(this.methods.clonex(this.user))
						if (this.user.profile) {
							this.$router.push('/account')
						} else {
							this.logout()
						}
					} else if (resp.status === 'ERROR') {
						this.logout()
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
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog] = state
			event()
		},
		sendLinkRecover() {
			this.$v.recover.$touch()
			if (!this.$v.recover.$invalid) {
				// Se envia un link de recuperación al correo ingresado
				this.dLoading.status = true
				this.dLoading.message = 'Enviando link de recuperación...'
				this.methods
					.requestApi(
						'/api/access/',
						'POST',
						{},
						{
							command: 'RECOVER_PASSWORD',
							transaction: {
								email: this.recover.email,
								profile: 'USR'
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.message({
								title: 'Excelente',
								message:
									'Se ha enviado un link de recuperación a su email',
								type: 'success'
							})
						}
						this.recover.email = ''
						this.resetForm()
					})
					.catch((err) => {
						this.dLoading.status = false
						this.message({
							title: 'Error',
							message: err,
							type: 'error'
						})
						this.recover.email = ''
						this.resetForm()
					})
			}
		},
		resetForm() {
			this.$v.$reset()
		},
		logout() {
			this.delToken()
			this.user = Object.assign({}, this.defaultUser)
			this.resetForm()
			this.$router.replace('/')
		},
		...mapMutations([
			'setToken',
			'delToken',
			'setProfile',
			'setConfiguration'
		])
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
