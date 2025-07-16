<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Liste des clients</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddUser = true">
          <v-icon start>mdi-plus</v-icon> Ajouter un client
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="users"
      :headers="headers"
      item-value="id"
      class="elevation-1"
      density="comfortable"
      no-data-text="Aucun utilisateur trouvé"
    >
      <template #item.phone="{ item }">
        {{ formatPhone(item.phone) }}
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn icon density="compact" color="primary" @click="editUser(item)">
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" color="error" @click="askDeleteUser(item)">
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
          <v-btn icon density="compact" color="info" :to="`/clients/${item.id}`">
            <v-icon size="18">mdi-eye</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

  
    <v-dialog v-model="showAddUser" max-width="700">
      <v-card>
        <v-card-title>
          {{ editedUser ? 'Modifier' : 'Ajouter' }} un client
        </v-card-title>

        <v-card-text>
          <v-form ref="userForm" v-model="formValid">
            <v-text-field
              v-model="form.firstname"
              label="Prénom"
              :rules="[v => !!v || 'Le prénom est requis']"
            />
            <v-text-field
              v-model="form.lastname"
              label="Nom"
              :rules="[v => !!v || 'Le nom est requis']"
            />
            <v-text-field
              v-model="form.company"
              label="Société"
              :rules="[v => !!v || 'La société est requise']"
            />
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[
                v => !!v || 'L\'email est requis',
                v => /.+@.+\..+/.test(v) || 'Email invalide'
              ]"
            />
            <v-text-field
              v-model="form.phone"
              label="Téléphone"
              @blur="form.phone = formatPhone(form.phone)"
              :rules="[
                v => !!v || 'Le téléphone est requis',
                v => /^\d{10}$/.test(v.replace(/\s/g, '')) || 'Numéro invalide (10 chiffres)'
              ]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveUser">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer
          <strong>{{ userToDelete?.firstname }} {{ userToDelete?.lastname }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteUser">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    firstname: 'Louis',
    lastname: 'Cauvet',
    company: 'OpenAI',
    email: 'louis@mail.com',
    phone: '0601020304'
  },
  {
    id: 2,
    firstname: 'Emma',
    lastname: 'Dubois',
    company: 'TechCorp',
    email: 'emma@mail.com',
    phone: '0612345678'
  },
])

const headers = [
  { title: 'Prénom', key: 'firstname' },
  { title: 'Nom', key: 'lastname' },
  { title: 'Société', key: 'company' },
  { title: 'Adresse mail', key: 'email' },
  { title: 'Téléphone', key: 'phone' },
  { title: '', key: 'actions', sortable: false, width: '100px' }
]

const showAddUser = ref(false)
const showDeleteConfirm = ref(false)
const editedUser = ref<any>(null)
const userToDelete = ref<any>(null)
const formValid = ref(false)
const userForm = ref()

const form = ref({ firstname: '', lastname: '', company: '', email: '', phone: '' })

function editUser(user: any) {
  editedUser.value = user
  form.value = { ...user }
  showAddUser.value = true
}

function askDeleteUser(user: any) {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

function confirmDeleteUser() {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  }
  showDeleteConfirm.value = false
  userToDelete.value = null
}

function saveUser() {
  userForm.value?.validate()
  if (!formValid.value) return

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
  form.value = { firstname: '', lastname: '', company: '', email: '', phone: '' }
  userForm.value?.resetValidation()
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 8px;
}
</style>
