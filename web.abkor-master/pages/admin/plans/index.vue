<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="plans" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Planes
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar plan" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dPlan', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Plan
						v-dialog(v-model="dPlan.status" scrollable persistent max-width="1000px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text(style="height: 600px")
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="8" lg="8")
													v-row
														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
															v-text-field(v-model.trim="editedPlan.name" prepend-icon="fas fa-signature" label="Nombre del plan" required :error-messages="nameErrors" @input="$v.editedPlan.name.$touch()" @blur="$v.editedPlan.name.$touch()" @keyup.enter="savePlan")
														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
															v-text-field(v-model.trim="editedPlan.price" type="number" prefix="S/ " label="Precio" required :error-messages="priceErrors" @input="$v.editedPlan.price.$touch()" @blur="$v.editedPlan.price.$touch()" @keyup.enter="savePlan")
														v-col(cols="12" xs="12" sm="6" md="6" lg="6")
															v-text-field(v-model.trim="editedPlan.maximum_appointments" type="number" label="Máximo de citas" @keyup.enter="savePlan")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															span Descripción
															Editor.mt-5(v-model="editedPlan.description")
												v-col(cols="12" xs="12" sm="6" md="4" lg="4")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															input(type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked")
															v-card
																v-tooltip(bottom v-if="editedPlan.photos.length > 0")
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='delFile' style="top: -20px")
																			v-icon fas fa-trash
																	span Eliminar Imagen
																v-tooltip(bottom)
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='pickFile' style="left: 50px; top: -20px")
																			v-icon fas fa-plus
																	span Agregar Imagen
																v-carousel(v-model="editedPhoto" height="200" v-if="editedPlan.photos.length > 0")
																	v-carousel-item(v-for="(photo, i) in editedPlan.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
																v-carousel(height="200" v-else hide-delimiters)
																	v-carousel-item(src="/img/without-image.jpg" reverse-transition="fade-transition" transition="fade-transition")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-autocomplete(v-model="editedPlan.includes" :items="services" prepend-icon="fas fa-tag" :search-input.sync="searchTag" hide-selected label="Añade todo lo que el plan incluye" multiple persistent-hint small-chips item-text="name" item-value="_id" return-object required :error-messages="includesErrors" @input="$v.editedPlan.includes.$touch()" @blur="$v.editedPlan.includes.$touch()")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-text-field(v-model.trim="editedPlan.duration" type="number" min="2" max="99" prepend-icon="fas fa-calendar-day" label="Duración en días" required :error-messages="durationErrors" @input="$v.editedPlan.duration.$touch()" @blur="$v.editedPlan.duration.$touch()" @keyup.enter="toggleDialog('dPlan', false, savePlan)")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-select(v-model="editedPlan.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedPlan.inactive.$touch()" @blur="$v.editedPlan.inactive.$touch()" @keyup.enter="toggleDialog('dPlan', false, savePlan)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dPlan', false, () => {})") Cancelar
									v-btn(text @click="savePlan" :loading="dPlan.loading" :disabled="dPlan.loading") Guardar
				template(v-slot:item.includes="{ item }")
					span {{ includesPlan(item) }}
				template(v-slot:item.duration="{ item }")
					span {{ item.duration }} Días
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dPlan', true, editPlan(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deletePlan(item)")
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
					v-btn(text color="primary" @click="dConfirm.event_cancel") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import {
	required,
	maxLength,
	minValue,
	maxValue,
	decimal,
	numeric
} from 'vuelidate/lib/validators'
import Editor from '@/components/Editor'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		Editor
	},
	validations: {
		editedPlan: {
			name: { required, maxLength: maxLength(150) },
			includes: { required },
			duration: {
				required,
				numeric,
				minValue: minValue(2),
				maxValue: maxValue(99)
			},
			price: { required, decimal, minValue: minValue(0) },
			inactive: { required }
		}
	},
	data() {
		return {
			plans: [],
			states: [],
			services: [],
			typeAdditionalsAmount: [],
			intervals: [],
			headers: [
				{
					text: 'Nombre plan',
					value: 'name',
					width: '150px'
				},
				{
					text: 'Incluye',
					value: 'includes',
					width: '150px'
				},
				{
					text: 'Duración',
					value: 'duration',
					width: '150px'
				},
				{
					text: 'precio',
					value: 'price',
					width: '150px'
				},
				{
					text: 'Creado por',
					value: 'create_by',
					width: '150px'
				},
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
				{
					text: 'Estado',
					value: 'inactive',
					width: '150px'
				},
				{
					text: 'Acción',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			],
			search: '',
			searchTag: '',
			editedPhoto: null,
			dPlan: {
				status: false,
				loading: false
			},
			editedPlan: {
				name: '',
				photos: [],
				includes: [],
				duration: 0,
				price: 0,
				maximum_appointments: 0,
				description: '',
				inactive: false
			},
			defaultPlan: {
				name: '',
				photos: [],
				includes: [],
				duration: 0,
				price: 0,
				maximum_appointments: 0,
				description: '',
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
			methods: null
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo plan' : 'Editar plan'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedPlan.name.$dirty) return errors
			!this.$v.editedPlan.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedPlan.name.maxLength &&
				errors.push('Solo puede contener hasta 150 caracteres!')
			return errors
		},
		includesErrors() {
			const errors = []
			if (!this.$v.editedPlan.includes.$dirty) return errors
			!this.$v.editedPlan.includes.required &&
				errors.push('Se requiere las inclusiones!')
			return errors
		},
		durationErrors() {
			const errors = []
			if (!this.$v.editedPlan.duration.$dirty) return errors
			!this.$v.editedPlan.duration.required &&
				errors.push('Se requiere la duración!')
			!this.$v.editedPlan.duration.numeric &&
				errors.push('Debe ser un numero válido!')
			!this.$v.editedPlan.duration.minValue &&
				errors.push('Debe ser mayor o igual a 2!')
			!this.$v.editedPlan.duration.maxValue &&
				errors.push('Debe ser menor o igual a 99!')
			return errors
		},
		priceErrors() {
			const errors = []
			if (!this.$v.editedPlan.price.$dirty) return errors
			!this.$v.editedPlan.price.required &&
				errors.push('Se requiere el precio!')
			!this.$v.editedPlan.price.decimal &&
				errors.push('Debe ser un numero válido!')
			!this.$v.editedPlan.price.minValue &&
				errors.push('Debe ser un precio mayor a 0!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedPlan.inactive.$dirty) return errors
			!this.$v.editedPlan.inactive.required &&
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
			this.getPlans()
			this.getStates()
			this.getServices()
			this.getIntervals()
			this.getTypeAdditionalsAmount()
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
						command: 'GET_SERVICES',
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
		getPlans() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo planes...'
			this.methods
				.requestApi(
					'/api/plan/',
					'GET',
					{
						command: 'GET_PLANS'
					},
					{},
					'/account/auth/sign-in'
				)
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
					{},
					'/account/auth/sign-in'
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
		editPlan(item) {
			this.editedIndex = this.plans.indexOf(item)
			this.editedPlan = Object.assign({}, item)
		},
		deletePlan(item) {
			this.editedIndex = this.plans.indexOf(item)
			this.editedPlan = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este plan?'
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
						`/api/plan/${this.editedPlan._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_PLAN'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.plans.splice(this.editedIndex, 1)
							this.methods.setHistory({
								origin: 'PLANS',
								title: 'Eliminación de Plan',
								content: `Se ha eliminado el Plan: ${this.editedPlan.name}`,
								module: 'ADMIN',
								color: 'indigo'
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
		savePlan() {
			this.$v.editedPlan.$touch()
			if (!this.$v.editedPlan.$invalid) {
				this.dPlan.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_PLAN'
					pmethod = 'PATCH'
					puri = `/api/plan/${this.editedPlan._id}`
				} else {
					pcommand = 'REGISTER_PLAN'
					pmethod = 'POST'
					puri = '/api/plan/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedPlan
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dPlan.status = false
						this.dPlan.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.plans[this.editedIndex],
									this.editedPlan
								)
							} else {
								const plan = resp.Response
								this.plans.push(plan)
								this.methods.setHistory({
									origin: 'PLANS',
									title: 'Creación de Plan',
									content: `Se ha creado el plan: ${this.editedPlan.name}`,
									module: 'ADMIN',
									color: 'indigo'
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
						this.dPlan.status = false
						this.dPlan.loading = false
						this.message({
							title: 'Error',
							message: err,
							type: 'error'
						})
					})
			}
		},
		resetForm() {
			this.editedPlan = this.methods.clonex(this.defaultPlan)
			this.editedIndex = -1
			this.editedPhoto = null
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.$reset()
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
			this.editedPlan.photos.splice(this.editedPhoto, 1)
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
					this.editedPlan.photos.push(fr.result)
					this.editedPhoto = -1
					setTimeout(() => {
						this.editedPhoto = this.editedPlan.photos.length - 1
					}, 300)
				})
			}
		},
		/* nameInterval(code) {
			let value = ''
			this.intervals.forEach((interval) => {
				if (interval.value1 === code) {
					value = interval.value2
				}
			})
			return value
		}, */
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
