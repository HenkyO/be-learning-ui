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

  const levelWeight = (level: string) => {
    if (level.includes('Basic')) return 1
    if (level.includes('Intermediate')) return 2
    if (level.includes('Advanced')) return 3
    return 4
  }

  const fetchLearningPath = async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
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
      // 1. Fetch Modules
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .neq('is_deleted', true)
        
      if (modError) throw modError

      const sortedModules = (modulesData || []).sort((a, b) => {
        if (levelWeight(a.level) !== levelWeight(b.level)) {
          return levelWeight(a.level) - levelWeight(b.level)
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })

      // 2. Fetch User Progress
      const { data: progressData, error: progError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authStore.user.id)

      if (progError) throw progError

      // 3. Map Progress to Modules
      const progressMap: Record<string, any> = {}
      progressData?.forEach(p => {
        progressMap[p.module_id] = p
      })
      
      let previousCompleted = true 
      
      modules.value = sortedModules.map((mod) => {
        const userProg = progressMap[mod.id]
        
        let status = 'Terkunci'
        let progress = 0
        
        if (userProg) {
          status = userProg.status
          progress = userProg.progress_percentage
        } else if (previousCompleted) {
          status = 'Terbuka'
        }

        if (status !== 'Selesai') {
          previousCompleted = false
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

      // Update local state immediately without refetching everything
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

      // Update local state
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