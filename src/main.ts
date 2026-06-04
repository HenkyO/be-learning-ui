// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/authStore'
import { initCSRFProtection } from './utils/csrfToken'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize CSRF protection
initCSRFProtection()

// Inisialisasi sesi Supabase sebelum me-mount aplikasi & router
const authStore = useAuthStore()
authStore.initializeSession().then(() => {
  app.use(router)
  app.mount('#app')
})