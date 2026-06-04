<template>
  <ToastContainer />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './store/authStore'
import ToastContainer from './components/ToastContainer.vue'

const authStore = useAuthStore()

// Daftar event yang dianggap sebagai "aktivitas pengguna"
const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

const resetTimer = () => {
  // Hanya reset timer jika pengguna sedang dalam status login
  if (authStore.isAuthenticated) {
    authStore.startInactivityTimer()
  }
}

onMounted(() => {
  // Pasang sensor aktivitas ke seluruh jendela aplikasi
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimer, { passive: true })
  })
})

onUnmounted(() => {
  // Bersihkan sensor untuk mencegah kebocoran memori (memory leak)
  activityEvents.forEach(event => {
    window.removeEventListener(event, resetTimer)
  })
})
</script>