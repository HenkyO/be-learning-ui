<template>
  <div class="space-y-8 animate-fade-in-up pb-12 max-w-4xl mx-auto mt-4">
    
    <div v-if="isLoading" class="flex justify-center items-center py-32">
      <div class="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
      <div class="w-16 h-16 border-4 border-bssn-cyan rounded-full border-t-transparent animate-spin absolute"></div>
    </div>

    <div v-else-if="activeProgress?.attempts >= 2 && activeProgress?.status !== 'Selesai'" class="bg-white p-12 rounded-[2rem] border border-red-200 shadow-xl shadow-red-900/5 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-red-50/50"></div>
      <div class="relative z-10">
        <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-3">Akses Ujian Terkunci</h3>
        <p class="text-slate-600 mb-8 max-w-md mx-auto font-medium">Anda telah menghabiskan batas maksimal 2 kali percobaan ujian untuk modul ini. Silakan hubungi Administrator atau Mentor untuk mereset sesi Anda.</p>
        <button @click="router.push('/learning-path')" class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
          Kembali ke Kurikulum
        </button>
      </div>
    </div>

    <div v-else-if="showResult" class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b" :class="isPassed ? 'from-green-50 to-transparent' : 'from-red-50 to-transparent'"></div>
      
      <div class="relative z-10">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-inner" :class="isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
          <svg v-if="isPassed" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        
        <h2 class="text-3xl font-extrabold text-slate-900 mb-2">{{ isPassed ? 'Kompetensi Tercapai!' : 'Evaluasi Belum Lulus' }}</h2>
        <p class="text-slate-500 text-sm font-medium mb-8">Skor akhir yang divalidasi oleh sistem:</p>
        
        <div class="text-7xl font-black tracking-tighter mb-8" :class="isPassed ? 'text-green-500' : 'text-red-500'">
          {{ score }}<span class="text-3xl text-slate-300 ml-1">/100</span>
        </div>

        <div class="bg-white/80 backdrop-blur border border-slate-200 p-4 rounded-xl inline-block mb-8 shadow-sm">
          <p class="text-sm font-bold text-slate-700">Sisa Percobaan Anda: <span :class="attemptsLeft > 0 ? 'text-bssn-cyan' : 'text-red-500'">{{ attemptsLeft }} Kali</span></p>
        </div>

        <p class="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          {{ isPassed 
            ? 'Selamat! Anda kini dapat melanjutkan ke tahapan kurikulum berikutnya.' 
            : attemptsLeft === 0 ? 'Anda telah kehabisan kesempatan. Akses modul ini sekarang terkunci.' : 'Skor Anda di bawah standar (70). Silakan baca ulang materi dan ulangi evaluasi ini.' 
          }}
        </p>

        <button v-if="wrongAnswerIds.length > 0" @click="isReviewing = true; showResult = false" 
          class="px-8 py-4 bg-white border border-slate-200 text-slate-800 font-black rounded-xl text-sm transition-all shadow-sm hover:bg-slate-50 block w-full max-w-xs mx-auto mb-4">
          Tinjau Kesalahan
        </button>

        <button @click="router.push('/learning-path')" class="px-8 py-4 bg-slate-900 text-white font-black rounded-xl text-sm transition-all shadow-xl hover:bg-slate-800 w-full max-w-xs mx-auto">
          Kembali ke Kurikulum
        </button>
      </div>
    </div>

    <div v-else-if="isReviewing" class="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-xl relative">
      <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 class="text-2xl font-black text-slate-900 mb-2">Evaluasi Hasil Ujian</h2>
          <p class="text-slate-500 font-medium">Berikut adalah daftar pertanyaan yang belum Anda jawab dengan tepat.</p>
        </div>
        <button @click="isReviewing = false; showResult = true" class="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-all">
          Tutup Evaluasi
        </button>
      </div>

      <div class="space-y-6">
        <div v-for="q in questions.filter(q => wrongAnswerIds.includes(q.id))" :key="q.id" 
             class="p-6 bg-red-50/50 border border-red-100 rounded-xl">
          <div class="flex gap-4">
            <span class="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 font-bold rounded-lg shrink-0">
              {{ questions.findIndex(original => original.id === q.id) + 1 }}
            </span>
            <div>
              <p class="text-slate-800 font-bold mb-3 leading-relaxed">{{ q.question_text }}</p>
              <div class="bg-white px-4 py-3 border border-red-100 rounded-lg shadow-sm">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Jawaban Anda:</span>
                <span class="text-slate-600 font-medium line-through decoration-red-400">
                  {{ answers[q.id] || '(Tidak dijawab)' }}
                </span>
              </div>
              <div class="bg-white px-4 py-3 border border-green-100 rounded-lg shadow-sm mt-3">
                <span class="text-xs font-bold text-green-500 uppercase tracking-wider block mb-1">Jawaban Benar:</span>
                <span class="text-slate-700 font-medium">
                  {{ getCorrectOptionText(q) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center pt-8 border-t border-slate-100">
        <button @click="router.push('/learning-path')" class="px-8 py-4 bg-slate-900 text-white font-black rounded-xl text-sm transition-all shadow-xl hover:bg-slate-800">
          Kembali ke Kurikulum
        </button>
      </div>
    </div>

    <div v-else class="space-y-6">
      
      <div class="flex items-center justify-between bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-900/20">
        <div class="flex-1">
          <div class="flex items-center gap-4 mb-2">
            <span class="px-3 py-1 bg-slate-800 text-bssn-cyan text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700">QUIZ</span>
            <span class="text-xs font-bold text-slate-400">Percobaan ke-{{ (activeProgress?.attempts || 0) + 1 }} dari 2</span>
            
            <div class="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-widest shadow-inner transition-colors"
                 :class="timeLeft < 300 ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ formattedTime }}
            </div>
          </div>
          <h2 class="text-2xl font-black">{{ activeModule?.title }}</h2>
        </div>
        <div class="text-right shrink-0 bg-slate-800 p-4 rounded-2xl border border-slate-700 ml-6">
          <div class="text-4xl font-black text-bssn-cyan">{{ currentQuestionIndex + 1 }}<span class="text-xl text-slate-500">/{{ questions.length }}</span></div>
        </div>
      </div>

      <div class="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative">
        <h3 class="text-xl font-bold text-slate-800 leading-relaxed mb-8">
          {{ questions[currentQuestionIndex]?.question_text }}
        </h3>

        <div class="space-y-3" v-if="questions[currentQuestionIndex]">
          <label v-for="opt in questions[currentQuestionIndex].shuffledOptions" :key="opt.displayLabel" 
            class="flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50"
            :class="answers[questions[currentQuestionIndex].id] === opt.text ? 'border-bssn-cyan bg-cyan-50/30 shadow-sm ring-2 ring-bssn-cyan/10' : 'border-slate-100 bg-white'">
            
            <input type="radio" :name="'q_' + questions[currentQuestionIndex].id" :value="opt.text" v-model="answers[questions[currentQuestionIndex].id]" class="w-5 h-5 text-bssn-cyan focus:ring-bssn-cyan border-slate-300">
            <span class="font-black text-slate-400 w-6 text-lg">{{ opt.displayLabel }}.</span>
            <span class="text-sm font-bold text-slate-700 select-none">
              {{ opt.text }}
            </span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4">
        <button @click="prevQuestion" :disabled="currentQuestionIndex === 0" 
          class="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all shadow-sm hover:bg-slate-50 disabled:opacity-50">
          Sebelumnya
        </button>

        <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion" 
          class="px-8 py-4 bg-slate-900 text-white font-black rounded-xl text-sm transition-all shadow-xl hover:bg-slate-800">
          Selanjutnya
        </button>

        <button v-else @click="submitQuiz" :disabled="isSubmitting || questions.length === 0 || Object.keys(answers).length < questions.length" 
          class="px-8 py-4 bg-bssn-cyan text-white font-black rounded-xl text-sm transition-all shadow-xl shadow-cyan-900/30 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          {{ isSubmitting ? 'Memvalidasi...' : 'Kirim Jawaban' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const route = useRoute() // TAMBAHAN: Ekstraksi instance route saat ini
const authStore = useAuthStore()

const isLoading = ref(true)
const activeModule = ref<any>(null)
const activeProgress = ref<any>(null)
const questions = ref<any[]>([])

const currentQuestionIndex = ref(0)
const answers = ref<Record<string, string>>({}) 
const isSubmitting = ref(false)
const showResult = ref(false)
const score = ref(0)
const isPassed = ref(false)
const attemptsLeft = ref(2)

const wrongAnswerIds = ref<string[]>([])
const isReviewing = ref(false)

const getCorrectOptionText = (q: any) => {
  const correctOpt = q.shuffledOptions?.find((o: any) => String(o.is_correct) === 'true')
  return correctOpt?.text || '(Tidak ada opsi benar yang diset)'
}

const DEFAULT_TIME_LIMIT_MINUTES = 30
const timeLeft = ref(DEFAULT_TIME_LIMIT_MINUTES * 60)
let timerInterval: ReturnType<typeof setInterval> | undefined = undefined 

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
      if (!isSubmitting.value && !showResult.value && !isReviewing.value) {
        submitQuiz() 
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
}

const storageKey = computed(() => {
  return `quiz_state_${activeModule.value?.id}_${authStore.user?.id}`
})

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(storageKey.value)
    if (saved) {
      const parsed = JSON.parse(saved)
      
      if (parsed.timeLeft !== undefined && parsed.timeLeft <= 0) {
        localStorage.removeItem(storageKey.value)
        return false
      }

      if (parsed.answers) answers.value = parsed.answers
      if (parsed.timeLeft) timeLeft.value = parsed.timeLeft
      return true
    }
  } catch (err) {
    console.error("Gagal memuat sesi ujian sebelumnya", err)
  }
  return false
}

