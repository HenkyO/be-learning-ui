const fs = require('fs');
let content = fs.readFileSync('src/views/management/CourseManagerView.vue', 'utf8');

// 1. Add toggle to list view
const listHeaderOld = `<div v-if="activeTab === 'list'" class="animate-fade-in-up bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
      <div v-if="isFetching" class="flex justify-center items-center py-20">`;
    
const listHeaderNew = `<div v-if="activeTab === 'list'" class="animate-fade-in-up bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-100 pb-6">
        <h3 class="text-xl font-black text-slate-800">{{ showArchived ? 'Daftar Modul Diarsipkan' : 'Daftar Modul Aktif' }}</h3>
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button @click="showArchived = false; fetchModules()" :class="!showArchived ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">Aktif</button>
          <button @click="showArchived = true; fetchModules()" :class="showArchived ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all">Arsip</button>
        </div>
      </div>

      <div v-if="isFetching" class="flex justify-center items-center py-20">`;
content = content.replace(listHeaderOld, listHeaderNew);

// 2. Fix empty state message
const emptyStateOld = `<p class="text-slate-500 font-bold">Basis data modul kosong. Belum ada kurikulum yang ditambahkan.</p>`;
const emptyStateNew = `<p class="text-slate-500 font-bold">{{ showArchived ? 'Tidak ada modul di dalam arsip.' : 'Basis data modul kosong. Belum ada kurikulum yang ditambahkan.' }}</p>`;
content = content.replace(emptyStateOld, emptyStateNew);

// 3. Update table actions
const tableActionsOld = `<td class="p-5 text-right flex items-center justify-end gap-2">
                <button @click="startEdit(mod)" class="px-4 py-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Edit Modul
                </button>
                <button @click="deleteModule(mod)" :disabled="isDeleting" class="px-4 py-2 bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Hapus
                </button>
              </td>`;

const tableActionsNew = `<td class="p-5 text-right flex items-center justify-end gap-2">
                <template v-if="!showArchived">
                  <button @click="startEdit(mod)" class="px-4 py-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Edit Modul
                  </button>
                  <button @click="deleteModule(mod)" :disabled="isDeleting" class="px-4 py-2 bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Hapus
                  </button>
                </template>
                <template v-else>
                  <button @click="restoreModule(mod)" :disabled="isRestoring" class="px-4 py-2 bg-white border-2 border-green-100 hover:border-green-500 hover:bg-green-50 text-green-600 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Pulihkan
                  </button>
                </template>
              </td>`;
content = content.replace(tableActionsOld, tableActionsNew);

// 4. Update script state
const scriptStateOld = `const modulesList = ref<any[]>([])
const isFetching = ref(false)
const isDeleting = ref(false)`;
const scriptStateNew = `const modulesList = ref<any[]>([])
const isFetching = ref(false)
const isDeleting = ref(false)
const isRestoring = ref(false)
const showArchived = ref(false)`;
content = content.replace(scriptStateOld, scriptStateNew);

// 5. Update fetchModules function
const fetchOld = `const fetchModules = async () => {
  isFetching.value = true
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .neq('is_deleted', true)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    modulesList.value = data || []
  } catch (error) {
    console.error("Galat memuat daftar:", error)
  } finally {
    isFetching.value = false
  }
}`;
const fetchNew = `const fetchModules = async () => {
  isFetching.value = true
  try {
    let query = supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (showArchived.value) {
      query = query.eq('is_deleted', true)
    } else {
      query = query.neq('is_deleted', true)
    }

    const { data, error } = await query
      
    if (error) throw error
    modulesList.value = data || []
  } catch (error) {
    console.error("Galat memuat daftar:", error)
  } finally {
    isFetching.value = false
  }
}`;
content = content.replace(fetchOld, fetchNew);

// 6. Add restoreModule function after deleteModule
const deleteFunc = `const deleteModule = async (mod: any) => {
  if (!window.confirm(\`Yakin ingin mengarsipkan modul "\${mod.title}"?\\nModul akan disembunyikan, tetapi rekam jejak kelulusan pegawai akan tetap tersimpan.\`)) return

  isDeleting.value = true
  try {
    // Soft delete: flag as deleted instead of dropping records
    const { error } = await supabase
      .from('modules')
      .update({ is_deleted: true })
      .eq('id', mod.id)

    if (error) throw error

    alert('Modul telah diarsipkan.')
    fetchModules()
  } catch (error: any) {
    alert('Galat mengarsipkan modul: ' + error.message)
  } finally {
    isDeleting.value = false
  }
}`;

const restoreFunc = `

// ==========================================
// FUNGSI: PULIHKAN MODUL (RESTORE)
// ==========================================
const restoreModule = async (mod: any) => {
  if (!window.confirm(\`Yakin ingin memulihkan modul "\${mod.title}"?\\nModul akan kembali terlihat di kurikulum peserta didik.\`)) return

  isRestoring.value = true
  try {
    const { error } = await supabase
      .from('modules')
      .update({ is_deleted: false })
      .eq('id', mod.id)

    if (error) throw error

    alert('Modul berhasil dipulihkan.')
    fetchModules()
  } catch (error: any) {
    alert('Galat memulihkan modul: ' + error.message)
  } finally {
    isRestoring.value = false
  }
}`;
content = content.replace(deleteFunc, deleteFunc + restoreFunc);

fs.writeFileSync('src/views/management/CourseManagerView.vue', content);
console.log("File updated successfully.");
