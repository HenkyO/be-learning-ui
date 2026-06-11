<template>
  <div class="space-y-10 animate-fade-in-up pb-16 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="bg-slate-900 p-10 sm:p-14 lg:p-16 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col justify-center mt-4">
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-bssn-cyan/10 via-blue-500/5 to-transparent rounded-full -mr-[400px] -mt-[400px] pointer-events-none blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full -ml-20 -mb-20 pointer-events-none blur-2xl"></div>
      
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-bssn-cyan text-xs font-extrabold tracking-widest uppercase mb-6 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Katalog Pembelajaran
        </div>
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">Jalur <span class="text-transparent bg-clip-text bg-gradient-to-r from-bssn-cyan to-blue-400">Kompetensi</span></h2>
        <p class="text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
          Pilih kurikulum pembelajaran yang sesuai dengan jalur karir Anda untuk mulai meningkatkan kompetensi keamanan informasi.
        </p>
      </div>
    </div>

    <div v-if="curriculumStore.isLoading" class="flex justify-center items-center py-40">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
        <div class="w-20 h-20 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>

    <div v-else-if="curriculumStore.curriculums.length === 0" class="bg-white p-20 rounded-[2rem] border border-slate-200 shadow-sm text-center">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 border-dashed">
        <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Katalog Kosong</h3>
      <p class="text-slate-500 text-base font-medium max-w-md mx-auto">Saat ini belum ada jalur kurikulum yang dipublikasikan oleh Administrator.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="path in curriculumStore.curriculums" 
        :key="path.id"
        @click="goToCurriculum(path.id)"
        class="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-bssn-cyan/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      >
        <div class="h-32 bg-slate-900 relative flex items-center justify-center overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-br from-bssn-cyan/20 to-blue-900/40 mix-blend-overlay"></div>
           <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
           <span class="text-5xl relative z-10 transition-transform duration-500 group-hover:scale-110">{{ path.icon || '📚' }}</span>
        </div>
        
        <div class="p-8 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-bssn-cyan transition-colors">{{ path.title }}</h3>
          <p class="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{{ path.description }}</p>
          
          <div class="mt-auto">
             <span class="inline-flex items-center justify-center w-full py-3 px-4 bg-slate-50 group-hover:bg-bssn-cyan text-slate-600 group-hover:text-white font-bold rounded-xl text-sm transition-all duration-300">
               Lihat Modul
               <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurriculumStore } from '../../stores/curriculumStore'

const router = useRouter()
const curriculumStore = useCurriculumStore()

const goToCurriculum = (pathId: string) => {
  router.push(`/learning-path/${pathId}`)
}

onMounted(() => {
  curriculumStore.fetchCurriculums()
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
