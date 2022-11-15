<template lang="pug">
	div
		v-autocomplete(:value="value" :prepend-icon="prependIcon" :required="required" return-object item-text="card_number" item-value="_id" :items="items" hide-selected :label="label" :multiple="multiple" no-data-text="No se ha encontrado información" persistent-hint small-chips @change="$emit('change', $event)" :error-messages="valueErrors" @input="$v.value.$touch()" @blur="$v.value.$touch()" :clearable="clearable" :disabled="disabled")
			template(v-slot:append-outer)
				v-slide-x-reverse-transition(mode="out-in")
					v-icon(@click="editItem" v-if="!Array.isArray(value) && value !== null") fas fa-pen
			template(v-slot:append-outer)
				v-slide-x-reverse-transition(mode="out-in")
					v-icon(@click="addItem") fas fa-plus
		v-dialog(v-model="dCard.status" scrollable persistent max-width="1000px")
			v-card
				v-card-title.headline.grey.lighten-2(primary-title) Finanzas
				v-card-text(style="max-height: 600px")
					AccountFinance(v-if="dCard.status")
				v-divider
				v-card-actions
					v-spacer
					v-btn(text @click="closeDialog" color="primary") Cerrar
</template>
<script>
import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'
import Util from '@/assets/js/util'
import AccountFinance from '@/components/account/finance/Page'
export default {
	components: {
		AccountFinance
	},
	mixins: [validationMixin],
	validations: {
		value: {
			required: requiredIf((valueModel) => {
				return valueModel.required
			})
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		prependIcon: {
			type: String,
			default: 'fas fa-credit-card'
		},
		value: {
			type: [Object, Array],
			default() {
				return []
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		required: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		label: {
			type: String,
			default: 'Seleccionar una tarjeta'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		error: {
			type: String,
			default: 'Se requiere al menos un elemento'
		},
		filter: {
			type: Object,
			default() {
				return {
					inactive: false
				}
			}
		}
	},
	data() {
		return {
			items: [],
			dCard: {
				status: false
			},
			edited: false,
			editedItem: {
				name: '',
				card_number: '',
				type: '',
				expiration: '',
				ccv: '',
				inactive: false
			},
			defaultItem: {
				name: '',
				card_number: '',
				type: '',
				expiration: '',
				ccv: '',
				inactive: false
			}
		}
	},
	computed: {
		valueErrors() {
			const errors = []
			if (!this.$v.value.$dirty) return errors
			!this.$v.value.required && errors.push(this.error)
			return errors
		},
		evalIcon() {
			return 'add'
		}
	},
	mounted() {
		this.$v.$reset()
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getItems()
		},
		getItems() {
			const newFilter = Object.assign(this.filter, {
				command: 'GET_PAYMENT_METHODS'
			})
			this.methods
				.requestApi('/api/finance/', 'GET', newFilter)
				.then((resp) => {
					if (resp.status === 'SUCCESS') {
						this.items = resp.Response
					}
				})
				.catch((err) => {
					this.message({
						title: 'Error',
						message: err,
						type: 'error'
					})
				})
		},
		editItem() {
			this.dCard.status = true
			this.editedItem = Object.assign(this.editedItem, this.value)
			this.edited = true
		},
		addItem() {
			this.dCard.status = true
			this.edited = false
		},
		closeDialog(close) {
			this.dCard.status = false
			setTimeout(() => {
				this.getItems()
			}, 100)
		}
	}
}
</script>
