<template>
  <v-container fluid>
    <h2>Données du client</h2>

    <v-card class="pa-4 mb-4">
      <v-form ref="editForm" v-model="formValid">
        <v-text-field v-model="client.firstname" label="Prénom" />
        <v-text-field v-model="client.lastname" label="Nom" />
        <v-text-field v-model="client.company" label="Société" />
        <v-text-field v-model="client.email" label="Email" />
        <v-text-field v-model="client.phone" label="Téléphone" />
      </v-form>

      <v-card-actions>
        <v-row dense class="w-100 justify-end">
          <v-col cols="12" sm="auto">
            <v-btn 
              v-if="hasChanged" 
              color="primary" 
              variant="flat" 
              block 
              @click="saveChanges"
            >
              <v-icon start>mdi-content-save</v-icon> Enregistrer
            </v-btn>
          </v-col>
          <v-col cols="12" sm="auto">
            <v-btn 
              color="error" 
              variant="flat" 
              class="text-white" 
              block 
              @click="showDeleteConfirm = true"
            >
              <v-icon start>mdi-delete</v-icon> Supprimer le client
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>


    <h3 class="mt-6">Historique des commandes</h3>
    <v-data-table
      :items="orders"
      :headers="orderHeaders"
      no-data-text="Aucune commande trouvée"
    />

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer
          <strong>{{ client.firstname }} {{ client.lastname }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const client = ref<any>({
  firstname: '',
  lastname: '',
  company: '',
  email: '',
  phone: ''
})
const initialClient = ref<any>(null)

const orders = ref<any[]>([])
const showDeleteConfirm = ref(false)

const formValid = ref(false)
const editForm = ref()

const orderHeaders = [
  { title: 'Numéro', key: 'number' },
  { title: 'Date', key: 'date' },
  { title: 'Montant total', key: 'total' }
]

onMounted(() => {
  const clientId = route.params.id
  client.value = {
    id: clientId,
    firstname: 'Louis',
    lastname: 'Cauvet',
    company: 'OpenAI',
    email: 'louis@mail.com',
    phone: '0601020304'
  }
  initialClient.value = { ...client.value }

  orders.value = [
    { number: 1001, date: '01/07/2025', total: '120 €' },
    { number: 1002, date: '15/07/2025', total: '340 €' }
  ]
})

const hasChanged = computed(() => {
  return JSON.stringify(client.value) !== JSON.stringify(initialClient.value)
})

function saveChanges() {
  editForm.value?.validate()
  if (!formValid.value) return

  initialClient.value = { ...client.value }
}

function confirmDelete() {
  showDeleteConfirm.value = false
  router.push('/clients')
}
</script>
