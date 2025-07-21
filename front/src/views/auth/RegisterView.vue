<template>
  <div class="gradient-background">
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
      <v-card width="100%" max-width="600" elevation="4" class="pa-4">
        <v-card-title class="text-h5 text-center">Créer un compte</v-card-title>
        <v-card-subtitle class="text-center mb-2">Merci de renseigner ces informations pour permettre la création de votre compte</v-card-subtitle>

        <v-form v-model="valid" ref="registerForm">
          <v-text-field v-model="form.firstname" label="Prénom" :rules="[required]" />
          <v-text-field v-model="form.lastname" label="Nom" :rules="[required]" />
          <v-text-field v-model="form.email" label="Email" :rules="[required, validEmail]" />
          <v-text-field v-model="form.password" label="Mot de passe" type="password" :rules="[required, minLength]" />
          <v-text-field v-model="form.confirmPassword" label="Confirmer le mot de passe" type="password" :rules="[required, matchPassword]" />
          <v-btn color="primary" block class="mt-3" @click="submit">Créer le compte</v-btn>
        </v-form>

        <div class="text-center mt-3">
          <span>Déjà inscrit ?</span>
          <v-btn variant="text" size="small" color="primary" :to="'/connexion'">Se connecter</v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/logo.png'

const valid = ref(false)
const registerForm = ref()

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const required = (v: string) => !!v || 'Champ requis'
const validEmail = (v: string) => /.+@.+\..+/.test(v) || 'Email invalide'
const minLength = (v: string) => v.length >= 6 || '6 caractères minimum'
const matchPassword = (v: string) => v === form.value.password || 'Les mots de passe ne correspondent pas'

function submit() {
  registerForm.value.validate()
  if (valid.value) {
    console.log('Inscription avec :', form.value)
  }
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(135deg, #4a94c9, #3d81b8);
  min-height: 100vh;
}
</style>
