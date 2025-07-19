<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Liste des commandes</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddOrder = true">
          <v-icon start>mdi-plus</v-icon> Ajouter une commande
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="sortedOrders"
      :headers="headers"
      item-value="id"
      class="elevation-1"
      density="comfortable"
      no-data-text="Aucune commande trouvée"
    >
      <template #item.clientId="{ item }">
        {{ getClientLabel(item.clientId) }}
      </template>

      <template #item.total="{ item }">
        {{ item.total }} €
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn icon density="compact" color="primary" @click="editOrder(item)">
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" color="error" @click="askDeleteOrder(item)">
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
          <v-btn icon density="compact" color="info" :to="`/commandes/${item.id}`">
            <v-icon size="18">mdi-eye</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="showAddOrder" max-width="700">
      <v-card>
        <v-card-title>{{ editedOrder ? 'Modifier' : 'Ajouter' }} une commande</v-card-title>
        <v-card-text>
          <v-form ref="orderForm" v-model="formValid">
            <v-text-field v-model="form.date" label="Date" type="date" :rules="[v => !!v || 'Date requise']" />
            <v-select
              v-model="form.status"
              :items="statuses"
              label="Statut"
              :rules="[v => !!v || 'Statut requis']"
            />
            <v-select
              v-model="form.clientId"
              :items="clients"
              item-title="label"
              item-value="id"
              label="Client"
              :rules="[v => !!v || 'Client requis']"
            />

            <v-sheet class="pa-4 mb-4" elevation="1" rounded>
              <h4 class="mb-3">Produits de la commande</h4>

              <v-alert
                v-if="showNoProductError"
                type="error"
                density="compact"
                class="mb-2"
                icon="mdi-alert-circle"
              >
                Vous devez ajouter au moins un produit à la commande.
              </v-alert>

              <div v-for="(product, index) in form.productsList" :key="index" class="product-line d-flex align-center mb-2">
                <v-select
                  v-model="product.id"
                  :items="products"
                  item-title="name"
                  item-value="id"
                  label="Produit"
                  class="flex-grow-1"
                  density="comfortable"
                  @update:modelValue="updateTotal"
                  :rules="[v => !!v || 'Produit requis']"
                />
                <v-text-field
                  v-model.number="product.qty"
                  label="Quantité"
                  type="number"
                  min="1"
                  density="comfortable"
                  style="max-width: 100px; margin-left: 8px;"
                  @input="updateTotal"
                  :error-messages="getQuantityError(product)"
                />

                <v-btn
                  icon
                  size="x-small"
                  variant="tonal"
                  color="error"
                  class="delete-btn ml-2 mb-5"
                  @click="removeProduct(index); updateTotal()"
                >
                  <v-icon size="14">mdi-close</v-icon>
                </v-btn>
              </div>

              <v-btn variant="tonal" color="primary" @click="addProduct" block>
                <v-icon start>mdi-plus</v-icon> Ajouter un produit
              </v-btn>
            </v-sheet>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveOrder">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Voulez-vous vraiment supprimer la commande <strong>{{ orderToDelete?.number }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteOrder">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statuses = ['Demandée', 'En préparation', 'Expédiée', 'Récupérée']

const clients = [
  { id: 1, firstname: 'Louis', lastname: 'Cauvet', company: 'OpenAI', label: 'Louis Cauvet - OpenAI' },
  { id: 2, firstname: 'Emma', lastname: 'Dubois', company: 'TechCorp', label: 'Emma Dubois - TechCorp' }
]

const products = [
  { id: 1, name: 'Ordinateur Portable', price: 500, stock: 10 },
  { id: 2, name: 'Clé USB 64Go', price: 30, stock: 50 },
  { id: 3, name: 'Moniteur 27"', price: 200, stock: 5 }
]

const orders = ref([
  { id: 1, number: 'CMD001', date: '2025-07-10', status: 'Demandée', clientId: 1, productsList: [{ id: 1, qty: 2 }], total: 1000 },
  { id: 2, number: 'CMD002', date: '2025-07-15', status: 'Expédiée', clientId: 2, productsList: [{ id: 2, qty: 1 }], total: 30 }
])

