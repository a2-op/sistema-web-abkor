<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="configurations" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Configuraciones
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar configuración" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dConfiguration', true, resetForm)") #[v-icon fas fa-plus]
							span Nueva Configuración
					v-dialog(v-model="dConfiguration.status" scrollable persistent max-width="1000px")
						v-card
							v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
							v-card-text(style="max-height: 600px")
								v-container
									v-form
										v-row
											v-col(cols="12")
											<!-- GERAL -->
												v-text-field(v-model="editedConfig.name" label="Nombre configuración" prepend-icon="fas fa-signature" required :error-messages="configNameErrors")
											v-col(cols="12")
												v-row
													v-expansion-panels
														v-expansion-panel
															v-expansion-panel-header
																h4 Compañia
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																		v-file-input(v-model="valueImages" :rules="rules" accept="image/png, image/jpeg, image/bmp" placeholder="Seleccione un logo" label="Logo compañia" prepend-icon="fas fa-camera")
																		v-img(:src="editedConfig.company.logo" width="100%" height="150")
																	v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																		v-text-field(v-model="editedConfig.company.name" label="Nombre compañia" prepend-icon="fas fa-signature")
																	

																	v-col(cols="12" )
																		v-row
																			v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																				v-select(v-model="selectedListSocial" :items="listSocial"  chips filled multiple label="Agregar Redes sociales")
																			v-col(cols="12" xs="12" sm="6" md="6" lg="6" v-for="(item,index) in selectedListSocial" :key="index")
																				v-text-field(style="text-transform: capitalize;" v-model="editedConfig.company.social[item]" :label="item" :prepend-icon="'fab fa-'+item")
														v-expansion-panel
															v-expansion-panel-header
																h4 Personalización
															v-expansion-panel-content
																v-row
																	v-col(cols="12")
																		h5 Carrusel de Imagenes
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		input(type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked")
																		v-card
																			v-tooltip(bottom v-if="editedConfig.personalization.carousel.length > 0")
																				template(v-slot:activator="{ on }")
																					v-btn(v-on="on" fab absolute dark small @click='delFile' style="top: -20px")
																						v-icon fas fa-trash
																				span Eliminar Imagen
																			v-tooltip(bottom)
																				template(v-slot:activator="{ on }")
																					v-btn(v-on="on" fab absolute dark small @click='pickFile' style="left: 50px; top: -20px")
																						v-icon fas fa-plus
																				span Agregar Imagen
																			v-carousel(v-model="editedPhoto" height="200" v-if="editedConfig.personalization.carousel.length > 0")
																				v-carousel-item(v-for="(photo, i) in editedConfig.personalization.carousel" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
																			v-carousel(height="550" v-else hide-delimiters)
																				v-carousel-item(src="/img/without-image.jpg" reverse-transition="fade-transition" transition="fade-transition")
														v-expansion-panel
															v-expansion-panel-header
																h4 Acceso
															v-expansion-panel-content
																v-row
																	v-col(cols="4")
																		v-subheader Codigo de seguridad de Acceso
																	v-col(cols="8")
																		v-text-field(v-model="editedConfig.security.access_code" label="Código de Seguridad" value="getup")
														v-expansion-panel
															v-expansion-panel-header
																h4 Metodos de Pago
															v-expansion-panel-content
																v-container
																	v-expansion-panels
																		v-expansion-panel
																			v-expansion-panel-header
																				h6 #[v-checkbox(v-model="editedConfig.payment_methods.active" label="Pasarelas de Pago")]
																			v-expansion-panel-content
																				v-row
																					v-col(cols="12")
																						v-select(v-model="editedConfig.payment_methods.type" :items="paymentGateways" label="Pasarela" filled)
																					v-col(cols="12")
																						template(v-if="editedConfig.payment_methods.type === 'PAYU'")
																							v-row
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-text-field(label="Llave API" prepend-icon="fas fa-key")
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-text-field(label="API Login" prepend-icon="fas fa-cog")
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-text-field(label="Llave Pública" prepend-icon="fas fa-key")
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-text-field(label="ID Comercio" prepend-icon="fas fa-cog")
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-text-field(label="ID Cuenta" prepend-icon="fas fa-user")
																								v-col(cols="12" xs="12" sm="6" md="4" lg="4")
																									v-checkbox(label="Modo de Pruebas")
																						template(v-else-if="editedConfig.payment_methods.type === 'CULQI'")
																							v-row
																								v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																									v-text-field(label="Llave Pública" prepend-icon="fas fa-key")
																								v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																									v-text-field(label="Llave Privada" prepend-icon="fas fa-key")
																						template(v-else)
																							span La plataforma no soporta actualmente las pasarelas de pago
																		v-expansion-panel
																			v-expansion-panel-header
																				h6 #[v-checkbox(v-model="editedConfig.payment_methods.cash.active" label="Transferencias Bancarias")]
																			v-expansion-panel-content
																				v-row
																					v-col(cols="12")
																						v-data-table.elevation-1(:headers="headersBankAccounts" :items="editedConfig.payment_methods.cash.bank_accounts" :search="search")
																							template(v-slot:top)
																								v-toolbar(flat color="white")
																									v-toolbar-title Cuentas de Banco
																									v-divider.mx-4(inset vertical)
																									v-spacer
																									v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar cuenta" single-line hide-details)
																									v-spacer
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dBankAccount', true, resetFormBankAccount)") #[v-icon fas fa-plus]
																										span Nueva Cuenta
																									v-dialog(v-model="dBankAccount.status" scrollable persistent max-width="600px")
																										v-card
																											v-card-title.headline.grey.lighten-2(primary-title) {{ formTitleBankAccount }}
																											v-card-text(style="max-height: 600px")
																												v-container
																													v-form
																														v-row
																															v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																																v-text-field(v-model.trim="editedBankAccount.bank" label="Banco" prepend-icon="fas fa-university")
																															v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																																v-text-field(v-model.trim="editedBankAccount.number_account" label="Número de cuenta" prepend-icon="fas fa-money-check")
																															v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																																v-text-field(v-model.trim="editedBankAccount.cci" label="CCI" prepend-icon="fas fa-money-check")
																															v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																																v-text-field(v-model.trim="editedBankAccount.beneficiary" label="Beneficiario" prepend-icon="fas fa-user")
																															v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																																StateAutocomplete(v-model="editedBankAccount.inactive")
																											v-divider
																											v-card-actions
																												v-spacer
																												v-btn(text @click="toggleDialog('dBankAccount', false, () => {})" color="primary") Cancelar
																												v-btn(text @click="saveBankAccount" :loading="dBankAccount.loading" :disabled="dBankAccount.loading") Guardar
																							template(v-slot:item.inactive="{ item }")
																								v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
																							template(v-slot:item.action="{ item }")
																								v-tooltip(bottom)
																									template(v-slot:activator="{ on }")
																										v-btn(icon small v-on="on" @click="toggleDialog('dBankAccount', true, editBankAccount(item))")
																											v-icon fas fa-edit
																									span Editar
																								v-tooltip(bottom)
																									template(v-slot:activator="{ on }")
																										v-btn(icon small v-on="on" @click="deleteBankAccount(item)")
																											v-icon fas fa-trash
																									span Eliminar
							v-divider
							v-card-actions
								v-spacer
								v-btn(text @click="toggleDialog('dConfiguration', false, () => {})" color="primary") Cancelar
								v-btn(text @click="saveConfig()" :loading="dConfiguration.loading" :disabled="dConfiguration.loading") Guardar
				template(v-slot:item.inactive="{ item }")
					v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dConfiguration', true, editConfiguration(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="activateConfiguration(item)")
								//-GERAL
								v-icon fas fa-check
						span Activar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteConfiguration(item)")
								v-icon fas fa-trash
						span Eliminar
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
import { required, maxLength } from 'vuelidate/lib/validators'
import StateAutocomplete from '@/components/global/states/autocomplete'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		StateAutocomplete
	},
	validations: {
		editedConfig: {
			name: { required, maxLength: maxLength(250) },
			inactive: { required }
		},
		editedBankAccount: {
			bank: { required, maxLength: maxLength(250) },
			number_account: { required, maxLength: maxLength(30) },
			cci: { required, maxLength: maxLength(30) },
			beneficiary: { required, maxLength: maxLength(250) },
			inactive: { required }
		}
	},
	data() {
		return {
			/* geral */
			listSocial: [
				'instagram',
				'facebook',
				'youtube',
				'whatsapp',
				'twitter',
				'skype',
				'snapchat',
				'reddit',
				'tumblr'
			],
			selectedListSocial: [],
			methods: null,
			paymentGateways: ['CULQI', 'PAYU'],
			valueImages: null,
			search: null,
			configurations: [],
			dConfiguration: {
				status: false,
				loading: false
			},
			dBankAccount: {
				status: false,
				loading: false
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
			rules: [
				(value) =>
					!value ||
					value.size < 5000000 ||
					'El logo no puede tener mas de 5 MB!'
			],
			editedIndex: -1,
			editedConfig: {
				name: '',
				company: {
					logo: '/img/company-logo-your-logo.png',
					name: '',
					social: {
						/* instagram: '',
						facebook: '' */
					}
				},
				personalization: {
					carousel: []
				},
				security: {
					access_code: ''
				},
				payment_methods: {
					payu: {
						api_key: '',
						api_login: '',
						public_key: '',
						merchant_id: '',
						account_id: '',
						payu_test: true
					},
					culqi: {
						public_key: '',
						private_key: ''
					},
					type: 'CULQI',
					active: true,
					cash: {
						bank_accounts: [],
						active: true
					}
				},
				inactive: true
			},
			defaultConfig: {
				name: '',
				company: {
					logo: '/img/company-logo-your-logo.png',
					name: '',
					social: {
						/* instagram: '',
						facebook: '' */
					}
				},
				personalization: {
					carousel: []
				},
				security: {
					access_code: ''
				},
				payment_methods: {
					payu: {
						api_key: '',
						api_login: '',
						public_key: '',
						merchant_id: '',
						account_id: '',
						payu_test: true
					},
					culqi: {
						public_key: '',
						private_key: ''
					},
					type: 'CULQI',
					active: true,
					cash: {
						bank_accounts: []
					}
				},
				inactive: true
			},
			editedBankAccountIndex: -1,
			editedBankAccount: {
				bank: '',
				number_account: '',
				cci: '',
				beneficiary: '',
				inactive: false
			},
			defaultBankAccount: {
				bank: '',
				number_account: '',
				cci: '',
				beneficiary: '',
				inactive: false
			},
			sizeImage: 5120,
			editedPhoto: null,
			headers: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			headersBankAccounts: [
				{ text: 'Banco', value: 'bank' },
				{ text: 'Numero de cuenta', value: 'number_account' },
				{ text: 'CCI', value: 'cci' },
				{ text: 'Beneficiario', value: 'beneficiary' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			]
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1
				? 'Nueva configuración'
				: 'Editar configuración'
		},
		formTitleBankAccount() {
			return this.editedBankAccountIndex === -1
				? 'Nueva cuenta'
				: 'Editar cuenta'
		},
		...mapState(['token']),
		/* GERAL */
		configNameErrors() {
			const errors = []
			if (!this.$v.editedConfig.name.$dirty) return errors
			!this.$v.editedConfig.name.required &&
				errors.push('Se requiere el nombre!')
			return errors
		}
		/* GERAL */
	},
	watch: {
		valueImages(val) {
			if (val) {
				const fileSize = val.size
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
				const imageName = val.name
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
				fr.readAsDataURL(val)
				fr.addEventListener('load', () => {
					this.editedConfig.company.logo = fr.result
				})
			} else {
				this.editedConfig.company.logo = '/img/without-image.jpg'
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
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
						command: 'GET_CONFIGURATIONS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.configurations = resp.Response
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
					this.editedConfig.personalization.carousel.push(fr.result)
					this.editedPhoto = -1
					setTimeout(() => {
						this.editedPhoto =
							this.editedConfig.personalization.carousel.length -
							1
					}, 300)
				})
			}
		},
		delFile() {
			this.editedConfig.personalization.carousel.splice(
				this.editedPhoto,
				1
			)
		},
		pickFile() {
			this.$refs.image.click()
		},
		resetForm() {
			this.editedConfig = this.methods.clonex(this.defaultConfig)
			this.editedIndex = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.$reset()
		},
		resetFormBankAccount() {
			this.editedBankAccount = this.methods.clonex(
				this.defaultBankAccount
			)
			this.editedBankAccountIndex = -1
			this.dConfirm = this.methods.clonex(this.dConfirmDefault)
			this.$v.editedBankAccount.$reset()
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		saveConfig(pactivate = false) {
			const promise = new Promise((resolve, reject) => {
				this.$v.editedConfig.$touch()

				if (!this.$v.editedConfig.$invalid) {
					this.dConfiguration.loading = true
					this.dLoading.status = true
					this.dLoading.message = 'Guardando...'
					let pcommand = ''
					let pmethod = ''
					let puri = ''
					if (this.editedIndex !== -1) {
						pcommand = 'UPDATE_CONFIGURATION'
						pmethod = 'PATCH'
						puri = `/api/configuration/${this.editedConfig._id}`
					} else {
						pcommand = 'REGISTER_CONFIGURATION'
						pmethod = 'POST'
						puri = '/api/configuration/'
					}
					if (!this.editedConfig.inactive) {
						this.editedConfig.inactive = false
					} else {
						this.editedConfig.inactive = !pactivate
					}
					const newarr = {}
					this.selectedListSocial.some((item, index) => {
						newarr[item] =
							this.editedConfig.company.social[item] || ''
					})
					this.editedConfig.company.social = newarr
					this.methods
						.requestApi(
							puri,
							pmethod,
							{},
							{
								command: pcommand,
								transaction: this.editedConfig
							}
						)
						.then((resp) => {
							this.dLoading.status = false
							this.dConfiguration.status = false
							this.dConfiguration.loading = false
							if (resp.status === 'SUCCESS') {
								if (this.editedIndex > -1) {
									Object.assign(
										this.configurations[this.editedIndex],
										this.editedConfig
									)
								} else {
									const configuration = resp.Response
									this.configurations.push(configuration)
								}
								this.message({
									title: 'Excelente',
									message:
										'Se ha registrado la información correctamente',
									type: 'success'
								})
								resolve({
									response: 'data loaded into BD'
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
							reject(err)
						})
				} /* geral else {
					const err = {
						response: 'data not valid for vuelidate'
					}
					reject(err)
				} */
			})
			return promise
		},
		editConfiguration(item) {
			this.editedIndex = this.configurations.indexOf(item)
			this.selectedListSocial = Object.keys(item.company.social || {})
			this.editedConfig = Object.assign({}, item)
			this.editedConfig.company.social =
				typeof this.editedConfig.company.social === 'undefined'
					? {}
					: this.editedConfig.company.social
		},
		deleteConfiguration(item) {
			this.editedIndex = this.configurations.indexOf(item)
			this.editedConfig = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta configuración?'
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
						`/api/configuration/${this.editedConfig._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_CONFIGURATION'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.configurations.splice(this.editedIndex, 1)
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
		activateConfiguration(item) {
			this.editedIndex = this.configurations.indexOf(item)
			this.editedConfig = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea activar esta configuración?'
			this.dConfirm.message =
				'Tip: Recuerde que esta sera la nueva configuración del sistema'
			this.dConfirm.event_cancel = () => {
				this.resetForm()
			}
			this.dConfirm.event_accept = () => {
				this.dConfirm.status = false
				this.saveConfig(true).then(() => {
					this.getConfigurations()
				})
			}
		},
		saveBankAccount() {
			this.$v.editedBankAccount.$touch()
			if (!this.$v.editedBankAccount.$invalid) {
				this.dBankAccount.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				const obj = this.editedConfig.payment_methods.cash.bank_accounts
				if (this.editedBankAccountIndex !== -1) {
					Object.assign(
						obj[this.editedBankAccountIndex],
						this.editedBankAccount
					)
				} else {
					obj.push(this.editedBankAccount)
				}
				this.dLoading.status = false
				this.dBankAccount.status = false
				this.dBankAccount.loading = false
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la configuración',
					type: 'warn'
				})
			}
		},
		editBankAccount(item) {
			this.editedBankAccountIndex = this.editedConfig.payment_methods.cash.bank_accounts.indexOf(
				item
			)
			this.editedBankAccount = Object.assign({}, item)
		},
		deleteBankAccount(item) {
			this.editedBankAccountIndex = this.editedConfig.payment_methods.cash.bank_accounts.indexOf(
				item
			)
			this.editedBankAccount = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta cuenta?'
			this.dConfirm.message =
				'Tip: Recuerde que tambien puede inhabilitar los registros'
			this.dConfirm.event_cancel = () => {
				this.resetFormOption()
			}
			this.dConfirm.event_accept = () => {
				this.dConfirm.status = false
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				this.editedConfig.payment_methods.cash.bank_accounts.splice(
					this.editedBankAccountIndex,
					1
				)
				this.message({
					title: 'Atención',
					message:
						'Los cambios efectuados son temporales hasta que no guarde la configuración',
					type: 'warn'
				})
				this.resetFormBankAccount()
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
