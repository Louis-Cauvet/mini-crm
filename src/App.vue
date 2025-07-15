<template>
  <v-app >
    <Sidebar />
    <v-main>
      <HeaderBar />
      <v-container fluid>
        <router-view />
      </v-container> 
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
</script>
