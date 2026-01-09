<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQuizStore } from '../stores/quiz'
import QuizCard from '../components/QuizCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const quizStore = useQuizStore()

const loading = ref(true)
const error = ref('')
const showResults = ref(false)
const selectedQuizId = ref(null)
const selectedResult = ref(null)
const resultAnswers = ref([])
const loadingAnswers = ref(false)
const showMyAnswers = ref(false)
const selectedMyResult = ref(null)
const myAnswers = ref([])

const myResults = computed(() => quizStore.results)
const quizResults = computed(() => quizStore.quizResults)

onMounted(async () => {
  try {
    if (authStore.isProf) {
      await quizStore.fetchQuizzes()
    } else {
      await quizStore.fetchMyResults()
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des donnees'
  } finally {
    loading.value = false
  }
})

async function handleDelete(quizId) {
  if (!confirm('Supprimer ce quiz ?')) return

  try {
    await quizStore.deleteQuiz(quizId)
  } catch (err) {
    alert('Erreur lors de la suppression')
  }
}

async function handleViewResults(quizId) {
  try {
    await quizStore.fetchQuizResults(quizId)
    selectedQuizId.value = quizId
    showResults.value = true
  } catch (err) {
    alert('Erreur lors du chargement des resultats')
  }
}

function closeResults() {
  showResults.value = false
  selectedQuizId.value = null
  selectedResult.value = null
  resultAnswers.value = []
}

async function viewAnswers(result) {
  loadingAnswers.value = true
  selectedResult.value = result
  try {
    resultAnswers.value = await quizStore.fetchResultAnswers(result.id)
  } catch (err) {
    alert('Erreur lors du chargement des reponses')
  } finally {
    loadingAnswers.value = false
  }
}

function backToResults() {
  selectedResult.value = null
  resultAnswers.value = []
}

// Pour les eleves - voir ses propres reponses
async function viewMyAnswers(result) {
  loadingAnswers.value = true
  selectedMyResult.value = result
  showMyAnswers.value = true
  try {
    myAnswers.value = await quizStore.fetchMyResultAnswers(result.id)
  } catch (err) {
    alert('Erreur lors du chargement des reponses')
  } finally {
    loadingAnswers.value = false
  }
}

function closeMyAnswers() {
  showMyAnswers.value = false
  selectedMyResult.value = null
  myAnswers.value = []
}

const canCreateQuiz = computed(() => {
  if (authStore.isPremium) return quizStore.quizzes.length < 20
  return quizStore.quizzes.length < 1
})

const quizLimit = computed(() => (authStore.isPremium ? 20 : 1))
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ authStore.isProf ? 'Mes Quiz' : 'Mes Resultats' }}
        </h1>
        <p class="text-gray-600 mt-1" v-if="authStore.isProf">
          {{ quizStore.quizzes.length }} / {{ quizLimit }} quiz
          <span v-if="!authStore.isPremium" class="text-primary-600 ml-2">
            <router-link to="/payment">Passer Premium</router-link>
          </span>
        </p>
      </div>

      <router-link
        v-if="authStore.isProf && canCreateQuiz"
        to="/create-quiz"
        class="btn btn-primary"
      >
        Creer un quiz
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Prof View: Quiz List -->
    <template v-else-if="authStore.isProf">
      <div v-if="quizStore.quizzes.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">Vous n'avez pas encore cree de quiz</p>
        <router-link to="/create-quiz" class="btn btn-primary">Creer mon premier quiz</router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-6">
        <QuizCard
          v-for="quiz in quizStore.quizzes"
          :key="quiz.id"
          :quiz="quiz"
          @delete="handleDelete"
          @view-results="handleViewResults"
        />
      </div>
    </template>

    <!-- Student View: Results List -->
    <template v-else>
      <div v-if="myResults.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">Vous n'avez pas encore participe a un quiz</p>
        <router-link to="/" class="btn btn-primary">Rejoindre un quiz</router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="result in myResults"
          :key="result.id"
          @click="viewMyAnswers(result)"
          class="card hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-900">{{ result.quiz_title }}</h3>
              <p class="text-sm text-gray-500">
                {{ new Date(result.played_at).toLocaleDateString('fr-FR') }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-2xl font-bold text-primary-600">
                  {{ result.score }} / {{ result.total_questions }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ Math.round((result.score / result.total_questions) * 100) }}%
                </div>
              </div>
              <span class="text-gray-400">&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Results Modal -->
    <div
      v-if="showResults"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeResults"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-2">
            <button
              v-if="selectedResult"
              @click="backToResults"
              class="text-gray-500 hover:text-gray-700"
            >
              &larr;
            </button>
            <h3 class="text-lg font-semibold">
              {{
                selectedResult ? `Reponses de ${selectedResult.student_email}` : 'Resultats du quiz'
              }}
            </h3>
          </div>
          <button @click="closeResults" class="text-gray-500 hover:text-gray-700">X</button>
        </div>

        <!-- Loading answers -->
        <div v-if="loadingAnswers" class="text-center py-8">
          <p class="text-gray-500">Chargement des reponses...</p>
        </div>

        <!-- Detailed answers view -->
        <div v-else-if="selectedResult" class="space-y-4">
          <div v-if="resultAnswers.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucune reponse enregistree pour cet eleve</p>
          </div>

          <div
            v-for="(answer, index) in resultAnswers"
            :key="answer.id"
            class="p-4 rounded-lg"
            :class="
              answer.is_correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            "
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Question {{ index + 1 }}</span>
              <span
                :class="answer.is_correct ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                {{ answer.is_correct ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <p class="font-medium text-gray-900 mb-3">{{ answer.question_text }}</p>
            <div class="space-y-1 text-sm">
              <p>
                <span class="text-gray-500">Reponse donnee:</span>
                <span
                  :class="answer.is_correct ? 'text-green-700' : 'text-red-700'"
                  class="ml-2 font-medium"
                >
                  {{ answer.user_answer }}
                </span>
              </p>
              <p v-if="!answer.is_correct">
                <span class="text-gray-500">Bonne reponse:</span>
                <span class="text-green-700 ml-2 font-medium">{{ answer.correct_answer }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Results list -->
        <template v-else>
          <div v-if="quizResults.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucun resultat pour ce quiz</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="result in quizResults"
              :key="result.id"
              @click="viewAnswers(result)"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <span class="text-gray-700">{{ result.student_email }}</span>
              <div class="flex items-center space-x-3">
                <span class="font-semibold text-primary-600">{{ result.score }} pts</span>
                <span class="text-gray-400">&rarr;</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Student Answers Modal -->
    <div
      v-if="showMyAnswers"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeMyAnswers"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">{{ selectedMyResult?.quiz_title }} - Mes reponses</h3>
          <button @click="closeMyAnswers" class="text-gray-500 hover:text-gray-700">X</button>
        </div>

        <!-- Score summary -->
        <div v-if="selectedMyResult" class="bg-primary-50 rounded-lg p-4 mb-4 text-center">
          <div class="text-3xl font-bold text-primary-600">
            {{ selectedMyResult.score }} / {{ selectedMyResult.total_questions }}
          </div>
          <div class="text-sm text-primary-700">
            {{ Math.round((selectedMyResult.score / selectedMyResult.total_questions) * 100) }}% de
            bonnes reponses
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loadingAnswers" class="text-center py-8">
          <p class="text-gray-500">Chargement des reponses...</p>
        </div>

        <!-- Answers -->
        <div v-else class="space-y-4">
          <div v-if="myAnswers.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucune reponse enregistree</p>
          </div>

          <div
            v-for="(answer, index) in myAnswers"
            :key="answer.id"
            class="p-4 rounded-lg"
            :class="
              answer.is_correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            "
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Question {{ index + 1 }}</span>
              <span
                :class="answer.is_correct ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                {{ answer.is_correct ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <p class="font-medium text-gray-900 mb-3">{{ answer.question_text }}</p>
            <div class="space-y-1 text-sm">
              <p>
                <span class="text-gray-500">Votre reponse:</span>
                <span
                  :class="answer.is_correct ? 'text-green-700' : 'text-red-700'"
                  class="ml-2 font-medium"
                >
                  {{ answer.user_answer }}
                </span>
              </p>
              <p v-if="!answer.is_correct">
                <span class="text-gray-500">Bonne reponse:</span>
                <span class="text-green-700 ml-2 font-medium">{{ answer.correct_answer }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
