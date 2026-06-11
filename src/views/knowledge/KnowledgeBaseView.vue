<template>
  <div class="space-y-6 animate-fade-in-up pb-12 w-full max-w-[1600px] mx-auto">
    
    <!-- Top Header Banner -->
    <div class="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
      <div class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-bssn-cyan/20 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none blur-2xl"></div>
      
      <div class="relative z-10 flex items-center gap-6">
        <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-bssn-cyan shadow-inner border border-white/10 shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div>
          <h2 class="text-3xl font-black text-white tracking-tight">{{ activeModule?.title || 'Memuat Modul...' }}</h2>
          <p class="text-slate-400 mt-2 text-sm font-medium">Pelajari seluruh materi pembelajaran di bawah ini secara berurutan untuk menyelesaikan modul.</p>
        </div>
      </div>
      
      <div class="relative z-10 hidden md:block">
         <span class="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl text-sm shadow-inner">
           Progres Materi: <span class="text-bssn-cyan ml-1">{{ completedSubjectsCount }} / {{ subjectStore.subjects.length }}</span>
         </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-24">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
        <div class="w-16 h-16 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!activeModule || subjectStore.subjects.length === 0" class="bg-white p-16 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
      
      <!-- === TAMBAHKAN BLOK INI: Tampilkan Video dari Modul jika ada === -->
      <div v-if="activeModule?.storage_path && activeModule.storage_path !== 'pending-upload-storage'" class="w-full max-w-4xl flex flex-col items-center">
        <video 
          v-if="activeModule.storage_path.toLowerCase().includes('.mp4')" 
          controls 
          class="w-full rounded-xl shadow-lg border border-slate-200"
        >
          <source :src="activeModule.storage_path" type="video/mp4">
          Browser Anda tidak mendukung pemutar video.
        </video>
        
        <iframe 
          v-else-if="activeModule.storage_path.toLowerCase().includes('.pdf')" 
          :src="activeModule.storage_path" 
          class="w-full h-[600px] rounded-xl shadow-lg border border-slate-200"
        ></iframe>
        
        <a 
          v-else 
          :href="activeModule.storage_path" 
          target="_blank" 
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buka Lampiran Materi
        </a>
      </div>
      <!-- ============================================================= -->

      <!-- === PERBARUI BLOK LAMA ANDA MENJADI V-ELSE === -->
      <div v-else class="flex flex-col items-center">
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 border-dashed">
           <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Materi Tidak Ditemukan</h3>
        <p class="text-slate-500 mb-8 max-w-md mx-auto text-base font-medium">Modul ini belum memiliki daftar materi (Subject). Silakan hubungi Administrator.</p>
        <button @click="router.push('/learning-path')" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20">
          Kembali ke Kurikulum
        </button>
      </div>
      <!-- ============================================== -->

    </div>

    <!-- Main Grid Layout: Sidebar & Content -->
    <div v-else class="flex flex-col lg:flex-row gap-8 items-start">
      
      <!-- Sidebar Navigation -->
      <div class="w-full lg:w-1/3 xl:w-1/4 shrink-0 space-y-4">
        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden sticky top-28">
          <div class="p-6 bg-slate-50 border-b border-slate-200">
            <h3 class="text-base font-black text-slate-900 uppercase tracking-widest">Daftar Materi</h3>
          </div>
          
          <div class="max-h-[600px] overflow-y-auto">
            <button 
              v-for="(subject, index) in subjectStore.subjects" 
              :key="subject.id"
              @click="activeSubjectId = subject.id"
              :class="[
                'w-full text-left px-6 py-4 border-b border-slate-100 last:border-b-0 transition-colors flex gap-4 items-start relative',
                activeSubjectId === subject.id ? 'bg-cyan-50/50' : 'hover:bg-slate-50'
              ]"
            >
              <!-- Active Indicator Strip -->
              <div v-if="activeSubjectId === subject.id" class="absolute left-0 top-0 bottom-0 w-1 bg-bssn-cyan"></div>

              <!-- Completion Checkmark or Number -->
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5',
                subject.progressStatus === 'Selesai' 
                  ? 'bg-green-100 border-green-200 text-green-600' 
                  : activeSubjectId === subject.id
                    ? 'bg-bssn-cyan border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-white border-slate-200 text-slate-400'
              ]">
                <svg v-if="subject.progressStatus === 'Selesai'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <span v-else class="text-xs font-black">{{ index + 1 }}</span>
              </div>
              
              <!-- Subject Text -->
              <div class="flex-1">
                <h4 :class="[
                  'text-sm font-bold leading-tight mb-1',
                  activeSubjectId === subject.id ? 'text-cyan-900' : 'text-slate-800'
                ]">
                  {{ subject.title }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {{ subject.content_type === 'video' ? 'Video' : 'Dokumen PDF' }}
                  </span>
                </div>
              </div>
            </button>
          </div>
          
          <!-- Final Action Area in Sidebar -->
          <div class="p-6 bg-slate-900 border-t border-slate-800">
            <button 
              v-if="allSubjectsCompleted" 
              @click="goToQuiz" 
              class="w-full py-3.5 px-4 bg-bssn-cyan hover:bg-cyan-500 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
            >
              Mulai Ujian Modul
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <div v-else class="text-center">
              <p class="text-xs text-slate-400 font-medium leading-relaxed">
                Selesaikan seluruh materi di atas untuk membuka akses ujian akhir modul.
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Main Content Viewer -->
      <div class="w-full lg:w-2/3 xl:w-3/4">
        <div v-if="activeSubject" class="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
          
          <h3 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
            {{ activeSubject.title }}
          </h3>
          <p class="text-base text-slate-600 mb-8 leading-relaxed">{{ activeSubject.description }}</p>
          
          <!-- Document / Video Container -->
          <div v-if="activeSubject.storage_path && activeSubject.storage_path !== 'pending-upload-storage'" class="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 mb-8">
            <div class="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <span class="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 text-bssn-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                Media Pembelajaran
              </span>
              <router-link v-if="activeSubject.content_type === 'pdf'" 
                :to="`/pdf-viewer?url=${encodeURIComponent(activeSubject.storage_path)}&title=${encodeURIComponent(activeSubject.title)}`" 
                class="text-bssn-cyan text-xs font-bold hover:text-cyan-700 flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                Layar Penuh
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </router-link>
            </div>
            
            <iframe v-if="activeSubject.content_type === 'pdf' || activeSubject.storage_path.toLowerCase().includes('.pdf')" 
                    :src="activeSubject.storage_path" 
                    class="w-full h-[600px] bg-slate-100" 
                    title="Dokumen Modul">
            </iframe>
            
            <video v-else-if="activeSubject.content_type === 'video' || activeSubject.storage_path.toLowerCase().includes('.mp4')" 
                   :src="activeSubject.storage_path" 
                   controls 
                   class="w-full h-auto max-h-[600px] bg-black">
            </video>
            
            <div v-else class="p-16 text-center">
              <a :href="activeSubject.storage_path" target="_blank" class="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20 hover:bg-slate-800 inline-flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Unduh File Materi
              </a>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-between pt-6 border-t border-slate-100">
            <div>
              <button 
                v-if="activeSubject.progressStatus === 'Selesai'" 
                disabled 
                class="py-3 px-6 bg-green-50 text-green-600 font-black rounded-xl text-sm border border-green-200 flex items-center gap-2 cursor-default"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                Telah Diselesaikan
              </button>
              
              <button 
                v-else 
                @click="markSubjectComplete" 
                :disabled="isMarkingRead" 
                class="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="isMarkingRead" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ isMarkingRead ? 'Menyimpan...' : 'Tandai Selesai' }}
              </button>
            </div>

            <button 
              v-if="nextSubjectId" 
              @click="activeSubjectId = nextSubjectId" 
              class="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
            >
              Materi Selanjutnya
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'
import { useSubjectStore } from '../../stores/subjectStore'

const router = useRouter()
const route = useRoute()
const subjectStore = useSubjectStore()

const isLoading = ref(true)
const activeModule = ref<any>(null)
const activeSubjectId = ref<string | null>(null)
const isMarkingRead = ref(false)

const fetchInitialData = async () => {
  isLoading.value = true
  try {
    const moduleId = route.query.moduleId as string
    
    if (!moduleId) {
      router.push('/learning-path')
      return
    }

    // 1. Fetch Module Details
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single()

    if (moduleError) throw moduleError
    activeModule.value = moduleData

    // 2. Fetch Subjects & Progress via Store
    await subjectStore.fetchSubjectsForModule(moduleId)

    // 3. Set Active Subject (First uncompleted, or first subject)
    if (subjectStore.subjects.length > 0) {
      const firstUncompleted = subjectStore.subjects.find(s => s.progressStatus !== 'Selesai')
      activeSubjectId.value = firstUncompleted ? firstUncompleted.id : subjectStore.subjects[0].id
    }

  } catch (error) {
    console.error("Gagal menarik data awal:", error)
  } finally {
    isLoading.value = false
  }
}

const activeSubject = computed(() => {
  if (!activeSubjectId.value) return null
  return subjectStore.subjects.find(s => s.id === activeSubjectId.value)
})

const nextSubjectId = computed(() => {
  if (!activeSubjectId.value) return null
  const currentIndex = subjectStore.subjects.findIndex(s => s.id === activeSubjectId.value)
  if (currentIndex < subjectStore.subjects.length - 1) {
    return subjectStore.subjects[currentIndex + 1].id
  }
  return null
})

const completedSubjectsCount = computed(() => {
  return subjectStore.subjects.filter(s => s.progressStatus === 'Selesai').length
})

const allSubjectsCompleted = computed(() => {
  if (subjectStore.subjects.length === 0) return false
  return completedSubjectsCount.value === subjectStore.subjects.length
})

const markSubjectComplete = async () => {
  if (!activeSubjectId.value) return
  isMarkingRead.value = true
  try {
    const success = await subjectStore.markSubjectAsCompleted(activeSubjectId.value)
    if (success) {
      // Perbarui progress modul (legacy compatibility & quiz requirement)
      if (allSubjectsCompleted.value && activeModule.value) {
         await supabase
          .from('user_progress')
          .update({ progress: 100 })
          .eq('module_id', activeModule.value.id)
      } else if (activeModule.value) {
         await supabase
          .from('user_progress')
          .update({ progress: 50 })
          .eq('module_id', activeModule.value.id)
      }
      
      // Auto-advance if next exists
      if (nextSubjectId.value) {
        activeSubjectId.value = nextSubjectId.value
      }
    }
  } catch (error) {
    console.error("Gagal memperbarui status subject:", error)
    alert("Gagal menyimpan progres membaca Anda ke server.")
  } finally {
    isMarkingRead.value = false
  }
}

const goToQuiz = () => {
  if (activeModule.value?.id) {
    router.push({ name: 'Quiz', params: { moduleId: activeModule.value.id } })
  }
}

onMounted(() => {
  fetchInitialData()
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

/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
