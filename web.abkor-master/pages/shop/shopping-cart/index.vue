<template lang="pug">
	v-card.ma-5
		v-card-text
			v-layout(row wrap)
				v-flex(xs12)
					v-toolbar(flat color="white")
						v-toolbar-title.title Carrito de Compra
						v-divider.mx-4(inset vertical)
						v-spacer
						h3 Subtotal: S/ {{ shopping_cart.total_price }}
						v-btn.ml-10(:disabled="shopping_cart.total_items <= 0" to="/shop/process-sale") Comprar
					v-container.ma-3(fluid grid-list-lg)
						v-layout(row wrap)
							v-flex(xs12)
								v-data-iterator(:items="shoppingCart" items-per-page.sync="4" no-data-text="No hay productos en el carrito")
									template(v-slot:default="props")
										v-row
											v-col(cols="12" xs="12" sm="6" md="4" lg="3" v-for="item in shoppingCart" :key="item._id")
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-card
															v-carousel(width="150" height="150" cycle)
																v-carousel-item(v-for="(photo, i) in item.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
															v-card-title(style="height: 80px")
																span.subtitle-1.font-weight-bold {{ item.name }}
															v-card-text
																v-row(align="center")
																	v-col(cols="6" xs="6" sm="6" md="6" lg="6")
																		span.font-weight-black S/ {{ item.price * item.quantity }} PEN
																	v-col(cols="6" xs="6" sm="6" md="6" lg="6")
																		v-text-field(v-model="item.quantity" label="Cantidad" type="number" @input="setQuantity(item)" @blur="setQuantity(item)")
															v-card-actions
																v-spacer
																v-tooltip(bottom)
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" icon @click="removeProduct(item)") #[v-icon(color="primary") fas fa-trash]
																	span Quitar
</template>
<style>
.gu-toolbar-category .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'main',
	data() {
		return {
			ndCategories: false,
			item: 0,
			dLoading: {
				status: false,
				message: ''
			},
			editedIndex: -1,
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
				quantity: 0,
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
				quantity: 0,
				inactive: false
			},
			headers: [
				{ text: 'Producto', value: 'product', width: '150px' },
				{ text: 'Precio', value: 'price' },
				{ text: 'Cantidad', value: 'quantity' },
				{ text: 'Subtotal', value: 'subtotal' },
				{ text: 'Acción', value: 'action', sortable: false }
			]
		}
	},
	computed: {
		shoppingCart() {
			return Object.assign({}, this.shopping_cart).data
		},
		...mapState(['shopping_cart'])
	},
	watch: {},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
		},
		addQuantity(item) {
			this.editedIndex = this.shoppingCart.indexOf(item)
			this.editedProduct = this.methods.clonex(item)
			this.editedProduct.quantity++
			setTimeout(() => {
				this.setQuantity(this.editedProduct)
			}, 300)
		},
		deleteQuantity(item) {
			this.editedIndex = this.shoppingCart.indexOf(item)
			this.editedProduct = this.methods.clonex(item)
			this.editedProduct.quantity--
			setTimeout(() => {
				this.setQuantity(this.editedProduct)
			}, 300)
		},
		...mapMutations(['removeProduct', 'setQuantity'])
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
