import { createApp, VueElement } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import naive from 'naive-ui'

createApp(App).use(router).use(store).use(naive).mount('#app')
