<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Manajemen Kurikulum</h1>
      <p class="text-gray-600">Buat dan kelola jalur pembelajaran (Learning Paths) untuk pengguna.</p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 class="text-lg font-semibold mb-4 border-b pb-2">Buat Kurikulum Baru</h2>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Kurikulum *</label>
          <input 
            id="title" 
            v-model="form.title" 
            type="text" 
            required
            placeholder="Contoh: Infrastruktur Kunci Publik"
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat *</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            required
            rows="3"
            placeholder="Jelaskan tujuan dari kurikulum ini..."
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="icon" class="block text-sm font-medium text-gray-700 mb-1">Ikon (Emoji) *</label>
            <input 
              id="icon" 
              v-model="form.icon" 
              type="text" 
              required
              placeholder="Contoh: 🔐 atau 🔰"
              class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex items-center mt-6">
            <input 
              id="is_published" 
              v-model="form.is_published" 
              type="checkbox" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="is_published" class="ml-2 block text-sm text-gray-900">
              Langsung Publikasikan (Tampil di Katalog)
            </label>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button 
            type="submit" 
            :disabled="curriculumStore.isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ curriculumStore.isLoading ? 'Menyimpan...' : 'Simpan Kurikulum' }}
          </button>
        </div>

        <div v-if="curriculumStore.error" class="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {{ curriculumStore.error }}
        </div>
        <div v-if="successMessage" class="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
          {{ successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCurriculumStore } from '../../stores/curriculumStore'

const curriculumStore = useCurriculumStore()

const form = ref({
  title: '',
  description: '',
  icon: '🔰',
  is_published: true
})

const successMessage = ref('')

const submitForm = async () => {
  successMessage.value = ''
  
  const result = await curriculumStore.createCurriculum({
    title: form.value.title,
    description: form.value.description,
    icon: form.value.icon,
    is_published: form.value.is_published
  })

  if (result.success) {
    successMessage.value = `Kurikulum "${result.data.title}" berhasil dibuat!`
    // Reset form
    form.value = {
      title: '',
      description: '',
      icon: '🔰',
      is_published: true
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}
</script>