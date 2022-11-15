<template lang="pug">
	v-container
		v-card.md-5
			v-card-title
				h4 Adquirir plan
			v-card-text
				v-row
					v-col(cols="12" xs="12" sm="6" md="4" lg="4")
						v-expansion-panels(v-model="pnlSummaryPlan" multiple)
							v-expansion-panel
								v-expansion-panel-header
									h4 Resumen
								v-expansion-panel-content
									v-card.mx-auto
										v-toolbar(dark)
											v-toolbar-title Plan
										v-list(three-line style="max-height: 600px; overflow-y: auto;")
											template(v-if="shoppingPlan <= 0")
												v-container
													span No se ha seleccionado ningun plan
											template(v-for="(plan, index) in shoppingPlan" v-else)
												v-list-item
													v-list-item-avatar(v-if="plan.photos.length > 0" :key="plan._id")
														v-img(:src="plan.photos[0]")
													v-list-item-avatar(v-else :key="plan._id")
													v-list-item-content
														v-list-item-title(v-html="plan.name")
														v-list-item-subtitle {{ plan.duration }} {{ nameInterval(plan.interval ? plan.interval : '') }} x #[span.font-weight-black S/ {{ plan.price }}]
												v-divider(inset)
					v-col(cols="12" xs="12" sm="6" md="8" lg="8")
						v-row
							v-col(cols="12" xs="12" sm="12" md="12" lg="12")
								template(v-if="token === null")
									v-expansion-panels#pnl-customer-information(v-model="pnlCustomerInformation" multiple ref="pnl-customer-information")
										v-expansion-panel
											v-expansion-panel-header
												h4 Inicia Sessión
								template(v-else)
									v-expansion-panels#pnl-customer-information(v-model="pnlCustomerInformation" multiple ref="pnl-customer-information")
										v-expansion-panel
											v-expansion-panel-header
												h4 1.- Datos de Facturación
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-spacer
														v-btn.mx-2(fab dark small @click="openModalProfile")
															v-icon(dark) fas fa-pen
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														h5 Datos del cliente
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(:value="editedProfile.email" type="email" label="Correo electronico" prepend-icon="fas fa-envelope" readonly required :error-messages="profileEmailErrors" @input="$v.editedProfile.email.$touch()" @blur="$v.editedProfile.email.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(:value="editedProfile.name" label="Nombre completo" prepend-icon="fas fa-signature" readonly required :error-messages="profileNameErrors" @input="$v.editedProfile.name.$touch()" @blur="$v.editedProfile.name.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(:value="editedProfile.document" label="DNI" prepend-icon="fas fa-id-card" readonly required :error-messages="profileDocumentErrors" @input="$v.editedProfile.document.$touch()" @blur="$v.editedProfile.document.$touch()")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-btn(@click="payPlanProfile") Comprar Ahora #[v-icon(right dark) fas fa-money-check]
										v-expansion-panel
											v-expansion-panel-header
												h4 2.- Selecciona tu metodo de pago
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="configuration.payment_methods.active")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/payment-methods.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga de forma segura con tarjeta de crédito o débito
																span Con ésta opción el cargo será en la moneda indicada
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCard" :disabled="shoppingPlan <= 0") Pagar con
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="configuration.payment_methods.cash.active")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/cash-payment.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga mediante transferencia bancaria
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCash" :disabled="shoppingPlan <= 0") Pagar con
		v-dialog(v-model="dPayment.status" persistent scrollable width="350")
			v-card
				v-card-title.black
					v-icon fas fa-times
					v-img.ma-3(:src="configuration.company.logo" width="80%")
				v-card-text(style="max-height: 600px")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							AccountFinanceAutocomplete(v-model="selectedCard")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-btn(block @click="payNowProfile" :disabled="shoppingPlan <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closePayment()") Cerrar

		v-dialog(v-model="dPaymentCash.status" persistent scrollable width="450")
			v-card
				v-card-title.black
					v-icon fas fa-times
					v-img.ma-3(:src="configuration.company.logo" width="80%")
				v-card-text(style="max-height: 600px")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							span Abone el monto a una de nuestras cuentas y escriba el número de la operación
					v-divider
					v-list(three-line)
						template(v-for="(bank_account, index) in this.configuration.payment_methods.cash.bank_accounts")
							v-list-item(:key="index" @click="")
								v-list-item-avatar
									span {{ bank_account.bank }}
								v-list-item-content
									v-list-item-subtitle N. de cuenta: {{ bank_account.number_account }}
									v-list-item-subtitle N. Interbancario: {{ bank_account.cci }}
									v-list-item-subtitle Beneficiario: {{ bank_account.beneficiary }}
							v-divider
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-text-field(v-model="operation_number" label="N° de Operación" prepend-icon="fas fa-file-invoice" required :error-messages="operationNumberErrors" @input="$v.operation_number.$touch()" @blur="$v.operation_number.$touch()")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-btn(block @click="payNowCashProfile" :disabled="shoppingPlan <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closePaymentCash()") Cerrar
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
		v-dialog(v-model="dProfile.status" scrollable persistent)
			v-card(color="white")
				v-card-title.headline.grey.lighten-2(primary-title) Mi perfil
				v-card-text(style="height: 600px")
					AccountMe(v-if="dProfile.status" ref="AccountMe")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="toggleDialog('dProfile', false, () => {})") Cerrar
					v-btn(text @click="toggleDialog('dProfile', false, saveProfile())") Guardar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required, maxLength, email, numeric } from 'vuelidate/lib/validators'
