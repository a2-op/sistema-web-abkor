<template lang="pug">
	v-container
		v-card.md-5
			v-card-title
				h4 Historial Nutricional
			v-card-text
				v-row
					v-col(cols="12" xs="12" sm="12" md="12" lg="12")
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
																		v-flex(xs12 sm12)
																			v-text-field(:value="profile.name" label="Nombre" prepend-icon="fas fa-user" disabled readonly)
																		v-flex(xs12 sm6)
																			v-text-field(:value="profile.birthday" label="Fecha de nacimiento" prepend-icon="fas fa-calendar-week" disabled readonly)
																		v-flex(xs12 sm6)
																			v-text-field(:value="data.age" label="Edad" prepend-icon="fas fa-calendar-week" disabled readonly)
																		v-flex(xs12 sm6)
																			v-text-field(:value="profile.email" label="Email" prepend-icon="fas fa-envelope" disabled readonly)
																		v-flex(xs12 sm6)
																			v-text-field(:value="profile.occupation" label="Ocupación" prepend-icon="fas fa-user-md" disabled readonly)
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.objective" label="Objectivo getUP!" prepend-icon="fas fa-bullseye")
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
																			v-text-field(v-model="editedMedicalHistory.medical_history.families.pathology" label="Patología" prepend-icon="fas fa-notes-medical")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.families.own" label="Posee" prepend-icon="fas fa-frown")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.families.family" label="Familiar" prepend-icon="fas fa-users")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerFamilies" items-per-page.sync="4")
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
																			v-text-field(v-model="editedMedicalHistory.medical_history.activities.type" label="Tipo" prepend-icon="fas fa-signature")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.activities.intencidad" label="Intencidad" prepend-icon="fas fa-signature")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.activities.frecuency" label="Frecuencia" prepend-icon="fas fa-wave-square")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerActivities" items-per-page.sync="4")
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
																			v-text-field(v-model="editedMedicalHistory.medical_history.diseases.pathology" label="Patología" prepend-icon="fas fa-notes-medical")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.diseases.frecuency" label="Frecuencia" prepend-icon="fas fa-wave-square")
																		v-flex(xs12 sm6)
																			v-text-field(v-model="editedMedicalHistory.medical_history.diseases.start_date" label="F. Inicio" prepend-icon="fas fa-calendar-week")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerDiseases" items-per-page.sync="4")
										v-expansion-panel
											v-expansion-panel-header
												h4 V. MEDICACIÓN
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerMedicines" items-per-page.sync="4")
										v-expansion-panel
											v-expansion-panel-header
												h4 Vi. ALERGIAS
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerAllergies" items-per-page.sync="4")
										v-expansion-panel
											v-expansion-panel-header
												h4 VI. HABITOS NO SALUDABLES
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerHabits" items-per-page.sync="4")
										v-expansion-panel
											v-expansion-panel-header
												h4 VII. CONTROL DE EVOLUCIÓN NUTRICIONAL
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerEvaluations" items-per-page.sync="4")
										v-expansion-panel
											v-expansion-panel-header
												h4 VIII. DIAGNÓSTICO
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-textarea(value="DIAGNÓSTICO GETUP!" outlined disabled)
										v-expansion-panel
											v-expansion-panel-header
												h4 IX. PLAN NUTRICIONAL
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-textarea(value="PLAN NUTRICIONAL GETUP!" outlined disabled)
										v-expansion-panel
											v-expansion-panel-header
												h4 X. NUTRICIONISTA TRATANTE
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-data-table.elevation-10(:items="items" :headers="headerTreatments" items-per-page.sync="4")
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
			profile: {
				email: '',
				name: '',
				birthday: '',
				document: '',
				occupation: '',
				allergies: [],
				medical_history: []
			},
			items: [],
			data: {
				age: '',
				objective: '',
				nutritional_plan: '',
				diagnostico: ''
			},
			headerFamilies: [
				{
					text: 'Patología',
					value: 'families.pathology',
					width: '300px'
				},
				{ text: 'Posee', value: 'families.own', width: '300px' },
				{ text: 'Familiar', value: 'families.family', width: '300px' }
			],
			headerActivities: [
				{ text: 'Tipo', value: 'activities.type', width: '300px' },
				{
					text: 'Intencidad',
					value: 'activities.intencidad',
					width: '300px'
				},
				{
					text: 'Frecuencia',
					value: 'activities.frecuency',
					width: '300px'
				}
			],
			headerDiseases: [
				{
					text: 'Patología',
					value: 'diseases.pathology',
					width: '300px'
				},
				{ text: 'Posee', value: 'diseases.frecuency', width: '300px' },
				{
					text: 'F. Inicio',
					value: 'diseases.start_date',
					width: '300px'
				}
			],
			headerMedicines: [
				{ text: 'Droga', value: 'medicines.drug', width: '300px' },
				{ text: 'Frecuencia', value: 'medicines.own', width: '300px' },
				{
					text: 'F. Inicio',
					value: 'medicines.start_date',
					width: '300px'
				}
			],
			headerAllergies: [
				{ text: 'Alimentos', value: 'allergies.food', width: '300px' },
				{ text: 'Alergia', value: 'allergies.allergy', width: '300px' },
				{
					text: 'Intolerancia',
					value: 'allergies.intolerant',
					width: '300px'
				}
			],
			headerHabits: [
				{ text: 'Hábito', value: 'habits.habit', width: '300px' },
				{
					text: 'Frecuencia/Detalle',
					value: 'habits.frecuency',
					width: '300px'
				}
			],
			headerEvaluations: [
				{ text: 'Dato', value: 'evaluations.data', width: '300px' },
				{ text: 'Fecha', value: 'evaluations.date', width: '300px' },
				{
					text: 'Resultado',
					value: 'evaluations.result',
					width: '300px'
				}
			],
			headerTreatments: [
				{ text: 'Fecha', value: 'treatments.date', width: '300px' },
				{
					text: 'Nuticionista',
					value: 'treatments.data',
					width: '300px'
				}
			],
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
			editedIndex: -1
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
	watch: {
		/* GERAL */
		'profile.birthday'(val) {
			if (
				typeof this.profile.birthday === 'undefined'
					? false
					: this.profile.birthday.length > 10
			) {
				this.profile.birthday = new Date().toISOString().substr(0, 10)
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getProfile()
			this.getMedicalHistory()
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
						const f1 = Number(
							(this.profile.birthday || '').substr(0, 4)
						)
						const f2 = Number(new Date().getFullYear())
						this.data.age = f2 - f1
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
		getMedicalHistory() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo mis Historial clinico...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_MEDICAL_HISTORY'
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
						const history = this.items
						if (!history) {
							this.editedMedicalHistory.medical_history = history
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
					`/api/user/${this.profile._id}`,
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
						message: `Error al realizar la solicitud ${err}`,
						type: 'error'
					})
				})
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
