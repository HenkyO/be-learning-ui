import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import type { LearningPath } from '../types'

export const useCurriculumStore = defineStore('curriculum', () => {
  const curriculums = ref<LearningPath[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCurriculums = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      curriculums.value = data || []
    } catch (err: any) {
      console.error('Gagal mengambil data kurikulum:', err)
      error.value = err.message || 'Terjadi kesalahan saat memuat katalog kurikulum.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    curriculums,
    isLoading,
    error,
    fetchCurriculums
  }
})
