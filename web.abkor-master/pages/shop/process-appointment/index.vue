<template lang="pug">
	v-container
		v-card.ma-5
			v-card-title
				h4 Adquirir citas
				v-spacer
				v-select(v-model="selectedAppointment" menu-props="auto" label="Elegir monto de cita" prepend-icon="fa fa-icon" :items="appointments" item-text="price" item-value="price")
				v-spacer
				v-text-field(v-model="quantity" label="Cantidad" type="number")
			v-card-text
				v-row
					v-col(cols="12" xs="12" sm="6" md="4" lg="4")
						v-expansion-panels(v-model="pnlSummaryOrder" multiple)
							v-expansion-panel
								v-expansion-panel-header
									h4 Resumen del Pedido
								v-expansion-panel-content
									v-card.mx-auto
										v-toolbar(dark)
											v-toolbar-title Citas
										v-list(three-line style="max-height: 600px; overflow-y: auto;")
											template(v-if="quantity <= 0")
												v-container
													span Ingresar cantidad
											template(v-else)
												v-container
													span Cantidad : #[span {{ quantity }}]
													v-spacer
													v-divider
													v-spacer
													span Total : #[span {{ quantity * selectedAppointment }}]
												v-divider(inset)
					v-col(cols="12" xs="12" sm="6" md="8" lg="8")
						v-row
							v-col(cols="12" xs="12" sm="12" md="12" lg="12")
								template
									v-expansion-panels#pnl-customer-information(v-model="pnlCustomerInformation" multiple ref="pnl-customer-information")
										v-expansion-panel
											v-expansion-panel-header
												h4 1.- Datos de Facturación
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														h5 Datos del cliente
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(:value="editedProfile.email" type="email" label="Correo electronico" prepend-icon="fas fa-envelope" readonly required :error-messages="profileEmailErrors" @input="$v.editedProfile.email.$touch()" @blur="$v.editedProfile.email.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(:value="editedProfile.name" label="Nombre completo" prepend-icon="fas fa-signature" readonly required :error-messages="profileNameErrors" @input="$v.editedProfile.name.$touch()" @blur="$v.editedProfile.name.$touch()")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-btn(@click="payOrderProfile" small) Comprar Ahora #[v-icon(right dark) fas fa-money-check]
										v-expansion-panel
											v-expansion-panel-header
												h4 2.- Selecciona tu metodo de pago
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/payment-methods.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga de forma segura con tarjeta de crédito o débito
																span Con ésta opción el cargo será en la moneda indicada
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCard" :disabled="quantity <= 0 || !selectedAppointment" small) Pagar con
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="configuration.payment_methods.cash.active")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/cash-payment.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga mediante transferencia bancaria
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCash" :disabled="quantity <= 0 || !selectedAppointment" small) Pagar con
		v-dialog(v-model="dPayment.status" persistent width="350")
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
							v-btn(block @click="payNowProfile" :disabled="quantity <= 0 || dLoading.loading" :loading="dLoading.loading" small) Pagar ahora
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closePayment()" small) Cerrar
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
							v-btn(block @click="payNowCashProfile" :disabled="quantity <= 0 || dLoading.loading" :loading="dLoading.loading" small) Pagar ahora
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closePaymentCash()" small) Cerrar
		v-overlay(:value="dLoading.status")
			v-dialog(v-model="dLoading.status" hide-overlay persistent width="300")
				v-card(dark)
					v-card-text {{ dLoading.message }}
						v-progress-linear.mb-0(indeterminate color="white")
		v-dialog(v-model="dFinance.status" scrollable persistent)
			v-card(color="white")
				v-card-title.headline.grey.lighten-2(primary-title) Finanzas
				v-card-text(style="height: 600px")
					AccountFinance(v-if="dFinance.status")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="toggleDialog('dFinance', false, () => {})" small) Cerrar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required, maxLength, email, numeric } from 'vuelidate/lib/validators'
