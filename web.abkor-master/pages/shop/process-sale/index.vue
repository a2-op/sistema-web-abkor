<template lang="pug">
	v-container
		v-card.ma-5
			v-card-title
				h4 Procesar Venta
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
											v-toolbar-title Productos
										v-list(three-line style="max-height: 600px; overflow-y: auto;")
											template(v-if="shoppingCart.length <= 0")
												v-container
													span No hay productos en el carrito
											template(v-for="(product, index) in shoppingCart" v-else)
												v-list-item
													v-list-item-avatar(v-if="product.photos.length > 0" :key="product._id")
														v-img(:src="product.photos[0]")
													v-list-item-avatar(v-else :key="product._id")
													v-list-item-content
														v-list-item-title(v-html="product.name")
														v-list-item-subtitle {{ product.quantity }} x #[span.font-weight-black S/ {{ calcPriceProduct(product) }} PEN]
												v-divider(inset)
					v-col(cols="12" xs="12" sm="6" md="8" lg="8")
						v-row
							v-col(cols="12" xs="12" sm="12" md="12" lg="12")
								template(v-if="token === null")
									v-expansion-panels#pnl-customer-information(v-model="pnlCustomerInformation" multiple ref="pnl-customer-information")
										v-expansion-panel
											v-expansion-panel-header
												h4 1.- Completa tus datos
											v-expansion-panel-content
												v-row
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														h5 Datos del cliente
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(v-model.trim="user.email" type="email" label="Correo electronico" prepend-icon="fas fa-envelope" required :error-messages="userEmailErrors" @input="$v.user.email.$touch()" @blur="$v.user.email.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(v-model.trim="user.name" label="Nombre completo" prepend-icon="fas fa-signature" required :error-messages="userNameErrors" @input="$v.user.name.$touch()" @blur="$v.user.name.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(v-model.trim="user.document" label="DNI" prepend-icon="fas fa-id-card" required :error-messages="userDocumentErrors" @input="$v.user.document.$touch()" @blur="$v.user.document.$touch()")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														h5 Datos de Envio
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-text-field(v-model.trim="address.address" label="Dirección completa" prepend-icon="fas fa-map-marker" required :error-messages="addressAddressErrors" @input="$v.address.address.$touch()" @blur="$v.address.address.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(v-model.trim="address.reference" label="Referencia" prepend-icon="fas fa-map-pin" required :error-messages="addressReferenceErrors" @input="$v.address.reference.$touch()" @blur="$v.address.reference.$touch()")
													v-col(cols="12" xs="12" sm="12" md="6" lg="6")
														v-text-field(v-model.trim="address.mobile" label="Telefono" prepend-icon="fas fa-phone" required :error-messages="addressMobileErrors" @input="$v.address.mobile.$touch()" @blur="$v.address.mobile.$touch()")
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-btn(@click="payOrder") Comprar Ahora #[v-icon(right dark) fas fa-money-check]
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
																v-btn(@click="payWithCard" :disabled="shopping_cart.total_items <= 0") Pagar con
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="configuration.payment_methods.cash.active")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/cash-payment.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga mediante transferencia bancaria
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCash" :disabled="shopping_cart.total_items <= 0") Pagar con
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
														h5 Seleccionar dirección Envio
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" style="overflow: auto;")
														v-data-table.elevation-1(v-model="selectedAddress" :headers="headDirections" item-key="_id" :items="editedProfile.addresses" single-select show-select)
													v-col(cols="12" xs="12" sm="12" md="12" lg="12")
														v-btn(@click="payOrderProfile") Comprar Ahora #[v-icon(right dark) fas fa-money-check]
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
																v-btn(@click="payWithCard" :disabled="shopping_cart.total_items <= 0") Pagar con
													v-col(cols="12" xs="12" sm="12" md="12" lg="12" v-if="configuration.payment_methods.cash.active")
														v-row(align="center")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																img(src="/img/cash-payment.png" width="120px")
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																h4 Paga mediante transferencia bancaria
															v-col.text-center(cols="12" xs="6" sm="6" md="4" lg="4")
																v-btn(@click="payWithCash" :disabled="shopping_cart.total_items <= 0") Pagar con
		v-dialog(v-model="dPayment.status" persistent width="350")
			v-card(v-if="token === null")
				v-card-title.black
					v-icon fas fa-times
					v-img.ma-3(:src="configuration.company.logo" width="80%")
				v-card-text
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-text-field(v-model.trim="billing.card_number" label="N° Tarjeta" autofocus type="number" :append-icon="typeCard.icon" required :error-messages="billingCardNumberErrors" @input="$v.billing.card_number.$touch()" @blur="$v.billing.card_number.$touch()")
						v-col(cols="12" xs="6" sm="6" md="6" lg="6")
							v-dialog(ref="dialog" v-model="mExpiration" :return-value.sync="billing.expiration" persistent width="290px")
								template(v-slot:activator="{ on }")
									v-text-field(v-model="billing.expiration" label="Vencimiento" prepend-icon="fas fa-calendar-alt" readonly v-on="on" required :error-messages="billingExpirationErrors" @input="$v.billing.expiration.$touch()" @blur="$v.billing.expiration.$touch()")
								v-date-picker(v-model="billing.expiration" type="month" scrollable locale="es-PE")
									v-divider
									v-spacer
									v-btn(text color="primary" @click="mExpiration = false") Cancelar
									v-btn(text @click="$refs.dialog.save(billing.expiration)") Aceptar
						v-col(cols="12" xs="6" sm="6" md="6" lg="6" prepend-icon="fas fa-lock")
							v-text-field(v-model.trim="billing.ccv" label="CCV" type="number" min="100" max="9999" required :error-messages="billingCcvErrors" @input="$v.billing.ccv.$touch()" @blur="$v.billing.ccv.$touch()")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-btn(block @click="payNow" :disabled="shopping_cart.total_items <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
						v-col.text-center(cols="12" xs="12" sm="12" md="12" lg="12" style="text-decoration: underline;")
							a(block @click="closePayment") Cerrar
			v-card(v-else)
				v-card-title.black
					v-icon fas fa-times
					v-img.ma-3(:src="configuration.company.logo" width="80%")
				v-card-text(style="max-height: 600px")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							AccountFinanceAutocomplete(v-model="selectedCard")
					v-row
						v-col(cols="12" xs="12" sm="12" md="12" lg="12")
							v-btn(block @click="payNowProfile" :disabled="shopping_cart.total_items <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
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
							v-btn(v-if="token !== null" block @click="payNowCashProfile" :disabled="shopping_cart.total_items <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
							v-btn(v-else block @click="payNowCash" :disabled="shopping_cart.total_items <= 0 || dLoading.loading" :loading="dLoading.loading") Pagar ahora
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
		v-dialog(v-model="dFinance.status" scrollable persistent)
			v-card(color="white")
				v-card-title.headline.grey.lighten-2(primary-title) Finanzas
				v-card-text(style="height: 600px")
					AccountFinance(v-if="dFinance.status")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text color="primary" @click="toggleDialog('dFinance', false, () => {})") Cerrar
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
		address: {
			address: { required, maxLength: maxLength(3000) },
			reference: { maxLength: maxLength(3000) },
			mobile: { required, maxLength: maxLength(10) }
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
				name: '',
				document: '',
				addresses: []
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
			address: {
				name: '',
				mobile: '',
				address: '',
				reference: ''
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
			headDirections: [
				{ text: 'Nombre y Apellido', value: 'name', width: '150px' },
				{ text: 'Móvil', value: 'mobile', width: '150px' },
				{ text: 'Dirección', value: 'address', width: '150px' },
				{ text: 'Referencia', value: 'reference', width: '150px' }
			],
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
			selectedAddress: [],
			selectedCard: null
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
		addressAddressErrors() {
			const errors = []
			if (!this.$v.address.address.$dirty) return errors
			!this.$v.address.address.required &&
				errors.push('Se requiere la dirección!')
			!this.$v.address.address.maxLength &&
				errors.push('La dirección solo puede contener 3000 caracteres!')
			return errors
		},
		addressReferenceErrors() {
			const errors = []
			if (!this.$v.address.reference.$dirty) return errors
			!this.$v.address.reference.maxLength &&
				errors.push(
					'La referencia solo puede contener 3000 caracteres!'
				)
			return errors
		},
		addressMobileErrors() {
			const errors = []
			if (!this.$v.address.mobile.$dirty) return errors
			!this.$v.address.mobile.required &&
				errors.push('Se requiere un numero de telefono!')
			!this.$v.address.mobile.maxLength &&
				errors.push('El telefono solo puede contener 10 caracteres!')
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
		billingCardNumberErrors() {
			const errors = []
			if (!this.$v.billing.card_number.$dirty) return errors
			!this.$v.billing.card_number.required &&
				errors.push('Se requiere el numero de tarjeta!')
			!this.$v.billing.card_number.luhn &&
				errors.push('Debe ser un numero de tarjeta valido!')
			return errors
		},
		billingExpirationErrors() {
			const errors = []
			if (!this.$v.billing.expiration.$dirty) return errors
			!this.$v.billing.expiration.required &&
				errors.push('Se requiere la fecha de vencimiento!')
			!this.$v.billing.expiration.maxLength &&
				errors.push('La fecha de vencimiento debe ser yyyy-MM!')
			return errors
		},
		billingCcvErrors() {
			const errors = []
			if (!this.$v.billing.ccv.$dirty) return errors
			!this.$v.billing.ccv.required &&
				errors.push('Se requiere el código de la tarjeta!')
			!this.$v.billing.ccv.maxLength &&
				errors.push('Solo puede contenter hasta 4 digitos!')
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
		profile(val) {
			if (val) {
				this.selectedAddress = []
				val.addresses.forEach((address) => {
					if (address.principal) {
						this.selectedAddress.push(address)
					}
				})
			}
		},
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
		},
		payOrder() {
			this.$v.user.$touch()
			this.$v.address.$touch()
			if (!this.$v.user.$invalid && !this.$v.address.$invalid) {
				this.pnlCustomerInformation = [1]
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payOrderProfile() {
			this.$v.editedProfile.$touch()
			const _self = this
			if (
				!this.$v.editedProfile.$invalid &&
				this.selectedAddress.length > 0
			) {
				this.pnlCustomerInformation = [1]
			} else {
				if (this.selectedAddress.length <= 0) {
					_self.message({
						title: 'Atención',
						message:
							'Debe seleccionar una dirección de entrega para cotinuar con el pedido',
						type: 'warn'
					})
				}
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
				this.user.address = this.selectedAddress[0]
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER_USER',
							transaction: {
								user: this.user,
								products: this.shoppingCart,
								billing: null,
								status: 'PENDING',
								total_price: this.shopping_cart.total_price,
								total_quantity: this.shopping_cart.total_items,
								operation_number: this.operation_number,
								method: 'CASH'
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
		payNowCash() {
			this.$v.operation_number.$touch()
			if (!this.$v.operation_number.$invalid) {
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su pedido...'
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER',
							transaction: {
								user: this.user,
								products: this.shoppingCart,
								billing: null,
								status: 'PENDING',
								total_price: this.shopping_cart.total_price,
								total_quantity: this.shopping_cart.total_items,
								operation_number: this.operation_number,
								method: 'CASH'
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
									'Su pedido fue registrado exitosamente, hemos enviado la información a su correo',
								type: 'success'
							})
							this.methods.setHistory({
								origin: 'ORDERS',
								title: 'Realizar compra',
								content: `se ha comprado ${this.shoppingCart.length} productos`,
								module: 'ACCOUNT',
								color: 'indigo'
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
			this.$v.address.$touch()
			this.$v.editedProfile.$touch()
			if (
				(this.token === null &&
					!this.$v.user.$invalid &&
					!this.$v.address.$invalid) ||
				(this.token !== null &&
					!this.$v.editedProfile.$invalid &&
					this.selectedAddress &&
					this.selectedAddress.length > 0)
			) {
				this.dPayment.status = true
			} else {
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			}
		},
		payNow() {
			this.$v.billing.$touch()
			this.user.address = this.address
			if (!this.$v.billing.$invalid) {
				this.closePayment()
				this.dLoading.status = true
				this.dLoading.message = 'Registrando su pedido...'
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER',
							transaction: {
								user: this.user,
								products: this.shoppingCart,
								billing: this.billing,
								status: 'PENDING',
								total_price: this.shopping_cart.total_price,
								total_quantity: this.shopping_cart.total_items,
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
							this.methods.setHistory({
								origin: 'ORDERS',
								title: 'Realizar compra',
								content: `se ha comprado ${this.shoppingCart.length} productos`,
								module: 'ACCOUNT',
								color: 'indigo'
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
		payNowProfile() {
			const _self = this
			if (this.selectedAddress.length <= 0) {
				_self.message({
					title: 'Atención',
					message:
						'Debe seleccionar una dirección de entrega para cotinuar con el pedido',
					type: 'warn'
				})
				this.pnlCustomerInformation = [0]
				this.selector = '#pnl-customer-information'
				this.$vuetify.goTo(this.target, this.options)
			} else if (!this.selectedCard) {
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
				this.user.address = this.selectedAddress[0]
				this.methods
					.requestApi(
						'/api/order',
						'POST',
						{},
						{
							command: 'REGISTER_ORDER_USER',
							transaction: {
								user: this.user,
								products: this.shoppingCart,
								billing: this.selectedCard,
								status: 'PENDING',
								total_price: this.shopping_cart.total_price,
								total_quantity: this.shopping_cart.total_items,
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
							this.methods.setHistory({
								origin: 'ORDERS',
								title: 'Realizar compra',
								content: `se ha comprado ${this.shoppingCart.length} productos`,
								module: 'ACCOUNT',
								color: 'indigo'
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
		calcPriceProduct(item) {
			const price = item.price
			let total = price
			item.variants.forEach((variant) => {
				variant.selection = variant.selection ? variant.selection : 0
				const option = variant.options[variant.selection]
				if (variant.options.length <= 0) {
					return total
				}
				if (option.type_additional === '%') {
					if (
						option.additional_amount === null ||
						option.additional_amount === ''
					) {
						option.additional_amount = 0
					}
					const addPrice =
						(item.price * parseFloat(option.additional_amount)) /
						100
					total += addPrice
				} else {
					total += parseFloat(option.additional_amount)
				}
			})
			return total
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
		saveProfile() {
			this.$refs.AccountMe.saveProfile()
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
