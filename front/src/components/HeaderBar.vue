<template>
  <v-app-bar flat elevation="2">
    <v-btn icon @click="drawer = !drawer" class="d-md-none">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="text-primary font-weight-medium">Bonjour Louis Cauvet !</v-toolbar-title>
    <v-spacer />
    <v-btn icon title="Se déconnecter">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const drawer = inject('drawer')  
</script>
