<template lang="pug">
	div
		v-container
			v-data-table.elevation-1(:headers="headers" :items="users" :search="search" sort-by="calories")
				template(v-slot:top)
					v-toolbar(flat color="white")
						v-toolbar-title Permisos
						v-divider.mx-4(inset vertical)
						v-spacer
						v-text-field(v-model="search" append-icon="fas fa-search" label="Buscar Usario" single-line hide-details)
						v-spacer
						v-dialog(v-model="dUser" scrollable persistent max-width="400px")
							v-card
								v-card-title.headline.grey.lighten-2(primary-title) permisos
								v-card-text(style="height: 600px")
									v-container
										v-form
											v-row
												v-col
													v-treeview(v-model="selection" ref="treeview" :items="routes" :active="active" selection-type="leaf" selectable return-object item-key="code")
								v-divider
								v-card-actions
									v-spacer
									v-btn(text color="primary" @click="toggleDialog('dUser', false, () => {})" small) Cancelar
									v-btn(text @click="toggleDialog('dUser', false, assignRoutes)" small) Guardar
				template(v-slot:item.action="{ item }")
					v-tooltip(bottom)
						template(v-slot:activator="{ on }")
							v-btn(icon small v-on="on" @click="toggleDialog('dUser', true, editRole(item))")
								v-icon fas fa-user-shield
						span Editar permisos
				template(v-slot:item.create_at="{ item }")
					| {{ item.create_at ? item.create_at.substring(0, 10) : '' }}
				template(v-slot:item.inactive="{ item }")
					v-chip(:color="item.inactive ? 'error' : 'success'" dark) {{ item.inactive ? 'Inactivo' : 'Activo' }}
				template(v-slot:item.profile="{ item }")
					| {{ item.profile === 'ADM' ? 'Administrador' : item.profile === 'NUT' ? 'Nutricionista' : 'Producción' }}
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
					v-btn(text @click="dConfirm.event_cancel" small) Cancelar
					v-btn(text @click="dConfirm.event_accept" small) Aceptar
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Util from '@/assets/js/util'
export default {
	layout: 'dashboard',
	data() {
		return {
			users: [],
			selection: [],
			newPermissions: [],
			search: '',
			headers: [
				{ text: 'Nombre', value: 'name', width: '300px' },
				{ text: 'Email', value: 'email', width: '150px' },
				{
					text: 'Modalidad de registro',
					value: 'entity',
					width: '150px'
				},
				{ text: 'Rol', value: 'profile', width: '150px' },
				{ text: 'Creado por', value: 'create_by.sub', width: '300px' },
				{
					text: 'Fecha de Regitro',
					value: 'create_at',
					width: '150px'
				},
				{ text: 'Estado', value: 'inactive', width: '150px' },
				{ text: 'Acción', value: 'action', sortable: false }
			],
			routes: [],
			active: [],
			editedUser: {
				permissions: [],
				inactive: false
			},
			defaultUser: {
				permissions: [],
				inactive: false
			},
			dUser: false,
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
		...mapState(['token'])
	},
	watch: {
		selection(val) {
			this.selection = val
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.setToken()
			this.getRoutes()
			this.getUsers()
		},
		getRoutes() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo rutas...'
			this.methods
				.requestApi(
					'/api/route/',
					'GET',
					{
						command: 'GET_ROUTES'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						const data = resp.Response
						data.forEach((value, index) => {
							if (value.profile !== 'USR') {
								this.routes.push(value)
							}
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
		getUsers() {
			// Se obtiene los tipos de perfil
			this.dLoading.status = true
			this.dLoading.message = 'Obteniendo usuarios...'
			this.methods
				.requestApi(
					'/api/user/',
					'GET',
					{
						command: 'GET_USERS'
					},
					{},
					'/account/auth/sign-in'
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						this.users = resp.Response
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
		editRole(item) {
			this.editedIndex = this.users.indexOf(item)
			this.editedUser = Object.assign({}, item)
			this.selection = []
			this.selection = item.permissions
		},
		assignRoutes() {
			// const role = this.$refs.treeview.items
			this.dLoading.status = true
			this.dLoading.message = 'Guardanado permisos...'
			this.selection.forEach((permissions, idx) => {
				const codes = permissions.code.split('#')
				this.identifyPermissions(
					this.routes,
					0,
					codes,
					this.newPermissions,
					''
				)
			})
			this.methods
				.requestApi(
					`/api/user/${this.editedUser._id}`,
					'PATCH',
					{},
					{
						command: 'ASSIGN_PERMISSIONS',
						transaction: {
							permissions: this.newPermissions,
							inactive: false
						}
					}
				)
				.then((resp) => {
					this.dLoading.status = false
					if (resp.status === 'SUCCESS') {
						Object.assign(
							this.users[this.editedIndex],
							this.editedUser
						)
						this.message({
							title: 'Excelente',
							message:
								'Se ha registrado la información correctamente',
							type: 'success'
						})
					}
					this.$router.push('/admin/permissions')
				})
				.catch((err) => {
					this.dLoading.status = false
					this.message({
						title: 'Error',
						message: `Error al realizar la solicitud ${err}`,
						type: 'error'
					})
				})
		},
		identifyPermissions(
			permissions,
			posistion,
			codes,
			newPermissions,
			parent
		) {
			permissions.forEach((permission) => {
				if (permission.code === `${parent}${codes[posistion]}`) {
					const clonPermission = this.methods.clonex(permission)
					// delete clonPermission.children
					const idxp = newPermissions
						.map((e) => {
							return e.code
						})
						.indexOf(permission.code)
					if (idxp === -1) {
						newPermissions.push(clonPermission)
					}
					if (posistion + 1 < codes.length) {
						if (!newPermissions.children) {
							newPermissions.children = []
						}
						this.identifyPermissions(
							permission.children,
							posistion + 1,
							codes,
							newPermissions.children,
							permission.code + '#'
						)
					}
				}
			})
		},
		toggleDialog(dialog, state = true, event = () => {}) {
			const _self = this
			setTimeout(() => {
				_self[dialog] = state
			}, 300)
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
