<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="templates" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Plantillas
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar plantilla" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dTemplate', true, resetForm)") #[v-icon fas fa-plus]
							span Crear Plantilla
						v-dialog(v-model="dTemplate.status" persistent max-width="600px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text
									v-container
										v-form
											v-row
												v-col(cols="12" sm="6" md="6")
													v-text-field(v-model.trim="editedTemplate.name" prepend-icon="fas fa-signature" label="Nombre de la plantilla" required :error-messages="nameErrors" @input="$v.editedTemplate.name.$touch()" @blur="$v.editedTemplate.name.$touch()" @keyup.enter="toggleDialog('dTemplate', false, saveTemplate)")
												v-col(cols="12" sm="6" md="6")
													v-select(v-model="editedTemplate.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedTemplate.inactive.$touch()" @blur="$v.editedTemplate.inactive.$touch()" @keyup.enter="toggleDialog('dTemplate', false, saveTemplate)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dTemplate', false, () => {})" color="primary" small) Cancelar
									v-btn(text @click="toggleDialog('dTemplate', false, saveTemplate)" :loading="dTemplate.loading" :disabled="dTemplate.loading" small) Guardar
						v-dialog(v-model="dCreator.status" scrollable persistent)
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) Creador de Plantillas
								v-card-text
									v-layout(row wrap)
										v-flex(xs12)
											v-text-field(label="Nombre plantilla" v-model.trim="editedTemplate.name" required :error-messages="nameErrors" @input="$v.editedTemplate.name.$touch()" @blur="$v.editedTemplate.name.$touch()")
										v-flex(xs12)
											TemplateCreator(v-model="editedTemplate" :generate="generate" :edited="editedIndex")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dCreator', false, () => { closeEdit(editedTemplate) })" color="primary" small) Cancelar
									v-btn(text @click="saveTemplate" :loading="dCreator.loading" :disabled="dCreator.loading" small) Guardar
						v-dialog(v-model="delDialog" max-width="290")
							v-card
								v-card-title.headline ¿Realmente desea eliminar esta plantilla?
								v-card-text Recuerde que tras eliminar la plantilla esta no se podra recuperar, si lo que desea es inhabilitarla, por favor edite la plantilla y cambie el estado a inactivo
								v-card-actions
									v-spacer
									v-btn(color="light-blue" text="text" @click="closeDelete" small) Cancelar
									v-btn(color="red" text="text" @click="" small) Aceptar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="editTemplate(item)")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteTemplate(item)")
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
					v-btn(text @click="dConfirm.event_cancel" small) Cancelar
					v-btn(text @click="dConfirm.event_accept" small) Aceptar
