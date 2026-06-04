<template>
  <div class="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl relative z-10">
    <div v-if="isSent" class="text-center">
      <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-inner text-green-500">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight mb-2">Periksa Email Anda</h2>
        <p class="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          Tautan aman untuk mengatur ulang kata sandi telah dikirim ke <span class="font-bold text-slate-900">{{ email }}</span>. Silakan periksa folder Kotak Masuk atau Spam Anda.
        </p>
        <button @click="router.push('/login')" class="w-full py-4 bg-slate-900 text-white font-black rounded-xl text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
          Kembali ke Halaman Login
        </button>
      </div>

      <div v-else>
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20 text-white">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Lupa Kata Sandi?</h2>
          <p class="text-slate-500 mt-2 text-sm font-medium">Masukkan email yang terdaftar, dan kami akan mengirimkan tautan untuk memulihkan akun Anda.</p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Alamat Email</label>
            <input type="email" v-model="email" required placeholder="nama@email.com" 
              class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
          </div>

          <button type="submit" :disabled="isLoading" 
            class="w-full py-4 bg-bssn-cyan text-white font-black rounded-xl text-sm shadow-xl shadow-cyan-900/20 hover:bg-cyan-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
            <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isLoading ? 'Mengirim Tautan...' : 'Kirim Tautan Pemulihan' }}
          </button>

          <button type="button" @click="router.push('/login')" class="w-full py-3 bg-white text-slate-500 font-bold rounded-xl text-sm hover:bg-slate-50 hover:text-slate-700 transition-colors mt-2 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali ke Halaman Login
          </button>
        </form>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const isSent = ref(false)

const handleReset = async () => {
  if (!email.value) {
    alert('Mohon masukkan alamat email Anda.')
    return
  }
  
  isLoading.value = true
  try {
    // Meminta Supabase mengirimkan email reset dengan instruksi pengalihan (redirectTo) ke halaman pembaruan password
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`
    })

    if (error) throw error
    
    isSent.value = true
  } catch (error: any) {
    alert('Gagal mengirim tautan pemulihan. Pastikan email terdaftar di sistem. Detail: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>