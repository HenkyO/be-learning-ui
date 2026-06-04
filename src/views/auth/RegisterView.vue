<template>
  <div class="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl relative z-10">
    <div class="text-center mb-8">
      <div class="hidden md:flex w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20 text-white">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Pendaftaran Akun</h2>
      <p class="text-slate-500 mt-2 text-sm font-medium">Lengkapi identitas Anda untuk mendapatkan akses ke modul pembelajaran.</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
          <input type="text" v-model="fullName" required placeholder="Sesuai identitas resmi..." 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">NIP / Nomor Induk</label>
          <input type="text" v-model="nip" required placeholder="Masukkan NIP Anda..." 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Alamat Email</label>
          <input type="email" v-model="email" required placeholder="nama@email.com" 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Kata Sandi</label>
          <input type="password" v-model="password" required placeholder="Minimal 6 karakter..." 
            class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
        </div>

        <button type="submit" :disabled="isLoading" 
          class="w-full py-4 bg-slate-900 text-white font-black rounded-xl text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
          <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang' }}
        </button>

        <div class="text-center mt-6">
          <p class="text-sm font-bold text-slate-500">
            Sudah memiliki akun? 
            <router-link to="/login" class="text-bssn-cyan hover:text-cyan-600 transition-colors">Masuk di sini</router-link>
          </p>
        </div>
      </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'

const router = useRouter()
const fullName = ref('')
const nip = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (password.value.length < 6) {
    alert('Kata sandi harus terdiri dari minimal 6 karakter.')
    return
  }

  isLoading.value = true
  try {
    // Cukup panggil signUp dengan metadata. Database trigger akan otomatis membuat baris di tabel profiles.
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
          nip: nip.value
        }
      }
    })

    if (error) throw error

    alert('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi (jika diaktifkan), lalu masuk menggunakan kredensial baru Anda.')
    router.push('/login')
  } catch (error: any) {
    alert('Pendaftaran gagal: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>