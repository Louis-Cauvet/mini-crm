<template>
  <v-container fluid>
    <h2>Détails de la commande</h2>

    <v-card class="pa-4 mb-4">
      <v-form ref="editForm" v-model="formValid">
        <v-text-field v-model="order.date" label="Date" type="date" />
        <v-select v-model="order.status" :items="statuses" label="Statut" />
        <v-select
          v-model="order.clientId"
          :items="clients"
          item-title="label"
          item-value="id"
          label="Client"
        />
      </v-form>
    </v-card>

    <h3>Produits de la commande</h3>

    <v-data-table
      :items="order.productsList"
      :headers="productHeaders"
      item-value="id"
      no-data-text="Aucun produit ajouté"
      class="mb-2"
      density="comfortable"
      hide-default-footer
    >
      <template #item.image="{ item }">
        <v-avatar size="40">
          <v-img :src="getProduct(item.id)?.image || ''" />
        </v-avatar>
      </template>

      <template #item.name="{ item }">
        {{ getProduct(item.id)?.name || "Produit inconnu" }}
      </template>

      <template #item.brand="{ item }">
        {{ getProduct(item.id)?.brand || "-" }}
      </template>

      <template #item.price="{ item }">
        {{ getProduct(item.id)?.price }} €
      </template>

      <template #item.color="{ item }">
        <v-chip
          small
          :style="`background:${colorHex(
            getProduct(item.id)?.color || ''
          )}; color:white`"
        >
          {{ colorLabel(getProduct(item.id)?.color || "") }}
        </v-chip>
      </template>

      <template #item.qty="{ item }">
        <v-text-field
          v-model.number="item.qty"
          type="number"
          min="1"
          :max="getProduct(item.id)?.stock || 1"
          :error-messages="getQtyError(item)"
          style="max-width: 100px"
          density="compact"
        />
      </template>

      <template #item.actions="{ index }">
        <v-btn
          icon
          density="compact"
          color="error"
          @click="removeProduct(index)"
        >
          <v-icon size="18">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-btn color="primary" variant="tonal" @click="showAddProductDialog = true">
      <v-icon start>mdi-plus</v-icon> Ajouter un produit
    </v-btn>

    <v-row class="mt-4 justify-end">
      <v-col cols="auto">
        <v-btn
          v-if="
            hasChanged &&
            order.productsList.length > 0 &&
            !order.productsList.some((p) => getQtyError(p))
          "
          color="primary"
          @click="saveChanges"
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

    <!-- Modale ajout produit -->
    <v-dialog v-model="showAddProductDialog" max-width="500">
      <v-card>
        <v-card-title>Ajouter un produit</v-card-title>
        <v-card-text>
          <v-select
            v-model="newProduct.id"
            :items="products"
            item-title="name"
            item-value="id"
            label="Produit"
          />
          <v-text-field
            v-model.number="newProduct.qty"
            type="number"
            min="1"
            :max="getProduct(newProduct.id)?.stock || 1"
            label="Quantité"
          />
          <v-alert
            v-if="getQtyError(newProduct)"
            type="error"
            density="compact"
            class="mt-2"
          >
            {{ getQtyError(newProduct) }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAddProductDialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="addProduct">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation suppression -->
    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Voulez-vous vraiment supprimer la commande
          <strong>{{ order.number }}</strong> ?
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clientService } from "@/services/clients";

const route = useRoute();
const router = useRouter();

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  color: string;
  stock: number;
  image: string;
}

interface OrderItem {
  id: number;
  qty: number;
}

interface Order {
  id: string | null;
  number: string;
  date: string;
  status: string;
  clientId: string | null;
  productsList: OrderItem[];
}

const statuses = [
  "Demandée",
  "En préparation",
  "Expédiée",
  "Récupérée",
  "Annulée",
];

const clients = ref<{ id: string; label: string }[]>([]);

const products: Product[] = [
  {
    id: 1,
    name: "Ordinateur Portable",
    price: 500,
    brand: "HP",
    color: "grey",
    stock: 10,
    image: "https://picsum.photos/200",
  },
  {
    id: 2,
    name: "Clé USB 64Go",
    price: 30,
    brand: "SanDisk",
    color: "red",
    stock: 50,
    image: "https://picsum.photos/201",
  },
  {
    id: 3,
    name: 'Moniteur 27"',
    price: 200,
    brand: "Dell",
    color: "black",
    stock: 5,
    image: "https://picsum.photos/205",
  },
];

const order = ref<Order>({
  id: null,
  number: "",
  date: "",
  status: "",
  clientId: null,
  productsList: [],
});

const initialOrder = ref<Order | null>(null);
const showDeleteConfirm = ref(false);
const showAddProductDialog = ref(false);
const formValid = ref(false);
const editForm = ref();

const newProduct = ref<{ id: number | null; qty: number }>({
  id: null,
  qty: 1,
});

const productHeaders = [
  { title: "Image", key: "image" },
  { title: "Nom", key: "name" },
  { title: "Marque", key: "brand" },
  { title: "Prix", key: "price" },
  { title: "Couleur", key: "color" },
  { title: "Quantité", key: "qty" },
  { title: "", key: "actions", sortable: false, width: "60px" },
];

onMounted(async () => {
  // Load clients from API
  try {
    const clientsData = await clientService.getClients();
    clients.value = clientsData.map((client) => ({
      id: client._id!,
      label: `${client.prenom} ${client.nom} - ${client.email}`,
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error);
  }

  const orderId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  order.value = {
    id: orderId,
    number: "CMD001",
    date: "2025-07-15",
    status: "Expédiée",
    clientId: clients.value[0]?.id || null,
    productsList: [{ id: 1, qty: 2 }],
  };
  initialOrder.value = JSON.parse(JSON.stringify(order.value));
});

const hasChanged = computed(() => {
  return JSON.stringify(order.value) !== JSON.stringify(initialOrder.value);
});

function saveChanges() {
  editForm.value?.validate();
  if (!formValid.value) return;

  if (
    !order.value.productsList.length ||
    !order.value.productsList.every((p) => !getQtyError(p))
  )
    return;

  initialOrder.value = JSON.parse(JSON.stringify(order.value));
}

function confirmDelete() {
  showDeleteConfirm.value = false;
  router.push("/commandes");
}

function getProduct(id: number | null): Product | undefined {
  return products.find((p) => p.id === id);
}

function getQtyError(item: { id: number | null; qty: number }): string {
  if (!item.id) return "Produit requis";
  if (!item.qty || item.qty <= 0) return "Quantité invalide";
  const stock = getProduct(item.id)?.stock || 0;
  if (item.qty > stock) return `Stock insuffisant (max ${stock})`;
  return "";
}

function addProduct() {
  if (!newProduct.value.id || getQtyError(newProduct.value)) return;
  order.value.productsList.push({
    id: newProduct.value.id,
    qty: newProduct.value.qty,
  });
  newProduct.value = { id: null, qty: 1 };
  showAddProductDialog.value = false;
}

function removeProduct(index: number) {
  order.value.productsList.splice(index, 1);
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
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 10px;
}
</style>
