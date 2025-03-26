import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import store from './module/store/store';// Import the Vuex store
import router from './router'
createApp(App)
.use(store)
.use(router)
.mount('#app')
