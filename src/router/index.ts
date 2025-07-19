import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/clients', component: () => import('@/views/ClientsView.vue') },
    { path: '/clients/:id', name: 'ClientDetails', component: () => import('@/views/ClientDetailsView.vue'), props: true },
    { path: '/articles', component: () => import('@/views/ArticlesView.vue') },
    { path: '/commandes', component: () => import('@/views/OrdersView.vue') },
    {
        path: '/commandes/:id', name: 'OrderDetails', component: () => import('@/views/OrderDetailsView.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
