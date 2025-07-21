<template>
  <v-container fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h2>Liste des commandes</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddOrder = true" :loading="loading">
          <v-icon start>mdi-plus</v-icon> Ajouter une commande
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :items="sortedOrders"
      :headers="headers"
      :loading="loading"
      item-value="_id"
      class="elevation-1"
      density="comfortable"
      no-data-text="Aucune commande trouvée"
    >
      <template #item.client="{ item }">
        {{ `${item.client.prenom} ${item.client.nom}` }}
      </template>

      <template #item.montantTotal="{ item }">
        {{ item.montantTotal }} €
      </template>

      <template #item.dateCommande="{ item }">
        {{ formatDate(item.dateCommande) }}
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn
            icon
            density="compact"
            color="primary"
            @click="editOrder(item)"
          >
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            color="error"
            @click="askDeleteOrder(item)"
          >
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            color="info"
            :to="`/commandes/${item._id}`"
          >
            <v-icon size="18">mdi-eye</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Add/Edit Order Dialog -->
    <v-dialog v-model="showAddOrder" max-width="700">
      <v-card>
        <v-card-title
          >{{ editedOrder ? "Modifier" : "Ajouter" }} une commande</v-card-title
        >
        <v-card-text>
          <v-form ref="orderForm" v-model="formValid">
            <v-select
              v-model="form.statut"
              :items="statuses"
              label="Statut"
              :rules="[(v) => !!v || 'Statut requis']"
            />
            <v-select
              v-model="form.client"
              :items="clients"
              item-title="label"
              item-value="_id"
              label="Client"
              :rules="[(v) => !!v || 'Client requis']"
              :loading="clientsLoading"
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

              <div
                v-for="(product, index) in form.articles"
                :key="index"
                class="product-line d-flex align-center mb-2"
              >
                <v-select
                  v-model="product.article"
                  :items="articles"
                  item-title="nom"
                  item-value="_id"
                  label="Produit"
                  class="flex-grow-1"
                  density="comfortable"
                  @update:modelValue="updateTotal"
                  :rules="[(v) => !!v || 'Produit requis']"
                  :loading="articlesLoading"
                />
                <v-text-field
                  v-model.number="product.quantite"
                  label="Quantité"
                  type="number"
                  min="1"
                  density="comfortable"
                  style="max-width: 100px; margin-left: 8px"
                  @input="updateTotal"
                  :error-messages="getQuantityError(product)"
                />

                <v-btn
                  icon
                  size="x-small"
                  variant="tonal"
                  color="error"
                  class="delete-btn ml-2 mb-5"
                  @click="
                    removeProduct(index);
                    updateTotal();
                  "
                >
                  <v-icon size="14">mdi-close</v-icon>
                </v-btn>
              </div>

              <v-btn variant="tonal" color="primary" @click="addProduct" block>
                <v-icon start>mdi-plus</v-icon> Ajouter un produit
              </v-btn>
            </v-sheet>

            <v-text-field
              v-model="calculatedTotal"
              label="Total"
              readonly
              suffix="€"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog" :disabled="saveLoading">Annuler</v-btn>
          <v-btn color="primary" @click="saveOrder" :loading="saveLoading"
            >Enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-btn
            color="error"
            @click="confirmDeleteOrder"
            :loading="deleteLoading"
            >Supprimer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from "vue";
import { orderService, type Order } from "@/services/orders";
import { articleService, type Article } from "@/services/articles";
import { clientService, type Client } from "@/services/clients";

const statuses = [
  "Demandée",
  "En préparation",
  "Expédiée",
  "Récupérée",
  "Annulée",
];

const orders = ref<Order[]>([]);
const clients = ref<(Client & { label: string })[]>([]);
const articles = ref<Article[]>([]);

const headers = [
  { title: "Client", key: "client" },
  { title: "Date", key: "dateCommande" },
  { title: "Statut", key: "statut" },
  { title: "Total", key: "montantTotal" },
  { title: "", key: "actions", sortable: false, width: "100px" },
];

// Loading states
const loading = ref(false);
const clientsLoading = ref(false);
const articlesLoading = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);

// Dialog states
const showAddOrder = ref(false);
const showDeleteConfirm = ref(false);
const showError = ref(false);
const showSuccess = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const editedOrder = ref<Order | null>(null);
const orderToDelete = ref<Order | null>(null);
const formValid = ref(false);
const orderForm = ref();
const showNoProductError = ref(false);

