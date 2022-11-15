<template lang="pug">
	v-app(id="inspire")
		v-navigation-drawer(v-model="drawer" v-if="user.profile !== 'USR'" app :mini-variant.sync="mini" width="280")
			v-list-item(dark style="background-color: #000000;")
				img(:src="configuration.company.logo" width="200px")
				v-btn(icon @click.stop="mini = !mini" small)
					v-icon fas fa-chevron-left
			v-divider
			v-list(dense)
				template(v-for="(route, index) in routes")
					v-list-item(v-if="route.path != '#' && route.profile === user.profile" :to="route.path" :key="index")
						v-list-item-action
							v-icon {{ route.icon }}
						v-list-item-content
							v-list-item-title {{ route.name }}
					v-list-group(v-else-if="route.profile === user.profile" v-model="route.active" :prepend-icon="route.icon" no-action)
						template(v-slot:activator)
							v-list-item-content
								v-list-item-title(v-text="route.name")
						v-list-item(v-for="(children, i) in route.children" :key="i" :to="children.path")
							v-list-item-icon
								v-icon {{ children.icon }}
							v-list-item-content
								v-list-item-title {{ children.name }}
		v-main
			v-app-bar(app)
				v-app-bar-nav-icon(@click="drawer = !drawer" v-if="user.profile !== 'USR'")
				v-toolbar-title.hidden-xs-only
					nuxt-link(v-if="user.profile !== 'USR'" to="/admin" style="text-decoration: none; color: #FFFFFF;") Dashboard
					nuxt-link(v-else to="/account" style="text-decoration: none;") Dashboard
				v-spacer
				v-toolbar-items
					v-menu(v-model="mAlert" :close-on-content-click="false" :nudge-width="200" offset-y)
						template(v-slot:activator="{ on }")
							v-btn.ml-3(text v-on="on" icon small)
								v-badge.align-self-center(overlap color="primary")
									template(v-slot:badge)
										span {{ alerts.length }}
									v-icon fas fa-bell
						v-card(width="400" scrollable)
							v-card-text(v-if="alerts.length > 0" style="max-height: 300px")
								v-list(three-line style="max-height: 290px; overflow-y: auto;")
									v-subheader Notificaciones
									template(v-for="(alert, index) in alerts")
										v-list-item
											v-list-item-avatar(v-if="alert.icon" :key="alert._id")
												v-icon(:color="alert.icon === 'fas fa-times' ? 'red' : alert.icon === 'fas fa-exclamation-triangle' ? 'orange' : 'aqua'") {{ alert.icon }}
											v-list-item-avatar(v-else :key="alert._id")
											v-list-item-content
												v-list-item-title {{ alert.title }}
												v-list-item-subtitle(v-html="alert.content")
										v-divider(inset)
							v-card-text(v-else)
								span No existe notificaciones
							v-card-actions(v-if="alerts.length > 0")
								v-row
									v-col(cols="12" xs="12" sm="12" md="12" lg="12")
										v-btn(block @click="mAlert = false" small) cerrar
					v-menu(v-model="mprofile" nudge-width="200" offset-y :close-on-content-click="false")
						template(v-slot:activator="{ on }")
							v-btn.ml-3(text v-on="on" icon @click="")
								v-avatar
									template(v-if="user.photo !== '' && user.photo")
										img(:src="user.photo" :alt="user.name")
									template(v-else)
										v-icon fas fa-user
						v-card
							v-list
								v-list-item
									v-list-item-avatar
										template(v-if="user.photo !== '' && user.photo")
											img(:src="user.photo" :alt="user.name")
										template(v-else)
											v-icon fas fa-user
									v-list-item-content
										v-list-item-title {{ user.name }}
										v-list-item-subtitle {{ valueProfile(user.profile) }}
							v-divider
							v-list
								v-list-item
									v-list-item-action
										v-switch(v-model="user.notifications" @change="saveProfile()")
									v-list-item-title Habilitar Notificaciones
							v-card-actions
								v-spacer
								v-btn(color="primary" text to="/" small) Inicio
								v-btn(text @click="logout()" small) Cerrar Sesión
			nuxt
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
		template(v-if="user.profile === 'USR'")
			v-btn.mx-2(bottom fixed fab dark large color="primary" style="bottom: 3%; z-index: 9999999; left: 50%; transform: translateX(-50%)" to="/account/me" small)
					v-icon(dark) fas fa-user
			v-bottom-navigation(v-model="routesNav" grow color="primary" app)
				template(v-for="(route, index) in routes")
					v-btn(:value="route.path" :to="route.path" small)
						span {{ route.name }}
						v-icon {{ route.icon }}
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	data() {
		return {
			mini: false,
			drawer: true,
			mprofile: false,
			fav: true,
			hints: true,
			mAlert: false,
			routes: [],
			routesNav: 'None',
			dLoading: {
				status: false,
				message: ''
			},
			user: {
				photo: '',
				name: '',
				email: '',
				password: '',
				notifications: true,
				entity: 'GETUP',
				profile: 'ADM',
				reference: ''
			},
			defaultUser: {
				photo: '',
				name: '',
				email: '',
				password: '',
				notifications: true,
				entity: 'GETUP',
				profile: 'ADM',
				reference: ''
			},
			profiles: [],
			methods: null,
			alerts: []
		}
	},
	computed: {
		...mapState(['token', 'configuration'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getProfile()
			this.getAlerts()
			this.getConfigurations()
		},
		getAlerts() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Alertas...'
			this.methods
				.requestApi('/api/alert/', 'GET', {
					command: 'GET_ALERTS_CURRENT'
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response.length > 0) {
							this.alerts = resp.Response
						}
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
					{},
					'/account/auth/sign-in'
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
		getProfile() {
			// Se obtiene el perfil del usuario
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo información...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_PROFILE'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.user = Object.assign({}, resp.Response)
						this.routes = this.user.permissions
						if (!this.user.profile) {
							this.logout()
							return
						}
						this.getProfiles()
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
		saveProfile() {
			this.dLoading.message = 'Guardando información...'
			this.dLoading.status = true
			this.methods
				.requestApi(
					`/api/user/${this.user._id}`,
					'PATCH',
					{},
					{
						command: 'UPDATE_PROFILE',
						transaction: this.user
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.message({
							title: 'Excelente',
							message:
								'Se ha actualizado su información correctamente',
							type: 'success'
						})
						this.setProfile(this.methods.clonex(this.user))
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
		getProfiles() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo tipos de perfiles...'
			this.methods
				.requestApi(
					'/api/master/',
					'GET',
					{
						command: 'GET_MASTER',
						transaction: {
							code: 'PROFILE'
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.profiles = resp.Response
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
		logout() {
			this.delToken()
			this.user = Object.assign({}, this.defaultUser)
			if (this.user.profile === 'USR') {
				this.$router.replace('/account/auth/sign-in')
			} else {
				this.$router.replace('/account/auth/sign-in')
			}
		},
		valueProfile(val) {
			const idx = this.profiles
				.map((e) => {
					return e.value1
				})
				.indexOf(val)
			return idx === -1 ? '' : this.profiles[idx].value2
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
