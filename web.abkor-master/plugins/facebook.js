/* global FB */
import Vue from 'vue'
Vue.prototype.$initFbSDK = () => {
	FB.init({
		appId: '2313167548749261',
		cookie: true,
		xfbml: true,
		version: 'v4.0'
	})

	FB.AppEvents.logPageView()
}
