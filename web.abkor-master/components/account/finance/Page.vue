<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="payment_methods" :search="search")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Metodos de Pago
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar metodos de pago" single-line hide-details)
						v-spacer
						v-tooltip(bottom)
							template(v-slot:activator="{ on }")
								v-btn.mb-2(fab small dark v-on="on" @click="toggleDialog('dPaymentmethod', true, resetForm)") #[v-icon fas fa-plus]
							span Nuevo Metodo de pago
						v-dialog(v-model="dPaymentmethod.status" scrollable persistent max-width="400px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) {{ formTitle }}
								v-card-text(style="max-height: 600px")
									v-container
										v-form
											v-row
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-text-field(v-model.trim="editedPaymentmethod.name" prepend-icon="fas fa-signature" label="Nombre de la tarjeta" required :error-messages="nameErrors" @input="$v.editedPaymentmethod.name.$touch()" @blur="$v.editedPaymentmethod.name.$touch()" @keyup.enter="toggleDialog('dPaymentmethod', false, savePaymentmethods)")
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-text-field(v-model.trim="editedPaymentmethod.card_number" label="N° Tarjeta" autofocus type="number" :append-icon="typeCard.icon" required :error-messages="cardNumberErrors" @input="$v.editedPaymentmethod.card_number.$touch()" @blur="$v.editedPaymentmethod.card_number.$touch()")
												v-col(cols="12" xs="6" sm="6" md="6" lg="6")
													v-dialog(ref="dialog" v-model="mExpiration" :return-value.sync="editedPaymentmethod.expiration" persistent width="290px")
														template(v-slot:activator="{ on }")
															v-text-field(v-model="editedPaymentmethod.expiration" label="Vencimiento" prepend-icon="fas fa-calendar-alt" readonly v-on="on" required :error-messages="expirationErrors" @input="$v.editedPaymentmethod.expiration.$touch()" @blur="$v.editedPaymentmethod.expiration.$touch()")
														v-date-picker(v-model="editedPaymentmethod.expiration" type="month" scrollable locale="es-PE")
															v-spacer
															v-btn(text color="primary" @click="mExpiration = false" small) Cancelar
															v-btn(text @click="$refs.dialog.save(editedPaymentmethod.expiration)" small) Aceptar
												v-col(cols="12" xs="6" sm="6" md="6" lg="6" prepend-icon="fas fa-lock")
													v-text-field(v-model.trim="editedPaymentmethod.ccv" label="CCV" type="number" min="100" max="9999" required :error-messages="ccvErrors" @input="$v.editedPaymentmethod.ccv.$touch()" @blur="$v.editedPaymentmethod.ccv.$touch()")
												v-col(cols="12" xs="12" sm="12" md="12" lg="12")
													v-select(v-model="editedPaymentmethod.inactive" :items="states" item-text="value2" item-value="value3" prepend-icon="fas fa-flag" label="Estado" required :error-messages="inactiveErrors" @input="$v.editedPaymentmethod.inactive.$touch()" @blur="$v.editedPaymentmethod.inactive.$touch()" @keyup.enter="toggleDialog('dPaymentmethod', false, savePaymentmethods)")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dPaymentmethod', false, () => {})") Cancelar
									v-btn(text @click="savePaymentmethods" :loading="dPaymentmethod.loading" :disabled="dPaymentmethod.loading") Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="deletePaymentmethods(item)")
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
					v-btn(text color="primary" @click="dConfirm.event_cancel") Cancelar
					v-btn(text @click="dConfirm.event_accept") Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
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
	layout: 'dashboard',
	validations: {
		editedPaymentmethod: {
			name: { required, maxLength: maxLength(30) },
			card_number: { required, luhn },
			expiration: { required, maxLength: maxLength(7) },
			ccv: { required, numeric, maxLength: maxLength(4) },
			inactive: { required }
		}
	},
	data() {
		return {
			payment_methods: [],
			states: [],
			headers: [
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
				},
				{
					text: 'Creado por',
					value: 'create_by',
					width: '150px'
				},
				{
					text: 'Fecha de creación',
					value: 'create_at',
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
				{
					text: 'Estado',
					value: 'inactive',
					width: '150px'
				},
				{
					text: 'Acción',
					value: 'action',
					sortable: false,
					width: '150px'
				}
			],
			search: '',
			typeCard: { icon: 'fas fa-credit-card' },
			mExpiration: false,
			dPaymentmethod: {
				status: false,
				loading: false
			},
			editedPaymentmethod: {
				name: '',
				card_number: '',
				type: '',
				expiration: '',
				ccv: '',
				inactive: false
			},
			defaultPaymentmethods: {
				name: '',
				card_number: '',
				type: '',
				expiration: '',
				ccv: '',
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
			methods: null
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1
				? 'Nuevo metodo de pago'
				: 'Editar metodo de pago'
		},
		nameErrors() {
			const errors = []
			if (!this.$v.editedPaymentmethod.name.$dirty) return errors
			!this.$v.editedPaymentmethod.name.required &&
				errors.push('Se requiere el nombre!')
			!this.$v.editedPaymentmethod.name.maxLength &&
				errors.push('Solo puede contener hasta 30 caracteres!')
			return errors
		},
		cardNumberErrors() {
			const errors = []
			if (!this.$v.editedPaymentmethod.card_number.$dirty) return errors
			!this.$v.editedPaymentmethod.card_number.required &&
				errors.push('Se requiere el numero de tarjeta!')
			!this.$v.editedPaymentmethod.card_number.luhn &&
				errors.push('Debe ser un numero de tarjeta valido!')
			return errors
		},
		expirationErrors() {
			const errors = []
			if (!this.$v.editedPaymentmethod.expiration.$dirty) return errors
			!this.$v.editedPaymentmethod.expiration.required &&
				errors.push('Se requiere la fecha de vencimiento!')
			!this.$v.editedPaymentmethod.expiration.maxLength &&
				errors.push('La fecha de vencimiento debe ser yyyy-MM!')
			return errors
		},
		ccvErrors() {
			const errors = []
			if (!this.$v.editedPaymentmethod.ccv.$dirty) return errors
			!this.$v.editedPaymentmethod.ccv.required &&
				errors.push('Se requiere el código de la tarjeta!')
			!this.$v.editedPaymentmethod.ccv.numeric &&
				errors.push('Debe ser un numero vlaido!')
			!this.$v.editedPaymentmethod.ccv.maxLength &&
				errors.push('Solo puede contenter hasta 4 digitos!')
			return errors
		},
		inactiveErrors() {
			const errors = []
			if (!this.$v.editedPaymentmethod.inactive.$dirty) return errors
			!this.$v.editedPaymentmethod.inactive.required &&
				errors.push('Se requiere el estado!')
			return errors
		},
		...mapState(['token'])
	},
	watch: {
		'editedPaymentmethod.card_number'(val) {
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
						this.editedPaymentmethod.type = element.name
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
			this.setToken()
			this.getPaymentmethods()
			this.getStates()
		},
		getPaymentmethods() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo metodos de pago...'
			this.methods
				.requestApi('/api/finance/', 'GET', {
					command: 'GET_PAYMENT_METHODS'
				})
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.payment_methods = resp.Response
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
				.requestApi('/api/master/', 'GET', {
					command: 'GET_MASTER',
					transaction: {
						code: 'STATE'
					}
				})
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
		editPaymentmethods(item) {
			this.editedIndex = this.payment_methods.indexOf(item)
			this.editedPaymentmethod = Object.assign({}, item)
		},
		deletePaymentmethods(item) {
			this.editedIndex = this.payment_methods.indexOf(item)
			this.editedPaymentmethod = Object.assign({}, item)
			this.dConfirm.status = true
			this.dConfirm.title = '¿Desea eliminar este metodo de pago?'
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
						`/api/finance/${this.editedPaymentmethod._id}`,
						'DELETE',
						{},
						{
							command: 'DELETE_PAYMENT_METHOD'
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						if (resp.status === 'SUCCESS') {
							this.payment_methods.splice(this.editedIndex, 1)
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
		savePaymentmethods() {
			this.$v.editedPaymentmethod.$touch()
			if (!this.$v.editedPaymentmethod.$invalid) {
				this.dPaymentmethod.loading = true
				this.dLoading.status = true
				this.dLoading.message = 'Guardando...'
				let pcommand = ''
				let pmethod = ''
				let puri = ''
				if (this.editedIndex !== -1) {
					pcommand = 'UPDATE_PAYMENT_METHOD'
					pmethod = 'PATCH'
					puri = `/api/finance/${this.editedPaymentmethod._id}`
				} else {
					pcommand = 'REGISTER_PAYMENT_METHOD'
					pmethod = 'POST'
					puri = '/api/finance/'
				}
				this.methods
					.requestApi(
						puri,
						pmethod,
						{},
						{
							command: pcommand,
							transaction: this.editedPaymentmethod
						}
					)
					.then((resp) => {
						this.dLoading.status = false
						this.dPaymentmethod.status = false
						this.dPaymentmethod.loading = false
						if (resp.status === 'SUCCESS') {
							if (this.editedIndex > -1) {
								Object.assign(
									this.payment_methods[this.editedIndex],
									this.editedPaymentmethod
								)
							} else {
								const Paymentmethods = resp.Response
								this.payment_methods.push(Paymentmethods)
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
						this.dPaymentmethod.status = false
						this.dPaymentmethod.loading = false
						this.message({
							title: 'Error',
							message: err,
							type: 'error'
						})
					})
			}
		},
		resetForm() {
			this.editedPaymentmethod = this.methods.clonex(
				this.defaultPaymentmethods
			)
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
