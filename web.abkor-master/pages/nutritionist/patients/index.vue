<template lang="pug">
	v-container
		v-data-table.elevation-1(:headers="headerClients" item-key="_id" :items="clients" :search="search")
			template(v-slot:top)
				v-toolbar(flat color="white")
					v-toolbar-title Pacientes
					v-divider.mx-4(inset vertical)
					v-spacer
					v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Paciente" single-line hide-details)
					v-spacer
					v-dialog(v-model="dSchedule.status" persistent max-width="1200px")
						v-card
							v-card-title.headline.grey.lighten-2(primary-title) {{ editedClient.name }}
							v-card-text
								v-container
									v-form
										v-row
											v-col(cols="12" xs="12" sm="12" md="12" lg="12")
												template
													v-expansion-panels
														v-expansion-panel
															v-expansion-panel-header
																h4 I. DATOS GENERALES
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm6)
																							v-text-field(:value="editedClient.name" label="Paciente" prepend-icon="fas fa-user" disabled)
																						v-flex(xs12 sm6)
																							v-text-field(:value="editedClient.email" label="Email" prepend-icon="fas fa-envelope" disabled)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.objective" label="Objetivo" prepend-icon="fas fa-bullseye" readonly)
														v-expansion-panel
															v-expansion-panel-header
																h4 II. ANTECEDENTES FAMILIARES
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.families.pathology" label="Patología" prepend-icon="fas fa-notes-medical" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.families.own" label="Posee" prepend-icon="fas fa-frown" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.families.family" label="Familiar" prepend-icon="fas fa-users" readonly)
														v-expansion-panel
															v-expansion-panel-header
																h4 III. ACTIVIDAD FÍSICA
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.activities.type" label="Tipo" prepend-icon="fas fa-signature" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.activities.intencidad" label="Intencidad" prepend-icon="fas fa-signature" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.activities.frecuency" label="Frecuencia" prepend-icon="fas fa-wave-square" readonly)
														v-expansion-panel
															v-expansion-panel-header
																h4 IV. ENFERMEDADES PRE EXISTENTES
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.diseases.pathology" label="Patología" prepend-icon="fas fa-notes-medical" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.diseases.frecuency" label="Frecuencia" prepend-icon="fas fa-wave-square" readonly)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.diseases.start_date" label="F. Inicio" prepend-icon="fas fa-calendar-week" readonly)
														v-expansion-panel
															v-expansion-panel-header
																h4 V. MEDICACIÓN
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.medicines.drug" label="Droga" prepend-icon="fas fa-capsules")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.medicines.own" label="Posee" prepend-icon="fas fa-frown")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.medicines.start_date" label="F. Inicio" prepend-icon="fas fa-calendar-week")
														v-expansion-panel
															v-expansion-panel-header
																h4 Vi. ALERGIAS
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.allergies.food" label="Alimento" prepend-icon="fas fa-utensils")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.allergies.allergy" label="Alergia" prepend-icon="fas fa-allergies")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.allergies.intolerant" label="Intolerancia" prepend-icon="fas fa-signature")
														v-expansion-panel
															v-expansion-panel-header
																h4 VI. HABITOS NO SALUDABLES
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.habits.habit" label="Hábito" prepend-icon="fas fa-signature")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.habits.frecuency" label="Frecuencia" prepend-icon="fas fa-wave-square")
														v-expansion-panel
															v-expansion-panel-header
																h4 VII. CONTROL DE EVOLUCIÓN NUTRICIONAL
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm12)
																							v-text-field(v-model="editedMedicalHistory.medical_history.evaluations.data" label="Datos" prepend-icon="fas fa-database")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.evaluations.date" label="Fecha" prepend-icon="fas fa-calendar-week")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.evaluations.result" label="Resultado" prepend-icon="fas fa-poll-h")
														v-expansion-panel
															v-expansion-panel-header
																h4 VIII. DIAGNÓSTICO
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-textarea(v-model="editedMedicalHistory.medical_history.diagnostico")
														v-expansion-panel
															v-expansion-panel-header
																h4 IX. PLAN NUTRICIONAL
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-textarea(v-model="editedMedicalHistory.medical_history.nutritional_plan")
														v-expansion-panel
															v-expansion-panel-header
																h4 X. NUTRICIONISTA TRATANTE
															v-expansion-panel-content
																v-row
																	v-col(cols="12" xs="12" sm="12" md="12" lg="12")
																		v-container
																			v-layout(row wrap)
																				v-flex(xs12)
																					v-layout(row wrap)
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.treatments.date" label="Fecha" prepend-icon="fas fa-calendar-week")
																						v-flex(xs12 sm6)
																							v-text-field(v-model="editedMedicalHistory.medical_history.treatments.data" label="Datos" prepend-icon="fas fa-user")
							v-divider
							v-card-actions
								v-spacer
								v-btn(dark @click="toggleDialog('dSchedule', false, addMedicalHistory)" small) guardar
								v-btn(@click="toggleDialog('dSchedule', false, () => {})" small) Cancelar
			template(v-slot:item.action="{ item }")
				v-tooltip(bottom)
					template(v-slot:activator="{ on }")
						v-btn(icon small v-on="on" @click="toggleDialog('dSchedule', true, editPatient(item))")
							v-icon fas fa-edit
					span Editar Historial Nutricional
