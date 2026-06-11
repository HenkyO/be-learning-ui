import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import type { Subject } from '../types'

export const useSubjectStore = defineStore('subject', () => {
  const authStore = useAuthStore()

  const subjects = ref<(Subject & { progressStatus?: string })[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchSubjectsForModule = async (moduleId: string) => {
    isLoading.value = true
    error.value = null
    subjects.value = []

    try {
      const userId = authStore.user?.id
      if (!userId) throw new Error('Pengguna tidak terautentikasi.')

      // 1. Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true })

      if (subjectsError) throw subjectsError

      // 2. Fetch user progress for these subjects
      const { data: progressData, error: progressError } = await supabase
        .from('user_subject_progress')
        .select('*')
        .eq('user_id', userId)

      if (progressError) throw progressError

      // 3. Map progress onto subjects
      subjects.value = (subjectsData || []).map(subject => {
        const prog = progressData?.find(p => p.subject_id === subject.id)
        return {
          ...subject,
          progressStatus: prog ? prog.status : 'Belum Selesai'
        }
      })

    } catch (err: any) {
      console.error('Gagal mengambil data subject:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const markSubjectAsCompleted = async (subjectId: string) => {
    try {
      const userId = authStore.user?.id
      if (!userId) throw new Error('Pengguna tidak terautentikasi.')

      const { error: upsertError } = await supabase
        .from('user_subject_progress')
        .upsert({
          user_id: userId,
          subject_id: subjectId,
          status: 'Selesai',
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,subject_id' })

      if (upsertError) throw upsertError

      // Update local state
      const idx = subjects.value.findIndex(s => s.id === subjectId)
      if (idx !== -1) {
        subjects.value[idx].progressStatus = 'Selesai'
      }

      return true
    } catch (err: any) {
      console.error('Gagal memperbarui status subject:', err)
      error.value = err.message
      return false
    }
  }

  return {
    subjects,
    isLoading,
    error,
    fetchSubjectsForModule,
    markSubjectAsCompleted
  }
})
