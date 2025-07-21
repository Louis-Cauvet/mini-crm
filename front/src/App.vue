<template>
  <v-app>
    <template v-if="!isAuthPage">
      <Sidebar />
      <v-main>
        <HeaderBar />
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
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const authPages = ['/connexion', '/enregistrement']

const isAuthPage = computed(() => authPages.includes(route.path))
</script>
