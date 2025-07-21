<template>
  <v-container fluid class="pa-0">
    <v-row dense class="pa-0">
      <!-- Clients -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Clients ({{ clients.length }} au total)</v-card-title>
          <v-divider class="my-2" />
          <v-card-subtitle class="pa-0">Clients récents :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="client in clients.slice(0, 3)" :key="client._id">
              <v-list-item-title>
                {{ client.prenom }} {{ client.nom }}
              </v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ client.email }} — {{ formatPhone(client.telephone) }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon density="compact" color="info" :to="`/clients/${client._id}`">
                  <v-icon size="20">mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/clients`" class="my-3">
            Voir tous les clients
          </v-btn>
        </v-card>
      </v-col>

      <!-- Articles -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Articles ({{ articles.length }} au total)</v-card-title>
          <v-divider class="my-2" />
          <v-card-subtitle class="pa-0">Articles récents :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="article in articles.slice(0, 3)" :key="article._id">
              <v-list-item-title>{{ article.nom }}</v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ article.marque }} — {{ article.prix }} €
              </v-list-item-subtitle>
              <template #append>
                <v-chip size="small" color="primary" text-color="white">
                  Stock : {{ article.stock }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/articles`" class="my-3">
            Voir tous les articles
          </v-btn>
        </v-card>
      </v-col>

      <!-- Commandes -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Commandes ({{ orders.length }} au total)</v-card-title>
          <v-divider class="my-2" />
          <v-card-subtitle class="pa-0">Commandes récentes :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="order in orders.slice(0, 3)" :key="order._id">
              <v-list-item-title>
                {{ formatOrderNumber(order._id) }} — {{ order.client.prenom }} {{ order.client.nom }}
              </v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ formatDate(order.dateCommande) }} — {{ order.montantTotal }} €
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon density="compact" color="info" :to="`/commandes/${order._id}`">
                  <v-icon size="20">mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/commandes`" class="my-3">
            Voir toutes les commandes
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="pt-5">
      <v-col cols="12" md="6" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Quantités vendues par article</v-card-title>
          <v-divider class="my-2" />
          <Doughnut :data="soldQtyData" />
        </v-card>
        <v-card-title class="text-subtitle-1 text-center mt-2">
          Total d'articles vendus : {{ totalSoldQty }} articles
        </v-card-title>
      </v-col>

      <v-col cols="12" md="6" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Chiffre d'affaires total par article (en €)</v-card-title>
          <v-divider class="my-2" />
          <Doughnut :data="soldAmountData" />
        </v-card>
        <v-card-title class="text-subtitle-1 text-center mt-2">
          Chiffre d'affaires total : {{ totalSoldAmount }} €
        </v-card-title>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, ref, onMounted } from 'vue'
import { clientService, type Client } from '@/services/clients'
import { articleService, type Article } from '@/services/articles'
import { orderService, type Order } from '@/services/orders'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const clients = ref<Client[]>([])
const articles = ref<Article[]>([])
const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    const [clientsData, articlesData, ordersData] = await Promise.all([
      clientService.getClients(),
      articleService.getArticles(),
      orderService.getOrders()
    ])
    clients.value = clientsData
    articles.value = articlesData
    orders.value = ordersData
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0','#9966FF',
  '#FF9F40', '#8BC34A', '#E91E63', '#795548', '#2196F3' 
]

function formatOrderNumber(id: string) {
  return 'CMD' + id.slice(-3).toUpperCase()
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
} 

const soldQtyData = computed(() => {
  const dataArray = articles.value.map(a => {
    const qty = orders.value.reduce((sum, o) => {
      return sum + o.articles.filter(item => item.article._id === a._id).reduce((q, item) => q + item.quantite, 0)
    }, 0)
    return { label: a.nom, value: qty }
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value)

  return {
    labels: dataArray.map(d => d.label),
    datasets: [{
      data: dataArray.map(d => d.value),
      backgroundColor: colors.slice(0, dataArray.length)
    }]
  }
})

const soldAmountData = computed(() => {
  const dataArray = articles.value.map(a => {
    const amount = orders.value.reduce((sum, o) => {
      return sum + o.articles.filter(item => item.article._id === a._id).reduce((amt, item) => amt + item.quantite * item.prixUnitaire, 0)
    }, 0)
    return { label: a.nom, value: amount }
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value)

  return {
    labels: dataArray.map(d => d.label),
    datasets: [{
      data: dataArray.map(d => d.value),
      backgroundColor: colors.slice(0, dataArray.length)
    }]
  }
})

const totalSoldQty = computed(() => {
  return soldQtyData.value.datasets[0].data.reduce((sum, val) => sum + val, 0)
})

const totalSoldAmount = computed(() => {
  return soldAmountData.value.datasets[0].data.reduce((sum, val) => sum + val, 0)
})
</script>

<style scoped>
.wrap-subtitle {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}
</style>
