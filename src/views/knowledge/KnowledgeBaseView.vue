<template>
  <div class="space-y-8 animate-fade-in-up pb-12 max-w-6xl mx-auto">
    
    <div class="bg-slate-900 p-8 sm:p-10 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
      <div class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none blur-2xl"></div>
      
      <div class="relative z-10 flex items-center gap-6">
        <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-bssn-cyan shadow-inner border border-white/10 shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div>
          <h2 class="text-3xl font-black text-white tracking-tight">Pusat Pengetahuan Berbasis Modul</h2>
          <p class="text-slate-400 mt-2 text-sm font-medium">Pelajari materi dengan saksama atau tinjau ulang dokumen teknis yang telah Anda selesaikan.</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-24">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
        <div class="w-16 h-16 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>

    <div v-else-if="activeModule" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
          
          <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black rounded-lg uppercase tracking-wider">
              Materi Aktif
            </span>
            <span class="text-sm font-black text-slate-400 uppercase tracking-widest">{{ activeModule.level }}</span>
            <span v-if="activeProgress?.status === 'Selesai'" class="ml-auto px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              Selesai
            </span>
          </div>

          <h3 class="text-3xl font-black text-slate-900 leading-tight mb-6">
            {{ activeModule.title }}
          </h3>

          <div class="prose prose-slate max-w-none">
            <p class="text-lg font-medium text-slate-600 mb-8 leading-relaxed">{{ activeModule.description }}</p>
            
            <div v-if="activeModule.storage_path && activeModule.storage_path !== 'pending-upload-storage'" class="mt-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <div class="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <span class="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4 text-bssn-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  Lampiran Dokumen Modul
                </span>
                <router-link v-if="activeModule.storage_path.toLowerCase().includes('.pdf')" 
                  :to="`/pdf-viewer?url=${encodeURIComponent(activeModule.storage_path)}&title=${encodeURIComponent(activeModule.title)}`" 
                  class="text-bssn-cyan text-xs font-bold hover:text-cyan-700 flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  Buka Layar Penuh
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                </router-link>
                <a v-else :href="activeModule.storage_path" target="_blank" class="text-bssn-cyan text-xs font-bold hover:text-cyan-700 flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  Buka di Tab Baru
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
              
              <iframe v-if="activeModule.storage_path.toLowerCase().includes('.pdf')" 
                      :src="activeModule.storage_path" 
                      class="w-full h-[600px] bg-slate-100" 
                      title="Dokumen Modul">
              </iframe>
              
              <video v-else-if="activeModule.storage_path.toLowerCase().includes('.mp4')" 
                     :src="activeModule.storage_path" 
                     controls 
                     class="w-full h-auto max-h-[600px] bg-black">
              </video>
              
              <div v-else class="p-16 text-center">
                <a :href="activeModule.storage_path" target="_blank" class="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20 hover:bg-slate-800 inline-flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Unduh File Materi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-800 shadow-2xl shadow-slate-900/30 text-white sticky top-28">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-4">Status & Tindakan</h4>
          
          <div class="space-y-6 mb-8">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-bssn-cyan/20 text-bssn-cyan flex items-center justify-center shrink-0 border border-bssn-cyan/30">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-white">Membaca Materi</p>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">Anda telah membuka dan mengakses materi ini.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', 
                            activeProgress?.status === 'Selesai' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-400 border-slate-700']">
                <svg v-if="activeProgress?.status === 'Selesai'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span v-else class="font-black text-sm">2</span>
              </div>
              <div>
                <p class="text-sm font-bold" :class="activeProgress?.status === 'Selesai' ? 'text-green-400' : 'text-slate-200'">Evaluasi Kompetensi</p>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  {{ activeProgress?.status === 'Selesai' ? 'Ujian telah diselesaikan dengan nilai memuaskan.' : 'Ujian pilihan ganda untuk mengukur pemahaman materi.' }}
                </p>
              </div>
            </div>
          </div>

          <button v-if="activeProgress?.status === 'Selesai'" disabled class="w-full py-4 px-4 bg-green-500/10 border border-green-500/30 text-green-400 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-default">
            Modul Telah Diselesaikan
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          </button>
          
          <button v-else-if="(activeProgress?.progress || 0) < 50" @click="markAsRead" :disabled="isMarkingRead" class="w-full py-4 px-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group disabled:opacity-50">
            <svg v-if="isMarkingRead" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isMarkingRead ? 'Memproses...' : 'Tandai Telah Dibaca' }}
            <svg v-if="!isMarkingRead" class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </button>

          <button v-else @click="goToQuiz" class="w-full py-4 px-4 bg-bssn-cyan hover:bg-cyan-500 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 group">
            Mulai Ujian Sekarang
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>

    </div>

    <div v-else class="bg-white p-16 rounded-[2rem] border border-slate-200 shadow-sm text-center">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 border-dashed">
        <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Materi Tidak Ditemukan</h3>
      <p class="text-slate-500 mb-8 max-w-md mx-auto text-base font-medium">Sistem tidak dapat memuat modul yang Anda minta. Silakan pilih kembali modul melalui jalur kurikulum.</p>
      <button @click="router.push('/learning-path')" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20">
        Kembali ke Kurikulum
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const activeModule = ref<any>(null)
const activeProgress = ref<any>(null)
const isMarkingRead = ref(false)

const fetchActiveModule = async () => {
  isLoading.value = true
  try {
    if (!authStore.user?.id) return

    let query = supabase
      .from('user_progress')
      .select('*, modules(*)')
      .eq('user_id', authStore.user.id)

    if (route.query.moduleId) {
      query = query.eq('module_id', route.query.moduleId)
    } else {
      query = query.eq('status', 'Sedang Dipelajari')
    }

    // PERBAIKAN: Gunakan pemanggilan reguler (array) untuk menghindari galat PGRST116
    const { data, error } = await query

    if (error) throw error

    if (data && data.length > 0) {
      activeModule.value = data[0].modules
      activeProgress.value = data[0]
    }
  } catch (error) {
    console.error("Gagal menarik data materi:", error)
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async () => {
  if (!activeModule.value) return
  isMarkingRead.value = true
  try {
    // Memperbarui progres menjadi 50 secara langsung melalui Supabase
    const { error } = await supabase
      .from('user_progress')
      .update({ progress: 50 })
      .eq('user_id', authStore.user?.id)
      .eq('module_id', activeModule.value.id)

    if (error) throw error

    // Pembaruan state lokal untuk merefleksikan perubahan di UI secara instan
    if (activeProgress.value) {
      activeProgress.value.progress = 50
    }
  } catch (error) {
    console.error("Gagal memperbarui progres:", error)
    alert("Gagal menyimpan progres membaca Anda ke server.")
  } finally {
    isMarkingRead.value = false
  }
}

const goToQuiz = () => {
  // PERBAIKAN: Sinkronisasi rute dengan parameter dinamis
  if (activeModule.value?.id) {
    router.push({ name: 'Quiz', params: { moduleId: activeModule.value.id } })
  } else {
    alert("Kesalahan rute: ID Modul tidak ditemukan.")
  }
}

onMounted(() => {
  fetchActiveModule()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>