import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import type { LearningPath } from '../types'

export const useCurriculumStore = defineStore('curriculum', () => {
  const curriculums = ref<LearningPath[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCurriculums = async (adminMode = false) => {
    isLoading.value = true
    error.value = null
    try {
      let query = supabase
        .from('learning_paths')
        .select('*')
        .order('created_at', { ascending: true })

      if (!adminMode) {
        query = query.eq('is_published', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      curriculums.value = data || []
    } catch (err: any) {
      console.error('Gagal mengambil data kurikulum:', err)
      error.value = err.message || 'Terjadi kesalahan saat memuat katalog kurikulum.'
    } finally {
      isLoading.value = false
    }
  }

  const createCurriculum = async (newCurriculum: { title: string; description: string; icon: string; is_published?: boolean }) => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('learning_paths')
        .insert([
          {
            title: newCurriculum.title,
            description: newCurriculum.description,
            icon: newCurriculum.icon || '🔰',
            is_published: newCurriculum.is_published !== undefined ? newCurriculum.is_published : true
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError
      
      // Update local state automatically so the UI refreshes
      if (data) {
        curriculums.value.push(data)
      }
      return { success: true, data }
    } catch (err: any) {
      console.error('Gagal membuat kurikulum:', err)
      error.value = err.message || 'Terjadi kesalahan saat membuat kurikulum.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateCurriculum = async (id: string, updates: { title?: string; description?: string; icon?: string; is_published?: boolean }) => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('learning_paths')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      const index = curriculums.value.findIndex(c => c.id === id)
      if (index !== -1 && data) {
        curriculums.value[index] = data
      }
      return { success: true, data }
    } catch (err: any) {
      console.error('Gagal memperbarui kurikulum:', err)
      error.value = err.message || 'Terjadi kesalahan saat memperbarui kurikulum.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteCurriculum = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      curriculums.value = curriculums.value.filter(c => c.id !== id)
      return { success: true }
    } catch (err: any) {
      console.error('Gagal menghapus kurikulum:', err)
      error.value = err.message || 'Terjadi kesalahan saat menghapus kurikulum.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    curriculums,
    isLoading,
    error,
    fetchCurriculums,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum
  }
})