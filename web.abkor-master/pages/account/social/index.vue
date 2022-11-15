<template lang="pug">
	div
		v-container
			template
				v-card
					v-toolbar(dark)
						v-btn(icon dark @click="dialog = false" small)
							v-icon mdi-close
					v-container
						v-card.ma-5
							v-card-title
								h4 MIS CHATS
							v-card-text
								v-row
									v-col(cols="12" xs="12" sm="6" md="4" lg="4")
										v-expansion-panels
											v-expansion-panel
												v-expansion-panel-header
													h4 Mis contactos
												v-expansion-panel-content
													v-list(three-line style="max-height: 600px; overflow-y: auto;")
														template(v-if="clients.length <= 0")
															v-container
																span No hay contactos
														template(v-else v-for="contact in clients")
															v-list-item(@click="")
																v-list-item-avatar(v-if="!contact.photo")
																	v-icon fas fa-image
																v-list-item-avatar(v-else)
																	v-img(:src="contact.photo")
																v-list-item-content
																	v-list-item-title {{contact.name}}
									v-col(cols="12" xs="12" sm="6" md="8" lg="8")
										v-row
											v-col(cols="12" xs="12" sm="12" md="12" lg="12")
												template(v-if="messages.length <= 0")
													h4 Seleccione un chat
												template(v-else)
													v-card.mx-auto
														v-card-title Contacto seleccionado
														v-card-text
															v-row
																v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																	p Chat 1
																v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																	p chat 2
														v-divider
														v-card-actions
															v-text-field
															v-btn(text) Enviar
																v-icon fas fa-paper-plane
			v-dialog(v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition")
				v-card
					v-toolbar(dark)
						v-btn(icon dark @click="dialog = false")
							v-icon mdi-close
					v-container
						v-card.ma-5
							v-card-title
								h4 MIS CHATS
							v-card-text
								v-row
									v-col(cols="12" xs="12" sm="6" md="4" lg="4")
										v-expansion-panels
											v-expansion-panel
												v-expansion-panel-header
													h4 Mis contactos
												v-expansion-panel-content
													v-list(three-line style="max-height: 600px; overflow-y: auto;")
														template(v-if="clients.length <= 0")
															v-container
																span No hay contactos
														template(v-else v-for="contact in clients")
															v-list-item(@click="")
																v-list-item-avatar(v-if="!contact.photo")
																	v-icon fas fa-image
																v-list-item-avatar(v-else)
																	v-img(:src="contact.photo")
																v-list-item-content
																	v-list-item-title {{contact.name}}
									v-col(cols="12" xs="12" sm="6" md="8" lg="8")
										v-row
											v-col(cols="12" xs="12" sm="12" md="12" lg="12")
												template(v-if="messages.length <= 0")
													h4 Seleccione un chat
												template(v-else)
													v-card.mx-auto
														v-card-title Contacto seleccionado
														v-card-text
															v-row
																v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																	p Chat 1
																v-col(cols="12" xs="12" sm="6" md="6" lg="6")
																	p chat 2
														v-divider
														v-card-actions
															v-text-field
															v-btn(text) Enviar
																v-icon fas fa-paper-plane
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import io from 'socket.io-client'
import Util from '@/assets/js/util'

export default {
	layout: 'dashboard',
	data() {
		return {
			dialog: false,
			msg: '',
			username: '',
			clients: [],
			contacts: [],
			dLoading: {
				status: false,
				message: ''
			},
			editedClient: {
				photos: [],
				name: '',
				email: '',
				entity: 'GETUP',
				profile: 'USR',
				inactive: true
			},
			socket: null,
			messages: []
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
			this.socket = io.connect(`http://localhost:4000/user`, {
				forceNew: true
			})
			this.sockets()
			this.setToken()
			this.getClients()
		},
		getClients() {
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_CLIENTS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.clients = resp.Response
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
		sockets() {
			this.socket.on('loggedIn', (data) => {
				this.message({
					title: 'Usuario Conectados',
					message: 'Sesión',
					type: 'success'
				})
				this.messages.push(this.msg)
			})
			this.socket.on('online', (data) => {
				this.message({
					title: 'Usuario en línea',
					message: 'online',
					type: 'warn'
				})
			})
			this.socket.on('msg', (msg) => {
				this.messages.push(msg)
			})
			this.messages.push(this.msg)
			this.msg = ''
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
<style>
.gu-toolbar-category .v-toolbar__content {
	background-color: rgba(240, 98, 146, 0.5) !important;
}
</style>