watch([answers, timeLeft], () => {
  if (activeModule.value?.id && !isSubmitting.value && !showResult.value && !isReviewing.value) {
    localStorage.setItem(storageKey.value, JSON.stringify({
      answers: answers.value,
      timeLeft: timeLeft.value
    }))
  }
}, { deep: true })

const shuffleArray = (array: any[]) => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr
}

const fetchQuizData = async () => {
  isLoading.value = true
  try {
    if (!authStore.user?.id) return

    const targetModuleId = route.params.moduleId
    
    // Proteksi tambahan jika URL tidak valid
    if (!targetModuleId) {
      alert("Parameter modul tidak ditemukan.");
      router.push('/learning-path');
      return;
    }

    // --- CACHE BUSTER APPLIED ---
    // Penambahan .order() akan mengubah URL menjadi "...&order=updated_at.desc"
    // Ini memaksa browser membuat koneksi jaringan BARU ke Supabase.
    const { data: progressList, error: progressError } = await supabase
      .from('user_progress')
      .select('*, modules(*)')
      .eq('user_id', authStore.user.id)
      .eq('module_id', targetModuleId)
      .order('updated_at', { ascending: false }) // <--- INJEKSI KUNCI

    if (progressError) throw progressError

    // Validasi apabila modul belum pernah diakses pengguna
    if (!progressList || progressList.length === 0) {
      isLoading.value = false
      alert("Anda belum terdaftar atau belum memulai progres pada modul ini.");
      router.push('/learning-path');
      return
    }

    // Karena diurutkan menurun, index [0] selalu memastikan kita mengambil progres percobaan terbaru
    const progressData = progressList[0];

    activeModule.value = progressData.modules
    activeProgress.value = progressData

    const { data: qData, error: qError } = await supabase
      .from('questions')
      .select('id, module_id, question_text, options') 
      .eq('module_id', activeModule.value.id)
      .order('id', { ascending: true }) // Cache buster tambahan untuk tabel soal

    if (qError) throw qError
    
    if (qData && qData.length > 0) {
      const processedQuestions = qData.map(q => {
        const rawOptions = Array.isArray(q.options) ? q.options : []
        const shuffledOptions = shuffleArray(rawOptions).map((opt, index) => ({
          ...opt,
          displayLabel: String.fromCharCode(65 + index) 
        }))
        return { ...q, shuffledOptions }
      })
      
      questions.value = shuffleArray(processedQuestions)
      
      const hasSavedState = loadSavedState()
      
      if (!hasSavedState) {
        await supabase
          .from('user_progress')
          .update({ 
            updated_at: 'now()',
            started_at: 'now()'
          })
          .eq('id', activeProgress.value.id)
      }
      
      startTimer()
    } else {
      // Auto-pass if there are no questions in this module
      await supabase
        .from('user_progress')
        .update({ progress: 100, status: 'Selesai' })
        .eq('id', activeProgress.value.id)
        
      alert("Modul ini tidak memiliki evaluasi ujian. Anda langsung dinyatakan lulus untuk modul ini.")
      router.push('/learning-path')
    }

  } catch (error: any) {
    console.error("Gagal menarik data evaluasi:", JSON.stringify(error, null, 2))
    alert(`Gagal memuat ujian: ${error?.message || error?.details || JSON.stringify(error)}`)
  } finally {
    isLoading.value = false
  }
}

