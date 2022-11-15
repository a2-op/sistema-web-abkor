<template lang="pug">
	v-card(text)
		v-toolbar(dark extended text)
		v-layout(row pb-2)
			v-flex(xs8 offset-xs2)
				v-card.card--flex-toolbar
					v-card-text
						v-layout(row wrap)
							v-flex.text-center(xs12)
								span.display-1 {{ poll.title }}
							v-flex.text-center(xs12)
								span {{ poll.description }}
							v-flex(xs12)
								v-form(ref="formPoll" v-model="valid" lazy-validation)
									template
										v-card.mx-auto
											template(v-if="page == 'init'")
												v-card-text.text-center
													v-btn(@click="activeWindows") Comenzar encuesta
											template(v-else-if="page == 'poll'")
												v-window(v-model='poll.step')
													template(v-for="(section, index) in poll.sections")
														v-window-item(:value="(index + 1)" :key="index")
															v-card-text
																v-card.mx-auto
																	v-card-title.title.font-weight-regular.justify-space-between
																		span {{ section.title }}
																		v-avatar.subtitle-1.white--text(color='primary lighten-2', size='24', v-text='(poll.step)')
																	v-card-text
																		v-container(fluid grid-list-lg)
																			v-layout(row wrap)
																				v-flex(xs12)
																					span.divider {{ section.description }}
																				template(v-for="(question, idx) in section.questions")
																					v-flex(xs12 :key="idx" v-if="question.type == 'subtitle'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								v-chip(label text-color="white") #[v-icon(left) label]
																									span.subtitle-1 {{ question.subtitle }}
																							v-flex(xs12)
																								span {{ question.description }}
																					v-flex(xs12 :key="idx" v-if="question.type == 'short_answer'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								template(v-if="!question.required")
																									v-text-field(label="Respuesta" v-model.trim="question.answer")
																								template(v-else)
																									v-text-field(required :rules="rules.text" label="Respuesta" v-model.trim="question.answer")
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'paragraph'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								template(v-if="!question.required")
																									v-textarea(label="Respuesta" v-model.trim="question.answer")
																								template(v-else)
																									v-textarea(required :rules="rules.text" label="Respuesta" v-model.trim="question.answer")
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'multiple_choice'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								template(v-if="!question.required")
																									v-radio-group(v-model="question.answer")
																										template(v-for="(option, idxo) in question.options")
																											v-radio(:key="idxo" :label="option.value" :value="option.value")
																								template(v-else)
																									v-radio-group(v-model="question.answer" :rules="rules.text" required)
																										template(v-for="(option, idxo) in question.options" )
																											v-radio(:key="idxo" :label="option.value" :value="option.value")
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'checkboxes'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								template(v-if="!question.required")
																									template(v-for="(option, idxo) in question.options")
																										v-checkbox(:key="idxo" v-model="question.answers" :label="option.value" :value="option.value")
																								template(v-else)
																									template(v-for="(option, idxo) in question.options")
																										v-checkbox(:key="idxo" v-model="question.answers" required :rules="rules.array" :label="option.value" :value="option.value")
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'desplegable'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								template(v-if="!question.required")
																									v-select(:items="question.options" v-model="question.answer" label="Seleccione su respuesta")
																								template(v-else)
																									v-select(required :rules="rules.text" :items="question.options" v-model="question.answer" label="Seleccione su respuesta")
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'qualification'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex.text-center(xs12)
																								.pa-3
																									v-rating(v-model="question.ini" :length="question.fin")
																									span.text--lighten-2.caption.mr-2 ({{ question.ini }})
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'date'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								v-menu(v-model="question.menu" close-on-content-click :nudge-right="40" transition="scale-transition" offset-y max-width="290px" min-width="290px")
																									template(v-slot:activator="{ on }")
																										template(v-if="!question.required")
																											v-text-field(v-on="on" v-model.trim="question.answer" label="Fecha" hint="YYYY/MM/DD" persistent-hint prepend-icon="event")
																										template(v-else)
																											v-text-field(required :rules="rules.text" v-on="on" v-model.trim="question.answer" label="Fecha" hint="YYYY/MM/DD" persistent-hint prepend-icon="event")
																									v-date-picker(locale="es-PE" v-model="question.answer" no-title scrollable)
																					v-flex(xs12 :key="idx" v-else-if="question.type == 'hour'")
																						v-layout(row wrap)
																							v-flex(xs12)
																								span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																							v-flex(xs12)
																								v-menu(v-model="question.menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="time" transition="scale-transition" offset-y max-width="290px" min-width="290px")
																									template(v-slot:activator="{ on }")
																										template(v-if="!question.required")
																											v-text-field(v-on="on" v-model.trim="question.answer" label="Hora" prepend-icon="access_time" readonly)
																										template(v-else)
																											v-text-field(required :rules="rules.text" v-on="on" v-model.trim="question.answer" label="Hora" prepend-icon="access_time" readonly)
																									v-time-picker(v-if="question.menu" v-model="question.answer" @click:minute="question.menu = false")
																	v-divider
																	v-card-actions
																		v-btn(:disabled='poll.step === 1', text='', @click='poll.step--') Anterior
																		v-spacer
																		template(v-if="poll.step === poll.sections.length")
																			v-btn(color='primary', depressed='', @click="validate") Enviar
																		template(v-else)
																			v-btn(color='primary', depressed='', @click='poll.step++') Siguiente
											template(v-if="page == 'finish'")
												v-card-text.text-center
													span Gracias por responder esta encuesta!
		v-dialog(v-model="loading" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ messageDialog }}
						v-progress-linear.mb-0(indeterminate color="white")
</template>
<style>
.card--flex-toolbar {
	margin-top: -64px;
}
</style>
<script>
import Util from '@/assets/js/util'
export default {
	layout: 'main',
	data() {
		return {
			poll: {
				title: 'Formulario sin título',
				description: '',
				sections: [],
				answers: [],
				progress: 0,
				answered_surveys: 0,
				pending_surveys: 0,
				step: 1
			},
			rules: {
				text: [(v) => !!v || 'El valor es requerido'],
				array: [
					(v) => v.length > 0 || 'Debe seleccionar al menos un valor'
				]
			},
			valid: true,
			page: 'init',
			messageDialog: '',
			loading: false
		}
	},
	mounted() {
		this.initialize()
	},
	methods: {
		initialize() {
			this.methods = new Util(this)
			this.messageDialog =
				'Obteniendo la lista de encuestas, por favor espere'
			this.loading = true
			this.methods
				.requestApi('/api/poll_unsec', 'GET', {
					command: 'GET_POLL',
					transaction: {
						token: this.$route.params.id
					}
				})
				.then((resp) => {
					this.loading = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response !== null) {
							this.poll = resp.Response
						}
					}
				})
				.catch((error) => {
					this.loading = false
					this.message({
						title: 'Error',
						message: error,
						type: 'error'
					})
				})
		},
		activeWindows() {
			if (this.poll.sections.length > 0) {
				this.page = 'poll'
			}
		},
		validate() {
			if (this.$refs.formPoll.validate()) {
				this.methods
					.requestApi(
						`/api/poll_unsec/${this.poll._id}`,
						'POST',
						{},
						{
							command: 'REGISTER_ANSWER',
							transaction: this.poll
						}
					)
					.then((resp) => {
						this.loading = false
						if (resp.status === 'SUCCESS') {
							this.page = 'finish'
						}
					})
					.catch((error) => {
						this.loading = false
						this.message({
							title: 'Error',
							message: error,
							type: 'error'
						})
					})
			}
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
