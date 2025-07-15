<template>
  <!-- Permanent sur mdAndUp, temporaire sinon -->
  <v-navigation-drawer
    v-model="drawer"
    app
    :permanent="$vuetify.display.mdAndUp"
    temporary
    width="220"
    color="white"
    elevation="2"
    class="pa-0"
  >
    <v-container class="py-4 text-center">
      <v-img :src="logo" max-width="70" class="mb-2 mx-auto" />
    </v-container>

    <v-list nav density="compact">
      <v-list-item to="/" prepend-icon="mdi-view-dashboard" active-class="border-right-active">
        <v-list-item-title class="text-body-1">Vue d'ensemble</v-list-item-title>
      </v-list-item>

      <v-list-item to="/users" prepend-icon="mdi-account-group" active-class="border-right-active">
        <v-list-item-title class="text-body-1">Utilisateurs</v-list-item-title>
      </v-list-item>

      <v-list-item to="/articles" prepend-icon="mdi-file-document-outline" active-class="border-right-active">
        <v-list-item-title class="text-body-1">Articles</v-list-item-title>
      </v-list-item>

      <v-list-item to="/orders" prepend-icon="mdi-cart-outline" active-class="border-right-active">
        <v-list-item-title class="text-body-1">Commandes</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue'
import { useDisplay } from 'vuetify'
import logo from '@/assets/logo.png'

const drawer = inject('drawer')
const display = useDisplay()

// Ouvre le drawer automatiquement si écran desktop
watch(
  () => display.mdAndUp.value,
  (isDesktop) => {
    if (isDesktop) drawer.value = true
  },
  { immediate: true }
)
</script>

<style scoped>
.border-right-active {
  border-right: 4px solid #1976d2;
  color: #1976d2 !important;
}
</style>
