import { createApp, ref } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)

const drawer = ref(false)
app.provide('drawer', drawer)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
