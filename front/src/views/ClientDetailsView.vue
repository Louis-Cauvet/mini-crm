<template>
  <v-container fluid>
    <h2>Données du client</h2>

    <v-card class="pa-4 mb-4" :loading="loading">
      <v-form ref="editForm" v-model="formValid">
        <v-text-field
          v-model="client.prenom"
          label="Prénom"
          :rules="[(v) => !!v || 'Le prénom est requis']"
        />
        <v-text-field
          v-model="client.nom"
          label="Nom"
          :rules="[(v) => !!v || 'Le nom est requis']"
        />
        <v-text-field
          v-model="client.email"
          label="Email"
          :rules="[
            (v) => !!v || 'L\'email est requis',
            (v) => /.+@.+\..+/.test(v) || 'Email invalide',
          ]"
        />
        <v-text-field
          v-model="client.telephone"
          label="Téléphone"
          :rules="[(v) => !!v || 'Le téléphone est requis']"
        />
        <v-text-field
          v-model="client.adresse.rue"
          label="Rue"
          :rules="[(v) => !!v || 'La rue est requise']"
        />
        <v-text-field
          v-model="client.adresse.ville"
          label="Ville"
          :rules="[(v) => !!v || 'La ville est requise']"
        />
        <v-text-field
          v-model="client.adresse.codePostal"
          label="Code postal"
          :rules="[(v) => !!v || 'Le code postal est requis']"
        />
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
              :loading="saving"
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
    >
      <template #item.actions="{ item }">
        <v-btn
          icon
          density="compact"
          color="info"
          :to="`/commandes/${item.id}`"
        >
          <v-icon size="18">mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer
          <strong>{{ client.prenom }} {{ client.nom }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="deleting"
            >Supprimer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clientService, type Client } from "@/services/clients";

const route = useRoute();
const router = useRouter();

const client = ref<Client>({
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: {
    rue: "",
    ville: "",
    codePostal: "",
  },
});
const initialClient = ref<Client | null>(null);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const orders = ref<any[]>([]);
const showDeleteConfirm = ref(false);

const formValid = ref(false);
const editForm = ref();

const orderHeaders = [
  { title: "Numéro", key: "number" },
  { title: "Date", key: "date" },
  { title: "Montant total", key: "total" },
  { title: "", key: "actions", sortable: false, width: "60px" },
];

onMounted(async () => {
  const clientId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  if (clientId) {
    await loadClient(clientId);
  }

  // TODO: Load client orders from API
  orders.value = [
    { id: 1001, number: "1001", date: "01/07/2025", total: "120 €" },
    { id: 1002, number: "1002", date: "15/07/2025", total: "340 €" },
  ];
});

async function loadClient(id: string) {
  loading.value = true;
  try {
    client.value = await clientService.getClient(id);
    initialClient.value = JSON.parse(JSON.stringify(client.value));
  } catch (error) {
    console.error("Erreur lors du chargement du client:", error);
    router.push("/clients");
  } finally {
    loading.value = false;
  }
}

const hasChanged = computed(() => {
  return JSON.stringify(client.value) !== JSON.stringify(initialClient.value);
});

async function saveChanges() {
  editForm.value?.validate();
  if (!formValid.value || !client.value._id) return;

  saving.value = true;
  try {
    const updated = await clientService.updateClient(client.value._id, {
      nom: client.value.nom,
      prenom: client.value.prenom,
      email: client.value.email,
      telephone: client.value.telephone,
      adresse: client.value.adresse,
    });
    client.value = updated;
    initialClient.value = JSON.parse(JSON.stringify(client.value));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!client.value._id) return;

  deleting.value = true;
  try {
    await clientService.deleteClient(client.value._id);
    router.push("/clients");
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    deleting.value = false;
  }
}
</script>
