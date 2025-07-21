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
      :loading="loading"
      item-value="_id"
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

      <template #item.prix="{ item }"> {{ item.prix }} € </template>

      <template #item.couleur="{ item }">
        <v-chip
          :style="`background-color: ${colorHex(item.couleur)}; color: white`"
          small
        >
          {{ colorLabel(item.couleur) }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn
            icon
            density="compact"
            color="primary"
            @click="editArticle(item)"
          >
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            color="error"
            @click="askDeleteArticle(item)"
          >
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="showAddArticle" max-width="700">
      <v-card>
        <v-card-title
          >{{ editedArticle ? "Modifier" : "Ajouter" }} un article</v-card-title
        >

        <v-card-text>
          <v-form ref="articleForm" v-model="formValid">
            <v-text-field
              v-model="form.nom"
              label="Nom de l'article"
              :rules="[(v) => !!v || 'Nom requis']"
            />
            <v-text-field
              v-model="form.marque"
              label="Marque"
              :rules="[(v) => !!v || 'Marque requise']"
            />
            <v-text-field
              v-model.number="form.prix"
              label="Prix (€)"
              type="number"
              :rules="[(v) => v >= 0 || 'Prix invalide']"
            />

            <v-img
              v-if="form.image"
              :src="form.image"
              max-width="150"
              class="mb-2"
            />

            <v-file-input
              v-model="selectedImage"
              label="Image de l'article"
              accept="image/*"
              prepend-icon="mdi-image"
              show-size
              @change="onImageSelected"
            />

            <v-select
              v-model="form.couleur"
              :items="availableColors"
              label="Couleur"
              item-title="label"
              item-value="value"
            />
            <v-textarea v-model="form.description" label="Description" />
            <v-text-field
              v-model.number="form.stock"
              label="Stock disponible"
              type="number"
              :rules="[(v) => v >= 0 || 'Stock invalide']"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveArticle" :loading="saving"
            >Enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Voulez-vous vraiment supprimer
          <strong>{{ articleToDelete?.nom }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteArticle" :loading="deleting"
            >Supprimer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { articleService, type Article } from "@/services/articles";

const availableColors = [
  { value: "red", label: "Rouge" },
  { value: "blue", label: "Bleu" },
  { value: "green", label: "Vert" },
  { value: "yellow", label: "Jaune" },
  { value: "purple", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "grey", label: "Gris" },
  { value: "black", label: "Noir" },
  { value: "white", label: "Blanc" },
];

function colorLabel(value: string) {
  return availableColors.find((c) => c.value === value)?.label || value;
}

function colorHex(value: string) {
  const map: Record<string, string> = {
    red: "#e53935",
    blue: "#1e88e5",
    green: "#43a047",
    yellow: "#fdd835",
    purple: "#8e24aa",
    orange: "#fb8c00",
    grey: "#757575",
    black: "#000000",
    white: "#e0e0e0",
  };
  return map[value] || "#bdbdbd";
}

const articles = ref<Article[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const headers = [
  { title: "Image", key: "image", sortable: false, width: "80px" },
  { title: "Nom", key: "nom" },
  { title: "Marque", key: "marque" },
  { title: "Prix", key: "prix" },
  { title: "Couleur", key: "couleur" },
  { title: "Stock", key: "stock" },
  { title: "", key: "actions", sortable: false, width: "100px" },
];

const showAddArticle = ref(false);
const showDeleteConfirm = ref(false);
const editedArticle = ref<Article | null>(null);
const articleToDelete = ref<Article | null>(null);
const formValid = ref(false);
const articleForm = ref();
const selectedImage = ref<File | null>(null);

const form = ref({
  nom: "",
  marque: "",
  prix: 0,
  image: "",
  couleur: "",
  description: "",
  stock: 0,
});

onMounted(() => {
  loadArticles();
});

async function loadArticles() {
  try {
    loading.value = true;
    articles.value = await articleService.getArticles();
  } catch (error) {
    showSnackbar("Erreur lors du chargement des articles", "error");
  } finally {
    loading.value = false;
  }
}

function onImageSelected() {
  if (!selectedImage.value) return;
  const reader = new FileReader();
  reader.onload = () => {
    form.value.image = reader.result as string;
  };
  reader.readAsDataURL(selectedImage.value);
}

function editArticle(article: Article) {
  editedArticle.value = article;
  form.value = {
    nom: article.nom,
    marque: article.marque,
    prix: article.prix,
    image: article.image || "",
    couleur: article.couleur,
    description: article.description,
    stock: article.stock,
  };
  selectedImage.value = null;
  showAddArticle.value = true;
}

function askDeleteArticle(article: Article) {
  articleToDelete.value = article;
  showDeleteConfirm.value = true;
}

async function confirmDeleteArticle() {
  if (!articleToDelete.value?._id) return;

  try {
    deleting.value = true;
    await articleService.deleteArticle(articleToDelete.value._id);
    await loadArticles();
    showSnackbar("Article supprimé avec succès");
  } catch (error) {
    showSnackbar("Erreur lors de la suppression", "error");
  } finally {
    deleting.value = false;
    showDeleteConfirm.value = false;
    articleToDelete.value = null;
  }
}

async function saveArticle() {
  articleForm.value?.validate();
  if (!formValid.value) return;

  try {
    saving.value = true;

    if (editedArticle.value?._id) {
      await articleService.updateArticle(editedArticle.value._id, form.value);
      showSnackbar("Article modifié avec succès");
    } else {
      await articleService.createArticle(form.value);
      showSnackbar("Article créé avec succès");
    }

    await loadArticles();
    closeDialog();
  } catch (error) {
    showSnackbar("Erreur lors de l'enregistrement", "error");
  } finally {
    saving.value = false;
  }
}

function closeDialog() {
  showAddArticle.value = false;
  editedArticle.value = null;
  selectedImage.value = null;
  form.value = {
    nom: "",
    marque: "",
    prix: 0,
    image: "",
    couleur: "",
    description: "",
    stock: 0,
  };
  articleForm.value?.resetValidation();
}

function showSnackbar(text: string, color: string = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 8px;
}
</style>
