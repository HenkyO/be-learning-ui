<template>
  <div class="space-y-10 animate-fade-in-up pb-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="bg-slate-900 p-10 sm:p-14 lg:p-16 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-10 mt-4">
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-bssn-cyan/10 via-blue-500/5 to-transparent rounded-full -mr-[400px] -mt-[400px] pointer-events-none blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full -ml-20 -mb-20 pointer-events-none blur-2xl"></div>
      
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-bssn-cyan text-xs font-extrabold tracking-widest uppercase mb-6 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Kurikulum Inti Operasional
        </div>
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">Infrastruktur Kunci <span class="text-transparent bg-clip-text bg-gradient-to-r from-bssn-cyan to-blue-400">Publik</span></h2>
        <p class="text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
          Selesaikan modul secara berurutan untuk membuka tingkat kompetensi selanjutnya. Kurikulum ini dirancang khusus untuk standardisasi pemahaman operasional keamanan informasi di Balai Besar Sertifikasi Elektronik (BSrE).
        </p>
      </div>

      <div class="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shrink-0 min-w-[280px] shadow-xl">
        <p class="text-sm font-extrabold text-slate-300 uppercase tracking-widest mb-3">Total Progres Anda</p>
        <div class="text-6xl font-black text-white flex items-baseline justify-center mb-4 drop-shadow-md">
          {{ courseStore.averageProgress }}<span class="text-2xl text-bssn-cyan ml-1">%</span>
        </div>
        <div class="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner border border-slate-700/50">
          <div class="bg-gradient-to-r from-bssn-cyan to-blue-500 h-full rounded-full transition-all duration-1000 relative overflow-hidden" :style="`width: ${courseStore.averageProgress}%`">
            <div class="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="courseStore.isLoading" class="flex justify-center items-center py-40">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
        <div class="w-20 h-20 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>

    <div v-else-if="courseStore.modules.length === 0" class="bg-white p-20 rounded-[2rem] border border-slate-200 shadow-sm text-center">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 border-dashed">
        <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Kurikulum Masih Kosong</h3>
      <p class="text-slate-500 text-base font-medium max-w-md mx-auto">Administrator atau Mentor belum mendistribusikan materi ke dalam jalur pembelajaran ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      
      <AppCard v-for="(mod, index) in courseStore.modules" :key="mod.id" 
           hoverable
           :class="[
             'group h-full flex flex-col',
             mod.status === 'Terkunci' ? 'opacity-70 scale-[0.98]' : '',
             mod.status === 'Selesai' ? 'ring-2 ring-green-500/50' : '',
             mod.status === 'Sedang Dipelajari' ? 'ring-2 ring-blue-500/50' : ''
           ]">
           
        <template #cover>
          <div :class="[
              'h-48 relative flex items-center justify-center',
              mod.status === 'Terkunci' ? 'bg-slate-800 grayscale' : 'bg-slate-900'
            ]">
            <div :class="[
                'absolute inset-0 z-0 opacity-80 mix-blend-overlay',
                mod.level === 'Basic' ? 'bg-gradient-to-br from-green-400 to-emerald-900' :
                mod.level === 'Intermediate' ? 'bg-gradient-to-br from-blue-400 to-indigo-900' :
                'bg-gradient-to-br from-purple-400 to-fuchsia-900'
              ]"></div>
            
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
            
            <div v-if="mod.status === 'Sedang Dipelajari'" class="absolute -right-14 top-6 bg-blue-600 text-white text-[10px] font-bold py-1 px-14 transform rotate-45 shadow-lg z-30 uppercase tracking-widest">
              Aktif
            </div>

            <div v-if="mod.status === 'Selesai'" class="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 z-20 shadow">
              <svg class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Tuntas
            </div>
            
            <span class="text-6xl relative z-10 transition-transform duration-500 group-hover:scale-110" :class="{'animate-pulse': mod.status === 'Sedang Dipelajari'}">
              {{ mod.level === 'Basic' ? '🔰' : mod.level === 'Intermediate' ? '⚙️' : '🚀' }}
            </span>
          </div>
        </template>
        
        <template #header>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Modul {{ index + 1 }}</span>
            <span :class="[
                'text-[10px] font-bold uppercase tracking-wider',
                mod.level === 'Basic' ? 'text-green-600' : mod.level === 'Intermediate' ? 'text-blue-600' : 'text-purple-600'
              ]">
              {{ mod.level }}
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {{ mod.title }}
          </h3>
        </template>

        <p class="mb-4 text-slate-600 flex-1 leading-relaxed">{{ mod.description }}</p>
        
        <div class="mt-auto">
          <ProgressBar 
            :progress="mod.progress || 0" 
            showLabel 
            label="Progres Belajar" 
            :color="mod.status === 'Selesai' ? 'success' : 'primary'"
            size="sm"
          />
        </div>

        <template #footer>
          <button v-if="mod.status === 'Selesai'" @click="interactWithModule(mod)" 
            class="w-full py-2.5 px-4 bg-white border border-slate-200 hover:border-green-500 hover:text-green-600 text-slate-700 font-semibold rounded-lg text-sm transition-colors text-center flex items-center justify-center gap-2">
            Tinjau Ulang
          </button>
          
          <button v-else-if="mod.status === 'Terkunci'" disabled 
            class="w-full py-2.5 px-4 bg-slate-50 text-slate-400 font-semibold rounded-lg text-sm cursor-not-allowed text-center border border-slate-100">
            Terkunci
          </button>
          
          <button v-else @click="interactWithModule(mod)" :disabled="courseStore.isUpdating"
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors text-center flex items-center justify-center gap-2">
            {{ mod.progress === 0 ? 'Mulai' : 'Lanjutkan' }}
          </button>
        </template>
      </AppCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../../stores/courseStore'
import AppCard from '../../components/AppCard.vue'
import ProgressBar from '../../components/ProgressBar.vue'

const router = useRouter()
const courseStore = useCourseStore()

const interactWithModule = async (mod: any) => {
  if (mod.progress === 0 && mod.status !== 'Sedang Dipelajari') {
    const success = await courseStore.startModule(mod.id)
    if (!success) {
      alert('Terjadi kesalahan saat memulai modul: ' + courseStore.error)
      return
    }
  }
  
  // Arahkan dengan query parameter agar halaman baca mengetahui materi mana yang harus ditarik
  router.push({ path: '/knowledge-base', query: { moduleId: mod.id } })
}

onMounted(() => {
  courseStore.fetchLearningPath()
})
</script>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>