<template lang="pug">
	div
		v-container
			v-card.md-5
				v-card-title
					v-icon(large left color="red") fas fa-heart
					v-row(align="center" justify="center")
						h4 Tus comentarios nos ayudaran a mejorar el nuestro servicio
				v-card-text
					v-row
						v-col(cols="12" md="12" class="container")
							v-sheet(elevation="12" class="pa-12")
								v-form(class="mt-12 text-center")
									Editor.mt-5(v-model="editedFeedback.description" ref="editor" required :error-messages="descriptionErrors" @input="$v.editedFeedback.description.$touch()" @blur="$v.editedFeedback.description.$touch()")
									div(class="mt-12 text-center")
										v-tooltip(bottom)
											template(v-slot:activator="{ on }")
												v-btn.mb-2(fab small primary v-on="on" @click="saveFeedback")
													v-icon fa fa-paper-plane
											span Enviar
				v-card-actions
					v-list-item(class="grow")
						v-row(align="center" justify="end")
							h5(class="subheading") Gracias por formar parte de GETUP!
</template>
<style>
.gu-toolbar-category .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
<script>
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { required } from 'vuelidate/lib/validators'
import Editor from '@/components/Editor'
import Util from '@/assets/js/util'

export default {
	layout: 'dashboard',
	components: {
		Editor
	},
	validations: {
		editedFeedback: {
			description: { required },
			inactive: { required }
		}
	},
	data() {
		return {
			dFeedback: {
				status: false,
				loading: false
			},
			dLoading: {
				status: false,
				message: ''
			},
			editedFeedback: {
				description: '',
				html: '' || 'sin html',
				inactive: false
			},
			defaultFeedback: {
				description: '',
				html: '',
				inactive: false
			}
		}
	},
	computed: {
		fas() {
			return fas
		},
		faGithub() {
			return faGithub
		},
		descriptionErrors() {
			const errors = []
			if (!this.$v.editedFeedback.description.$dirty) return errors
			!this.$v.editedFeedback.description.required &&
				errors.push('Se requiere el mensaje!')
			return errors
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
		},
		saveFeedback() {
			if (this.editedFeedback.description.length === 0) {
				return this.message({
					title: 'Atención',
					message: 'Mensaje requerido',
					type: 'warn'
				})
			}
			this.$v.editedFeedback.$touch()
			if (!this.$v.editedFeedback.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Enviando...'
				this.methods
					.requestApi(
						'/api/feedback/',
						'POST',
						{},
						{
							command: 'REGISTER_FEEDBACK',
							transaction: this.editedFeedback
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dFeedback.status = false
						this.dFeedback.loading = false
						if (resp.status === 'SUCCESS') {
							this.resetForm()
							this.message({
								title: 'Comentario',
								message: 'Gracias por sus comentarios',
								type: 'success'
							})
							setTimeout(() => {
								this.$router.replace('/')
							}, 1500)
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
			this.editedFeedback = Object.assign({}, this.defaultFeedback)
			this.$v.$reset()
		}
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
