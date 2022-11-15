<template lang="pug">
	div
		v-autocomplete(:value="model" label="Categoria" return-object prepend-icon="fas fa-project-diagram" clearable :items="categories" :loading="dLoading.status" item-text="name" item-value="_id" @change="$emit('change', $event)")
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
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			categories: [],
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
			this.getCategories()
		},
		getCategories() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.methods
				.requestApi(
					'/api/category/',
					'GET',
					{
						command: 'GET_CATEGORIES',
						transaction: {
							inactive: false
						}
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.categories = resp.Response
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
