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
            <v-list-item v-for="client in clients.slice(0, 3)" :key="client.id">
              <v-list-item-title>
                {{ client.firstname }} {{ client.lastname }} - {{ client.company }}
              </v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ client.email }} — {{ formatPhone(client.phone) }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon density="compact" color="info" :to="`/clients/${client.id}`">
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
            <v-list-item v-for="article in articles.slice(0, 3)" :key="article.id">
              <v-list-item-title>{{ article.name }}</v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ article.brand }} — {{ article.price }} €
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
            <v-list-item v-for="order in orders.slice(0, 3)" :key="order.id">
              <v-list-item-title>
                {{ formatOrderNumber(order.id) }} — {{ getClientName(order.clientId) }}
              </v-list-item-title>
              <v-list-item-subtitle class="wrap-subtitle">
                {{ order.date }} — {{ order.amount }} €
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon density="compact" color="info" :to="`/commandes/${order.id}`">
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
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const clients = [
  { id: 1, firstname: 'Louis', lastname: 'Cauvet', company: 'OpenAI', email: 'louis@mail.com', phone: '0601020304' },
  { id: 2, firstname: 'Emma', lastname: 'Dubois', company: 'TechCorp', email: 'emma@mail.com', phone: '0605060708' },
  { id: 3, firstname: 'Paul', lastname: 'Martin', company: 'StartUpX', email: 'paul@mail.com', phone: '0611223344' }
]

const articles = [
  { id: 1, name: 'Ordinateur Portable', price: 1200, stock: 10, brand: 'HP', color: 'Gris' },
  { id: 2, name: 'Clé USB 64Go', price: 20, stock: 50, brand: 'SanDisk', color: 'Rouge' },
  { id: 3, name: 'Ecran 27"', price: 250, stock: 5, brand: 'Dell', color: 'Noir' }
]

const orders = [
  { id: 102, clientId: 1, date: '15/07/2025', amount: 0, productsList: [{ id: 1, qty: 1 }, { id: 2, qty: 3 }] },
  { id: 101, clientId: 2, date: '14/07/2025', amount: 0, productsList: [{ id: 1, qty: 2 }, { id: 3, qty: 1 }] },
  { id: 100, clientId: 3, date: '13/07/2025', amount: 0, productsList: [{ id: 2, qty: 5 }, { id: 3, qty: 2 }] }
]

orders.forEach(order => {
  order.amount = order.productsList.reduce((total, p) => {
    const product = articles.find(a => a.id === p.id)
    return total + (product ? product.price * p.qty : 0)
  }, 0)
})

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0','#9966FF',
  '#FF9F40', '#8BC34A', '#E91E63', '#795548', '#2196F3' 
]

function formatOrderNumber(id: number) {
  return 'CMD' + String(id).padStart(3, '0')
}

function getClientName(clientId: number) {
  const client = clients.find(c => c.id === clientId)
  return client ? `${client.firstname} ${client.lastname}` : 'Client inconnu'
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
} 

const soldQtyData = computed(() => {
  const dataArray = articles.map(a => {
    const qty = orders.reduce((sum, o) => {
      return sum + o.productsList.filter(p => p.id === a.id).reduce((q, p) => q + p.qty, 0)
    }, 0)
    return { label: a.name, value: qty }
  }).sort((a, b) => b.value - a.value)

  return {
    labels: dataArray.map(d => d.label),
    datasets: [{
      data: dataArray.map(d => d.value),
      backgroundColor: colors.slice(0, dataArray.length)
    }]
  }
})

const soldAmountData = computed(() => {
  const dataArray = articles.map(a => {
    const amount = orders.reduce((sum, o) => {
      return sum + o.productsList.filter(p => p.id === a.id).reduce((amt, p) => amt + p.qty * a.price, 0)
    }, 0)
    return { label: a.name, value: amount }
  }).sort((a, b) => b.value - a.value)

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