</template>
<script>
import { validationMixin } from 'vuelidate'
import { mapState, mapMutations } from 'vuex'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import TemplateCreator from '@/components/templates/Template-creator'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		TemplateCreator
	},
	mixins: [validationMixin],
	validations: {
		editedTemplate: {
			name: {
				required,
				maxLength: maxLength(80),
				minLength: minLength(5)
			},
			inactive: { required }
		}
	},
	data() {
		return {
			dCreator: {
				status: false,
				loading: false
			},
			generate: false,
			templates: [],
			states: [],
			user: {},
			tabs: null,
			view: 'L',
			selected: [],
			template_filtered: [],
			headers: [
				{ text: 'Nombre plantilla', value: 'name' },
				{ text: 'Creado por', value: 'create_by' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			search: '',
			dTemplate: {
				status: false,
				loading: false
			},
			editedTemplate: {
				name: '',
				subject: '',
				preheader: '',
				content: '',
				styles: {
					module: {
						background$color: '#FFFFFF',
						padding$top: '0px',
						padding$bottom: '0px',
						padding$left: '0px',
						padding$right: '0px',
						width: '600px',
						margin: '0 auto'
					},
					container: {
						background$color: '#FFFFFF',
						color: '#000000',
						font$family: 'Arial, Helvetica, sans-serif',
						font$size: '14px'
					}
				},
				design: [],
				inactive: false
			},
			defaultTemplate: {
				name: '',
				subject: '',
				preheader: '',
				content: '',
				styles: {
					module: {
						background$color: '#FFFFFF',
						padding$top: '0px',
						padding$bottom: '0px',
						padding$left: '0px',
						padding$right: '0px',
						width: '600px',
						margin: '0 auto'
					},
					container: {
						background$color: '#FFFFFF',
						color: '#000000',
						font$family: 'Arial, Helvetica, sans-serif',
						font$size: '14px'
					}
				},
				design: [],
				inactive: false
			},
			button: {
				type: 'button',
				buttonText: 'Texto Boton',
				buttonUri: '',
				options: false,
				styles: {
					module: {
						background$color: 'rgb(51, 51, 51)',
						border$color: 'rgb(51, 51, 51)',
						border$style: 'solid',
						border$width: '1px',
						border$radius: '6px',
						color: 'rgb(255, 255, 255)',
						display: 'inline-block',
						font$family: 'Lucida Sans Unicode',
						font$size: '16px',
						font$weight: 'normal',
						letter$spacing: '0px',
						line$height: '16px',
						padding$top: '12px',
						padding$right: '18px',
						padding$bottom: '12px',
						padding$left: '18px',
						text$align: 'center',
						text$decoration: 'none'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			column: {
				type: 'column',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				},
				childs: []
			},
			text: {
				type: 'text',
				text:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			image: {
				type: 'image',
				imageUri:
					'https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png',
				options: false,
				styles: {
					module: {
						width: '50%'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			space: {
				type: 'space',
				options: false,
				styles: {
					module: {
						padding$top: '0px',
						padding$right: '0px',
						padding$bottom: '30px',
						padding$left: '0px'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			divider: {
				type: 'divider',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center',
						background$color: '#000000'
					}
				}
			},
			social: {
				type: 'social',
				options: false,
				linkFacebook: '#',
				linkTwitter: '#',
				linkInstagram: '#',
				linkGoogle: '#',
				linkPinterest: '#',
				linkLinkedIn: '#',
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			footer: {
				type: 'footer',
				textHeader1: '[REMITENTE]',
				textHeader2: '[DIRECCION], [CIUDAD], [ESTADO] [CODIGO_POSTAL]',
				textFooter: 'Link',
				linkFooter: '#',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			messageDialog: '',
			delDialog: false,
			pConfigTemplate: [true],
			pBuildTemplate: [false, false, false, false],
			editRowModule: false,
			editedRowModule: null,
			page: 1,
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
			return this.editedIndex === -1
				? 'Nueva plantilla'
				: 'Editar plantilla'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedTemplate.name.$dirty) return errors
			!this.$v.editedTemplate.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedTemplate.name.maxLength &&
				errors.push('Solo puede contener hasta 80 caracteres!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedTemplate.inactive.$dirty) return errors
			!this.$v.editedTemplate.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		templates(val) {
			this.template_filtered = this.templates
		},
		search(val) {
			if (val === '') {
				this.template_filtered = this.templates
			} else {
				this.template_filtered = this.templates.filter((element) => {
					return element.name
						.toLowerCase()
						.includes(val.toLowerCase())
				})
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
			this.getTemplates()
			this.getStates()
		},
		getTemplates() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo encuestas...'
			this.methods
				.requestApi(
					'/api/template-email/',
					'GET',
					{
						command: 'GET_TEMPLATES_MAIL'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.templates = resp.Response
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
		editTemplate(item) {
			this.editedIndex = this.templates.indexOf(item)
			this.editedTemplate = Object.assign(this.editedTemplate, item)
			this.dCreator.status = true
		},
		closeEdit() {
			this.dCreator.status = false
			setTimeout(() => {
				this.editedTemplate = Object.assign({}, this.defaultTemplate)
				this.editedIndex = -1
				this.editRowModule = false
				this.editedRowModule = null
				this.$v.$reset()
			}, 300)
		},
		closeDelete() {
			this.delDialog = false
			setTimeout(() => {
				this.editedTemplate = Object.assign({}, this.defaultTemplate)
				this.editedIndex = -1
				this.$v.$reset()
			}, 300)
		},
		deleteTemplate(item) {
			this.editedIndex = this.templates.indexOf(item)
			this.editedTemplate = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta plantilla?'
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
						`/api/template-email/${this.editedTemplate._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_TEMPLATE_EMAIL'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.templates.splice(this.editedIndex, 1)
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
		saveTemplate() {
			this.$v.editedTemplate.$touch()
			if (!this.$v.editedTemplate.$invalid) {
				this.generate = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_TEMPLATE_EMAIL'
					pmethod = 'PATCH'
					puri = `/api/template-email/${this.editedTemplate._id}`
				} else {
					pcommand = 'REGISTER_TEMPLATE_EMAIL'
					pmethod = 'POST'
					puri = '/api/template-email/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedTemplate
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.generate = false
						this.dCreator.status = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.templates[this.editedIndex],
									this.editedTemplate
								)
							} else {
								const template = resp.Response
								this.templates.push(template)
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
						this.generate = false
						this.message({
							title: 'Error',
							message: err,
							type: 'error'
						})
					})
			}
		},
		resetForm() {
			this.editedTemplate = Object.assign({}, this.defaultTemplate)
			this.editedIndex = -1
			this.dConfirm = Object.assign({}, this.dConfirmDefault)
			this.$v.$reset()
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
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
