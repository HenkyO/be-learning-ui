<template>
  <div class="space-y-10 animate-fade-in-up pb-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="bg-slate-900 p-10 sm:p-14 lg:p-16 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10 mt-4">
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-full -mr-[200px] -mt-[200px] pointer-events-none blur-3xl"></div>
      
      <div class="relative z-10 w-full">
        <h1 class="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Pusat Kendali <span class="text-transparent bg-clip-text bg-gradient-to-r from-bssn-cyan to-blue-400">Analitik</span>
        </h1>
        <p class="text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
          Pantau efektivitas distribusi materi, perkembangan kompetensi, dan matriks kelulusan peserta didik secara real-time.
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
        <div class="w-20 h-20 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
        <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <p class="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Peserta Didik</p>
        <h3 class="text-5xl font-black text-slate-900">{{ stats.totalPegawai }}</h3>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
        <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <p class="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">Kurikulum Aktif</p>
        <h3 class="text-5xl font-black text-slate-900">{{ stats.totalModul }}</h3>
      </div>

      <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
        <div class="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
        <p class="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">Volume Bank Soal</p>
        <h3 class="text-5xl font-black text-slate-900">{{ stats.totalSoal }}</h3>
      </div>

      <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-800 shadow-2xl shadow-slate-900/30 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-bl-full pointer-events-none"></div>
        <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-bssn-cyan mb-6 group-hover:scale-110 transition-transform border border-white/10">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
        <p class="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">Indeks Kelulusan</p>
        <div class="flex items-baseline">
          <h3 class="text-5xl font-black text-white">{{ stats.averageProgress }}</h3>
          <span class="text-2xl font-bold text-bssn-cyan ml-1">%</span>
        </div>
      </div>

    </div>

    <div v-if="!isLoading" class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
      <div class="p-10 md:w-2/3">
        <h3 class="text-2xl font-extrabold text-slate-900 mb-3">Status Operasional Sistem</h3>
        <p class="text-slate-500 leading-relaxed font-medium mb-6">
          Sistem manajemen pembelajaran beroperasi secara optimal. Seluruh tautan relasional antara profil pengguna, penyimpanan objek dokumen, dan evaluasi soal terenkripsi dengan aman melalui integrasi Supabase.
        </p>
        <div class="flex flex-wrap gap-3">
          <span class="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Database Terkoneksi
          </span>
          <span class="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Object Storage Aktif
          </span>
        </div>
      </div>
      <div class="bg-slate-50 md:w-1/3 border-l border-slate-200 p-10 flex flex-col justify-center">
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Aksi Cepat</p>
        <div class="space-y-3">
          <button @click="$router.push('/management')" class="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-bssn-cyan text-slate-700 hover:text-bssn-cyan font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-between group">
            Tambah Modul Baru
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <button @click="$router.push('/users')" class="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-bssn-cyan text-slate-700 hover:text-bssn-cyan font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-between group">
            Kelola Akses Pengguna
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabaseClient'

const isLoading = ref(true)

// State Metrik
const stats = ref({
  totalPegawai: 0,
  totalModul: 0,
  totalSoal: 0,
  averageProgress: 0
})

const fetchAnalytics = async () => {
  isLoading.value = true
  try {
    // 1. Hitung Total Peserta Didik (Role = Pegawai)
    const { count: pegawaiCount, error: err1 } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'Pegawai')
    
    if (!err1) stats.value.totalPegawai = pegawaiCount || 0

    // 2. Hitung Total Modul
    const { count: modulCount, error: err2 } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true })

    if (!err2) stats.value.totalModul = modulCount || 0

    // 3. Hitung Total Bank Soal
    const { count: soalCount, error: err3 } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })

    if (!err3) stats.value.totalSoal = soalCount || 0

    // 4. Kalkulasi Rata-rata Progres Keseluruhan (Indeks Kelulusan)
    const { data: progressData, error: err4 } = await supabase
      .from('progress')
      .select('progress_percentage')

    if (!err4 && progressData && progressData.length > 0) {
      const totalProgress = progressData.reduce((sum, curr) => sum + curr.progress_percentage, 0)
      stats.value.averageProgress = Math.round(totalProgress / progressData.length)
    } else {
      stats.value.averageProgress = 0
    }

  } catch (error) {
    console.error("Gagal memuat analitik dashboard:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
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