const headers = [
  { title: 'Numéro', key: 'number' },
  { title: 'Date', key: 'date' },
  { title: 'Statut', key: 'status' },
  { title: 'Client', key: 'clientId' },
  { title: 'Total', key: 'total' },
  { title: '', key: 'actions', sortable: false, width: '100px' }
]

const showAddOrder = ref(false)
const showDeleteConfirm = ref(false)
const editedOrder = ref<any>(null)
const orderToDelete = ref<any>(null)
const formValid = ref(false)
const orderForm = ref()
const showNoProductError = ref(false)

const form = ref({
  date: '',
  status: '',
  clientId: null,
  productsList: [] as { id: number | null, qty: number }[]
})

function getClientLabel(id: number) {
  const client = clients.find(c => c.id === id)
  return client ? `${client.firstname} ${client.lastname} - ${client.company}` : 'Client inconnu'
}

function generateNextOrderNumber() {
  const numbers = orders.value.map(o => parseInt(o.number.replace('CMD', ''))).filter(n => !isNaN(n))
  const max = numbers.length ? Math.max(...numbers) : 0
  return 'CMD' + String(max + 1).padStart(3, '0')
}

function getProductStock(productId: number | null) {
  if (!productId) return 0
  const p = products.find(p => p.id === productId)
  return p ? p.stock : 0
}

function getQuantityError(product: { id: number | null; qty: number }) {
  if (!product.qty || product.qty <= 0) {
    return "Quantité invalide"
  }
  if (product.id) {
    const stock = getProductStock(product.id)
    if (product.qty > stock) {
      return `Stock insuffisant (max ${stock})`
    }
  }
  return ''
}


function addProduct() {
  form.value.productsList.push({ id: null, qty: 1 })
}

function removeProduct(index: number) {
  form.value.productsList.splice(index, 1)
}

function updateTotal() {
  let total = 0
  form.value.productsList.forEach(p => {
    const prod = products.find(prod => prod.id === p.id)
    if (prod) {
      total += (prod.price * (p.qty || 0))
    }
  })
  return total
}

function editOrder(order: any) {
  editedOrder.value = order
  form.value = {
    date: order.date,
    status: order.status,
    clientId: order.clientId,
    productsList: JSON.parse(JSON.stringify(order.productsList))
  }
  showAddOrder.value = true
}

function askDeleteOrder(order: any) {
  orderToDelete.value = order
  showDeleteConfirm.value = true
}

function confirmDeleteOrder() {
  if (orderToDelete.value) {
    orders.value = orders.value.filter(o => o.id !== orderToDelete.value.id)
  }
  showDeleteConfirm.value = false
  orderToDelete.value = null
}

function isFormValid() {
  if (!formValid.value) return false
  if (form.value.productsList.length === 0) return false
  return form.value.productsList.every(p => p.id && p.qty > 0 && p.qty <= getProductStock(p.id))
}

function saveOrder() {
  orderForm.value?.validate()
  showNoProductError.value = form.value.productsList.length === 0

  if (!formValid.value || showNoProductError.value) return

  if (!form.value.productsList.every(p => p.id && p.qty > 0 && p.qty <= getProductStock(p.id)))
    return

  const total = updateTotal()

  if (editedOrder.value) {
    Object.assign(editedOrder.value, { ...form.value, total })
  } else {
    orders.value.push({
      id: Date.now(),
      number: generateNextOrderNumber(),
      ...form.value,
      total
    })
  }
  closeDialog()
}

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function closeDialog() {
  showAddOrder.value = false
  editedOrder.value = null
  form.value = { date: '', status: '', clientId: null, productsList: [] }
  orderForm.value?.resetValidation()
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 10px;
}

.product-line {
  align-items: center;
}

.delete-btn {
  align-self: center;
  margin-left: 8px;
  height: 32px;
  width: 32px;
  min-width: 32px;
}
</style>
