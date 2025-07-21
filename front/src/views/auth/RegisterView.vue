<template>
  <div class="gradient-background">
    <v-container
      class="d-flex align-center justify-center"
      style="height: 100vh"
    >
      <v-card width="100%" max-width="600" elevation="4" class="pa-4">
        <v-card-title class="text-h5 text-center">Créer un compte</v-card-title>
        <v-card-subtitle class="text-center mb-2"
          >Merci de renseigner ces informations pour permettre la création de
          votre compte</v-card-subtitle
        >

        <v-alert
          v-if="authStore.error"
          type="error"
          class="mb-4"
          closable
          @click:close="authStore.clearError"
        >
          {{ authStore.error }}
        </v-alert>

        <v-form v-model="valid" ref="registerForm" @submit.prevent="submit">
          <v-text-field
            v-model="form.prenom"
            label="Prénom"
            :rules="[required]"
            :disabled="authStore.loading"
          />
          <v-text-field
            v-model="form.nom"
            label="Nom"
            :rules="[required]"
            :disabled="authStore.loading"
          />
          <v-text-field
            v-model="form.email"
            label="Email"
            :rules="[required, validEmail]"
            :disabled="authStore.loading"
          />
          <v-text-field
            v-model="form.password"
            label="Mot de passe"
            type="password"
            :rules="[required, minLength]"
            :disabled="authStore.loading"
          />
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            :rules="[required, matchPassword]"
            :disabled="authStore.loading"
          />
          <v-btn
            color="primary"
            block
            class="mt-3"
            type="submit"
            :loading="authStore.loading"
            :disabled="!valid"
          >
            Créer le compte
          </v-btn>
        </v-form>

        <div class="text-center mt-3">
          <span>Déjà inscrit ?</span>
          <v-btn variant="text" size="small" color="primary" :to="'/connexion'"
            >Se connecter</v-btn
          >
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const valid = ref(false);
const registerForm = ref();

const form = ref({
  prenom: "",
  nom: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const required = (v: string) => !!v || "Champ requis";
const validEmail = (v: string) => /.+@.+\..+/.test(v) || "Email invalide";
const minLength = (v: string) => v.length >= 6 || "6 caractères minimum";
const matchPassword = (v: string) =>
  v === form.value.password || "Les mots de passe ne correspondent pas";

async function submit() {
  if (!valid.value) return;

  const result = await authStore.register({
    nom: form.value.nom,
    prenom: form.value.prenom,
    email: form.value.email,
    motDePasse: form.value.password,
  });

  if (result.success) {
    router.push("/");
  }
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(135deg, #4a94c9, #3d81b8);
  min-height: 100vh;
}
</style>