const form = ref({
  statut: "Demandée",
  client: "",
  articles: [] as { article: string; quantite: number }[],
});

const calculatedTotal = computed(() => {
  let total = 0;
  form.value.articles.forEach((item) => {
    const article = articles.value.find((a) => a._id === item.article);
    if (article) {
      total += article.prix * item.quantite;
    }
  });
  return total.toFixed(2);
});

onMounted(async () => {
  await Promise.all([loadOrders(), loadClients(), loadArticles()]);
});

async function loadOrders() {
  try {
    loading.value = true;
    orders.value = await orderService.getOrders();
  } catch (error) {
    showErrorMessage("Erreur lors du chargement des commandes");
  } finally {
    loading.value = false;
  }
}

async function loadClients() {
  try {
    clientsLoading.value = true;
    const clientsData = await clientService.getClients();
    clients.value = clientsData.map((client) => ({
      ...client,
      label: `${client.prenom} ${client.nom} - ${client.email}`,
    }));
  } catch (error) {
    showErrorMessage("Erreur lors du chargement des clients");
  } finally {
    clientsLoading.value = false;
  }
}

async function loadArticles() {
  try {
    articlesLoading.value = true;
    articles.value = await articleService.getArticles();
  } catch (error) {
    showErrorMessage("Erreur lors du chargement des articles");
  } finally {
    articlesLoading.value = false;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function getArticleStock(articleId: string) {
  const article = articles.value.find((a) => a._id === articleId);
  return article ? article.stock : 0;
}

function getQuantityError(product: { article: string; quantite: number }) {
  if (!product.quantite || product.quantite <= 0) {
    return "Quantité invalide";
  }
  if (product.article) {
    const stock = getArticleStock(product.article);
    if (product.quantite > stock) {
      return `Stock insuffisant (max ${stock})`;
    }
  }
  return "";
}

function addProduct() {
  form.value.articles.push({ article: "", quantite: 1 });
}

function removeProduct(index: number) {
  form.value.articles.splice(index, 1);
}

function updateTotal() {
  // Total is computed automatically
}

function editOrder(order: Order) {
  editedOrder.value = order;
  form.value = {
    statut: order.statut,
    client: order.client._id,
    articles: order.articles.map((item) => ({
      article: item.article._id,
      quantite: item.quantite,
    })),
  };
  showAddOrder.value = true;
}

function askDeleteOrder(order: Order) {
  orderToDelete.value = order;
  showDeleteConfirm.value = true;
}

async function confirmDeleteOrder() {
  if (!orderToDelete.value) return;

  try {
    deleteLoading.value = true;
    await orderService.deleteOrder(orderToDelete.value._id);
    await loadOrders();
    showSuccessMessage("Commande supprimée avec succès");
  } catch (error) {
    showErrorMessage("Erreur lors de la suppression de la commande");
  } finally {
    deleteLoading.value = false;
    showDeleteConfirm.value = false;
    orderToDelete.value = null;
  }
}

async function saveOrder() {
  orderForm.value?.validate();
  showNoProductError.value = form.value.articles.length === 0;

  if (!formValid.value || showNoProductError.value) return;

  if (
    !form.value.articles.every(
      (p) =>
        p.article && p.quantite > 0 && p.quantite <= getArticleStock(p.article)
    )
  ) {
    return;
  }

  try {
    saveLoading.value = true;

    const orderData = {
      client: form.value.client,
      statut: form.value.statut,
      articles: form.value.articles.map((item) => {
        const article = articles.value.find((a) => a._id === item.article);
        return {
          article: item.article,
          quantite: item.quantite,
          prixUnitaire: article?.prix || 0,
        };
      }),
      montantTotal: parseFloat(calculatedTotal.value),
    };

    if (editedOrder.value) {
      await orderService.updateOrder(editedOrder.value._id, orderData);
      showSuccessMessage("Commande modifiée avec succès");
    } else {
      await orderService.createOrder(orderData);
      showSuccessMessage("Commande créée avec succès");
    }

    await loadOrders();
    closeDialog();
  } catch (error) {
    showErrorMessage("Erreur lors de l'enregistrement de la commande");
  } finally {
    saveLoading.value = false;
  }
}

const sortedOrders = computed(() => {
  return [...orders.value].sort(
    (a, b) =>
      new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
  );
});

function closeDialog() {
  showAddOrder.value = false;
  editedOrder.value = null;
  form.value = { statut: "Demandée", client: "", articles: [] };
  orderForm.value?.resetValidation();
  showNoProductError.value = false;
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
