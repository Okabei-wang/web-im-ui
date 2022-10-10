import { createApp, VueElement } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import store from './store'
import naive from 'naive-ui'
import eventBus from 'vue3-eventbus'

createApp(App).use(router).use(store).use(naive).use(eventBus).mount('#app')
