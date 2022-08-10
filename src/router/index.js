import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        redirect: '/home/index'
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        children: [
          {
            path: 'index',
            component: () => import('../views/home/mainpage/index.vue')
          },
          {
            path: 'newroom',
            component: () => import('../views/home/room/index.vue')
          },
          {
            path: 'room',
            component: () => import('../views/home/innerRoom/index.vue')
          }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register/index.vue')
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})