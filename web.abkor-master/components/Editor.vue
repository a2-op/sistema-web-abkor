<template lang="pug">
	div
		vue-editor(v-model="value" @text-change="handleTextChange" style="height:250px")
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
			type: String,
			default: ''
		}
	},
	data() {
		return {
			value: '',
			methods: null
		}
	},
	watch: {
		model() {
			this.value = this.methods.clonex(this.model)
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.value = this.methods.clonex(this.model)
		},
		handleTextChange(delta, oldDelta, source) {
			this.$emit('change', this.value)
		}
	}
}
</script>
