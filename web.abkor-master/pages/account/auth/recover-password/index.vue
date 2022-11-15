<template lang="pug">
	div
		v-card.elevation-12
			v-toolbar(color='primary', dark='', flat='')
				v-toolbar-title
					img.mb-6(:src="configuration.company.logo" style="width: 250px;")
				v-spacer
			v-card-text
				v-form
					v-text-field#password(v-model.trim="user.password" :append-icon="showlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showlogin = !showlogin" label='Nueva Contraseña', name='password', prepend-icon='fas fa-lock', :type="showlogin ? 'text' : 'password'" required :error-messages="passwordErrors" @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" @keyup.enter="restorePassword()")
					v-text-field#repassword(v-model.trim="user.repassword" :append-icon="reshowlogin ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="reshowlogin = !reshowlogin" label='Repetir Contraseña', name='repassword', prepend-icon='fas fa-lock', :type="reshowlogin ? 'text' : 'password'" required :error-messages="repasswordErrors" @input="$v.user.repassword.$touch()" @blur="$v.user.repassword.$touch()" @keyup.enter="restorePassword()")
			v-card-actions
				v-spacer
				v-btn(color='primary', block, @click="restorePassword()") Restaurar contraseña
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'centered',
	validations: {
		user: {
			password: { required, minLength: minLength(6) },
			repassword: { required, minLength: minLength(6) }
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
				password: '',
				repassword: ''
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
		passwordErrors() {
			const errors = []
			if (!this.$v.user.password.$dirty) return errors
			!this.$v.user.password.required &&
				errors.push('Se requiere la nueva contraseña!')
			!this.$v.user.password.minLength &&
				errors.push('Debe tener un  minimo de 6 digitos!')
			return errors
		},
		repasswordErrors() {
			const errors = []
			if (!this.$v.user.repassword.$dirty) return errors
			!this.$v.user.repassword.required &&
				errors.push('Se requiere repetir la contraseña!')
			!this.$v.user.repassword.minLength &&
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
			this.validateToken()
		},
		validateToken() {
			this.setToken(this.$route.query.token)
			this.methods
				.requestApi('/api/user/', 'GET', {
					command: 'VALIDATE_TOKEN'
				})
				.then(() => {
					this.dLoading.status = false
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
					this.$router.replace('/')
				})
			this.delToken()
		},
		restorePassword() {
			this.$v.$touch()
			if (!this.$v.$invalid) {
				this.setToken(this.$route.query.token)
				this.dLoading.status = true
				this.dLoading.message = 'Restaurando Contraseña...'
				this.methods
					.requestApi(
						'/api/user/',
						'POST',
						{},
						{
							command: 'RESTORE_PASSWORD',
							transaction: this.user
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
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
				this.delToken()
			}
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
