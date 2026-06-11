<template>
  <div class="max-w-6xl mx-auto py-8 px-4 animate-fade-in-up">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Manajemen Kurikulum</h1>
        <p class="text-gray-600 mt-1">Buat dan kelola jalur pembelajaran (Learning Paths) untuk pengguna.</p>
      </div>
      
      <div class="flex bg-slate-100 p-1 rounded-lg">
        <button @click="activeTab = 'add'" :class="['px-4 py-2 rounded-md text-sm font-semibold transition-colors', activeTab === 'add' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900']">
          {{ editingId ? 'Edit Kurikulum' : 'Tambah Kurikulum' }}
        </button>
        <button @click="switchToListTab" :class="['px-4 py-2 rounded-md text-sm font-semibold transition-colors', activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900']">
          Daftar Kurikulum
        </button>
      </div>
    </div>

    <!-- TAB: ADD / EDIT -->
    <div v-if="activeTab === 'add'" class="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in-up">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold">{{ editingId ? 'Edit Kurikulum' : 'Buat Kurikulum Baru' }}</h2>
        <button v-if="editingId" @click="resetForm" class="text-sm text-gray-500 hover:text-gray-700">Batal Edit</button>
      </div>
      
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
            {{ curriculumStore.isLoading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Kurikulum') }}
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

    <!-- TAB: LIST -->
    <div v-if="activeTab === 'list'" class="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in-up">
      <div v-if="curriculumStore.isLoading" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
      <div v-else-if="curriculumStore.curriculums.length === 0" class="text-center py-12">
        <p class="text-gray-500">Belum ada data kurikulum.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-slate-500 uppercase">Informasi Kurikulum</th>
              <th class="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="curr in curriculumStore.curriculums" :key="curr.id" class="hover:bg-slate-50/50">
              <td class="p-4">
                <span :class="[
                  'px-2.5 py-1 rounded-full text-xs font-semibold',
                  curr.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                ]">
                  {{ curr.is_published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">{{ curr.icon }}</span>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">{{ curr.title }}</h4>
                    <p class="text-xs text-gray-500 line-clamp-1 mt-1">{{ curr.description }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="startEdit(curr)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                    Edit
                  </button>
                  <button @click="deleteCurriculum(curr)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCurriculumStore } from '../../stores/curriculumStore'

const curriculumStore = useCurriculumStore()

const activeTab = ref('add')
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  description: '',
  icon: '🔰',
  is_published: true
})

const successMessage = ref('')

onMounted(() => {
  // Fetch all curriculums including drafts (adminMode = true)
  curriculumStore.fetchCurriculums(true)
  activeTab.value = 'list'
})

const switchToListTab = () => {
  activeTab.value = 'list'
  resetForm()
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    title: '',
    description: '',
    icon: '🔰',
    is_published: true
  }
}

const startEdit = (curr: any) => {
  editingId.value = curr.id
  form.value = {
    title: curr.title,
    description: curr.description,
    icon: curr.icon || '🔰',
    is_published: curr.is_published
  }
  activeTab.value = 'add'
}

const submitForm = async () => {
  successMessage.value = ''
  let result;
  
  if (editingId.value) {
    result = await curriculumStore.updateCurriculum(editingId.value, {
      title: form.value.title,
      description: form.value.description,
      icon: form.value.icon,
      is_published: form.value.is_published
    })
    if (result.success) {
      successMessage.value = `Kurikulum berhasil diperbarui!`
      setTimeout(() => switchToListTab(), 1500)
    }
  } else {
    result = await curriculumStore.createCurriculum({
      title: form.value.title,
      description: form.value.description,
      icon: form.value.icon,
      is_published: form.value.is_published
    })
    if (result.success) {
      successMessage.value = `Kurikulum "${result.data?.title}" berhasil dibuat!`
      resetForm()
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  }
}

const deleteCurriculum = async (curr: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kurikulum "${curr.title}"? Semua modul yang ada di dalamnya mungkin akan terhapus jika diatur CASCADE.`)) {
    const res = await curriculumStore.deleteCurriculum(curr.id)
    if (res.success) {
      alert('Kurikulum berhasil dihapus')
    } else {
      alert('Gagal menghapus kurikulum')
    }
  }
}
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>