<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Liste des articles</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddArticle = true">
          <v-icon start>mdi-plus</v-icon> Ajouter un article
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="articles"
      :headers="headers"
      item-value="id"
      class="elevation-1"
      density="comfortable"
      no-data-text="Aucun article trouvé"
    >
      <template #item.image="{ item }">
        <v-avatar size="40">
          <v-img v-if="item.image" :src="item.image" />
          <v-icon v-else>mdi-image-off</v-icon>
        </v-avatar>
      </template>

      <template #item.price="{ item }">
        {{ item.price }} €
      </template>

      <template #item.color="{ item }">
        <v-chip
          :style="`background-color: ${colorHex(item.color)}; color: white`"
          small
        >
          {{ colorLabel(item.color) }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn icon density="compact" color="primary" @click="editArticle(item)">
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" color="error" @click="askDeleteArticle(item)">
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="showAddArticle" max-width="700">
      <v-card>
        <v-card-title>{{ editedArticle ? 'Modifier' : 'Ajouter' }} un article</v-card-title>

        <v-card-text>
          <v-form ref="articleForm" v-model="formValid">
            <v-text-field v-model="form.name" label="Nom de l'article" :rules="[v => !!v || 'Nom requis']" />
            <v-text-field v-model="form.brand" label="Marque" :rules="[v => !!v || 'Marque requise']" />
            <v-text-field v-model.number="form.price" label="Prix (€)" type="number" :rules="[v => v >= 0 || 'Prix invalide']" />

            <v-img v-if="form.image" :src="form.image" max-width="150" class="mb-2" />

            <v-file-input
              v-model="selectedImage"
              label="Image de l'article"
              accept="image/*"
              prepend-icon="mdi-image"
              show-size
              @change="onImageSelected"
            />

            <v-select
              v-model="form.color"
              :items="availableColors"
              label="Couleur"
              item-title="label"
              item-value="value"
            />
            <v-textarea v-model="form.description" label="Description" />
            <v-text-field v-model.number="form.stock" label="Stock disponible" type="number" :rules="[v => v >= 0 || 'Stock invalide']" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveArticle">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Voulez-vous vraiment supprimer <strong>{{ articleToDelete?.name }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteArticle">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const availableColors = [
  { value: 'red', label: 'Rouge' },
  { value: 'blue', label: 'Bleu' },
  { value: 'green', label: 'Vert' },
  { value: 'yellow', label: 'Jaune' },
  { value: 'purple', label: 'Violet' },
  { value: 'orange', label: 'Orange' },
  { value: 'grey', label: 'Gris' },
  { value: 'black', label: 'Noir' },
  { value: 'white', label: 'Blanc' }
]

function colorLabel(value: string) {
  return availableColors.find(c => c.value === value)?.label || value
}

function colorHex(value: string) {
  const map: Record<string, string> = {
    red: '#e53935',
    blue: '#1e88e5',
    green: '#43a047',
    yellow: '#fdd835',
    purple: '#8e24aa',
    orange: '#fb8c00',
    grey: '#757575',
    black: '#000000',
    white: '#e0e0e0'
  }
  return map[value] || '#bdbdbd'
}

const articles = ref([
  { id: 1, name: 'Ordinateur Portable ProBook 450', brand: 'HP', price: 1299, image: 'https://picsum.photos/200', color: 'grey', description: 'Ordinateur professionnel.', stock: 12 },
  { id: 2, name: 'Clé USB Ultra Fit 64Go', brand: 'SanDisk', price: 25, image: 'https://picsum.photos/201', color: 'red', description: 'Clé USB compacte.', stock: 100 },
  { id: 3, name: 'Moniteur LED 27" UltraSharp', brand: 'Dell', price: 399, image: 'https://picsum.photos/205', color: 'black', description: 'Moniteur QHD design.', stock: 8 }
])

const headers = [
  { title: 'Image', key: 'image', sortable: false, width: '80px' },
  { title: 'Nom', key: 'name' },
  { title: 'Marque', key: 'brand' },
  { title: 'Prix', key: 'price' },
  { title: 'Couleur', key: 'color' },
  { title: 'Stock', key: 'stock' },
  { title: '', key: 'actions', sortable: false, width: '100px' }
]

const showAddArticle = ref(false)
const showDeleteConfirm = ref(false)
const editedArticle = ref<any>(null)
const articleToDelete = ref<any>(null)
const formValid = ref(false)
const articleForm = ref()
const selectedImage = ref<File | null>(null)

const form = ref({
  name: '',
  brand: '',
  price: 0,
  image: '',
  color: '',
  description: '',
  stock: 0
})

function onImageSelected() {
  if (!selectedImage.value) return
  const reader = new FileReader()
  reader.onload = () => {
    form.value.image = reader.result as string
  }
  reader.readAsDataURL(selectedImage.value)
}

function editArticle(article: any) {
  editedArticle.value = article
  form.value = { ...article }
  selectedImage.value = null
  showAddArticle.value = true
}

function askDeleteArticle(article: any) {
  articleToDelete.value = article
  showDeleteConfirm.value = true
}

function confirmDeleteArticle() {
  if (articleToDelete.value) {
    articles.value = articles.value.filter(a => a.id !== articleToDelete.value.id)
  }
  showDeleteConfirm.value = false
  articleToDelete.value = null
}

function saveArticle() {
  articleForm.value?.validate()
  if (!formValid.value) return

  if (editedArticle.value) {
    Object.assign(editedArticle.value, { ...form.value })
  } else {
    articles.value.push({ id: Date.now(), ...form.value })
  }
  closeDialog()
}

function closeDialog() {
  showAddArticle.value = false
  editedArticle.value = null
  selectedImage.value = null
  form.value = { name: '', brand: '', price: 0, image: '', color: '', description: '', stock: 0 }
  articleForm.value?.resetValidation()
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 8px;
}
</style>
