<template>
  <v-app>
    <template v-if="!isAuthPage && authStore.isAuthenticated">
      <Sidebar v-model:drawer="drawer" />
      <v-main>
        <HeaderBar @toggle-drawer="drawer = !drawer" />
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </template>

    <template v-else>
      <v-main>
        <router-view />
      </v-main>
    </template>

    <!-- Loading overlay pendant la vérification de l'auth -->
    <v-overlay
      v-if="authStore.loading && !authStore.isAuthenticated"
      persistent
    >
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const authStore = useAuthStore();
const authPages = ["/connexion", "/enregistrement"];
const drawer = ref(false);

const isAuthPage = computed(() => authPages.includes(route.path));

// Vérifier l'authentification au démarrage
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }
});
</script>
