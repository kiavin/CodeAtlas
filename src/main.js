import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css' // Import Tailwind CSS

const app = createApp(App)

app.use(createPinia()) // Initialize Pinia
app.use(router)        // Initialize Router

app.mount('#app')