const nextQuestion = () => { if (currentQuestionIndex.value < questions.value.length - 1) currentQuestionIndex.value++ }
const prevQuestion = () => { if (currentQuestionIndex.value > 0) currentQuestionIndex.value-- }

const submitQuiz = async () => {
  if (!activeModule.value || !activeModule.value.id) {
    alert("Terjadi kesalahan: Data ujian tidak termuat dengan sempurna. Silakan muat ulang halaman.");
    return;
  }

  isSubmitting.value = true
  stopTimer() 

  try {
    if (!authStore.user?.id) throw new Error('User not authenticated')

    // Evaluasi Skor secara Lokal (Menggantikan RPC yang usang/bermasalah)
    let correctCount = 0;
    const wrongIds: string[] = [];

    questions.value.forEach(q => {
      const userAnswer = answers.value[q.id];
      const correctOpt = q.shuffledOptions.find((opt: any) => String(opt.is_correct) === 'true');
      
      if (correctOpt && userAnswer === correctOpt.text) {
        correctCount++;
      } else {
        wrongIds.push(q.id);
      }
    });

    const totalQuestions = questions.value.length;
    const calculatedScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = calculatedScore >= 70; 
    const currentAttempts = (activeProgress.value?.attempts || 0) + 1;
    const left = Math.max(0, 2 - currentAttempts);

    // Update state di database
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        attempts: currentAttempts,
        status: passed ? 'Selesai' : (left === 0 ? 'Terkunci' : 'Sedang Dipelajari'),
        progress: passed ? 100 : (activeProgress.value?.progress || 0),
        score: calculatedScore
      })
      .eq('id', activeProgress.value.id);

    if (updateError) throw updateError;

    // Tampilkan hasil
    score.value = calculatedScore
    isPassed.value = passed
    attemptsLeft.value = left
    wrongAnswerIds.value = wrongIds
    
    activeProgress.value.attempts = currentAttempts
    if (passed) {
      activeProgress.value.status = 'Selesai'
      activeProgress.value.progress = 100
    }
    showResult.value = true

    localStorage.removeItem(storageKey.value)

  } catch (error: any) {
    console.error("Detail Galat Sinkronisasi:", JSON.stringify(error, null, 2))
    alert("Terjadi kesalahan saat menyimpan hasil ujian.")
    startTimer() 
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => fetchQuizData())

onBeforeUnmount(() => {
  stopTimer() 
})
</script>