</template>
<style>
.gu-toolbar-category .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
<script>
import { mapState } from 'vuex'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			dSchedule: {
				status: false,
				loading: false
			},
			clients: [],
			items: [],
			search: '',
			headerClients: [
				{ text: 'Nombre Usuario', value: 'name', width: '150px' },
				{ text: 'Correo Usuario', value: 'email', width: '150px' },
				{
					text: 'Acción',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			],
			editedClient: {
				name: '',
				email: '',
				inactive: false
			},
			editedMedicalHistory: {
				medical_history: {
					objective: '',
					families: {
						pathology: '',
						own: '',
						family: ''
					},
					activities: {
						type: '',
						intencidad: '',
						frecuency: ''
					},
					diseases: {
						pathology: '',
						frecuency: '',
						start_date: ''
					},
					medicines: {
						drug: '',
						own: '',
						start_date: ''
					},
					allergies: {
						food: '',
						allergy: '',
						intolerant: ''
					},
					habits: {
						habit: '',
						frecuency: ''
					},
					evaluations: {
						data: '',
						date: '',
						result: ''
					},
					diagnostico: '',
					nutritional_plan: '',
					treatments: {
						date: '',
						data: ''
					}
				},
				inactive: false
			},
			defaultMedicalHistory: {
				medical_history: {
					objective: '',
					families: {
						pathology: '',
						own: '',
						family: ''
					},
					activities: {
						type: '',
						intencidad: '',
						frecuency: ''
					},
					diseases: {
						pathology: '',
						frecuency: '',
						start_date: ''
					},
					medicines: {
						drug: '',
						own: '',
						start_date: ''
					},
					allergies: {
						food: '',
						ellergy: '',
						intolerant: ''
					},
					habits: {
						habit: '',
						frecuency: ''
					},
					evaluations: {
						data: '',
						date: '',
						result: ''
					},
					diagnostico: '',
					nutritional_plan: '',
					treatments: {
						date: '',
						data: ''
					}
				},
				inactive: false
			},
			dLoading: {
				status: false,
				message: ''
			},
			editedIndex: -1,
			methods: null
		}
	},
	computed: {
		fas() {
			return fas
		},
		faGithub() {
			return faGithub
		},
		...mapState(['token'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
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
						command: 'GET_NUTRITIONISTS_APPOINTMENTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						if (resp.Response[0].patients.length === 0) {
							/* GERAL */
							this.message({
								title: 'Aviso',
								message: 'No cuenta con pacientes',
								type: 'warn'
							})
						} else {
							this.clients = resp.Response[0].patients
						}
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
		getMedicalHistoryUpdate(filter2) {
			this.editedMedicalHistory = Object.assign(
				{},
				this.defaultMedicalHistory
			)
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis Historial clinico...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_MEDICAL_HISTORY_UPDATE',
						transaction: {
							filter: filter2
						}
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
						this.items = resp.Response
						if (this.items.length === 0) {
							this.message({
								title: 'Información',
								message:
									'El usuario no a registrado aún su información',
								type: 'warn'
							})
						} else {
							this.editedMedicalHistory.medical_history = this.items[0]
						}
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
		addMedicalHistory() {
			this.dLoading.status = true
			this.dLoading.message = 'Guardanado historial clinico...'
			this.methods
				.requestApi(
					`/api/user/${this.editedClient.sub}`,
					'PATCH',
					{},
					{
						command: 'ADD_MEDICAL_HISTORY',
						transaction: this.editedMedicalHistory
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						Object.assign(
							this.clients[this.editedIndex],
							this.defaultMedicalHistory
						)
						this.message({
							title: 'Excelente',
							message:
								'Se ha registrado la información correctamente',
							type: 'success'
						})
					}
					this.$router.push('/nutritionist/patients')
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: `Error al realizar la solicitud ${err}`,
						type: 'error'
					})
				})
		},
		editPatient(item) {
			this.editedIndex = this.clients.indexOf(item)
			this.editedClient = Object.assign({}, item)
			this.getMedicalHistoryUpdate(item.sub)
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
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
