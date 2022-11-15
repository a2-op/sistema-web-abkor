<template lang="pug">
	div
		v-autocomplete(:value="model" label="Estado" prepend-icon="fas fa-flag" clearable :items="states" :loading="dLoading.status" item-text="value2" item-value="value3" @change="$emit('change', $event)")
</template>
<script>
import Util from '@/assets/js/util'
export default {
	model: {
		prop: 'model',
		event: 'change'
	},
	props: {
		model: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			states: [],
			dLoading: {
				status: false
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.getStates()
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
					{}
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
