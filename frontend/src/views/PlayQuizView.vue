<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import { useAuthStore } from '../stores/auth'
import QuestionDisplay from '../components/QuestionDisplay.vue'
import ScoreDisplay from '../components/ScoreDisplay.vue'
import { useSeo, seoPresets } from '../composables/useSeo'

// SEO : Meta tags pour jouer un quiz
useSeo(seoPresets.play)

const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const currentQuestionIndex = ref(0)
const answers = ref([])
const score = ref(0)
const isFinished = ref(false)
const submitting = ref(false)
const error = ref('')

const currentQuiz = computed(() => quizStore.currentQuiz)
const questions = computed(() => quizStore.questions)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => questions.value.length)

onMounted(async () => {
  if (!currentQuiz.value) {
    router.push('/')
    return
  }

  try {
    await quizStore.fetchQuestionsForPlay(currentQuiz.value.id)
  } catch (err) {
    error.value = 'Erreur lors du chargement des questions'
  }
})

function handleAnswer(answer) {
  const isCorrect = answer === currentQuestion.value.correct_answer

  // Store detailed answer
  answers.value.push({
    question_id: currentQuestion.value.id,
    user_answer: answer,
    is_correct: isCorrect
  })

  if (isCorrect) {
    score.value++
  }

  // Move to next question or finish
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
  } else {
    finishQuiz()
  }
}

async function finishQuiz() {
  submitting.value = true

  try {
    // Submit score with detailed answers if user is authenticated as student
    if (authStore.isAuthenticated && authStore.isEleve) {
      await quizStore.submitResult(currentQuiz.value.id, score.value, answers.value)
    }
  } catch {
    // Erreur silencieuse - le resultat n'a pas pu etre enregistre
  } finally {
    submitting.value = false
    isFinished.value = true
  }
}

function goBack() {
  quizStore.clearCurrentQuiz()
  router.push(authStore.isAuthenticated ? '/dashboard' : '/')
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-8">
    <!-- Loading -->
    <div v-if="!currentQuiz || questions.length === 0" class="text-center">
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-else class="text-gray-500">Chargement...</p>
    </div>

    <!-- Quiz finished -->
    <ScoreDisplay
      v-else-if="isFinished"
      :score="score"
      :total="totalQuestions"
      :quiz-title="currentQuiz.title"
      @back="goBack"
    />

    <!-- Question display -->
    <div v-else class="w-full max-w-2xl px-4">
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-gray-900">{{ currentQuiz.title }}</h1>
      </div>

      <QuestionDisplay
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="totalQuestions"
        @answer="handleAnswer"
      />
    </div>
  </div>
</template>
