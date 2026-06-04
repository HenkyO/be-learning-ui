<template>
  <div class="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl relative z-10">
    <div class="text-center mb-8">
      <div class="hidden md:flex w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20 text-white">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Perbarui Kata Sandi</h2>
      <p class="text-slate-500 mt-2 text-sm font-medium">Silakan masukkan kata sandi baru untuk mengamankan kembali akun Anda.</p>
    </div>

    <form @submit.prevent="handleUpdatePassword" class="space-y-5">
        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Kata Sandi Baru</label>
          <input type="password" v-model="newPassword" required placeholder="Minimal 6 karakter..." 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Konfirmasi Kata Sandi</label>
          <input type="password" v-model="confirmPassword" required placeholder="Ketik ulang kata sandi..." 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <button type="submit" :disabled="isLoading" 
          class="w-full py-4 bg-slate-900 text-white font-black rounded-xl text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
          <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoading ? 'Memproses...' : 'Simpan Kata Sandi' }}
        </button>

        <button type="button" @click="router.push('/learning-path')" class="w-full py-3 bg-white text-slate-500 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors mt-2">
          Batal & Kembali
        </button>
      </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'

const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleUpdatePassword = async () => {
  if (newPassword.value.length < 6) {
    alert('Kata sandi harus terdiri dari minimal 6 karakter.')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    alert('Konfirmasi kata sandi tidak cocok!')
    return
  }

  isLoading.value = true
  try {
    // Fungsi ajaib Supabase: akan memperbarui password dari user yang saat ini sedang memiliki sesi aktif (termasuk sesi dari tautan email)
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error

    alert('Sukses! Kata sandi Anda telah berhasil diperbarui.')
    router.push('/learning-path') // Arahkan ke dalam aplikasi setelah sukses
  } catch (error: any) {
    alert('Gagal memperbarui kata sandi: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>