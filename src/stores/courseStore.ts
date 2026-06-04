import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from './authStore'

export interface Module {
  id: string
  title: string
  description: string
  level: 'Basic' | 'Intermediate' | 'Advanced' | string
  created_at: string
  order_index?: number       // Penambahan kolom urutan kustom
  prerequisite_id?: string   // Penambahan kolom ID prasyarat (opsional)
  
  // UI Specific State added during fetch
  status?: 'Terkunci' | 'Terbuka' | 'Sedang Dipelajari' | 'Selesai'
  progress?: number
}

export const useCourseStore = defineStore('course', () => {
  const authStore = useAuthStore()
  
  const modules = ref<Module[]>([])
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<number>(0)

  // Cache duration (e.g., 5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000 

  const averageProgress = computed(() => {
    if (modules.value.length === 0) return 0
    const total = modules.value.reduce((sum, mod) => sum + (mod.progress || 0), 0)
    return Math.round(total / modules.value.length)
  })

  const fetchLearningPath = async (forceRefresh = false) => {
    // Kembalikan data cache jika masih valid
    if (!forceRefresh && modules.value.length > 0 && (Date.now() - lastFetched.value) < CACHE_DURATION) {
      return
    }

    if (!authStore.user?.id) {
      error.value = 'User not authenticated'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // 1. Tarik Data Modul
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .neq('is_deleted', true)
        
      if (modError) throw modError

      // [UPDATE LOGIKA]: Urutkan berdasarkan order_index secara dinamis
      const sortedModules = (modulesData || []).sort((a, b) => {
        return (a.order_index || 0) - (b.order_index || 0)
      })

      // 2. Tarik Progres Pengguna
      const { data: progressData, error: progError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authStore.user.id)

      if (progError) throw progError

      // 3. Peta Progres untuk Kalkulasi Cepat
      const progressMap: Record<string, any> = {}
      progressData?.forEach(p => {
        progressMap[p.module_id] = p
      })
      
      // [UPDATE LOGIKA]: Evaluasi Status berdasarkan Prerequisite ID
      modules.value = sortedModules.map((mod) => {
        const userProg = progressMap[mod.id]
        
        let status = 'Terkunci'
        let progress = 0
        
        if (userProg) {
          // Jika sudah pernah dibuka/dikerjakan, gunakan status dari database
          status = userProg.status
          progress = userProg.progress_percentage
        } else {
          // Jika belum ada progres, evaluasi apakah ada prasyarat
          if (!mod.prerequisite_id) {
            // Modul bebas prasyarat otomatis terbuka
            status = 'Terbuka' 
          } else {
            // Evaluasi status modul prasyaratnya
            const prereqProgress = progressMap[mod.prerequisite_id]
            if (prereqProgress && prereqProgress.status === 'Selesai') {
              status = 'Terbuka' // Buka jika prasyaratnya sudah lulus
            } else {
              status = 'Terkunci' // Tetap kunci jika prasyarat belum diselesaikan
            }
          }
        }

        return { ...mod, status, progress }
      })
      
      lastFetched.value = Date.now()

    } catch (err: any) {
      console.error('Galat menarik kurikulum:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const startModule = async (moduleId: string) => {
    if (!authStore.user?.id) return false
    
    isUpdating.value = true
    error.value = null
    
    try {
      const { data: existingRecord, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', authStore.user.id)
        .eq('module_id', moduleId)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingRecord) {
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            status: 'Sedang Dipelajari',
            progress_percentage: 15,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id)
          
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([{
            user_id: authStore.user.id,
            module_id: moduleId,
            status: 'Sedang Dipelajari',
            progress_percentage: 15
          }])
          
        if (insertError) throw insertError
      }

      // Update state lokal
      const moduleIndex = modules.value.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1) {
        modules.value[moduleIndex].status = 'Sedang Dipelajari'
        modules.value[moduleIndex].progress = 15
      }

      return true
    } catch (err: any) {
      console.error('Galat memperbarui progres:', err)
      error.value = err.message
      return false
    } finally {
      isUpdating.value = false
    }
  }

  const markAsRead = async (moduleId: string) => {
    if (!authStore.user?.id) return false

    isUpdating.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          progress_percentage: 50,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', authStore.user.id)
        .eq('module_id', moduleId)

      if (updateError) throw updateError

      const moduleIndex = modules.value.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1) {
        modules.value[moduleIndex].progress = 50
      }

      return true
    } catch (err: any) {
      console.error('Galat menandai selesai dibaca:', err)
      error.value = err.message
      return false
    } finally {
      isUpdating.value = false
    }
  }

  return {
    modules,
    isLoading,
    isUpdating,
    error,
    averageProgress,
    fetchLearningPath,
    startModule,
    markAsRead
  }
})