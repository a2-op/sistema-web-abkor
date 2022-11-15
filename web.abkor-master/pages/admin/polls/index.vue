<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="polls" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Encuestas
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar encuesta" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dPoll', true, resetForm)") #[v-icon fas fa-plus]
							span Crear Encuesta
						v-dialog(v-model="dPoll.status" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable)
							v-card(text)
								v-toolbar(dark text)
									v-btn(icon dark @click="closeEdit")
										v-icon mdi-close
									v-toolbar-title {{ formTitle }}
									v-spacer
									v-toolbar-items
										v-btn(text dark @click="savePoll") Guardar
								v-card-text
									v-layout(row wrap)
										v-flex(xs8 offset-xs2)
											v-text-field(label="Titulo del Formulario" v-model.trim="editedPoll.title" required :error-messages="titleErrors" @input="$v.editedPoll.title.$touch()" @blur="$v.editedPoll.title.$touch()")
											v-text-field(label="Descripción del formulario" v-model.trim="editedPoll.description" required  :error-messages="descriptionErrors" @input="$v.editedPoll.description.$touch()" @blur="$v.editedPoll.description.$touch()")
											v-card.card--flex-toolbar
												v-card-text(style="min-height: 500px;")
													v-tabs(v-model="tabPoll" centered)
														v-tab(href="#questions") Preguntas
														v-tab(href="#preview") Vista Previa
														v-tab(href="#answers") Respuestas
													v-tabs-items(v-model="tabPoll")
														v-tab-item(value="questions")
															v-card(text)
																v-card-text
																	v-btn(dark absolute top right fab @click="addSection")
																		v-icon fas fa-plus
																	v-container(fluid grid-list-lg)
																		v-layout(row wrap v-for="(section, index) in editedPoll.sections" :key="index")
																			v-flex(xs12)
																				v-hover(v-slot:default="{ hover }")
																					v-card.mx-auto(:elevation="hover ? 12 : 2")
																						v-card-title(v-if="editedPoll.sections.length > 1")
																							span.title Sección {{index + 1}} de {{editedPoll.sections.length}}
																						v-card-text
																							v-card
																								v-card-text
																									v-layout(row wrap)
																										v-flex(xs12)
																											v-text-field(label="Título de la sección (opcional)" v-model.trim="section.title")
																										v-flex(xs12)
																											v-text-field(label="Descripción (opcional)" v-model.trim="section.description")
																							template(v-for="(question, idx) in section.questions")
																								v-hover(v-slot:default="{ hover }")
																									v-card.mx-auto(:elevation="hover ? 12 : 2" :key="idx")
																										v-card-text
																											v-layout(row wrap)
																												template(v-if="question.type !== 'subtitle'")
																													v-flex(xs12 sm12 md6 lg6)
																														v-text-field(label="Pregunta" v-model.trim="question.question")
																													v-flex(xs12 sm12 md6 lg6)
																														v-select(:items="typeQuestions" v-model="question.type")
																												template
																													v-flex(xs12 v-if="question.type == 'short_answer'")
																														v-text-field(label="Texto de respuesta corta" disabled)
																													v-flex(xs12 v-else-if="question.type == 'paragraph'")
																														v-textarea(label="Texto de respuesta larga" disabled)
																													v-flex(xs12 v-else-if="question.type == 'multiple_choice'")
																														template(v-for="(option, idxo) in question.options")
																															v-layout(align-center)
																																v-radio.shrink.mr-2(hide-details disabled)
																																v-text-field(label="Opción" v-model.trim="option.value" @change="updateText(option)")
																																v-btn(icon text @click="deleteOption(idxo, question.options)")
																																	v-icon fas fa-trash
																														v-btn(icon @click="addOption(question.options)")
																															v-icon fas fa-plus
																													v-flex(xs12 v-else-if="question.type == 'checkboxes'")
																														template(v-for="(option, idxo) in question.options")
																															v-layout(align-center)
																																v-checkbox.shrink.mr-2(hide-details disabled)
																																v-text-field(label="Opción" v-model.trim="option.value" @change="updateText(option)")
																																v-btn(icon text @click="deleteOption(idxo, question.options)")
																																	v-icon fas fa-trash
																														v-btn(icon @click="addOption(question.options)")
																															v-icon fas fa-plus
																													v-flex(xs12 v-else-if="question.type == 'desplegable'")
																														template(v-for="(option, idxo) in question.options")
																															v-layout(align-center)
																																span {{idxo + 1}}.
																																v-text-field(label="Opción" v-model.trim="option.value" @change="updateText(option)")
																																v-btn(icon text @click="deleteOption(idxo, question.options)")
																																	v-icon fas fa-trash
																														v-btn(icon @click="addOption(question.options)")
																															v-icon fas fa-plus
																													v-flex(xs12 v-else-if="question.type == 'qualification'")
																														v-layout(row wrap)
																															v-flex(xs2)
																																v-subheader De
																															v-flex(xs4)
																																v-select(:items="rangeInit" v-model="question.ini")
																															v-flex(xs2)
																																v-subheader a
																															v-flex(xs4)
																																v-select(:items="rangeEnd" v-model="question.fin")
																													v-flex(xs12 v-else-if="question.type == 'date'")
																														v-text-field(label="Fecha" hint="MM/DD/YYYY" persistent-hint prepend-icon="event" disabled)
																													v-flex(xs12 v-else-if="question.type == 'hour'")
																														v-text-field(label="Hora" prepend-icon="access_time" disabled)
																													v-flex(xs12 v-else-if="question.type == 'subtitle'")
																														v-text-field(v-model.trim="question.subtitle" label="Subtitulo")
																														v-text-field(v-model.trim="question.description" label="Descripción")
																										v-card-actions
																											v-list-item.grow
																												v-layout(align-center justify-center)
																													v-tooltip(bottom)
																														template(v-slot:activator="{ on }")
																															v-icon.mr-2(v-on="on" @click="duplicateQuestion(question, section.questions)") fas fa-file
																														span Duplicar
																													v-tooltip(bottom)
																														template(v-slot:activator="{ on }")
																															v-icon.mr-2(v-on="on" @click="deleteQuestion(idx, section.questions)") fas fa-trash
																														span Eliminar
																													v-switch(v-model="question.required" label="Obligatorio")
																						v-card-actions
																							v-list-item.grow
																								v-layout(align-center justify-end)
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-icon.mr-2(v-on="on" @click="addQuestion(section)") fas fa-plus
																										span Añadir Pregunta
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-icon.mr-2(v-on="on" @click="addSubtitle(section)") fas fa-heading
																										span Añadir Subtitulo
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-icon.mr-2(v-on="on" @click="duplicateSection(index)") fas fa-file-code
																										span Duplicar
																									v-tooltip(bottom)
																										template(v-slot:activator="{ on }")
																											v-icon.mr-2(v-on="on" @click="deleteSection(index)") fas fa-trash
																										span Eliminar
																			v-flex(xs12 v-if="index != editedPoll.sections.length - 1")
																				v-layout(row wrap)
																					v-flex(xs6)
																						v-subheader Después de la sección {{index + 1}}
																					v-flex(xs6)
																						v-select(:items="redirectSections" v-model="section.event")
														v-tab-item(value="preview")
															v-layout(row wrap)
																v-flex.text-center(xs12)
																	span.display-1 {{ editedPoll.title }}
																v-flex.text-center(xs12)
																	span {{ editedPoll.description }}
																v-flex(xs12)
																	v-form(ref="formPoll" v-model="valid" lazy-validation)
																		template
																			v-card.mx-auto
																				template(v-if="!modifyPoll")
																					v-card-text.text-center
																						v-btn(@click="activeWindows") Comenzar encuesta
																				template(v-else)
																					v-window(v-model='editedPoll.step')
																						template(v-for="(section, index) in editedPoll.sections")
																							v-window-item(:value="(index + 1)" :key="index")
																								v-card-text
																									v-card.mx-auto
																										v-card-title.title.font-weight-regular.justify-space-between
																											span {{ section.title }}
																											v-avatar.subtitle-1.white--text(color='primary lighten-2', size='24', v-text='(editedPoll.step)')
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
																																		v-textarea(label="Respuesta" v-model="question.answer")
																																	template(v-else)
																																		v-textarea(required :rules="rules.text" label="Respuesta" v-model="question.answer")
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
																											v-btn(:disabled='editedPoll.step === 1', text='', @click='editedPoll.step--') Anterior
																											v-spacer
																											template(v-if="editedPoll.step === editedPoll.sections.length")
																												v-btn(color='primary', depressed='', @click='') Enviar
																											template(v-else)
																												v-btn(color='primary', depressed='', @click='editedPoll.step++') Siguiente
														v-tab-item(value="answers")
															v-tabs(v-model="tabAnswers" color="white" dark slider-color="white")
																v-tab(href="#individual") Individual
															v-tabs-items(v-model="tabAnswers")
																v-tab-item(value="individual")
																	v-layout(row wrap)
																		v-flex.text-center(xs12)
																			span.display-1 {{ editedPoll.title }}
																		v-flex.text-center(xs12)
																			span {{ editedPoll.description }}
																	template(v-for="(answer, index) in editedPoll.answers")
																		v-card.mx-auto(:key="index")
																			v-card-title.title {{ answer.respondent }}
																			v-card-text
																				v-window(v-model='answer.step')
																					template(v-for="(section, index) in answer.sections")
																						v-window-item(:value="(index + 1)" :key="index")
																							v-card-text
																								v-card.mx-auto
																									v-card-title.title.font-weight-regular.justify-space-between
																										span {{ section.title }}
																										v-avatar.subtitle-1.white--text(color='primary lighten-2', size='24', v-text='(answer.step)')
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
																																v-text-field(readonly label="Respuesta" v-model.trim="question.answer")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'paragraph'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																v-textarea(readonly label="Respuesta" v-model="question.answer")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'multiple_choice'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																v-radio-group(readonly v-model="question.answer")
																																	template(v-for="(option, idxo) in question.options")
																																		v-radio(:key="idxo" :label="option.value" :value="option.value")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'checkboxes'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																template(v-for="(option, idxo) in question.options")
																																	v-checkbox(readonly :key="idxo" v-model="question.answers" :label="option.value" :value="option.value")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'desplegable'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																v-select(readonly :items="question.options" v-model="question.answer" label="Seleccione su respuesta")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'qualification'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex.text-center(xs12)
																																.pa-3
																																	v-rating(readonly v-model="question.ini" :length="question.fin")
																																	span.text--lighten-2.caption.mr-2 ({{ question.ini }})
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'date'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																v-text-field(readonly v-model.trim="question.answer" label="Fecha" hint="YYYY/MM/DD" persistent-hint prepend-icon="event")
																													v-flex(xs12 :key="idx" v-else-if="question.type == 'hour'")
																														v-layout(row wrap)
																															v-flex(xs12)
																																span.title {{ question.question }} #[span(v-text="question.required ? '*' : ''")]
																															v-flex(xs12)
																																v-text-field(readonly v-model.trim="question.answer" label="Hora" prepend-icon="access_time")
																									v-divider
																									v-card-actions
																										v-btn(:disabled='answer.step === 1', text='', @click='answer.step--') Anterior
																										v-spacer
																										template(:disabled="answer.step === answer.sections.length")
																											v-btn(color='primary', depressed='', @click='editedPoll.step++') Siguiente
						v-dialog(v-model="dialogClient" persistent max-width="800px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) Clientes
								v-card-text
									v-container
										v-data-table.elevation-1(v-model="selectedItem" :headers="headerClients" item-key="_id" :items="clients" show-select)
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="dialogClient = false") Cancelar
									v-btn(text dark @click="onSubmit")  Enviar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="editPoll(item)")
								v-icon fas fa-edit
						span Editar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deletePoll(item)")
								v-icon fas fa-trash
						span Eliminar
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="pushItem(item)")
								v-icon fas fa-paper-plane
						span Enviar Escuesta
				template(v-slot:item.create_by="{ item }")
					| {{ item.create_by.name }}
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.modified_by="{ item }")
					| {{ item.modified_by ? item.modified_by.title : '' }}
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
					v-btn(text @click="dConfirm.event_cancel") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { validationMixin } from 'vuelidate'
