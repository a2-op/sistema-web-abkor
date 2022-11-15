<template lang="pug">
	div
		v-container
			CategoriesPage
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import CategoriesPage from '@/components/admin/categories/page'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	components: {
		CategoriesPage
	},
	data() {
		return {
			methods: null
		}
	},
	computed: {
		...mapState(['token'])
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
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
