<template>
  <div class="gradient-background">
    <v-container
      class="d-flex align-center justify-center"
      style="height: 100vh"
    >
      <v-card width="100%" max-width="500" elevation="4" class="pa-4">
        <v-card-title class="text-h5 text-center"
          >Connexion à votre compte</v-card-title
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

        <v-form v-model="valid" ref="loginForm" @submit.prevent="submit">
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
            :rules="[required]"
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
            Se connecter
          </v-btn>
        </v-form>

        <div class="text-center mt-3">
          <span>Pas encore de compte ?</span>
          <v-btn
            variant="text"
            size="small"
            color="primary"
            :to="'/enregistrement'"
            >Créer un compte</v-btn
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
const loginForm = ref();

const form = ref({
  email: "",
  password: "",
});

const required = (v: string) => !!v || "Champ requis";
const validEmail = (v: string) => /.+@.+\..+/.test(v) || "Email invalide";

async function submit() {
  if (!valid.value) return;

  const result = await authStore.login({
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