import AccountMe from '@/components/account/me/Page'
import AccountFinanceAutocomplete from '@/components/account/finance/Autocomplete'
import Util from '@/assets/js/util'
const luhn = (value) => {
	if (/[^0-9-\s]+/.test(value)) return false
	// The Luhn Algorithm. It's so pretty.
	let nCheck = 0
	let nDigit = 0
	let bEven = false
	value = value.replace(/\D/g, '')

	for (let n = value.length - 1; n >= 0; n--) {
		const cDigit = value.charAt(n)
		nDigit = parseInt(cDigit, 10)

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9
		}

		nCheck += nDigit
		bEven = !bEven
	}

	return nCheck % 10 === 0
}
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
		billing: {
			card_number: { required, luhn },
			expiration: { required, maxLength: maxLength(7) },
			ccv: { required, maxLength: maxLength(4) }
		},
		operation_number: { required, numeric }
	},
	data() {
		return {
			pnlSummaryOrder: [0],
			pnlCustomerInformation: [0],
			dPayment: {
				status: false
			},
			dPaymentCash: {
				status: false
			},
			user: {
				email: '',
				name: ''
			},
			operation_number: null,
			billing: {
				card_number: '',
				expiration: '',
				ccv: '',
				currency: 'PEN'
			},
			defaultBilling: {
				card_number: '',
				expiration: '',
				ccv: '',
				type: '',
				currency: 'PEN'
			},
			typeCard: { icon: 'fas fa-credit-card' },
			mExpiration: false,
			selector: '#pnl-customer-information',
			type: 'selector',
			duration: 1000,
			offset: 0,
			easing: 'easeInOutCubic',
			dProfile: {
				status: false
			},
			dFinance: {
				status: false
			},
			dLoading: {
				status: false,
				message: '',
				loading: false
			},
			selectedCard: null,
			quantity: 0,
			editedAppointment: {
				name: 'CITA',
				tags: ['CODE#CITA'],
				price: this.selectedAppointment,
				stock: 1,
				inactive: false
			},
			defaultAppointment: {
				name: 'CITA',
				tags: ['CODE#CITA'],
				price: 0,
				stock: 0,
				inactive: false
			},
			code: 'CITA#ADM',
			appointments: [],
			selectedAppointment: ''
		}
	},
	computed: {
		shoppingCart() {
			const valor = Object.assign({}, this.shopping_cart).data
			return valor
		},
		editedProfile() {
			if (this.profile) {
				return this.profile
			} else {
				return this.user
			}
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
		...mapState(['shopping_cart', 'profile', 'token', 'configuration'])
	},
	watch: {
		'billing.card_number'(val) {
			const identifiers = [
				{
					name: 'VISA',
					pattern: /^4\d{12}(\d{3})?$/,
					icon: 'fab fa-cc-visa'
				},
				{
					name: 'MasterCard',
					pattern: /^(5[1-5]\d{4}|677189)\d{10}$/,
					icon: 'fab fa-cc-mastercard'
				},
				{
					name: 'Discover',
					pattern: /^6(?:011\d\d|5\d{4}|4[4-9]\d{3}|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d\d|9(?:[01]\d|2[0-5])))\d{10}$/,
					icon: 'fab fa-cc-discover'
				},
				{
					name: 'Amex',
					pattern: /^3[47]\d{13}$/,
					icon: 'fab fa-cc-amex'
				},
				{
					name: 'Diners',
					pattern: /^3(0[0-5]|[68]\d)\d{11}$/,
					icon: 'fab fa-cc-diners-club'
				},
				{
					name: 'JCB',
					pattern: /^35(28|29|[3-8]\d)\d{12}$/,
					icon: 'fab fa-cc-jcb'
				},
				{
					name: 'Switch',
					pattern: /^6759\d{12}(\d{2,3})?$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Solo',
					pattern: /^6767\d{12}(\d{2,3})?$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Dankort',
					pattern: /^5019\d{12}$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Maestro',
					pattern: /^(5[06-8]|6\d)\d{10,17}$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Forbrugsforeningen',
					pattern: /^600722\d{10}$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Laser',
					pattern: /^(6304|6706|6771|6709)\d{8}(\d{4}|\d{6,7})?$/,
					icon: 'fas fa-credit-card'
				},
				{
					name: 'Unknown',
					pattern: /.*/,
					icon: 'fas fa-credit-card'
				}
			]
			let aux = true
			identifiers.forEach((element) => {
				if (aux) {
					if (element.pattern.test(val)) {
						this.typeCard = element
						this.billing.type = element.name
						aux = !aux
					}
				}
			})
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getAppointments()
		},
		getAppointments() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo citas...'
			this.methods
				.requestApi(
					'/api/appointment/',
					'GET',
					{
						command: 'GET_ADMIN_APPOINTMENTS',
						transaction: {
							code: this.code
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.appointments = resp.Response
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
		payOrder() {
			this.$v.user.$touch()
			if (!this.$v.user.$invalid) {
				this.pnlCustomerInformation = [1]
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payOrderProfile() {
			this.$v.editedProfile.$touch()
			if (!this.$v.editedProfile.$invalid) {
				this.pnlCustomerInformation = [1]
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payNowCashProfile() {
			this.$v.operation_number.$touch()
			if (!this.$v.operation_number.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su pedido...'
				this.user = this.editedProfile
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER_APPOINTMENT',
							transaction: {
								user: this.user,
								products: this.editedAppointment,
								billing: null,
								status: 'PENDING',
								total_price:
									this.quantity * this.selectedAppointment,
								total_quantity: this.quantity,
								operation_number: this.operation_number,
								method: 'CASH'
							}
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.Response === 'ERROR') {
							this.message({
								title: 'Error',
								message: resp.Response,
								type: 'error'
							})
						} else {
							this.message({
								title: 'Excelente',
								message:
									'Su pedido fue registrado exitosamente, hemos enviado la información a su correo',
								type: 'success'
							})
							// Se vacia el carrito
							const data = this.methods.clonex(this.shoppingCart)
							data.forEach((element) => {
								this.removeProduct(element)
							})
							this.$router.push('/')
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
			this.$v.user.$touch()
			this.$v.editedProfile.$touch()
			if (!this.$v.user.$invalid || !this.$v.editedProfile.$invalid) {
				this.dPayment.status = true
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payNowProfile() {
			const _self = this
			if (!this.selectedCard) {
				_self.message({
					title: 'Atención',
					message:
						'Debe seleccionar un metodo de pago para cotinuar con el pedido',
					type: 'warn'
				})
			} else {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su pedido...'
				this.user = this.editedProfile
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER_APPOINTMENT',
							transaction: {
								user: this.user,
								products: this.editedAppointment,
								billing: this.selectedCard,
								status: 'PENDING',
								total_price:
									this.quantity * this.selectedAppointment,
								total_quantity: this.quantity,
								operation_number: null,
								method: 'CARD'
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
						} else if (
							resp.status !== 'ERROR' &&
							(resp.Response.capture ||
								resp.Response.transactionResponse.state ===
									'APPROVED')
						) {
							this.message({
								title: 'Excelente',
								message:
									'Su pedido fue registrado exitosamente, hemos enviado la información a su correo',
								type: 'success'
							})
							// Se vacia el carrito
							const data = this.methods.clonex(this.shoppingCart)
							data.forEach((element) => {
								this.removeProduct(element)
							})
							this.$router.push('/')
						} else {
							this.message({
								title: 'Error',
								message:
									'ocurrio un error al realizar su pedido',
								type: 'error'
							})
						}
					})
					.catch((err) => {
						this.dLoading.status = false
						this.closePayment()
						this.message({
							title: 'Error',
							message: `Error al realizar la solicitud ${err}`,
							type: 'error'
						})
					})
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
		openModalProfile() {
			this.dProfile.status = true
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			_self[dialog].status = state
			event()
		},
		...mapMutations(['removeProduct'])
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
