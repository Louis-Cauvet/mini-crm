<template>
  <div class="gradient-background">
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
      <v-card width="100%" max-width="500" elevation="4" class="pa-4">
        <v-card-title class="text-h5 text-center">Connexion à votre compte</v-card-title>

        <v-form v-model="valid" ref="loginForm">
          <v-text-field v-model="form.email" label="Email" :rules="[required, validEmail]" />
          <v-text-field v-model="form.password" label="Mot de passe" type="password" :rules="[required]" />
          <v-btn color="primary" block class="mt-3" @click="submit">Se connecter</v-btn>
        </v-form>

        <div class="text-center mt-3">
          <span>Pas encore de compte ?</span>
          <v-btn variant="text" size="small" color="primary" :to="'/enregistrement'">Créer un compte</v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/logo.png'

const valid = ref(false)
const loginForm = ref()

const form = ref({
  email: '',
  password: ''
})

const required = (v: string) => !!v || 'Champ requis'
const validEmail = (v: string) => /.+@.+\..+/.test(v) || 'Email invalide'

function submit() {
  loginForm.value.validate()
  if (valid.value) {
    console.log('Connexion avec :', form.value)
  }
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(135deg, #4a94c9, #3d81b8);
  min-height: 100vh;
}
</style>