<template lang="pug">
	v-layout(row wrap)
		v-flex(xs12 v-if="filter_main === ''")
			v-carousel
				v-carousel-item(v-for="(slide, i) in this.configuration.personalization.carousel" :key="i" :src="slide")
			v-toolbar(dense)
				v-spacer
				v-toolbar-items
					v-btn(@click="filterCategory({ _id: 'plans', name: 'Planes' })" text v-if="plansFiltered.length > 0" small) Planes
					v-btn(v-for="(category, i) in categories" :key="category._id" @click="filterCategory(category)" text small) {{ category.name }}
				v-spacer
		v-flex(xs12)
			.text-center
				v-chip.ma-2(v-for="(category, i) in filterCategories" :key="category._id" label close @click:close="removeFilter(category)" color="primary") {{ category.name }}
		v-flex(xs12)
			v-container
				v-container(fluid grid-list-lg)
					v-row(align="center" justify="center")
						v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12" v-if="productsFiltered.length <= 0 && plansFiltered.length <= 0")
							v-alert(outlined type="warning" prominent border="left") Ups! No se encontraron planes ni productos
						v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="productsFiltered.length > 0 || plans.length > 0")
							v-layout(row wrap)
								v-flex(xs12 sm6 md3 lg3 v-for="(product, i) in productsFiltered" :key="`${i}-product`")
									v-hover(v-slot:default="{ hover }")
										v-card.mx-auto(:class="`elevation-${hover ? 12 : 2}`")
											v-carousel(height="150" cycle hide-delimiters :show-arrows="false")
												v-carousel-item(v-for="(photo, i) in product.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
													v-expand-transition
														.d-flex.transition-fast-in-fast-out.secondary.darken-2.v-card--reveal.display-3.white--text(v-if="hover" style="height: 100%") S/ {{ calcPriceProduct(product) }}
											v-card-text.pt-6(style="position: relative")
												v-tooltip(bottom)
													template(v-slot:activator="{ on }")
														v-btn(v-on="on" absolute color="primary" class="white--text" fab large right top @click="addToShoppingCart(product)" :disabled="product.stock <= 0")
															v-icon fas fa-shopping-cart
													span Añadir al carrito
												h3 {{ product.name }}
												v-row(align="center" class="mx-0")
													div.ml-4.grey--text Precio: S/ {{ calcPriceProduct(product) }}
													div.ml-4.grey--text Stock: {{ product.stock }}
												div(v-if="product.tags.length > 0") Incluye: {{ product.tags.toString() }}
											v-divider.mx-4
											v-card-text(v-if="product.stock <= 0")
												v-chip.secondary.accent-4.white--text Agotado
											template(v-if="!variant.inactive" v-for="(variant, index) in product.variants")
												v-card-title.title(:key="index") {{ variant.name }}
												v-card-text
													v-chip-group(v-model="variant.selection" active-class="secondary accent-4 white--text" column)
														template(v-if="!option.inactive" v-for="(option, idx) in variant.options")
															v-chip(:key="idx") {{ option.name }}
											v-card-actions
												v-spacer
												v-btn(text @click="showProduct(product)" color="primary") Ver detalle
								v-flex(xs12 sm6 md3 lg3 v-for="(plan, i) in plansFiltered" :key="plan._id")
									v-hover(v-slot:default="{ hover }")
										v-card.mx-auto(:class="`elevation-${hover ? 12 : 2}`")
											v-carousel(height="150" cycle hide-delimiters :show-arrows="false")
												v-carousel-item(v-for="(photo, i) in plan.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
													v-expand-transition
														.d-flex.transition-fast-in-fast-out.secondary.darken-2.v-card--reveal.display-3.white--text(v-if="hover" style="height: 100%") S/ {{ plan.price }}
											v-card-text.pt-6(style="position: relative")
												v-tooltip(bottom)
													template(v-slot:activator="{ on }")
														v-btn(v-on="on" absolute color="primary" class="white--text" fab large right top @click="buyPlan(plan)")
															v-icon fas fa-check-circle
													span Adquirir Plan
												h3 {{ plan.name }}
												v-row(align="center" class="mx-0")
													div.ml-4.grey--text Precio: S/ {{ plan.price }}
													div.ml-4.grey--text(v-if="plan.includes.length > 0") Incluye: {{ includesPlan(plan) }}
											v-divider.mx-4
											v-card-actions
												v-spacer
												v-tooltip(bottom)
													template(v-slot:activator="{ on }")
														v-btn(text @click="showPlan(plan)" color="primary" small) Ver detalle
													span Vista previa
								v-dialog(v-model="dPlan.status" scrollable persistent width="1000")
									v-card
										v-card-title.headline.grey.lighten-2(primary-title) {{ editedPlan.name }}
										v-card-text(style="max-height: 600px")
											v-container
												v-row
													v-col(cols="12" xs="12" sm="6" md="5" lg="5")
														v-carousel(v-model="editedPhoto" height="300" v-if="editedPlan.photos.length > 0")
															v-carousel-item(v-for="(photo, i) in editedPlan.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
													v-col(cols="12" xs="12" sm="6" md="7" lg="7")
														div(style="height: 300px; overflow-y: auto;")
															span(v-html="editedPlan.description")
													v-col(cols="12" xs="12")
														v-row
															v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12")
																v-row
																	v-col(cols="12" xs="12" sm="6" md="4" lg="4").text-center
																		h3.mt-6 Precio: S/ {{ editedPlan.price }}
																	v-col(cols="12" xs="12" sm="6" md="4" lg="4").text-center
																		v-combobox(v-model="editedPlan.includes" :items="services" item-text="name" item-value="_id" :search-input.sync="searchTag" hide-selected label="Incluye" multiple persistent-hint small-chips readonly)
																	v-col(cols="12" xs="12" sm="6" md="4" lg="4").text-center
																		h3.mt-6 Duración: {{ editedPlan.duration }} {{ nameInterval(editedPlan.interval ? editedPlan.interval : '') }} dias
										v-divider
										v-card-actions
											v-spacer
											v-btn(text @click="closeShowPlan" color="primary" small) Cerrar
											v-btn(text @click="buyPlan(editedPlan)" small) Adquirir Plan
		v-dialog(v-model="dNotice" max-width="600px")
			v-card
				v-fab-transition
					v-btn.mt-8(fab dark absolute top right @click="dNotice = false")
						v-icon fas fa-times
				v-carousel
					v-carousel-item(v-for="(notice, i) in notices" :key="i" :src="notice.photos[0]")
						v-chip.headline.primary.lighten-2.mt-5.ml-5(primary-title) {{ notice.title }}
						v-spacer
						v-divider
						v-row(class="fill-height" align="center" justify="center")
							.display-1.ml-10(style="color: white; justify-content: flex-end;" v-html="notice.description")
		v-dialog(v-model="dProduct.status" scrollable persistent width="1000")
			v-card
				v-card-title.headline.grey.lighten-2(primary-title) {{ editedProduct.name }}
				v-card-text(style="height: 600px")
					v-container
						v-row
							v-col(cols="12" xs="12" sm="6" md="5" lg="5")
								v-carousel(cycle height="300")
									v-carousel-item(v-for="(photo, i) in editedProduct.photos" :key="i" :src="photo" reverse-transition="fade-transition" transition="fade-transition")
							v-col(cols="12" xs="12" sm="6" md="7" lg="7")
								div(style="height: 300px; overflow-y: auto;")
									span(v-html="editedProduct.description")
							v-col(cols="12" xs="12")
								v-row
									v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12")
										v-row
											v-col.text-center(cols="12" xs="12" sm="6" md="4" lg="4")
												h3.mt-6 Precio: S/ {{ calcPriceProduct(editedProduct) }}
											v-col.text-center(cols="12" xs="12" sm="6" md="4" lg="4")
												v-text-field(v-model="editedOrder.quantity" label="Cantidad" type="number" min="1" :max="editedProduct.stock" readonly)
													v-btn.mx-2(slot="append" icon dark small @click="addQuantity")
														v-icon fas fa-plus
													v-btn.mx-2(slot="prepend" icon dark small @click="reduceQuantity")
														v-icon fas fa-minus
											v-col.text-center(cols="12" xs="12" sm="12" md="4" lg="4")
												h3.mt-6 Subtotal: {{ calcPriceProduct(editedProduct) * editedOrder.quantity }}
									v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12")
										template(v-if="!variant.inactive" v-for="(variant, index) in editedProduct.variants")
											span.title(:key="index") {{ variant.name }}
											div
												v-chip-group(v-model="variant.selection" active-class="secondary accent-4 white--text" column)
													template(v-if="!option.inactive" v-for="(option, idx) in variant.options")
														v-chip(:key="idx") {{ option.name }}
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closeShowProduct" color="primary") Cerrar
					v-btn(text @click="addToShoppingCart(editedProduct)" :disabled="editedProduct.stock <= 0") Agregar al carrito
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<style scoped>
.v-card--reveal {
	align-items: center;
	bottom: 0;
	justify-content: center;
	opacity: 0.8;
	position: absolute;
	width: 100%;
}
</style>

<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'main',
	data() {
		return {
			slides: [],
			tags: [],
			categories: [],
			products: [],
			plans: [],
			intervals: [],
			notices: [],
			services: [],
			filterCategories: [],
			noticeTitle: 0,
			dLoading: {
				status: false,
				message: ''
			},
			searchTag: '',
			editedPhoto: null,
			dPlan: {
				status: false,
				title: ''
			},
			editedPlan: {
				name: '',
				duration: '',
				photos: [],
				includes: [],
				variants: [],
				price: 0.0,
				inactive: false
			},
			defaultPlan: {
				name: '',
				duration: '',
				photos: [],
				includes: [],
				variants: [],
				price: 0.0,
				inactive: false
			},
			dProduct: {
				status: false,
				title: ''
			},
			editedProduct: {
				name: '',
				description: '',
				photos: [],
				category: null,
				tags: [],
				variants: [],
				stock: 0,
				price: 0.0,
				inactive: false
			},
			defaultProduct: {
				name: '',
				description: '',
				photos: [],
				category: null,
				tags: [],
				variants: [],
				stock: 0,
				price: 0.0,
				inactive: false
			},
			editedOrder: {
				quantity: 1
			},
			defaultOrder: {
				quantity: 1
			},
			editedIndex: -1,
			dNotice: false,
			methods: null
		}
	},
	computed: {
		productsFiltered() {
			if (this.filterCategories.length <= 0) {
				return this.products.filter(
					(product) =>
						this.filter_main === '' ||
						product.name
							.toLowerCase()
							.includes(this.filter_main.toLowerCase())
				)
			} else {
				return this.products.filter((product) => {
					const idx = this.filterCategories
						.map((e) => {
							return e._id
						})
						.indexOf(product.category._id)
					return (
						(this.filter_main === '' ||
							product.name
								.toLowerCase()
								.includes(this.filter_main.toLowerCase())) &&
						idx !== -1
					)
				})
			}
		},
		plansFiltered() {
			if (this.filterCategories.length <= 0) {
				return this.plans.filter(
					(plan) =>
						this.filter_main === '' ||
						plan.name
							.toLowerCase()
							.includes(this.filter_main.toLowerCase())
				)
			} else {
				const idx = this.filterCategories
					.map((e) => {
						return e._id
					})
					.indexOf('plans')
				return this.plans.filter(
					(plan) =>
						(this.filter_main === '' ||
							plan.name
								.toLowerCase()
								.includes(this.filter_main.toLowerCase())) &&
						idx !== -1
				)
			}
		},
		...mapState([
			'token',
			'shopping_plan',
			'shopping_cart',
			'filter_main',
			'configuration'
		])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getPlans()
			this.getCategories()
			this.getServices()
			this.getProducts()
			this.getIntervals()
			this.getNoticesClient()
		},
		getServices() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo servicios...'
			this.methods
				.requestApi(
					'/api/service/',
					'GET',
					{
						command: 'GET_SERVICES'
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.services = resp.Response
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
		getCategories() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo categorias...'
			this.methods
				.requestApi(
					'/api/category/',
					'GET',
					{
						command: 'GET_CATEGORIES'
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.categories = resp.Response
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
		getProducts() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo productos...'
			this.methods
				.requestApi(
					'/api/product/',
					'GET',
					{
						command: 'GET_PRODUCTS'
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.products = resp.Response
						this.products.forEach((product) => {
							product.variants.forEach((variant) => {
								variant.selection = 0
							})
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
		showProduct(item) {
			this.editedIndex = this.products.indexOf(item)
			this.editedProduct = this.methods.clonex(item)
			this.editedOrder = this.methods.clonex(this.defaultOrder)
			this.dProduct.status = true
			this.dProduct.title = item.name
		},
		getPlans() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo planes...'
			this.methods
				.requestApi('/api/plan/', 'GET', {
					command: 'GET_PLANS',
					transaction: {
						inactive: false
					}
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.plans = resp.Response
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
		getIntervals() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo estados...'
			this.methods
				.requestApi(
					'/api/master/',
					'GET',
					{
						command: 'GET_MASTER',
						transaction: {
							code: 'INTERVAL'
						}
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.intervals = resp.Response
						this.intervals.forEach((interval) => {
							interval.value3 = interval.value3 === '1'
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
		addToShoppingCart(item) {
			this.editedIndex = this.products.indexOf(item)
			this.editedProduct = this.methods.clonex(item)
			this.dProduct.status = false
			this.dLoading.status = true
			this.dLoading.message = 'Agreando producto al carrito'
			const obj = Object.assign(this.editedProduct, this.editedOrder)
			setTimeout(() => {
				this.addProduct(obj)
				this.closeShowProduct()
				this.dLoading.status = false
				this.message({
					title: '',
					message: 'Se añadio el producto al carrito',
					type: 'success'
				})
			}, 300)
		},
		closeShowProduct() {
			this.dProduct.status = false
			this.editedIndex = -1
			this.editedProduct = this.methods.clonex(this.defaultProduct)
			this.editedOrder = this.methods.clonex(this.defaultOrder)
		},
		addQuantity() {
			if (
				this.editedOrder.quantity >= 0 &&
				this.editedOrder.quantity < this.editedProduct.stock
			) {
				this.editedOrder.quantity++
			}
		},
		reduceQuantity() {
			if (this.editedOrder.quantity > 0) {
				this.editedOrder.quantity--
			} else {
				this.editedOrder.quantity = 0
			}
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
		getNoticesClient() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo anuncios...'
			this.methods
				.requestApi(
					'/api/notice/',
					'GET',
					{
						command: 'GET_NOTICES_CLIENT'
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.notices = resp.Response
						if (this.notices.length > 0) {
							this.dNotice = true
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
		showPlan(item) {
			this.editedIndex = this.plans.indexOf(item)
			this.editedPlan = this.methods.clonex(item)
			this.editedOrder = this.methods.clonex(this.defaultOrder)
			this.dPlan.status = true
			this.dPlan.title = item.name
		},
		buyPlan(item) {
			this.editedIndex = this.plans.indexOf(item)
			this.editedPlan = this.methods.clonex(item)
			this.dPlan.status = false
			this.dLoading.status = true
			this.dLoading.message = 'Adquiriendo plan'
			setTimeout(() => {
				const obj = Object.assign(this.editedPlan, this.editedOrder)
				this.addPlan(obj)
				this.closeShowPlan()
				this.dLoading.status = false
			}, 300)

			if (this.token !== null) {
				this.$router.push('/shop/process-plan')
			} else {
				setTimeout(() => {
					this.dLoading.status = false
					this.$router.push('/account/auth/sign-in')
				}, 300)
			}
		},
		closeShowPlan() {
			this.dPlan.status = false
			this.editedIndex = -1
			this.editedPlan = this.methods.clonex(this.defaultPlan)
			this.editedOrder = this.methods.clonex(this.defaultOrder)
		},
		nameInterval(code) {
			let value = ''
			this.intervals.forEach((interval) => {
				if (interval.value1 === code) {
					value = interval.value2
				}
			})
			return value
		},
		includesPlan(plan) {
			let text = ''
			plan.includes.forEach((element, idx) => {
				if (typeof element === 'string') {
					text += `${element} ${
						idx === plan.includes.length - 1 ? '' : ','
					}`
				} else {
					text += `${element.name} ${
						idx === plan.includes.length - 1 ? '' : ','
					}`
				}
			})
			return text
		},
		filterCategory(category) {
			const idx = this.filterCategories
				.map((e) => {
					return e._id
				})
				.indexOf(category._id)
			if (idx === -1) {
				this.filterCategories.push(category)
			}
		},
		removeFilter(category) {
			const idx = this.filterCategories
				.map((e) => {
					return e._id
				})
				.indexOf(category._id)
			if (idx !== -1) {
				this.filterCategories.splice(idx, 1)
			}
		},
		...mapMutations(['setToken', 'delToken', 'addPlan', 'addProduct'])
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
