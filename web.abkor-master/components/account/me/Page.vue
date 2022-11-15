<template lang="pug">
	v-layout.ma-3(row wrap)
		v-container(fluid grid-list-lg)
			v-flex(xs12)
				v-card
					v-card-title
						v-toolbar(flat color="white")
							v-toolbar-title Mi cuenta
							v-divider.mx-4(inset vertical)
							v-spacer
							v-btn.mb-2(dark rounded @click="saveProfile" small) Guardar
							v-btn.mb-2.ml-2(rounded @click="dChangePassword = true" small) Cambiar Contraseña
					v-card-text
						v-container(fluid)
							v-layout(row wrap)
								v-flex(xs12)
									v-layout(row)
										v-flex(xs12 sm6 md4 lg4)
											v-card(v-if="myplan" color="primary" dark style="height: 100%")
												.d-flex.flex-no-wrap.justify-space-between
													div
														v-card-title(v-text="myplan.name")
														v-card-text(style="min-height: 60px;")
															span Duración: {{ myplan.duration }} dias
															br
															span Precio: S/ {{ parseFloat(myplan.price).toFixed(2) }}
														v-card-subtitle
															v-btn(text @click="dManagePlan = true" small) Gestionar Plan
													v-avatar.ma-3(size="60" tile)
														v-img(:src="myplan.photos[0]")
										v-flex(xs12 sm6 md4 lg4)
											v-card(v-if="myplan" color="primary" dark style="height: 100%")
												.d-flex.flex-no-wrap.justify-space-between
													div
														v-card-title.headline Historial Clinico
														v-card-text(style="min-height: 60px;")
															span Revisa y actualiza tu información medica
														v-card-actions
															v-btn(text @click="dNutricionalHistory = true" small) Ver historial
										v-flex(xs12 sm6 md4 lg4)
											v-card(v-if="myplan" color="primary" dark style="height: 100%")
												.d-flex.flex-no-wrap.justify-space-between
													div
														v-card-title.headline Agendar citas
														v-card-text(style="min-height: 60px;")
															span Agendar una cita con alguno de nuestros nutricionistas
														v-card-actions
															v-btn(text @click="dMedicalAppointments = true" small) Agendar cita
								v-flex(xs12 sm4 md2 lg2)
									v-img(:src="userPhoto")
									v-file-input(v-model="photo" :rules="rules" hide-details single-line accept="image/png, image/jpeg, image/bmp" prepend-icon="fas fa-pen" label="Avatar")
										template(v-slot:selection="{ index, text }")
											v-chip(v-if="index < 2" dark label small) {{ text }}
								v-flex(xs10)
									v-layout(row wrap)
										v-flex(xs12 sm6)
											v-text-field(v-model="profile._id" label="ID de Usuario" prepend-icon="fas fa-id-badge" disabled readonly)
										v-flex(xs12 sm6)
											v-text-field(v-model="profile.email" label="Email" prepend-icon="fas fa-envelope" value="acaicedoporras@gmail.com" disabled readonly)
										v-flex(xs12 sm6)
											v-text-field(v-model="profile.name" label="Nombre completo" prepend-icon="fas fa-user" required :error-messages="nameErrors" @input="$v.profile.name.$touch()" @blur="$v.profile.name.$touch()")
										v-flex(xs12 sm6)
											v-layout(row wrap)
												v-flex.mt-5(xs2)
													span Genero
												v-flex(xs10)
													v-radio-group(v-model="profile.gender" row)
														v-radio(label="Hombre" value="M")
														v-radio(label="Mujer" value="F")
								v-flex(xs12 sm6 md4)
									v-menu(v-model="birthday" ref="birthday" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px")
										template(v-slot:activator="{ on }")
											v-text-field(v-model="profile.birthday" label="Fecha de nacimiento" v-mask="mask" prepend-icon="fas fa-calendar-week" readonly v-on="on")
										v-date-picker(ref="picker" v-model="profile.birthday" locale="es-PE" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="saveBirthday")
								v-flex(xs12 sm6 md4)
									v-text-field(v-model.trim="profile.document" label="Documento" prepend-icon="fas fa-id-card" required :error-messages="documentErrors" @input="$v.profile.document.$touch()" @blur="$v.profile.document.$touch()")
								v-flex(xs12 sm6 md4)
									v-text-field(v-model.trim="profile.phone" label="Movil" prepend-icon="fas fa-mobile" :error-messages="phoneErrors" @input="$v.profile.phone.$touch()" @blur="$v.profile.phone.$touch()")
								v-flex(xs12 sm6 md4)
									v-combobox(v-model="profile.allergies" :items="supplies" :search-input.sync="searchTag" @change="changeInputAllergies" hide-selected label="Añade Alergias" item-text="name" item-value="_id" return-object prepend-icon="fas fa-allergies" multiple persistent-hint small-chips)
								v-flex(xs12 sm6 md4)
									v-text-field(v-model.trim="profile.occupation" label="Ocupación" prepend-icon="fas fa-user-md")
								v-flex(xs12)
									v-chip(label text-color="white") #[v-icon(left) fsa fa-tag] Direcciones de entrega
								v-flex(xs12)
									v-dialog(v-model="dAddress" scrollable persistent max-width="800")
										template(v-slot:activator="{ on }")
											v-btn(dark v-on="on" @click="openDialog" rounded small) Agregar
										v-card
											v-card-title.headline.grey.lighten-2(primary-title) {{ formTitleAddress }}
											v-card-text(style="height: 600px")
												v-container(grid-list-xl)
													v-layout(row wrap)
														v-flex(xs12)
															v-btn(small @click="useMyInfo()") Usar mis datos
														v-flex(xs12 sm6 md6 lg4)
															v-text-field(v-model.trim="address.name" label="Nombre completo" prepend-icon="fas fa-user" required :error-messages="addressNameErrors" @input="$v.address.name.$touch()" @blur="$v.address.name.$touch()")
														v-flex(xs12 sm6 md6 lg4)
															v-text-field(v-model.trim="address.mobile" label="Movil" prepend-icon="fas fa-mobile")
														v-flex(xs12 sm12 md12 lg4)
															v-text-field(v-model.trim="address.address" label="Dirección" prepend-icon="fas fa-address-card" required :error-messages="addressAddressErrors" @input="$v.address.address.$touch()" @blur="$v.address.address.$touch()")
														v-flex(xs12 sm12 md6 lg6)
															v-text-field(v-model.trim="address.reference" label="Referencia" prepend-icon="fas fa-info")
														v-flex(xs12 sm12 md6 lg6)
															v-checkbox(v-model="address.principal" label="Dirección Principal" @change="openPrincipalAddress" :disabled="profile.addresses ? profile.addresses.length === 0 : true")
												v-card.pa-4(flat)
													v-toolbar(dense absolute style="top: 10px; left: 25%;" width="60%")
														v-text-field(v-model.trim="addressMap" ref="address" id="address" placeholder="Ubica tu dirección en el mapa" hide-details prepend-icon="fas fa-search" single-line)
													v-card-text(style="min-height: 300px")
														div(ref="mapGoogle" id="mapGoogle" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;")
											v-divider
											v-card-actions
												v-spacer
												v-btn(color="primary" text @click="closeDAddress") Cancelar
												v-btn(text @click="saveAddress") Guardar
									v-data-table(:headers="headDirections" :items="profile.addresses")
										template(v-slot:item.action="{ item }")
											v-icon.mr-2(small @click="editAddress(item)") fas fa-pen
											v-icon.mr-2(small @click="deleteAddress(item)") fas fa-trash-alt
		v-dialog(v-model="dChangePassword" max-width="290")
			v-card
				v-card-title.headline.grey.lighten-2(primary-title) Cambiar Contraseña
				v-card-text
					v-container
						v-layout(row wrap)
							v-flex(xs12)
								v-text-field(v-model.trim="password.password" :append-icon="showoldpassword ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showoldpassword = !showoldpassword" prepend-icon="fas fa-lock" label="Contraseña actual" :type="showoldpassword ? 'text' : 'password'" required :error-messages="passwordPasswordErrors" @input="$v.password.password.$touch()" @blur="$v.password.password.$touch()")
							v-flex(xs12)
								v-text-field(v-model.trim="password.newPassword" :append-icon="shownewpassword ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="shownewpassword = !shownewpassword" prepend-icon="fas fa-user-lock" label="Nueva contraseña" :type="shownewpassword ? 'text' : 'password'" required :error-messages="passwordNewPasswordErrors" @input="$v.password.newPassword.$touch()" @blur="$v.password.newPassword.$touch()")
							v-flex(xs12)
								v-text-field(v-model.trim="password.rePassword" :append-icon="showrepassword ?  'fas fa-eye' : 'fas fa-eye-slash'" @click:append="showrepassword = !showrepassword" prepend-icon="fas fa-user-lock" label="Repetir nueva contraseña" :type="showrepassword ? 'text' : 'password'" required :error-messages="passwordRePasswordErrors" @input="$v.password.rePassword.$touch()" @blur="$v.password.rePassword.$touch()")
				v-divider
				v-card-actions
					v-spacer
					v-btn(color="primary" text @click="closeChangePassword") Cancelar
					v-btn(text @click="savePassword") Guardar
		v-dialog(v-model="dPrincipalAddress" max-width="290")
			v-card
				v-card-title.headline Atención
				v-card-text Al seleccionar esta dirección como principal, si ya habia marcado una se deseleccionara automaticamente priorizando esta nueva dirección
				v-card-actions
					.flex-grow-1
					v-btn(color="blue darken-1" text @click="dPrincipalAddress = false") Aceptar
		v-dialog(v-model="dNutricionalHistory" fullscreen scrollable transition="dialog-bottom-transition" hide-overlay persistent)
			v-card(color="white")
				v-card-title.headline.grey.lighten-2(primary-title) Historial Nutricional
				v-card-text(style="height: 600px")
					NutricionalHistory(v-if="dNutricionalHistory" ref="NutricionalHistory")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="dNutricionalHistory = false") Cerrar
					v-btn(text @click="addMedicalHistory") Guardar
		v-dialog(v-model="dMedicalAppointments" fullscreen scrollable transition="dialog-bottom-transition" hide-overlay persistent)
			v-card(tile)
				v-toolbar(flat dark color="grey lighten-2")
					v-btn(icon dark @click="dMedicalAppointments = false")
						v-icon(class="black--text") mdi-close
					v-toolbar-title.headline(class="black--text") Agendar cita
					v-spacer
					v-toolbar-items
						v-btn(class="black--text" dark text) {{profile.name}} ({{profile.email}})
				v-card-text(style="height: 800px")
					v-container
						Appointment(v-if="dMedicalAppointments" ref="Appointment")
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="dMedicalAppointments = false") Cerrar
		ManagePlanDialog(v-model="dManagePlan")
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import {
	required,
	numeric,
	minLength,
	maxLength
} from 'vuelidate/lib/validators'
import NutricionalHistory from '@/components/account/nutritional-history/Page'
import Appointment from '@/components/account/appointment/Page'
import ManagePlanDialog from '@/components/account/me/plan/ManagePlanDialog'
import Util from '@/assets/js/util'
export default {
	layout: 'main',
	components: {
		NutricionalHistory,
		Appointment,
		ManagePlanDialog
	},
	validations: {
		profile: {
			name: { required },
			document: {
				numeric,
				minLength: minLength(8),
				maxLength: maxLength(8)
			},
			phone: { maxLength: maxLength(10) }
		},
		address: {
			name: { required },
			address: { required }
		},
		password: {
			password: { required },
			newPassword: { required },
			rePassword: { required }
		}
	},
	data() {
		return {
			headDirections: [
				{ text: 'Nombre y Apellido', value: 'name' },
				{ text: 'Móvil', value: 'mobile' },
				{ text: 'Dirección', value: 'address' },
				{ text: 'Referencia', value: 'reference' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			mask: '####-##-##',
			dAddress: false,
			map: null,
			requestMap: {
				query: '',
				fields: ['name', 'geometry']
			},
			infowindow: null,
			serviceMap: null,
			placesMap: [],
			searchMap: null,
			isLoadingMap: false,
			birthday: false,
			date: null,
			google: null,
			geocoder: null,
			markers: [],
			days: [],
			months: [],
			years: [],
			profile: {
				_id: '',
				photo: '',
				email: '',
				name: '',
				gender: '',
				birthday: '',
				document: '',
				phone: '',
				allergies: [],
				occupation: '',
				addresses: []
			},
			editedAddressIndex: -1,
			address: {
				name: '',
				mobile: '',
				address: '',
				reference: '',
				principal: false,
				coordinates: null
			},
			defaultAddress: {
				name: '',
				mobile: '',
				address: '',
				reference: '',
				principal: false,
				coordinates: null
			},
			password: {
				password: '',
				newPassword: '',
				rePassword: ''
			},
			defaultPassword: {
				password: '',
				newPassword: '',
				rePassword: ''
			},
			tmpProfile: {
				photo: ''
			},
			rules: [
				(value) =>
					!value ||
					value.size < 2000000 ||
					'El tamaño de la foto debe ser inferior a 2 MB!'
			],
			dLoading: {
				status: false,
				message: ''
			},
			addressMap: null,
			dChangePassword: false,
			dNutricionalHistory: false,
			dMedicalAppointments: false,
			photo: [],
			methods: null,
			showoldpassword: false,
			shownewpassword: false,
			showrepassword: false,
			dPrincipalAddress: false,
			autocomplete: null,
			searchTag: '',
			supplies: [],
			myplan: null,
			dManagePlan: false
		}
	},
	computed: {
		formTitleAddress() {
			return this.editedAddressIndex === -1
				? 'Agregar Dirección'
				: 'Editar Dirección'
		},
		userPhoto() {
			if (
				this.profile.photo === '' ||
				this.profile.photo === null ||
				this.profile.photo === undefined
			) {
				return '/img/default-user.png'
			} else {
				return this.profile.photo
			}
		},
		nameErrors() {
			const errors = []
			if (!this.$v.profile.name.$dirty) return errors
			!this.$v.profile.name.required &&
				errors.push('Se requiere el nombre!')
			return errors
		},
		documentErrors() {
			const errors = []
			if (!this.$v.profile.document.$dirty) return errors
			!this.$v.profile.document.minLength &&
				errors.push('El nro de documento es de 8 digitos!')
			!this.$v.profile.document.maxLength &&
				errors.push('El nro de documento es de 8 digitos!')
			return errors
		},
		phoneErrors() {
			const errors = []
			if (!this.$v.profile.phone.$dirty) return errors
			!this.$v.profile.phone.maxLength &&
				errors.push('El telefono no puede tener mas de 20 digitos!')
			return errors
		},
		addressNameErrors() {
			const errors = []
			if (!this.$v.address.name.$dirty) return errors
			!this.$v.address.name.required &&
				errors.push('Se requiere el nombre!')
			return errors
		},
		addressAddressErrors() {
			const errors = []
			if (!this.$v.address.address.$dirty) return errors
			!this.$v.address.address.required &&
				errors.push('Se requiere la dirección!')
			return errors
		},
		passwordPasswordErrors() {
			const errors = []
			if (!this.$v.password.password.$dirty) return errors
			!this.$v.password.password.required &&
				errors.push('Se requiere la contraseña actual!')
			return errors
		},
		passwordNewPasswordErrors() {
			const errors = []
			if (!this.$v.password.newPassword.$dirty) return errors
			!this.$v.password.newPassword.required &&
				errors.push('Se requiere la nueva contraseña!')
			return errors
		},
		passwordRePasswordErrors() {
			const errors = []
			if (!this.$v.password.rePassword.$dirty) return errors
			!this.$v.password.rePassword.required &&
				errors.push('Debe repetir la nueva contraseña!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		birthday(val) {
			val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
		},
		photo(val) {
			if (val) {
				const fr = new FileReader()
				fr.readAsDataURL(val)
				fr.addEventListener('load', () => {
					this.profile.photo = fr.result
				})
			} else {
				this.profile.photo = this.tmpProfile.photo
			}
		}
	},
	mounted() {
		this.google = window.google
		this.localStorage = window.localStorage
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.geocoder = new this.google.maps.Geocoder()
			this.getProfile()
			this.getSupplies()
			this.getUserPlan()
		},
		changeInputAllergies() {
			const arr = this.profile.allergies.map((item, i) => {
				const x = typeof item.name === 'undefined' ? item : item.name
				return x
			})
			const unique = [...new Set(arr)]
			this.profile.allergies = unique
		},
		getSupplies() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo Insumos...'
			this.methods
				.requestApi(
					'/api/supply/',
					'GET',
					{
						command: 'GET_SUPPLIES',
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
						this.supplies = resp.Response
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
		getUserPlan() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mi plan...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_USER_PLAN'
					},
					{},
					'/'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'WARNING') {
						this.message({
							title: 'Información',
							message: resp.message,
							type: 'warn'
						})
					} else if (resp.status === 'SUCCESS') {
						this.myplan = resp.Response
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
			this.dLoading.message = 'Obteniendo información...'
			this.dLoading.status = true
			this.methods
				.requestApi('/api/user/', 'GET', {
					command: 'GET_PROFILE'
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.profile = resp.Response
						this.tmpProfile = this.methods.clonex(resp.Response)
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
		startMap(lat = -12.110158934695, lng = -77.022099494934) {
			this.map = new this.google.maps.Map(this.$refs.mapGoogle, {
				center: { lat: -12.110158934695, lng: -77.022099494934 },
				zoom: 13,
				mapTypeId: this.google.maps.MapTypeId.ROADMAP
			})
			this.infowindow = new this.google.maps.InfoWindow()
			this.serviceMap = new this.google.maps.places.PlacesService(
				this.map
			)
			this.autocomplete = new this.google.maps.places.Autocomplete(
				this.$refs.address.$refs.input
			)
			this.google.maps.event.addListener(
				this.autocomplete,
				'place_changed',
				() => {
					this.setMapOnAll(null)
					const nearPlace = this.autocomplete.getPlace()
					if (nearPlace.hasOwnProperty('geometry')) {
						const resp = nearPlace.geometry.location
						const respLat = resp.lat()
						const respLng = resp.lng()
						this.map.setCenter(nearPlace.geometry.location)
						const marker = new this.google.maps.Marker({
							map: this.map,
							position: nearPlace.geometry.location,
							draggable: true,
							title: 'Reubicar'
						})
						this.address.coordinates = {
							latitude: respLat,
							longitude: respLng
						}
						this.markers.push(marker)
						this.addressMap = ''
					}
				}
			)
		},
		openDialog() {
			this.dAddress = true
			if (this.editedAddressIndex === -1) {
				this.address.principal = this.profile.addresses.length === 0
			}
			if (this.map === null) {
				setTimeout(() => {
					this.startMap()
					this.setMapOnAll(null)
				}, 300)
			}
		},
		toLocate() {
			if (this.searchMap === '') {
				this.message({
					title: 'Error',
					message: 'Debe especificar una dirección',
					type: 'error'
				})
				return
			}
			this.dLoading.message = 'Direccionando...'
			this.dLoading.status = true
			this.setMapOnAll(null)
			this.markers = []
			this.geocoder.geocode(
				{ address: this.searchMap },
				(results, status) => {
					this.dLoading.status = false
					if (status === 'OK') {
						const resp = results[0].geometry.location
						const respLat = resp.lat()
						const respLng = resp.lng()
						this.map.setCenter(results[0].geometry.location)
						const marker = new this.google.maps.Marker({
							map: this.map,
							position: results[0].geometry.location,
							draggable: true,
							title: 'Reubicar'
						})
						this.address.coordinates = {
							latitude: respLat,
							longitude: respLng
						}
						this.markers.push(marker)
					} else {
						let msg = ''
						if (status === 'ZERO_RESULTS') {
							msg =
								'No hubo resultados para la dirección ingresada.'
						} else if (
							[
								'OVER_QUERY_LIMIT',
								'REQUEST_DENIED',
								'UNKNOWN_ERROR'
							].includes(status)
						) {
							msg = 'Error general del mapa.'
						} else if (status === 'INVALID_REQUEST') {
							msg = 'Error de la web. Contacte con Name Agency.'
						}
						this.message({
							title: 'Error',
							message: msg,
							type: 'error'
						})
					}
				}
			)
		},
		setMapOnAll(map) {
			for (let i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(map)
			}
		},
		saveBirthday(date) {
			this.$refs.birthday.save(date)
		},
		saveProfile() {
			this.$v.profile.$touch()
			if (!this.$v.profile.$invalid) {
				this.dLoading.message = 'Guardando información...'
				this.dLoading.status = true
				/* GERAL */
				this.profile.allergies.some((item, index) => {
					if (typeof item.name === 'undefined') {
						this.profile.allergies[index] = { name: item }
					}
				})
				/* GERAL */
				this.methods
					.requestApi(
						`/api/user/${this.profile._id}`,
						'PATCH',
						{},
						{
							command: 'UPDATE_PROFILE',
							transaction: this.profile
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
							this.tmpProfile.photo = this.profile.photo
							this.profile = this.methods.clonex(resp.Response)
							if (
								this.profile.birthday &&
								this.profile.birthday.length >= 10
							) {
								this.profile.birthday = this.profile.birthday.substring(
									0,
									10
								)
							}
							this.setProfile(this.methods.clonex(this.profile))
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
		closeDAddress() {
			this.dAddress = false
			setTimeout(() => {
				this.address = Object.assign({}, this.defaultAddress)
				this.editedAddressIndex = -1
			}, 300)
			this.$v.address.$reset()
		},
		saveAddress() {
			this.$v.address.$touch()
			if (!this.$v.address.$invalid) {
				if (!this.address.coordinates) {
					this.message({
						title: 'Error',
						message: 'Se necesita indicar un punto en el mapa',
						type: 'error'
					})
					return
				}
				this.profile.addresses.forEach((element) => {
					element.principal = false
				})
				if (this.editedAddressIndex !== -1) {
					const addresses = this.profile.addresses
					Object.assign(
						addresses[this.editedAddressIndex],
						this.address
					)
					this.message({
						title: 'Info',
						message:
							'No olvide confirmar los cambios con el boton guardar',
						type: 'info'
					})
				} else {
					this.profile.addresses.push(this.address)
				}
				this.closeDAddress()
			}
		},
		editAddress(item) {
			this.editedAddressIndex = this.profile.addresses.indexOf(item)
			this.openDialog()
			this.address = Object.assign({}, item)
			const coordinates = {
				lat: this.address.coordinates.latitude,
				lng: this.address.coordinates.longitude
			}
			if (this.address.coordinates) {
				setTimeout(() => {
					this.map.setCenter(coordinates)
					const marker = new this.google.maps.Marker({
						map: this.map,
						position: coordinates,
						draggable: true,
						title: 'Reubicar'
					})
					this.markers.push(marker)
				}, 300)
			}
		},
		deleteAddress(item) {
			this.profile.addresses.splice(this.editedAddressIndex, 1)
		},
		closeChangePassword() {
			this.dChangePassword = false
			setTimeout(() => {
				this.password = Object.assign({}, this.defaultPassword)
			}, 300)
			this.$v.password.$reset()
		},
		savePassword() {
			this.$v.password.$touch()
			if (!this.$v.password.$invalid) {
				if (
					this.compareValue(
						this.password.newPassword,
						this.password.rePassword
					)
				) {
					this.dLoading.message = 'Actualizando contraseña...'
					this.dLoading.status = true
					this.methods
						.requestApi(
							'/api/user/',
							'PATCH',
							{},
							{
								command: 'UPDATE_PASSWORD',
								transaction: this.password
							}
						)
						.then((resp) => {
							this.dLoading.status = false
							if (resp.status === 'SUCCESS') {
								this.message({
									title: 'Excelente',
									message:
										'Se ha actualizado su contraseña correctamente',
									type: 'success'
								})
							}
							this.closeChangePassword()
						})
						.catch((err) => {
							this.dLoading.status = false
							this.message({
								title: 'Error',
								message: err,
								type: 'error'
							})
							this.closeChangePassword()
						})
				} else {
					this.message({
						title: 'Atención',
						message:
							'La nueva contraseña no coincide con el campo repetir contraseña',
						type: 'warn'
					})
				}
			}
		},
		compareValue(val1, val2) {
			return val1 === val2
		},
		openPrincipalAddress() {
			this.dPrincipalAddress = this.address.principal
		},
		searchPlaces() {
			if (this.searchMap === '') {
				return
			}
			this.placesMap = []
			if (typeof this.searchMap === 'string') {
				this.requestMap.query = this.searchMap
			} else {
				this.requestMap.query = ''
			}
			this.serviceMap.findPlaceFromQuery(
				this.requestMap,
				(results, status) => {
					if (
						status ===
						this.google.maps.places.PlacesServiceStatus.OK
					) {
						for (let i = 0; i < results.length; i++) {
							results[i]._id = i
							this.placesMap.push(results[i])
						}
					}
				}
			)
		},
		useMyInfo() {
			this.address.name = this.profile.name
			this.address.mobile = this.profile.phone
		},
		addMedicalHistory() {
			this.$refs.NutricionalHistory.addMedicalHistory()
		},
		...mapMutations(['setProfile'])
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
