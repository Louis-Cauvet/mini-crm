<template>
  <v-app-bar color="primary" density="comfortable" elevation="1">
    <v-app-bar-title class="text-white"> Mini CRM </v-app-bar-title>

    <v-spacer />

    <div class="d-flex align-center" v-if="authStore.user">
      <v-chip class="me-4" color="white" variant="outlined">
        <v-icon start>mdi-account</v-icon>
        {{ authStore.user.prenom }} {{ authStore.user.nom }}
        <v-chip
          class="ms-2"
          size="x-small"
          :color="authStore.user.role === 'admin' ? 'orange' : 'blue'"
        >
          {{ authStore.user.role }}
        </v-chip>
      </v-chip>

      <v-btn icon @click="logout" title="Se déconnecter">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  router.push("/connexion");
}
</script>
