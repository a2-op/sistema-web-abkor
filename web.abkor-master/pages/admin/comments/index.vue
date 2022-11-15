<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="comments")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Comentarios
						v-divider.mx-4(inset vertical)
						v-spacer
					v-dialog(v-model="dComment.status" max-width="600px")
						v-card
							v-card-text
								v-fab-transition
									v-btn.mt-12(fab dark absolute top right @click="dComment.status = false" small)
										v-icon fas fa-times
								v-row(class="fill-height" align="center" justify="center")
									.display-1.ml-10(v-html="editedComment.description")
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dComment', true, seeComment(item))")
								v-icon fas fa-eye
						span Vizualizar Comentario
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			comments: [],
			headers: [
				{
					text: 'Enviado por',
					value: 'create_by.name',
					width: '300px'
				},
				{ text: 'Fecha de envio', value: 'create_at', width: '300px' },
				{
					text: 'Visualizar Conentatio',
					value: 'action',
					width: '150px'
				}
			],
			dLoading: {
				status: false,
				message: ''
			},
			editedComment: {
				description: ''
			},
			dComment: {
				status: false,
				loading: false
			},
			editedIndex: -1
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
			this.getComments()
		},
		getComments() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo comentarios...'
			this.methods
				.requestApi(
					'/api/feedback/',
					'GET',
					{
						command: 'GET_COMMENTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.comments = resp.Response
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
		seeComment(item) {
			this.editedIndex = this.comments.indexOf(item)
			this.editedComment = Object.assign({}, item)
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
