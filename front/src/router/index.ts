import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    component: () => import("@/views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/clients",
    component: () => import("@/views/ClientsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/clients/:id",
    name: "ClientDetails",
    component: () => import("@/views/ClientDetailsView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/articles",
    component: () => import("@/views/ArticlesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/commandes",
    component: () => import("@/views/OrdersView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/commandes/:id",
    name: "OrderDetails",
    component: () => import("@/views/OrderDetailsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/connexion",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/enregistrement",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { requiresGuest: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard pour vérifier l'authentification
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Attendre l'initialisation de l'authentification
  if (!authStore.initialized) {
    await authStore.checkAuth();
  }

  // Redirection pour les routes protégées
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/connexion");
    return;
  }

  // Redirection pour les routes guests (déjà connecté)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/");
    return;
  }

  next();
});

export default router;