import { mapState, mapMutations } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	mixins: [validationMixin],
	validations: {
		editedPoll: {
			title: { required, maxLength: maxLength(30) },
			description: { required, maxLength: maxLength(3000) }
		}
	},
	data() {
		return {
			dialog: '',
			dialogClient: false,
			selectedItem: [],
			selectedMail: [],
			polls: [],
			states: [],
			headers: [
				{ text: 'Nombre encuesta', value: 'title' },
				{ text: 'Creado por', value: 'create_by' },
				{ text: 'Fecha de creación', value: 'create_at' },
				{ text: 'Modificado por', value: 'modified_by' },
				{ text: 'Fecha de modificación', value: 'modified_at' },
				{ text: 'Estado', value: 'inactive' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			headerClients: [
				{ text: 'Nombre', value: 'name' },
				{ text: 'Correo', value: 'email' },
				{ text: 'Ocupación', value: 'occupation' }
			],
			search: '',
			dPoll: {
				loading: false,
				status: false
			},
			view: 'L',
			selected: [],
			tabPoll: 'questions',
			tabAnswers: 'individual',
			poll_filtered: [],
			redirectSections: [
				{ text: 'Ir a la siguiente sección', value: 'next' },
				{ text: 'Enviar formulario', value: 'send' }
			],
			typeQuestions: [
				{ text: 'Respuesta Corta', value: 'short_answer' },
				{ text: 'Párrafo', value: 'paragraph' },
				{ text: 'Selección Multiple', value: 'multiple_choice' },
				{ text: 'Casillas de Verificación', value: 'checkboxes' },
				{ text: 'Desplegable', value: 'desplegable' },
				{ text: 'Calificación', value: 'qualification' },
				{ text: 'Fecha', value: 'date' },
				{ text: 'Hora', value: 'hour' }
			],
			section: {
				title: 'Sección sin titulo',
				description: '',
				event: 'next',
				questions: []
			},
			rangeInit: [{ text: '1', value: '1' }],
			rangeEnd: [
				{ text: '2', value: '2' },
				{ text: '3', value: '3' },
				{ text: '4', value: '4' },
				{ text: '5', value: '5' },
				{ text: '6', value: '6' },
				{ text: '7', value: '7' },
				{ text: '8', value: '8' },
				{ text: '9', value: '9' },
				{ text: '10', value: '10' }
			],
			rules: {
				text: [(v) => !!v || 'El valor es requerido'],
				array: [
					(v) => v.length > 0 || 'Debe seleccionar al menos un valor'
				]
			},
			question: {
				type: 'multiple_choice',
				question: '',
				answer: '',
				answers: [],
				image: '',
				ini: 1,
				fin: 5,
				menu: false,
				options: [{ text: 'Opción', value: 'Opción' }],
				required: false
			},
			editedPoll: {
				title: 'Formulario sin título',
				description: '----',
				sections: [],
				answers: [],
				step: 1,
				inactive: false
			},
			defaultPoll: {
				title: 'Formulario sin título',
				description: '----',
				sections: [],
				answers: [],
				step: 1,
				inactive: false
			},
			clients: [],
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
			methods: null,
			modifyPoll: false,
			valid: true,
			delDialog: false,
			page: 1
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1
				? 'Nueva encuesta'
				: 'Editar encuesta'
		},
		titleErrors() {
			const errors = []
			if (!this.$v.editedPoll.title.$dirty) return errors
			!this.$v.editedPoll.title.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedPoll.title.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		descriptionErrors() {
			const errors = []
			if (!this.$v.editedPoll.description.$dirty) return errors
			!this.$v.editedPoll.description.required &&
				errors.push('Se requiere el Descripción!')
			!this.$v.editedPoll.description.maxLength &&
				errors.push(
					'La descripción debe tener un maximo de 3000 caracteres'
				)
			return errors
		},
		calcPagination() {
			return Math.ceil(this.poll_filtered.length / 6)
		},
		...mapState(['token'])
	},
	watch: {
		polls(val) {
			this.poll_filtered = this.polls
		},
		search(val) {
			if (val === '') {
				this.poll_filtered = this.polls
			} else {
				this.poll_filtered = this.polls.filter((element) => {
					return (
						element.title
							.toLowerCase()
							.includes(val.toLowerCase()) ||
						element.create_at
							.toLowerCase()
							.includes(val.toLowerCase())
					)
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
			this.getPolls()
			this.getStates()
			this.getClients()
		},
		getClients() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_CLIENTS'
					},
					{},
					'/admin/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.clients = resp.Response
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
		getPolls() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo encuestas...'
			this.methods
				.requestApi(
					'/api/poll/',
					'GET',
					{
						command: 'GET_POLLS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.polls = resp.Response
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
		editPoll(item) {
			this.editedIndex = this.polls.indexOf(item)
			this.editedPoll = Object.assign({}, item)
			this.dPoll.status = true
		},
		pushItem(item) {
			this.editedIndex = this.polls.indexOf(item)
			this.editedPoll = Object.assign({}, item)
			this.dialogClient = true
		},
		deletePoll(item) {
			this.editedIndex = this.polls.indexOf(item)
			this.editedPoll = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar esta encuesta?'
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
						`/api/poll/${this.editedPoll._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_POLL'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.polls.splice(this.editedIndex, 1)
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
		savePoll() {
			this.$v.editedPoll.$touch()
			if (!this.$v.editedPoll.$invalid) {
				this.dPoll.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_POLL'
					pmethod = 'PATCH'
					puri = `/api/poll/${this.editedPoll._id}`
				} else {
					pcommand = 'REGISTER_POLL'
					pmethod = 'POST'
					puri = '/api/poll/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedPoll
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dPoll.status = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.polls[this.editedIndex],
									this.editedPoll
								)
							} else {
								const pull = resp.Response
								this.polls.push(pull)
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
		statusValue(val) {
			return val ? 'Inactivo' : 'Activo'
		},
		createValue(val) {
			if (val === undefined) {
				const date = new Date()
				const year = date.getFullYear()
				let month = date.getMonth() + 1
				month = (month < 10 ? '0' : '') + month
				let day = date.getDate()
				day = (day < 10 ? '0' : '') + day
				return `${year}-${month}-${day}`
			} else {
				return val.substring(0, 10)
			}
		},
		closeEdit() {
			this.dPoll.status = false
			setTimeout(() => {
				const obj = this.methods.clonex(this.defaultPoll)
				this.editedPoll = Object.assign({}, obj)
				this.editedIndex = -1
				this.$v.$reset()
			}, 300)
		},
		addSection() {
			const section = this.methods.clonex(this.section)
			this.editedPoll.sections.push(section)
			this.modifyPoll = false
		},
		deleteSection(index) {
			this.editedPoll.sections.splice(index, 1)
			this.modifyPoll = false
		},
		duplicateSection(index) {
			const section = this.methods.clonex(this.editedPoll.sections[index])
			this.editedPoll.sections.push(section)
			this.modifyPoll = false
		},
		addQuestion(item) {
			const question = this.methods.clonex(this.question)
			item.questions.push(question)
			this.modifyPoll = false
		},
		duplicateQuestion(question, array) {
			const clone = this.methods.clonex(question)
			array.push(clone)
			this.modifyPoll = false
		},
		deleteQuestion(index, array) {
			array.splice(index, 1)
			this.modifyPoll = false
		},
		addOption(array) {
			array.push({ text: 'Opción', value: 'Opción' })
			this.modifyPoll = false
		},
		deleteOption(index, array) {
			array.splice(index, 1)
			this.modifyPoll = false
		},
		addSubtitle(item) {
			const question = this.methods.clonex(this.question)
			question.type = 'subtitle'
			question.options = []
			question.subtitle = ''
			question.description = ''
			item.questions.push(question)
			this.modifyPoll = false
		},
		updateText(item) {
			item.text = item.value
		},
		activeWindows() {
			if (this.editedPoll.sections.length > 0) {
				this.modifyPoll = true
			}
		},
		onSubmit() {
			let email = ''
			this.dLoading.status = true
			this.dLoading.message = 'Enviando Encuesta...'
			this.selectedItem.forEach((value) => {
				this.selectedMail.push(value.email)
			})
			email = this.selectedMail[0]
			this.methods
				.requestApi(
					'/api/poll/',
					'POST',
					{},
					{
						command: 'SEND_POLL',
						transaction: {
							email,
							profile: 'USR',
							_id: this.editedPoll._id
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					this.dialogClient = false
					if (resp.status === 'SUCCESS') {
						this.message({
							title: 'Excelente',
							message: 'Se ha enviado la encuesta correctamente',
							type: 'success'
						})
					}
					this.resetForm()
				})
				.catch((err) => {
					this.dLoading.status = false
					this.dialogClient = false
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		resetForm() {
			this.editedPoll = Object.assign({}, this.defaultPoll)
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
