<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="products" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Productos
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar producto" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dProduct', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Producto
						v-dialog(v-model="dProduct.status" scrollable persistent max-width="1000px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text(style="max-height: 600px")
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="8" lg="8")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-text-field(v-model.trim="editedProduct.name" prepend-icon="fas fa-signature" label="Nombre del producto" required :error-messages="nameErrors" @input="$v.editedProduct.name.$touch()" @blur="$v.editedProduct.name.$touch()" @keyup.enter="saveProduct")
														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
															v-text-field(v-model.trim="editedProduct.stock" type="number" prepend-icon="fas fa-clipboard-list" label="Existencias" required :error-messages="stockErrors" @input="$v.editedProduct.stock.$touch()" @blur="$v.editedProduct.stock.$touch()" @keyup.enter="saveProduct")
														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
															v-text-field(v-model.trim="editedProduct.price" type="number" prefix="S/ " label="Precio unitario" required :error-messages="priceErrors" @input="$v.editedProduct.price.$touch()" @blur="$v.editedProduct.price.$touch()" @keyup.enter="saveProduct")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															span Descripción
															Editor.mt-5(v-model="editedProduct.description")
												v-col(cols="12" xs="12" sm="6" md="4" lg="4")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															input(type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked")
															v-card
																v-tooltip(bottom v-if="editedProduct.photos.length > 0")
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='delFile' style="top: -20px")
																			v-icon fas fa-trash
																	span Eliminar Imagen
																v-tooltip(bottom)
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='pickFile' style="left: 50px; top: -20px")
																			v-icon fas fa-plus
																	span Agregar Imagen
																v-carousel(v-model="editedPhoto" height="200" v-if="editedProduct.photos.length > 0")
																	v-carousel-item(v-for="(photo, i) in editedProduct.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
																v-carousel(height="200" v-else hide-delimiters)
																	v-carousel-item(src="/img/without-image.jpg" reverse-transition="fade-transition" transition="fade-transition")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															CategoriesAutocomplete(v-model.trim="editedProduct.category" prepend-icon="fas fa-signature" label="Nombre de la Categoria" required :error-messages="categoryErrors" @input="$v.editedProduct.category.$touch()" @blur="$v.editedProduct.category.$touch()" @keyup.enter="saveProduct")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-combobox(v-model="editedProduct.tags" :items="tags" :search-input.sync="searchTag" hide-selected label="Añade etiquetas al producto" multiple persistent-hint small-chips)
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															StateAutocomplete(v-model="editedProduct.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedProduct.inactive.$touch()" @blur="$v.editedProduct.inactive.$touch()" @keyup.enter="saveProduct")
											v-row.mt-12
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-data-table.elevation-1(:headers="headersVariants" :items="editedProduct.variants" :search="searchVariant")
														template(v-slot:top)
															v-toolbar(flat color="white")
																v-toolbar-title Variantes
																v-divider(class="mx-4" inset vertical)
																v-spacer
																v-text-field(v-model="searchVariant" append-icon="fas fa-search" label="Buscar variante" single-line hide-details)
																v-spacer
																v-tooltip(bottom)
																	template(v-slot:activator="{ on }")
																		v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dVariant', true, resetFormVariant)") #[v-icon fas fa-plus]
																	span Nueva variante
																v-dialog(v-model="dVariant.status" persistent scrollable max-width="800px")
																	v-card
																		v-card-title.headline.grey.lighten-2(primary-title) {{ formTitleVariant }}
																		v-card-text(style="max-height: 600px")
																			v-container
																				v-row
																					v-col(cols="12" xs="12" sm="6" md="8" lg="8")
																						v-text-field(v-model.trim="editedVariant.name" prepend-icon="fas fa-signature" label="Nombre de la variante" required :error-messages="variantNameErrors" @input="$v.editedVariant.name.$touch()" @blur="$v.editedVariant.name.$touch()" @keyup.enter="saveVariant")
																					v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																						StateAutocomplete(v-model="editedVariant.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="variantInactiveErrors" @input="$v.editedVariant.inactive.$touch()" @blur="$v.editedVariant.inactive.$touch()" @keyup.enter="saveVariant")
																					v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																						v-data-table.elevation-1(:headers="headersOptions" :items="editedVariant.options")
																							template(v-slot:top)
																								v-toolbar(flat color="white")
																									v-toolbar-title Opciones
																									v-divider.mx-4(inset vertical)
																									v-spacer
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dOption', true, resetFormOption)") #[v-icon fas fa-plus]
																										span Nueva opcion
																									v-dialog(v-model="dOption.status" persistent max-width="500px")
																										template(v-slot:activator="{ on }")
																										v-card
																											v-card-title.headline.grey.lighten-2(primary-title) {{ formTitleOption }}
																											v-card-text
																												v-container
																													v-row
																														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																															v-text-field(v-model.trim="editedOption.name" prepend-icon="fas fa-signature" label="Nombre de la opción" required :error-messages="optionNameErrors" @input="$v.editedOption.name.$touch()" @blur="$v.editedOption.name.$touch()" @keyup.enter="saveOption")
																														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																															v-text-field(v-model.trim="editedOption.additional_amount" type="number" prepend-icon="fas fa-money-bill" label="Monto Adicional" required :error-messages="optionAdditionalAmountErrors" @input="$v.editedOption.additional_amount.$touch()" @blur="$v.editedOption.additional_amount.$touch()" @keyup.enter="saveOption")
																														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																															v-select(v-model="editedOption.type_additional" :items="typeAdditionalsAmount" prepend-icon="fas fa-funnel-dollar" label="Tipo de adicional" item-text="value1" item-value="value2" required :error-messages="optionTypeAdditionalErrors" @input="$v.editedOption.type_additional.$touch()" @blur="$v.editedOption.type_additional.$touch()" @keyup.enter="saveOption")
																														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																															StateAutocomplete(v-model="editedOption.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="optionInactiveErrors" @input="$v.editedOption.inactive.$touch()" @blur="$v.editedOption.inactive.$touch()" @keyup.enter="saveOption")
																											v-divider
																											v-card-actions
																												v-spacer
																												v-btn(text @click="toggleDialog('dOption', false, () => {})" color="primary") Cancelar
																												v-btn(text @click="saveOption" :loading="dOption.loading" :disabled="dOption.loading") Guardar
																							template(v-slot:item.inactive="{ item }")
																								v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
																							template(v-slot:item.action="{ item }")
																								v-tooltip(bottom)
																									template(v-slot:activator="{ on }")
																										v-btn(icon small v-on="on" @click="toggleDialog('dOption', true, editOption(item))")
																											v-icon fas fa-edit
																									span Editar
																								v-tooltip(bottom)
																									template(v-slot:activator="{ on }")
																										v-btn(icon small v-on="on" @click="deleteOption(item)")
																											v-icon fas fa-trash
																									span Eliminar
																		v-divider
																		v-card-actions
																			v-spacer
																			v-btn(text @click="toggleDialog('dVariant', false, () => {})" color="primary") Cancelar
																			v-btn(text @click="saveVariant" :loading="dVariant.loading" :disabled="dVariant.loading") Guardar
														template(v-slot:item.options="{ item }")
															| {{ item.options.length }}
														template(v-slot:item.inactive="{ item }")
															v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
														template(v-slot:item.action="{ item }")
															v-tooltip(bottom)
																template(v-slot:activator="{ on }")
																	v-btn(icon small v-on="on" @click="toggleDialog('dVariant', true, editVariant(item))")
																		v-icon fas fa-edit
																span Editar
															v-tooltip(bottom)
																template(v-slot:activator="{ on }")
																	v-btn(icon small v-on="on" @click="deleteVariant(item)")
																		v-icon fas fa-trash
																span Eliminar
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dProduct', false, () => {})" color="primary") Cancelar
									v-btn(text @click="saveProduct" :loading="dProduct.loading" :disabled="dProduct.loading") Guardar
				template(v-slot:item.variants="{ item }")
					| {{ item.variants.length }}
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dProduct', true, editProduct(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteProduct(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.modified_by="{ item }")
					| {{ item.modified_by ? item.modified_by.name : '' }}
				template(v-slot:item.modified_at="{ item }")
					| {{ item.modified_at ? item.modified_at.substring(0, 10) : '' }}
				template(v-slot:item.inactive="{ item }")
					v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
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
					v-btn(text @click="dConfirm.event_cancel" color="primary") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import {
	required,
	maxLength,
	minValue,
	decimal,
	numeric
} from 'vuelidate/lib/validators'
import Editor from '@/components/Editor'
import CategoriesAutocomplete from '@/components/admin/categories/autocomplete'
import StateAutocomplete from '@/components/global/states/autocomplete'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		CategoriesAutocomplete,
		StateAutocomplete,
		Editor
	},
	validations: {
		editedProduct: {
			name: { required, maxLength: maxLength(250) },
			category: { required },
			stock: { required, numeric, minValue: minValue(0) },
			price: { required, decimal, minValue: minValue(0) },
			inactive: { required }
		},
		editedVariant: {
			name: { required, maxLength: maxLength(250) },
			inactive: { required }
		},
		editedOption: {
			name: { required, maxLength: maxLength(250) },
			additional_amount: { required, decimal, minValue: minValue(0) },
			type_additional: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			products: [],
			states: [],
			typeAdditionalsAmount: [],
			tags: [],
			headers: [
				{ text: 'Nombre producto', value: 'name', width: '300px' },
				{ text: 'Categoria', value: 'category.name', width: '150px' },
				{ text: 'Cant. Tags', value: 'tags', width: '150px' },
				{ text: 'Cant. Variantes', value: 'variants', width: '150px' },
				{ text: 'Stock', value: 'stock', width: '150px' },
				{ text: 'Creado por', value: 'create_by', width: '150px' },
				{
					text: 'Fecha de creación',
					value: 'create_at',
					width: '150px'
				},
				{
					text: 'Modificado por',
					value: 'modified_by',
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
			headersVariants: [
				{ text: 'Nombre Variante', value: 'name' },
				{
					text: 'Cant. alternativas',
					value: 'options'
				},
				{ text: 'Estado', value: 'inactive' },
				{
					text: 'Acción',
					value: 'action',
					sortable: false
				}
			],
			headersOptions: [
				{ text: 'Nombre Opción', value: 'name' },
				{
					text: 'Monto adicional',
					value: 'additional_amount'
				},
				{
					text: 'Tipo de adicional',
					value: 'type_additional'
				},
				{ text: 'Estado', value: 'inactive' },
				{
					text: 'Acción',
					value: 'action',
					sortable: false
				}
			],
			search: '',
			searchVariant: '',
			searchTag: null,
			editedPhoto: null,
			dProduct: {
				status: false,
				loading: false
			},
			dVariant: {
				status: false,
				loading: false
			},
			dOption: {
				status: false,
				loading: false
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
			editedVariant: {
				name: '',
				options: [],
				inactive: false
			},
			defaultVariant: {
				name: '',
				options: [],
				inactive: false
			},
			editedOption: {
				name: '',
				additional_amount: 0,
				type_additional: null,
				inactive: false
			},
			defaultOption: {
				name: '',
				additional_amount: 0,
				type_additional: null,
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
			editedIndexVariant: -1,
			editedIndexOption: -1,
			sizeImage: 5120,
			methods: null
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1
				? 'Nuevo producto'
				: 'Editar producto'
		},
		formTitleVariant() {
			return this.editedIndexVariant === -1
				? 'Nueva variante'
				: 'Editar variante'
		},
		formTitleOption() {
			return this.editedIndexOption === -1
				? 'Nueva opción'
				: 'Editar opción'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedProduct.name.$dirty) return errors
			!this.$v.editedProduct.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedProduct.name.maxLength &&
				errors.push('Solo puede contener hasta 250 caracteres!')
			return errors
		},
		categoryErrors() {
			const errors = []
			if (!this.$v.editedProduct.category.$dirty) return errors
			!this.$v.editedProduct.category.required &&
				errors.push('Se requiere la categoria!')
			return errors
		},
		stockErrors() {
			const errors = []
			if (!this.$v.editedProduct.stock.$dirty) return errors
			!this.$v.editedProduct.stock.required &&
				errors.push('Se requiere el stock!')
			!this.$v.editedProduct.stock.minValue &&
				errors.push('El stock debe ser mayor o igual 0!')
			!this.$v.editedProduct.stock.numeric &&
				errors.push('El stock debe ser un numero!')
			return errors
		},
		priceErrors() {
			const errors = []
			if (!this.$v.editedProduct.price.$dirty) return errors
			!this.$v.editedProduct.price.required &&
				errors.push('Se requiere el precio!')
			!this.$v.editedProduct.price.minValue &&
				errors.push('El precio debe ser mayor o igual a 0!')
			!this.$v.editedProduct.price.decimal &&
				errors.push('El precio debe ser un numero!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedProduct.inactive.$dirty) return errors
			!this.$v.editedProduct.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		// Variants
		variantNameErrors() {
			const errors = []
			if (!this.$v.editedVariant.name.$dirty) return errors
			!this.$v.editedVariant.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedVariant.name.maxLength &&
				errors.push('Solo puede contener hasta 250 caracteres!')
			return errors
		},
		variantInactiveErrors() {
			const errors = []
			if (!this.$v.editedVariant.inactive.$dirty) return errors
			!this.$v.editedVariant.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		// Options
		optionNameErrors() {
			const errors = []
			if (!this.$v.editedOption.name.$dirty) return errors
			!this.$v.editedOption.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedOption.name.maxLength &&
				errors.push('Solo puede contener hasta 250 caracteres!')
			return errors
		},
		optionAdditionalAmountErrors() {
			const errors = []
			if (!this.$v.editedOption.additional_amount.$dirty) return errors
			!this.$v.editedOption.additional_amount.required &&
				errors.push('Se requiere el monto adicional!')
			!this.$v.editedOption.additional_amount.decimal &&
				errors.push('El monto adicional debe ser un número!')
			!this.$v.editedOption.additional_amount.minValue &&
				errors.push('El monto adicional debe ser mayor o igual a 0!')
			return errors
		},
		optionTypeAdditionalErrors() {
			const errors = []
			!this.$v.editedOption.type_additional.required &&
				errors.push('Se requiere el tipo monto adicional!')
			return errors
		},
		optionInactiveErrors() {
			const errors = []
			if (!this.$v.editedOption.inactive.$dirty) return errors
			!this.$v.editedOption.inactive.required &&
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
			this.getProducts()
			this.getTypeAdditionalsAmount()
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
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.products = resp.Response
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
		getTypeAdditionalsAmount() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo tipos de monto adicional...'
			this.methods
				.requestApi('/api/master/', 'GET', {
					command: 'GET_MASTER',
					transaction: {
						code: 'TYPEADDAMOUNT'
					}
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.typeAdditionalsAmount = resp.Response
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
		editProduct(item) {
			this.editedIndex = this.products.indexOf(item)
			this.editedProduct = Object.assign({}, item)
		},
		editVariant(item) {
			this.editedIndexVariant = this.editedProduct.variants.indexOf(item)
			this.editedVariant = Object.assign({}, item)
		},
		editOption(item) {
			this.editedIndexOption = this.editedVariant.options.indexOf(item)
			this.editedOption = Object.assign({}, item)
		},
		deleteProduct(item) {
			this.editedIndex = this.products.indexOf(item)
			this.editedProduct = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este producto?'
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
						`/api/product/${this.editedProduct._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_PRODUCT'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.products.splice(this.editedIndex, 1)
							this.methods.setHistory({
								origin: 'PRODUCTS',
								title: 'Eliminación de Producto',
								content: `Se ha eliminado el producto: ${this.editedProduct.name}`,
								module: 'ADMIN',
								color: 'red lighten-1'
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
		deleteVariant(item) {
			this.editedIndexVariant = this.editedProduct.variants.indexOf(item)
			this.editedVariant = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta variante?'
			this.dConfirm.message =
				'Tip: Recuerde que tambien puede inhabilitar los registros'
			this.dConfirm.event_cancel = () => {
				this.resetFormVariant()
			}
			this.dConfirm.event_accept = () => {
				this.dConfirm.status = false
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				this.editedProduct.variants.splice(this.editedIndexVariant, 1)
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la información del producto',
					type: 'warn'
				})
				this.resetFormVariant()
			}
		},
		deleteOption(item) {
			this.editedIndexOption = this.editedProduct.variants.indexOf(item)
			this.editedOption = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta opción?'
			this.dConfirm.message =
				'Tip: Recuerde que tambien puede inhabilitar los registros'
			this.dConfirm.event_cancel = () => {
				this.resetFormOption()
			}
			this.dConfirm.event_accept = () => {
				this.dConfirm.status = false
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				this.editedVariant.options.splice(this.editedIndexOption, 1)
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la información del producto',
					type: 'warn'
				})
				this.resetFormOption()
			}
		},
		saveProduct() {
			this.$v.editedProduct.$touch()
			if (!this.$v.editedProduct.$invalid) {
				this.dProduct.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_PRODUCT'
					pmethod = 'PATCH'
					puri = `/api/product/${this.editedProduct._id}`
				} else {
					pcommand = 'REGISTER_PRODUCT'
					pmethod = 'POST'
					puri = '/api/product/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedProduct
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dProduct.status = false
						this.dProduct.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.products[this.editedIndex],
									this.editedProduct
								)
							} else {
								const product = resp.Response
								this.products.push(product)
								this.methods.setHistory({
									origin: 'PRODUCTS',
									title: 'Creación de Producto',
									content: `Se ha creado el producto ${this.editedProduct.name}`,
									module: 'ADMIN',
									color: 'red lighten-1'
								})
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
		saveVariant() {
			this.$v.editedVariant.$touch()
			if (!this.$v.editedVariant.$invalid) {
				this.dVariant.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				if (this.editedIndexVariant !== -1) {
					Object.assign(
						this.editedProduct.variants[this.editedIndexVariant],
						this.editedVariant
					)
				} else {
					this.editedProduct.variants.push(this.editedVariant)
				}
				this.dLoading.status = false
				this.dVariant.status = false
				this.dVariant.loading = false
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la información del producto',
					type: 'warn'
				})
			}
		},
		saveOption() {
			this.$v.editedOption.$touch()
			if (!this.$v.editedOption.$invalid) {
				this.dOption.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				if (this.editedIndexOption !== -1) {
					Object.assign(
						this.editedVariant.options[this.editedIndexOption],
						this.editedOption
					)
				} else {
					this.editedVariant.options.push(this.editedOption)
				}
				this.dLoading.status = false
				this.dOption.status = false
				this.dOption.loading = false
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la información del producto',
					type: 'warn'
				})
			}
		},
		resetForm() {
			this.editedProduct = this.methods.clonex(this.defaultProduct)
			this.editedIndex = -1
			this.editedPhoto = null
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.resetFormVariant()
			this.resetFormOption()
			this.$v.$reset()
		},
		resetFormVariant() {
			this.editedVariant = this.methods.clonex(this.defaultVariant)
			this.editedIndexVariant = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.resetFormOption()
			this.$v.editedVariant.$reset()
		},
		resetFormOption() {
			this.editedOption = this.methods.clonex(this.defaultOption)
			this.editedIndexOption = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.editedOption.$reset()
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		pickFile() {
			this.$refs.image.click()
		},
		delFile() {
			this.editedProduct.photos.splice(this.editedPhoto, 1)
		},
		onFilePicked(e) {
			const files = e.target.files
			if (files[0] !== undefined) {
				const fileSize = files[0].size
				const sizekiloByte = parseInt(fileSize / 1024)
				if (sizekiloByte > this.sizeImage) {
					this.message({
						title: 'Atención!',
						message:
							'El tamaño de la imagen es demasiado grande (Max: 5MB)',
						type: 'warning'
					})
					return
				}
				const imageName = files[0].name
				if (imageName.lastIndexOf('.') <= 0) {
					this.message({
						title: 'Atención!',
						message:
							'El archivo no cuenta con una extensión de imagen',
						type: 'warning'
					})
					return
				}
				const fr = new FileReader()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.editedProduct.photos.push(fr.result)
					this.editedPhoto = -1
					setTimeout(() => {
						this.editedPhoto = this.editedProduct.photos.length - 1
					}, 300)
				})
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
