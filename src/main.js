import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from './plugins/font-awesome'

import setupInterceptors from './services/setupInterceptors'

setupInterceptors(store)

import jQuery from 'jquery'

window.$ = window.jQuery = jQuery

createApp(App)
.use(router)
.use(store)
.use(jQuery)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
