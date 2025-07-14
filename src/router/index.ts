import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/users', component: () => import('@/views/UsersView.vue') },
    { path: '/articles', component: () => import('@/views/ArticlesView.vue') },
    { path: '/orders', component: () => import('@/views/OrdersView.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router