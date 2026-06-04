<template>
  <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bssn-cyan to-blue-600"></div>
    <div class="absolute -right-20 -top-20 w-40 h-40 bg-bssn-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="text-center mb-10 relative z-10">
      <div class="hidden md:block w-16 h-16 mx-auto bg-gradient-to-br from-bssn-cyan to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-900/30 mb-4 transform transition-transform hover:scale-105">
        <span class="text-3xl font-extrabold text-white">B</span>
      </div>
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
      <p class="text-slate-500 text-sm mt-2 font-medium">Masuk untuk melanjutkan ke dashboard Anda</p>
    </div>

    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-lg z-10 relative">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
      
      <div class="space-y-1.5">
        <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email Kedinasan</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-bssn-cyan transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
          </div>
          <input type="email" v-model="email" :class="{'ring-2 ring-red-500 border-red-500': errors.email}" required placeholder="contoh@bssn.go.id" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-bssn-cyan/20 focus:border-bssn-cyan focus:outline-none transition-all shadow-sm">
        </div>
        <p v-if="errors.email" class="text-red-500 text-xs font-semibold mt-1">{{ errors.email[0] }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-bssn-cyan transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <input type="password" v-model="password" :class="{'ring-2 ring-red-500 border-red-500': errors.password}" required placeholder="Masukkan kata sandi" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-bssn-cyan/20 focus:border-bssn-cyan focus:outline-none transition-all shadow-sm">
        </div>
        <p v-if="errors.password" class="text-red-500 text-xs font-semibold mt-1">{{ errors.password[0] }}</p>
      </div>

      <button type="submit" :disabled="isLoading" class="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 mt-2 flex justify-center items-center gap-2">
        <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem' }}
      </button>
    </form>

    <div class="mt-8 flex flex-col items-center gap-4 text-sm font-semibold relative z-10 border-t border-slate-100 pt-6">
      <router-link to="/forgot-password" class="text-bssn-cyan hover:text-cyan-700 transition-colors">
        Lupa Kata Sandi?
      </router-link>
      <span class="text-slate-500">
        Belum memiliki akun? 
        <router-link to="/register" class="text-slate-800 hover:text-bssn-cyan transition-colors ml-1">Daftar sekarang</router-link>
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { useRateLimiter } from '../../composables/useRateLimiter'
import { useCsrfToken } from '../../composables/useCsrfToken'

const router = useRouter()
const authStore = useAuthStore()
const { recordAttempt, isLocked, getFormattedLockoutTime } = useRateLimiter('login')
useCsrfToken() // Initialize CSRF protection

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

// Compute loading state from auth store
const isLoading = computed(() => authStore.isLoading)

// Compute lockout message
const lockoutMessage = computed(() => {
  if (isLocked.value) {
    return `Akun terkunci. Coba lagi dalam ${getFormattedLockoutTime()}`
  }
  return ''
})

const handleLogin = async () => {
  errors.value = {}
  errorMessage.value = ''
  let hasError = false

  if (!email.value) {
    errors.value.email = ['Email harus diisi']
    hasError = true
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errors.value.email = ['Format email tidak valid']
      hasError = true
    }
  }
  
  if (!password.value) {
    errors.value.password = ['Kata sandi harus diisi']
    hasError = true
  }

  if (hasError) {
    errorMessage.value = 'Silakan perbaiki kesalahan pada formulir'
    return
  }

  // Check rate limit
  if (isLocked.value) {
    errorMessage.value = lockoutMessage.value
    return
  }

  try {
    await authStore.login(email.value, password.value)
    recordAttempt() // Record successful attempt
    router.push('/dashboard')
  } catch (error: any) {
    // Record failed attempt
    recordAttempt()
    
    // Use error message from store or fallback
    errorMessage.value = authStore.error || 'Login gagal. Silakan coba lagi.'
    console.error("Kesalahan Otentikasi:", error.message)
  }
}
</script>