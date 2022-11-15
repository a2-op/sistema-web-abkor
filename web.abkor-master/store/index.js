export const state = () => ({
	token: null,
	profile: null,
	filter_main: '',
	shopping_cart: {
		data: [],
		total_items: 0,
		total_price: 0
	},
	shopping_plan: {
		data: [],
		interval: 0,
		interval_count: 0
	},
	configuration: {
		company: {
			logo: '/img/company-logo-your-logo.png',
			name: 'Yor Company',
			social: {
				/* instagram: '#', geral
				facebook: '#' */
			}
		},
		personalization: {
			carousel: ['/img/carousel-1.jpg']
		},
		security: {
			access_code: 'admin'
		},
		payment_methods: {
			payu: {
				api_key: '',
				api_login: '',
				public_key: '',
				merchant_id: '',
				account_id: '',
				payu_test: ''
			},
			culqi: {
				public_key: '',
				private_key: ''
			},
			type: 'CULQI',
			active: true,
			cash: {
				bank_accounts: []
			}
		}
	}
})

export const getters = {
	shoppingCart(state) {
		return state.shopping_cart.data
	},
	shoppingPlan(state) {
		return state.shopping_plan.data
	}
}

export const mutations = {
	delToken(state) {
		localStorage.removeItem('token')
		state.token = null
	},
	setToken(state, token) {
		state.token = token || localStorage.getItem('token')
	},
	setProfile(state, profile) {
		state.profile = profile || null
	},
	setConfiguration(state, config) {
		state.configuration = config || null
	},
	setFilterMain(state, filter) {
		state.filter_main = filter || ''
	},
	addProduct(state, product) {
		let idx = -1
		state.shopping_cart.data.forEach((locateProduct, index) => {
			if (product._id === locateProduct._id && idx === -1) {
				const errors = []
				locateProduct.variants.forEach((variant, indexv) => {
					if (
						variant.selection !== product.variants[indexv].selection
					) {
						errors.push(indexv)
					}
				})
				idx = errors.length > 0 ? -1 : index
			}
		})
		if (idx !== -1) {
			if (
				state.shopping_cart.data[idx].quantity + product.quantity <=
				product.stock
			) {
				state.shopping_cart.data[idx].quantity += product.quantity
			}
		} else {
			state.shopping_cart.data.push(product)
		}
		state.shopping_cart.total_items = 0
		state.shopping_cart.total_price = 0
		state.shopping_cart.data.forEach((product) => {
			product.quantity =
				product.quantity === '' ? 0 : product.quantity || 0
			state.shopping_cart.total_items += parseFloat(product.quantity)
			state.shopping_cart.total_price += product.price * product.quantity
		})
	},
	removeProduct(state, product) {
		let idx = -1
		state.shopping_cart.data.forEach((locateProduct, index) => {
			if (product._id === locateProduct._id && idx === -1) {
				const errors = []
				locateProduct.variants.forEach((variant, indexv) => {
					if (
						variant.selection !== product.variants[indexv].selection
					) {
						errors.push(indexv)
					}
				})
				idx = errors.length > 0 ? -1 : index
			}
		})
		if (idx !== -1) {
			state.shopping_cart.data.splice(idx, 1)
		}
		state.shopping_cart.total_items = 0
		state.shopping_cart.total_price = 0
		let subtotalItem = 0
		state.shopping_cart.data.forEach((product) => {
			product.quantity =
				product.quantity === '' ? 0 : product.quantity || 0
			state.shopping_cart.total_items += parseFloat(product.quantity)
			product.variants.forEach((variant) => {
				variant.selection = variant.selection ? variant.selection : 0
				const option = variant.options[variant.selection]
				if (option.type_additional === '%') {
					if (
						option.additional_amount === null ||
						option.additional_amount === ''
					) {
						option.additional_amount = 0
					}
					const addPrice =
						(product.price * parseFloat(option.additional_amount)) /
						100
					subtotalItem += addPrice
				} else {
					subtotalItem += parseFloat(option.additional_amount)
				}
			})
			state.shopping_cart.total_price += subtotalItem * product.quantity
		})
	},
	setQuantity(state, product) {
		let idx = -1
		state.shopping_cart.data.forEach((locateProduct, index) => {
			if (product._id === locateProduct._id && idx === -1) {
				const errors = []
				locateProduct.variants.forEach((variant, indexv) => {
					if (
						variant.selection !== product.variants[indexv].selection
					) {
						errors.push(indexv)
					}
				})
				idx = errors.length > 0 ? -1 : index
			}
		})
		if (idx !== -1) {
			state.shopping_cart.data[idx].quantity = parseFloat(
				product.quantity
			)
		}
		state.shopping_cart.total_items = 0
		state.shopping_cart.total_price = 0
		let subtotalItem = 0
		state.shopping_cart.data.forEach((product) => {
			product.quantity =
				product.quantity === '' ? 0 : product.quantity || 0
			state.shopping_cart.total_items += parseFloat(product.quantity)
			product.variants.forEach((variant) => {
				variant.selection = variant.selection ? variant.selection : 0
				const option = variant.options[variant.selection]
				if (option.type_additional === '%') {
					if (
						option.additional_amount === null ||
						option.additional_amount === ''
					) {
						option.additional_amount = 0
					}
					const addPrice =
						(product.price * parseFloat(option.additional_amount)) /
						100
					subtotalItem += addPrice
				} else {
					subtotalItem += parseFloat(option.additional_amount)
				}
			})
			state.shopping_cart.total_price += subtotalItem * product.quantity
		})
	},
	addPlan(state, plan) {
		const idx = state.shopping_plan.data
			.map((e) => {
				return e._id
			})
			.indexOf(plan._id)
		if (idx !== -1) {
			state.shopping_plan.data.splice(idx, 1)
		} else {
			state.shopping_plan.data.push(plan)
		}
	},
	removePlan(state, plan) {
		const idx = state.shopping_plan.data
			.map((e) => {
				return e._id
			})
			.indexOf(plan._id)
		if (idx !== -1) {
			state.shopping_plan.data.splice(idx, 1)
		}
	}
}
export const actions = () => ({})
