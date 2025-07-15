<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Gestion des utilisateurs</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddUser = true">
          <v-icon start>mdi-plus</v-icon> Ajouter un utilisateur
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="users"
      :headers="headers"
      item-value="id"
      class="elevation-1"
      density="comfortable"
    >
      <template #item.phone="{ item }">
        {{ formatPhone(item.phone) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn icon color="primary" @click="editUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="deleteUser(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog ajout/modif utilisateur -->
    <v-dialog v-model="showAddUser" max-width="500">
      <v-card>
        <v-card-title>
          {{ editedUser ? 'Modifier' : 'Ajouter' }} un utilisateur
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="form.name" label="Nom" />
          <v-text-field v-model="form.email" label="Email" />
          <v-text-field
            v-model="form.phone"
            label="Téléphone"
            @blur="form.phone = formatPhone(form.phone)"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveUser">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Louis Cauvet', email: 'louis@mail.com', phone: '0601020304' },
  { id: 2, name: 'Emma Dubois', email: 'emma@mail.com', phone: '0612345678' },
])

const headers = [
  { title: 'Nom', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Téléphone', key: 'phone' },
  { title: '', key: 'actions', sortable: false },
]

const showAddUser = ref(false)
const editedUser = ref<any>(null)
const form = ref({ name: '', email: '', phone: '' })

function editUser(user: any) {
  editedUser.value = user
  form.value = { ...user }
  showAddUser.value = true
}

function deleteUser(user: any) {
  users.value = users.value.filter((u) => u.id !== user.id)
}

function saveUser() {
  if (editedUser.value) {
    Object.assign(editedUser.value, form.value)
  } else {
    users.value.push({
      id: Date.now(),
      ...form.value,
    })
  }
  closeDialog()
}

function closeDialog() {
  showAddUser.value = false
  editedUser.value = null
  form.value = { name: '', email: '', phone: '' }
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}
</script>
