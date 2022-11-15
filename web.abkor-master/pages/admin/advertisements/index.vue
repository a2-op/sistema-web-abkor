<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="notices" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Anuncios
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Anucnio" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dNotice', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Anuncio
						v-dialog(v-model="dNotice.status" scrollable persistent max-width="1000px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text(style="height: 600px")
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="6" md="8" lg="8")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-text-field(v-model.trim="editedNotice.title" prepend-icon="fas fa-signature" label="título del anuncio" required :error-messages="titleErrors" @input="$v.editedNotice.title.$touch()" @blur="$v.editedNotice.title.$touch()" @keyup.enter="saveNotice")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															span Descripción
															Editor.mt-5(v-model="editedNotice.description")
												v-col(cols="12" xs="12" sm="6" md="4" lg="4")
													v-row
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															input(type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked")
															v-card
																v-tooltip(bottom v-if="editedNotice.photos.length > 0")
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='delFile' style="top: -20px")
																			v-icon fas fa-trash
																	span Eliminar Imagen
																v-tooltip(bottom)
																	template(v-slot:activator="{ on }")
																		v-btn(v-on="on" fab absolute dark small @click='pickFile' style="left: 50px; top: -20px")
																			v-icon fas fa-plus
																	span Agregar Imagen
																v-carousel(v-model="editedPhoto" height="200" v-if="editedNotice.photos.length > 0")
																	v-carousel-item(v-for="(photo, i) in editedNotice.photos" :src="photo" :key="i" reverse-transition="fade-transition" transition="fade-transition")
																v-carousel(height="200" v-else hide-delimiters)
																	v-carousel-item(src="/img/without-image.jpg" reverse-transition="fade-transition" transition="fade-transition")
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-combobox(v-model="editedNotice.tags" :items="tags" :search-input.sync="searchTag" hide-selected label="Añade etiquetas al anuncio" multiple persistent-hint small-chips)
														v-col(cols="12" xs="12" sm="12" md="12" lg="12")
															v-dialog(ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px")
																template(v-slot:activator="{ on }")
																	v-text-field(v-model="editedNotice.end" label="Expiración del anuncio" v-mask="mask" readonly v-on="on" required)
																v-date-picker(v-model="editedNotice.end" locale="es-PE" scrollable)
																	v-spacer
																	v-btn(text @click="modal = false") Cancelar
																	v-btn(text @click="$refs.dialog.save(date)") Ok
								v-divider
								v-card-actions
									v-spacer
									v-btn(text @click="toggleDialog('dNotice', false, () => {})" color="primary") Cancelar
									v-btn(text @click="saveNotice" :loading="dNotice.loading" :disabled="dNotice.loading") Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dNotice', true, editNotice(item))")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deleteNotice(item)")
								v-icon fas fa-trash
						span Eliminar
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.end="{ item }")
					| {{ item.end ? item.end.substring(0, 10) : '' }}
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
import { required, maxLength } from 'vuelidate/lib/validators'
import StateAutocomplete from '@/components/global/states/autocomplete'
import Util from '@/assets/js/util'
import Editor from '@/components/Editor'
export default {
	layout: 'dashboard',
	components: {
		StateAutocomplete,
		Editor
	},
	validations: {
		editedNotice: {
			title: { required, maxLength: maxLength(250) },
			photos: { required },
			end: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			notices: [],
			states: [],
			tags: [],
			mask: '####-##-##',
			modal: false,
			date: new Date().toISOString().substr(0, 10),
			headers: [
				{ text: 'Título de anuncio', value: 'title', width: '300px' },
				{ text: 'Tags', value: 'tags', width: '150px' },
				{ text: 'Creado por', value: 'create_by', width: '150px' },
				{
					text: 'Fecha de creación',
					value: 'create_at',
					width: '150px'
				},
				{
					text: 'Fecha de Expiración',
					value: 'end',
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
			search: '',
			searchTag: null,
			editedPhoto: null,
			dNotice: {
				status: false,
				loading: false
			},
			editedNotice: {
				title: '',
				description: '',
				photos: [],
				end: new Date().toISOString().substr(0, 10),
				tags: [],
				inactive: false
			},
			defaultProduct: {
				title: '',
				description: '',
				photos: [],
				end: new Date().toISOString().substr(0, 10),
				tags: [],
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
			sizeImage: 5120,
			methods: null
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Anuncio' : 'Editar Anuncio'
		},
		titleErrors() {
			const errors = []
			if (!this.$v.editedNotice.title.$dirty) return errors
			!this.$v.editedNotice.title.required &&
				errors.push('Se requiere el title!')
			!this.$v.editedNotice.title.maxLength &&
				errors.push('Solo puede contener hasta 250 caracteres!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedNotice.inactive.$dirty) return errors
			!this.$v.editedNotice.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		'editedNotice.end'(val) {
			if (this.editedNotice.end.length > 10) {
				this.editedNotice.end = new Date().toISOString().substr(0, 10)
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
			this.getNotices()
		},
		getNotices() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo anuncios...'
			this.methods
				.requestApi(
					'/api/notice/',
					'GET',
					{
						command: 'GET_NOTICES'
					},
					{}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.notices = resp.Response
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
		editNotice(item) {
			this.editedIndex = this.notices.indexOf(item)
			this.editedNotice = Object.assign({}, item)
		},
		deleteNotice(item) {
			this.editedIndex = this.notices.indexOf(item)
			this.editedNotice = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este anuncio?'
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
						`/api/notice/${this.editedNotice._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_NOTICE'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.notices.splice(this.editedIndex, 1)
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
		saveNotice() {
			this.$v.editedNotice.$touch()
			if (!this.$v.editedNotice.$invalid) {
				this.dNotice.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_NOTICE'
					pmethod = 'PATCH'
					puri = `/api/notice/${this.editedNotice._id}`
				} else {
					pcommand = 'REGISTER_NOTICE'
					pmethod = 'POST'
					puri = '/api/notice/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedNotice
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dNotice.status = false
						this.dNotice.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.notices[this.editedIndex],
									this.editedNotice
								)
							} else {
								const notice = resp.Response
								this.notices.push(notice)
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
		resetForm() {
			this.editedNotice = this.methods.clonex(this.defaultProduct)
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
			this.editedNotice.photos.splice(this.editedPhoto, 1)
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
					this.editedNotice.photos.push(fr.result)
					this.editedPhoto = -1
					setTimeout(() => {
						this.editedPhoto = this.editedNotice.photos.length - 1
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
