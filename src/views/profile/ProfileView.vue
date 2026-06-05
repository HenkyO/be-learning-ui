<template>
  <div class="space-y-8 animate-fade-in-up pb-12 w-full max-w-5xl mx-auto mt-4">
    
    <div class="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center gap-8">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-full -mr-[100px] -mt-[100px] pointer-events-none blur-3xl"></div>
      
      <div class="relative z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-4xl shadow-xl border-4 border-slate-800 shrink-0">
        {{ userInitials }}
      </div>
      
      <div class="relative z-10 flex-1">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-bssn-cyan text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm">
          Status Akses: {{ authStore.userProfile?.role === 'Pegawai' ? 'Peserta Didik (Student)' : authStore.userProfile?.role }}
        </div>
        <h2 class="text-4xl font-black text-white tracking-tight mb-2">{{ authStore.userProfile?.full_name || 'Memuat...' }}</h2>
        <p class="text-slate-400 font-medium text-lg">NIP. {{ authStore.userProfile?.nip || '-' }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div class="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative">
        <h3 class="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Pengaturan Identitas</h3>
        
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
            <input type="text" v-model="editForm.full_name" required 
              class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Nomor Induk Pegawai (NIP)</label>
            <input type="text" v-model="editForm.nip" required 
              class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Alamat Email</label>
            <input type="email" v-model="editForm.email" required 
              class="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-bssn-cyan/10 focus:border-bssn-cyan outline-none transition-all">
            <p v-if="emailChangedMsg" class="text-xs font-bold text-bssn-cyan mt-1">{{ emailChangedMsg }}</p>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="$router.push('/update-password')" class="px-6 py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl text-sm transition-all hover:bg-slate-100 border border-slate-200">
              Ganti Kata Sandi
            </button>
            <button type="submit" :disabled="isSaving" class="px-8 py-3.5 bg-slate-900 text-white font-black rounded-xl text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>

      <div class="md:col-span-1 space-y-6">
        <div class="bg-gradient-to-br from-bssn-cyan to-blue-500 p-8 rounded-[2rem] text-white shadow-xl shadow-cyan-900/20">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-xs font-black text-white/70 uppercase tracking-widest mb-1">Modul Diselesaikan</p>
          <h3 class="text-5xl font-black">{{ stats.completed }}<span class="text-xl text-white/60 ml-2">Materi</span></h3>
        </div>

        <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div class="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 border border-orange-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Sedang Dipelajari</p>
          <h3 class="text-4xl font-black text-slate-900">{{ stats.inProgress }}</h3>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()

const isSaving = ref(false)
const emailChangedMsg = ref('')
const editForm = ref({ full_name: '', nip: '', email: '' })
const stats = ref({ completed: 0, inProgress: 0 })

const userInitials = computed(() => {
  const name = authStore.userProfile?.full_name || '?'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
})

const fetchStats = async () => {
  if (!authStore.user?.id) return
  const { data } = await supabase.from('user_progress').select('status').eq('user_id', authStore.user.id)
  if (data) {
    stats.value.completed = data.filter(p => p.status === 'Selesai').length
    stats.value.inProgress = data.filter(p => p.status === 'Sedang Dipelajari').length
  }
}

const syncForm = () => {
  if (authStore.userProfile) {
    editForm.value.full_name = authStore.userProfile.full_name
    editForm.value.nip = authStore.userProfile.nip
  }
  if (authStore.user) {
    editForm.value.email = authStore.user.email || ''
  }
}

// Pantau jika profil telat dimuat
watch(() => authStore.userProfile, syncForm, { deep: true })
watch(() => authStore.user, syncForm, { deep: true })

const updateProfile = async () => {
  if (!authStore.user?.id) return
  isSaving.value = true
  emailChangedMsg.value = ''
  let successMessage = 'Profil berhasil diperbarui!'

  try {
    // 1. Update Profile Information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: editForm.value.full_name, nip: editForm.value.nip })
      .eq('id', authStore.user.id)

    if (profileError) throw profileError

    // 2. Update Email if changed
    if (editForm.value.email !== authStore.user.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: editForm.value.email
      })
      
      if (authError) {
         throw authError
      } else {
         emailChangedMsg.value = 'Tautan konfirmasi telah dikirim ke email baru dan lama Anda.'
         successMessage = 'Profil diperbarui. Silakan periksa email Anda untuk mengonfirmasi perubahan alamat email.'
      }
    }
    
    // Perbarui state global agar header ikut berubah secara instan
    await authStore.fetchProfile(authStore.user.id)
    if (!emailChangedMsg.value) {
        alert(successMessage)
    }
  } catch (error: any) {
    alert('Galat memperbarui profil: ' + error.message)
    syncForm() // revert form on error
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  syncForm()
  fetchStats()
})
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>