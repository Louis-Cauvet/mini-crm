<template>
  <v-container fluid class="pa-0">
    <v-row dense class="pa-0">
      <!-- Bloc Utilisateurs -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Utilisateurs ({{ users.length }})</v-card-title>
          <v-divider class="my-2"/>
          <v-card-subtitle class="pa-0">Utilisateurs récents :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="user in users.slice(0, 3)" :key="user.id">
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/users`" class="my-3">
            Voir tous les utilisateurs
          </v-btn>
        </v-card>
      </v-col>

      <!-- Bloc Articles -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Articles ({{ articles.length }})</v-card-title>
          <v-divider class="my-2" />
          <v-card-subtitle class="pa-0">Articles récents :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="article in articles.slice(0, 3)" :key="article.id">
              <v-list-item-title>{{ article.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ article.price }} €</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/articles`" class="my-3">
            Voir tous les articles
          </v-btn>
        </v-card>
      </v-col>

      <!-- Bloc Commandes -->
      <v-col cols="12" sm="6" md="4" class="pa-2">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6">Commandes ({{ orders.length }})</v-card-title>
          <v-divider class="my-2" />
          <v-card-subtitle class="pa-0">Commandes récentes :</v-card-subtitle>
          <v-list density="compact">
            <v-list-item v-for="order in orders.slice(0, 3)" :key="order.id">
              <v-list-item-title>#{{ order.id }} - {{ order.client }}</v-list-item-title>
              <v-list-item-subtitle>{{ order.date }} — {{ order.amount }} €</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn color="primary" variant="flat" block :to="`/orders`" class="my-3">
            Voir toutes les commandes
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const users = [
  { id: 1, name: 'Louis Cauvet', email: 'louis@mail.com' },
  { id: 2, name: 'Emma Dubois', email: 'emma@mail.com' },
  { id: 3, name: 'Paul Martin', email: 'paul@mail.com' },
]

const articles = [
  { id: 1, name: 'Ordinateur Portable', price: 1200 },
  { id: 2, name: 'Clé USB 64Go', price: 20 },
  { id: 3, name: 'Ecran 27"', price: 250 },
]

const orders = [
  { id: 101, client: 'Société Alpha', date: '15/07/2025', amount: 320 },
  { id: 100, client: 'Entreprise Beta', date: '14/07/2025', amount: 850 },
  { id: 99, client: 'SARL Gamma', date: '13/07/2025', amount: 420 },
]
</script>
