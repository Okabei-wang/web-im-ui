import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue')
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})