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
      item-value="_id"
      class="elevation-1"
      density="comfortable"
      no-data-text="Aucun utilisateur trouvé"
      :loading="loading"
    >
      <template #item.phone="{ item }">
        {{ formatPhone(item.telephone) }}
      </template>

      <template #item.address="{ item }">
        {{
          `${item.adresse.rue}, ${item.adresse.ville} ${item.adresse.codePostal}`
        }}
      </template>

      <template #item.actions="{ item }">
        <div class="action-buttons d-flex justify-end align-center gap-2">
          <v-btn icon density="compact" color="primary" @click="editUser(item)">
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            color="error"
            @click="askDeleteUser(item)"
          >
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            color="info"
            :to="`/clients/${item._id}`"
          >
            <v-icon size="18">mdi-eye</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="showAddUser" max-width="700">
      <v-card>
        <v-card-title>
          {{ editedUser ? "Modifier" : "Ajouter" }} un client
        </v-card-title>

        <v-card-text>
          <v-form ref="userForm" v-model="formValid">
            <v-text-field
              v-model="form.prenom"
              label="Prénom"
              :rules="[(v) => !!v || 'Le prénom est requis']"
            />
            <v-text-field
              v-model="form.nom"
              label="Nom"
              :rules="[(v) => !!v || 'Le nom est requis']"
            />
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[
                (v) => !!v || 'L\'email est requis',
                (v) => /.+@.+\..+/.test(v) || 'Email invalide',
              ]"
            />
            <v-text-field
              v-model="form.telephone"
              label="Téléphone"
              @blur="form.telephone = formatPhone(form.telephone)"
              :rules="[
                (v) => !!v || 'Le téléphone est requis',
                (v) =>
                  /^\d{10}$/.test(v.replace(/\s/g, '')) ||
                  'Numéro invalide (10 chiffres)',
              ]"
            />
            <v-text-field
              v-model="form.adresse.rue"
              label="Rue"
              :rules="[(v) => !!v || 'La rue est requise']"
            />
            <v-text-field
              v-model="form.adresse.ville"
              label="Ville"
              :rules="[(v) => !!v || 'La ville est requise']"
            />
            <v-text-field
              v-model="form.adresse.codePostal"
              label="Code postal"
              :rules="[(v) => !!v || 'Le code postal est requis']"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="saving"
            >Enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer
          <strong>{{ userToDelete?.prenom }} {{ userToDelete?.nom }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteConfirm = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDeleteUser" :loading="deleting"
            >Supprimer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { clientService, type Client } from "@/services/clients";

const users = ref<Client[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const headers = [
  { title: "Prénom", key: "prenom" },
  { title: "Nom", key: "nom" },
  { title: "Email", key: "email" },
  { title: "Téléphone", key: "phone" },
  { title: "Adresse", key: "address" },
  { title: "", key: "actions", sortable: false, width: "100px" },
];

const showAddUser = ref(false);
const showDeleteConfirm = ref(false);
const editedUser = ref<Client | null>(null);
const userToDelete = ref<Client | null>(null);
const formValid = ref(false);
const userForm = ref();

const form = ref({
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

onMounted(async () => {
  await loadClients();
});

async function loadClients() {
  loading.value = true;
  try {
    users.value = await clientService.getClients();
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error);
  } finally {
    loading.value = false;
  }
}

function editUser(user: Client) {
  editedUser.value = user;
  form.value = {
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    adresse: { ...user.adresse },
  };
  showAddUser.value = true;
}

function askDeleteUser(user: Client) {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
}

async function confirmDeleteUser() {
  if (!userToDelete.value?._id) return;

  deleting.value = true;
  try {
    await clientService.deleteClient(userToDelete.value._id);
    await loadClients();
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  } finally {
    deleting.value = false;
    showDeleteConfirm.value = false;
    userToDelete.value = null;
  }
}

async function saveUser() {
  userForm.value?.validate();
  if (!formValid.value) return;

  saving.value = true;
  try {
    if (editedUser.value?._id) {
      await clientService.updateClient(editedUser.value._id, form.value);
    } else {
      await clientService.createClient(form.value);
    }
    await loadClients();
    closeDialog();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  } finally {
    saving.value = false;
  }
}

function closeDialog() {
  showAddUser.value = false;
  editedUser.value = null;
  form.value = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: { rue: "", ville: "", codePostal: "" },
  };
  userForm.value?.resetValidation();
}

function formatPhone(phone: string) {
  return phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/g, "$1 ")
    .trim();
}
</script>

<style scoped>
.action-buttons > *:not(:first-child) {
  margin-left: 10px;
}
</style>