import AccountMe from '@/components/account/me/Page'
import AccountFinanceAutocomplete from '@/components/account/finance/Autocomplete'
import Util from '@/assets/js/util'
export default {
	layout: 'main',
	components: {
		AccountMe,
		AccountFinanceAutocomplete
	},
	validations: {
		user: {
			email: { required, email },
			name: { required, maxLength: maxLength(250) },
			document: { required, maxLength: maxLength(10) }
		},
		editedProfile: {
			email: { required, email },
			name: { required, maxLength: maxLength(250) },
			document: { required, maxLength: maxLength(10) }
		},
		operation_number: { required, numeric }
	},
	data() {
		return {
			pnlSummaryPlan: [0],
			operation_number: '',
			pnlCustomerInformation: [0],
			user: {
				email: '',
				name: '',
				document: ''
			},
			typeCard: { icon: 'fas fa-credit-card' },
			mExpiration: false,
			selector: '#pnl-customer-information',
			type: 'selector',
			duration: 1000,
			offset: 0,
			easing: 'easeInOutCubic',
			searchCard: '',
			dLoading: {
				status: false,
				message: ''
			},
			dProfile: {
				status: false
			},
			dPayment: {
				status: false
			},
			dPaymentCash: {
				status: false
			},
			dCard: {
				status: false,
				loading: false
			},
			billing: {
				token_id: ''
			},
			defaultBilling: {
				token_id: ''
			},
			headCards: [
				{
					text: 'Nombre asociado',
					value: 'name',
					width: '150px'
				},
				{
					text: 'Número',
					value: 'card_number',
					width: '150px'
				},
				{
					text: 'Tipo',
					value: 'type',
					width: '150px'
				}
			],
			selectedCard: [],
			intervals: []
		}
	},
	computed: {
		shoppingPlan() {
			const valor = Object.assign({}, this.shopping_plan).data
			return valor
		},
		editedProfile() {
			if (this.profile) {
				return this.profile
			} else {
				return this.user
			}
		},
		userEmailErrors() {
			const errors = []
			if (!this.$v.user.email.$dirty) return errors
			!this.$v.user.email.required && errors.push('Se requiere el email!')
			!this.$v.user.email.email &&
				errors.push('Debe ser un email válido!')
			return errors
		},
		userNameErrors() {
			const errors = []
			if (!this.$v.user.name.$dirty) return errors
			!this.$v.user.name.required && errors.push('Se requiere el nombre!')
			!this.$v.user.name.maxLength &&
				errors.push(
					'El nombre solo puede contener hasta 250 caracteres!'
				)
			return errors
		},
		userDocumentErrors() {
			const errors = []
			if (!this.$v.user.document.$dirty) return errors
			!this.$v.user.document.required &&
				errors.push('Se requiere el documento!')
			!this.$v.user.document.maxLength &&
				errors.push(
					'El nombre solo puede contener hasta 10 caracteres!'
				)
			return errors
		},
		operationNumberErrors() {
			const errors = []
			if (!this.$v.operation_number.$dirty) return errors
			!this.$v.operation_number.required &&
				errors.push('Se requiere el número de operación!')
			!this.$v.operation_number.numeric &&
				errors.push('Debe ser un número!')
			return errors
		},
		profileEmailErrors() {
			const errors = []
			if (!this.$v.editedProfile.email.$dirty) return errors
			!this.$v.editedProfile.email.required &&
				errors.push('Se requiere el email!')
			!this.$v.editedProfile.email.email &&
				errors.push('Debe ser un email válido!')
			return errors
		},
		profileNameErrors() {
			const errors = []
			if (!this.$v.editedProfile.name.$dirty) return errors
			!this.$v.editedProfile.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedProfile.name.maxLength &&
				errors.push(
					'El nombre solo puede contener hasta 250 caracteres!'
				)
			return errors
		},
		profileDocumentErrors() {
			const errors = []
			if (!this.$v.editedProfile.document.$dirty) return errors
			!this.$v.editedProfile.document.required &&
				errors.push('Se requiere el documento!')
			!this.$v.editedProfile.document.maxLength &&
				errors.push(
					'El nombre solo puede contener hasta 10 caracteres!'
				)
			return errors
		},
		target() {
			const value = this[this.type]
			if (!isNaN(value)) return Number(value)
			else return value
		},
		options() {
			return {
				duration: this.duration,
				offset: this.offset,
				easing: this.easing
			}
		},
		...mapState(['shopping_plan', 'profile', 'token', 'configuration'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getIntervals()
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
					{}
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
		payPlanProfile() {
			this.$v.editedProfile.$touch()
			if (!this.$v.editedProfile.$invalid) {
				this.pnlCustomerInformation = [1]
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payNowProfile() {
			if (this.selectedCard.length <= 0) {
				this.message({
					title: 'Atención',
					message:
						'Debe seleccionar una tarjeta para continuar con la operación',
					type: 'warn'
				})
			} else {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su plan...'
				this.shoppingPlan[0].state = 'ASSOCIATED'
				this.shoppingPlan[0].method = 'CARD'
				this.shoppingPlan[0].operation_number = this.operation_number
				this.methods
					.requestApi(
						'/api/user',
						'POST',
						{},
						{
							command: 'ASSOCIATE_PLAN',
							transaction: {
								plan: this.shoppingPlan[0],
								billing: this.selectedCard
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.Response.code === 'ERROR') {
							this.message({
								title: 'Error',
								message: resp.Response,
								type: 'error'
							})
						} else {
							this.message({
								title: 'Excelente',
								message:
									'Se ha asociado el plan a su cuenta correctamente',
								type: 'success'
							})
							// Se vacia el carrito
							this.shoppingPlan.forEach((element) => {
								this.removePlan(element)
							})
							this.$router.push('/account/me')
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
		payNowCashProfile() {
			this.$v.operation_number.$touch()
			if (!this.$v.operation_number.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su pedido...'
				this.shoppingPlan[0].state = 'PENDING'
				this.shoppingPlan[0].method = 'CASH'
				this.shoppingPlan[0].operation_number = this.operation_number
				this.methods
					.requestApi(
						'/api/user',
						'POST',
						{},
						{
							command: 'ASSOCIATE_PLAN',
							transaction: {
								plan: this.shoppingPlan[0],
								billing: null
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.Response.code === 'ERROR') {
							this.message({
								title: 'Error',
								message: resp.Response,
								type: 'error'
							})
						} else {
							this.message({
								title: 'Excelente',
								message:
									'Se ha asociado el plan a su cuenta correctamente, su plan sera activado cuando se verifique el abono',
								type: 'success'
							})
							// Se vacia el carrito
							this.shoppingPlan.forEach((element) => {
								this.removePlan(element)
							})
							this.$router.push('/account/me')
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
		payWithCard() {
			this.$v.editedProfile.$touch()
			if (!this.$v.editedProfile.$invalid) {
				this.dPayment.status = true
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payWithCash() {
			this.$v.editedProfile.$touch()
			if (!this.$v.editedProfile.$invalid) {
				this.dPaymentCash.status = true
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		closePayment() {
			this.$v.$reset()
			this.dPayment.status = false
			setTimeout(() => {
				this.billing = Object.assign({}, this.defaultBilling)
			}, 300)
		},
		closePaymentCash() {
			this.$v.$reset()
			this.dPaymentCash.status = false
			setTimeout(() => {
				this.billing = Object.assign({}, this.defaultBilling)
			}, 300)
		},
		nameInterval(code) {
			let value = ''
			this.intervals.forEach((interval) => {
				if (interval.value1 === code) {
					value = interval.value2
				}
			})
			return value
		},
		openModalProfile() {
			this.dProfile.status = true
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		saveProfile() {
			this.$refs.AccountMe.saveProfile()
		},
		...mapMutations(['removePlan'])
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
