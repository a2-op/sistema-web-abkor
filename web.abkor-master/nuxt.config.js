module.exports = {
	/*
	 ** Headers of the page
	 */
	head: {
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		script: [
			{ src: 'https://connect.facebook.net/en_PE/sdk.js' },
			{ src: 'https://apis.google.com/js/platform.js' },
			{ src: 'https://apis.google.com/js/api:client.js' },
			{
				src:
					'https://maps.googleapis.com/maps/api/js?key=AIzaSyBIGwxjiaQfXkN2kLfPqMvQS6QaGr-zEdw&libraries=places'
			},
			{
				src:
					'https://www.google.com/recaptcha/api.js?render=6Ld0e7AUAAAAAMgqtPAccNA4bWCQXT6qMb9OB3EJ'
			}
		]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },
	/*
	 ** Global CSS
	 */
	css: ['@fortawesome/fontawesome-free/css/all.css'],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		'@/plugins/vuelidate',
		'@/plugins/facebook',
		'@/plugins/vue-drag-drop',
		'@/plugins/vue-the-mask',
		'@/plugins/v-mask',
		'@/plugins/vue-moment',
		{ src: '@/plugins/quill-editor', mode: 'client' },
		{ src: '@/plugins/vue-notifications', mode: 'client' }
	],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/proxy',
		'@nuxtjs/pwa',
		[
			'nuxt-fontawesome',
			{
				component: 'fa'
			}
		]
	],
	buildModules: ['@nuxtjs/vuetify'],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {
		proxy: true
	},
	proxy: {
		'/api/': {
			target: process.env.URI_WS || 'http://localhost:4000',
			pathRewrite: {
				'^/api/': '/'
			}
		}
	},
	/*
	 ** vuetify module configuration
	 ** https://github.com/nuxt-community/vuetify-module
	 */
	vuetify: {
		theme: {
			dark: false,
			themes: {
				light: {
					primary: '#e67d9f',
					secondary: '#c4db88',
					accent: '#cd56e5',
					info: '#5b5c79',
					error: '#FF5252'
				},
				dark: {
					primary: '#c4db88'
				}
			},
			defaultAssets: {
				font: true,
				icons: 'fa'
			}
		}
	},
	/*
	 ** Build configuration
	 */
	build: {
		transpile: ['vue-notifications', 'mini-toastr'],
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			// Run ESLint on save
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
					options: {
						fix: true
					}
				})
				config.devtool = 'source-map'
			}
		}
	}
}
