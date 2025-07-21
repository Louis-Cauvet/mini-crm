<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Détails de la commande</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="$router.push('/commandes')" variant="outlined">
          <v-icon start>mdi-arrow-left</v-icon> Retour
        </v-btn>
      </v-col>
    </v-row>

    <v-card v-if="order" class="pa-4 mb-4">
      <v-form ref="editForm" v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="formatDate(order.dateCommande)"
              label="Date de commande"
              readonly
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="order.statut"
              :items="statuses"
              label="Statut"
              @update:modelValue="hasChanged = true"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="`${order.client.prenom} ${order.client.nom} - ${order.client.email}`"
              label="Client"
              readonly
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-card v-if="order">
      <v-card-title>Produits de la commande</v-card-title>
      <v-card-text>
        <v-data-table
          :items="order.articles"
          :headers="productHeaders"
          no-data-text="Aucun produit ajouté"
          density="comfortable"
          hide-default-footer
        >
          <template #item.image="{ item }">
            <v-avatar size="40">
              <v-img :src="item.article.image || 'https://picsum.photos/200'" />
            </v-avatar>
          </template>

          <template #item.nom="{ item }">
            {{ item.article.nom }}
          </template>

          <template #item.marque="{ item }">
            {{ item.article.marque }}
          </template>

          <template #item.prixUnitaire="{ item }">
            {{ item.prixUnitaire }} €
          </template>

          <template #item.couleur="{ item }">
            <v-chip
              small
              :style="`background:${colorHex(item.article.couleur)}; color:white`"
            >
              {{ colorLabel(item.article.couleur) }}
            </v-chip>
          </template>

          <template #item.quantite="{ item }">
            <v-text-field
              v-model.number="item.quantite"
              type="number"
              min="1"
              :max="item.article.stock"
              style="max-width: 100px"
              density="compact"
              @input="hasChanged = true"
            />
          </template>

          <template #item.total="{ item }">
            {{ (item.quantite * item.prixUnitaire).toFixed(2) }} €
          </template>
        </v-data-table>

        <v-divider class="my-4" />

        <v-row justify="end">
          <v-col cols="auto">
            <div class="text-h6">
              Total: {{ order.montantTotal.toFixed(2) }} €
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mt-4 justify-end">
      <v-col cols="auto">
        <v-btn
          v-if="hasChanged && order"
          color="primary"
          @click="saveChanges"
          :loading="saveLoading"
        >
          <v-icon start>mdi-content-save</v-icon> Enregistrer
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="showDeleteConfirm = true">
          <v-icon start>mdi-delete</v-icon> Supprimer la commande
        </v-btn>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Voulez-vous vraiment supprimer cette commande ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false" :disabled="deleteLoading"
            >Annuler</v-btn
          >
          <v-btn color="error" @click="confirmDelete" :loading="deleteLoading"
            >Supprimer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="5000">
      {{ errorMessage }}
      <template #actions>
        <v-btn @click="showError = false">Fermer</v-btn>
      </template>
    </v-snackbar>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ successMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { orderService, type Order } from "@/services/orders";

const route = useRoute();
const router = useRouter();

const statuses = [
  "Demandée",
  "En préparation",
  "Expédiée",
  "Récupérée",
  "Annulée",
];

const order = ref<Order | null>(null);
const hasChanged = ref(false);
const loading = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);
const showDeleteConfirm = ref(false);
const showError = ref(false);
const showSuccess = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const formValid = ref(false);
const editForm = ref();

const productHeaders = [
  { title: "Image", key: "image" },
  { title: "Nom", key: "nom" },
  { title: "Marque", key: "marque" },
  { title: "Prix unitaire", key: "prixUnitaire" },
  { title: "Couleur", key: "couleur" },
  { title: "Quantité", key: "quantite" },
  { title: "Total", key: "total" },
];

onMounted(async () => {
  await loadOrder();
});

async function loadOrder() {
  const orderId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;

  try {
    loading.value = true;
    order.value = await orderService.getOrder(orderId);
  } catch (error) {
    showErrorMessage("Erreur lors du chargement de la commande");
  } finally {
    loading.value = false;
  }
}

async function saveChanges() {
  if (!order.value) return;

  try {
    saveLoading.value = true;

    // Recalculate total
    const newTotal = order.value.articles.reduce(
      (sum, item) => sum + item.quantite * item.prixUnitaire,
      0
    );

    // Only send the updateable fields, not the full order object
    const updateData = {
      statut: order.value.statut,
      articles: order.value.articles.map(item => ({
        article: item.article._id,
        quantite: item.quantite,
        prixUnitaire: item.prixUnitaire
      })),
      montantTotal: newTotal,
    };

    const updatedOrder = await orderService.updateOrder(order.value._id, updateData);
    order.value = updatedOrder;
    hasChanged.value = false;
    showSuccessMessage("Commande modifiée avec succès");
  } catch (error) {
    showErrorMessage("Erreur lors de la modification de la commande");
  } finally {
    saveLoading.value = false;
  }
}

async function confirmDelete() {
  if (!order.value) return;

  try {
    deleteLoading.value = true;
    await orderService.deleteOrder(order.value._id);
    showSuccessMessage("Commande supprimée avec succès");
    router.push("/commandes");
  } catch (error) {
    showErrorMessage("Erreur lors de la suppression de la commande");
  } finally {
    deleteLoading.value = false;
    showDeleteConfirm.value = false;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function colorLabel(value: string) {
  const map: Record<string, string> = {
    red: "Rouge",
    blue: "Bleu",
    green: "Vert",
    yellow: "Jaune",
    purple: "Violet",
    orange: "Orange",
    grey: "Gris",
    black: "Noir",
    white: "Blanc",
  };
  return map[value] || value;
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

function showErrorMessage(message: string) {
  errorMessage.value = message;
  showError.value = true;
}

function showSuccessMessage(message: string) {
  successMessage.value = message;
  showSuccess.value = true;
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 10px;
}
</style>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 10px;
}
</style>
