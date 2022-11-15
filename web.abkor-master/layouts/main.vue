<template lang="pug">
	v-app(id="inspire")
		v-main
			v-app-bar(app)
				v-app-bar-nav-icon.d-flex.d-sm-none(@click="drawer = !drawer")
				v-toolbar-title.hidden-xs-only
					v-btn(text to="/" style="height: 100%" dark)
						v-img(:src="configuration.company.logo" width="180px")
				v-spacer
				v-autocomplete.pt-6(v-model="modelProduct" rounded :loading="isLoadingSearch" :items="products" :search-input.sync="searchProduct" hide-no-data hide-selected label="Que libro busca?" return-object cache-items solo-inverted)
				v-spacer
				v-toolbar-items
					v-menu(v-model="mShoppingCart" :close-on-content-click="false" :nudge-width="200" offset-y)
						template(v-slot:activator="{ on }")
							v-btn.ml-3(text v-on="on" icon)
								v-badge.align-self-center(color="primary" overlap)
									template(v-slot:badge)
										span {{ totalItems }}
									v-icon fas fa-shopping-cart
						v-card(width="400" scrollable)
							v-card-text(v-if="shoppingCart.length > 0" style="max-height: 300px")
								v-list(three-line style="max-height: 290px; overflow-y: auto;")
									v-subheader Productos
									template(v-for="(product, index) in shoppingCart")
										v-list-item
											v-list-item-avatar(v-if="product.photos.length > 0" :key="product._id")
												v-img(:src="product.photos[0]")
											v-list-item-avatar(v-else :key="product._id")
											v-list-item-content
												v-list-item-title(v-html="product.name")
												v-list-item-subtitle {{ product.quantity }} x #[span.font-weight-black S/ {{ calcPriceProduct(product) }} PEN]
											v-list-item-icon
												v-btn(icon)
													v-icon(@click="removeProduct(product)") fas fa-trash
										v-divider(inset)
							v-card-text(v-else)
								span No hay nada en el carrito
							v-card-actions(v-if="shoppingCart.length > 0")
								v-row
									v-col(cols="12" xs="12" sm="12" md="12" lg="12")
										span Total: #[span.font-weight-black S/ {{ totalOrder() }} PEN]
									v-col(cols="12" xs="12" sm="12" md="12" lg="12")
										//-GERAL
										v-btn(color="black" class="white--text" block to="/shop/process-sale" @click="closeSummary") Finalizar pedido
									v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12")
										a(style="text-decoration: underline;" @click="changePage('/shop/shopping-cart', () => { mShoppingCart = false })") Ver carrito
					v-menu(v-if="token !== null" v-model="mAlert" :close-on-content-click="false" :nudge-width="200" offset-y)
						template(v-slot:activator="{ on }")
							v-btn.ml-3(text v-on="on" icon)
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
										v-btn(block @click="mAlert = false") cerrar
					v-btn(v-if="token === null" text icon to="account/auth/sign-in")
						v-icon fas fa-user
					v-menu(v-model="mprofile" v-else nudge-width="200" offset-y :close-on-content-click="false")
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
								v-btn(color="primary" text to="/account" small) Mi cuenta
								v-btn(text @click="logout()" small) Cerrar Sesión
			nuxt
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
		v-footer(height="auto" padless)
			v-card.flex.text-center
				v-card-text
					v-spacer
					v-btn.mx-3(v-for="(item,index) in listSocial" :key="index" icon :href="configuration.company.social[item]" target="_blank")
						v-icon {{'fab fa-'+item}}
				v-card-actions.justify-center
					| &copy;{{ getYear() }} {{ getNameCompany() }}. Todos los derechos Reservados
</template>
<style>
.mini-toastr {
	font-family: 'Roboto', sans-serif;
}
.spacer {
	margin-top: 10px;
}
.mini-toastr__notification {
	-webkit-transition: width 2s !important; /* Safari prior 6.1 */
	transition: width 2s !important;
}
</style>

<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	components: {
		Util
	},
	data() {
		return {
			tab: null,
			mini: false,
			drawer: false,
			modelProduct: null,
			mShoppingCart: false,
			mAlert: false,
			searchProduct: '',
			isLoadingSearch: false,
			products: [],
			alerts: [],
			dLoading: {
				status: false,
				message: ''
			},
			mprofile: false,
			user: {
				photo: '',
				name: '',
				email: '',
				password: '',
				notifications: true,
				entity: 'GETUP',
				profile: 'USR',
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
			}
		}
	},
	computed: {
		shoppingCart() {
			return this.shopping_cart.data
		},
		totalItems() {
			return parseInt(this.shopping_cart.total_items)
		},
		listSocial() {
			return Object.keys(this.configuration.company.social || {})
		},
		...mapState(['token', 'shopping_cart', 'profile', 'configuration'])
	},
	watch: {
		profile(val) {
			this.user = this.methods.clonex(val)
		},
		searchProduct(val) {
			this.setFilterMain(val)
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			if (this.token !== null) {
				this.getProfile()
			}
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
						this.setProfile(this.user)
						if (!this.user.profile) {
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
		logout() {
			this.delToken()
			this.user = Object.assign({}, this.defaultUser)
			this.$router.replace('/')
		},
		totalOrder() {
			let total = 0
			this.shoppingCart.forEach((product) => {
				total += this.calcPriceProduct(product)
			})
			return total
		},
		changePage(page, event) {
			this.$router.push(page)
			if (event) {
				event()
			}
		},
		closeSummary() {
			this.mShoppingCart = false
		},
		calcPriceProduct(item) {
			const price = item.price
			let total = price
			item.variants.forEach((variant) => {
				variant.selection = variant.selection ? variant.selection : 0
				const option = variant.options[variant.selection]
				if (variant.options.length <= 0) {
					return total
				}
				if (option.type_additional === '%') {
					if (
						option.additional_amount === null ||
						option.additional_amount === ''
					) {
						option.additional_amount = 0
					}
					const addPrice =
						(item.price * parseFloat(option.additional_amount)) /
						100
					total += addPrice
				} else {
					total += parseFloat(option.additional_amount)
				}
			})
			return total
		},
		valueProfile(val) {
			return 'Usuario'
		},
		redirectTo(path) {
			this.$router.push('/')
		},
		getYear() {
			const date = new Date()
			const year = date.getFullYear()
			return year
		},
		getNameCompany() {
			return this.configuration.company.name.toUpperCase()
		},
		...mapMutations([
			'setToken',
			'removeProduct',
			'delToken',
			'setProfile',
			'setConfiguration',
			'setFilterMain'
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
