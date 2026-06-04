import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export interface Module {
  id: string
  title: string
  description: string
  level: 'Basic' | 'Intermediate' | 'Advanced' | string
  created_at: string
  order_index?: number
  prerequisite_id?: string
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

  const CACHE_DURATION = 5 * 60 * 1000 

  const averageProgress = computed(() => {
    if (modules.value.length === 0) return 0
    const total = modules.value.reduce((sum, mod) => sum + (mod.progress || 0), 0)
    return Math.round(total / modules.value.length)
  })

  const fetchLearningPath = async (forceRefresh = false) => {
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
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .neq('is_deleted', true)
        
      if (modError) throw modError

      const sortedModules = (modulesData || []).sort((a, b) => {
        return (a.order_index || 0) - (b.order_index || 0)
      })

      const { data: progressData, error: progError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authStore.user.id)

      if (progError) throw progError

      const progressMap: Record<string, any> = {}
      progressData?.forEach(p => {
        progressMap[p.module_id] = p
      })
      
      modules.value = sortedModules.map((mod) => {
        const userProg = progressMap[mod.id]
        
        let status = 'Terkunci'
        let progress = 0
        
        if (userProg) {
          status = userProg.status
          progress = userProg.progress_percentage
        } else {
          if (!mod.prerequisite_id) {
            status = 'Terbuka' 
          } else {
            const prereqProgress = progressMap[mod.prerequisite_id]
            if (prereqProgress && prereqProgress.status === 'Selesai') {
              status = 'Terbuka'
            } else {
              status = 'Terkunci'
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

  // [UPDATED] Secured API Call via RPC
  const startModule = async (moduleId: string) => {
    isUpdating.value = true
    error.value = null
    
    try {
      // Only pass the module_id. The server securely identifies the user via their JWT.
      const { error: rpcError } = await supabase.rpc('update_learning_progress', {
        p_module_id: moduleId,
        p_progress_type: 'START'
      })

      if (rpcError) throw rpcError

      // Update local state dynamically
      const moduleIndex = modules.value.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1 && modules.value[moduleIndex].progress! < 15) {
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

  // [UPDATED] Secured API Call via RPC
  const markAsRead = async (moduleId: string) => {
    isUpdating.value = true
    error.value = null

    try {
      const { error: rpcError } = await supabase.rpc('update_learning_progress', {
        p_module_id: moduleId,
        p_progress_type: 'READ'
      })

      if (rpcError) throw rpcError

      // Update local state dynamically
      const moduleIndex = modules.value.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1 && modules.value[moduleIndex].progress! < 50) {
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