<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import QuestionForm from '../components/QuestionForm.vue'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()

const isEditing = computed(() => !!route.query.edit)
const quizId = computed(() => route.query.edit ? parseInt(route.query.edit) : null)

const title = ref('')
const questions = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const showQuestionForm = ref(false)
const editingQuestion = ref(null)

onMounted(async () => {
  if (isEditing.value && quizId.value) {
    loading.value = true
    try {
      const quiz = quizStore.quizzes.find(q => q.id === quizId.value)
      if (quiz) {
        title.value = quiz.title
      }
      await quizStore.fetchQuestions(quizId.value)
      questions.value = [...quizStore.questions]
    } catch (err) {
      error.value = 'Erreur lors du chargement du quiz'
    } finally {
      loading.value = false
    }
  }
})

const titleError = computed(() => {
  if (!title.value) return ''
  if (title.value.length < 5) return 'Minimum 5 caracteres'
  if (title.value.length > 100) return 'Maximum 100 caracteres'
  return ''
})

const canSave = computed(() => {
  return title.value.length >= 5 && !titleError.value
})

async function saveQuiz() {
  if (!canSave.value) return

  saving.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      await quizStore.updateQuiz(quizId.value, title.value)
    } else {
      const newQuiz = await quizStore.createQuiz(title.value)
      router.replace(`/create-quiz?edit=${newQuiz.id}`)
    }
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

async function handleQuestionSubmit(questionData) {
  try {
    if (editingQuestion.value) {
      await quizStore.updateQuestion(editingQuestion.value.id, questionData)
    } else {
      await quizStore.createQuestion(questionData)
    }
    await quizStore.fetchQuestions(quizId.value)
    questions.value = [...quizStore.questions]
    showQuestionForm.value = false
    editingQuestion.value = null
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur lors de la sauvegarde de la question')
  }
}

function editQuestion(question) {
  editingQuestion.value = question
  showQuestionForm.value = true
}

async function deleteQuestion(questionId) {
  if (!confirm('Supprimer cette question ?')) return

  try {
    await quizStore.deleteQuestion(questionId)
    await quizStore.fetchQuestions(quizId.value)
    questions.value = [...quizStore.questions]
  } catch (err) {
    alert('Erreur lors de la suppression')
  }
}

function cancelQuestionForm() {
  showQuestionForm.value = false
  editingQuestion.value = null
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Modifier le quiz' : 'Creer un quiz' }}
      </h1>
      <router-link to="/dashboard" class="btn btn-secondary">
        Retour
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <template v-else>
      <!-- Quiz Title -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold mb-4">Informations du quiz</h2>

        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              v-model="title"
              type="text"
              class="input"
              placeholder="Titre du quiz (5-100 caracteres)"
            />
            <p v-if="titleError" class="error-text">{{ titleError }}</p>
          </div>
          <button
            @click="saveQuiz"
            :disabled="!canSave || saving"
            class="btn btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': !canSave || saving }"
          >
            {{ saving ? 'Sauvegarde...' : (isEditing ? 'Mettre a jour' : 'Creer') }}
          </button>
        </div>

        <p v-if="error" class="error-text mt-2">{{ error }}</p>
      </div>

      <!-- Questions Section (only visible after quiz creation) -->
      <template v-if="isEditing && quizId">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">
            Questions ({{ questions.length }})
          </h2>
          <button
            v-if="!showQuestionForm && questions.length > 0"
            @click="showQuestionForm = true"
            class="btn btn-primary"
          >
            Ajouter une question
          </button>
        </div>

        <!-- Question Form -->
        <QuestionForm
          v-if="showQuestionForm"
          :quiz-id="quizId"
          :question="editingQuestion"
          @submit="handleQuestionSubmit"
          @cancel="cancelQuestionForm"
          class="mb-6"
        />

        <!-- Questions List -->
        <div v-if="questions.length === 0 && !showQuestionForm" class="card text-center py-8">
          <p class="text-gray-500 mb-4">Aucune question pour le moment</p>
          <button @click="showQuestionForm = true" class="btn btn-primary">
            Ajouter la premiere question
          </button>
        </div>

        <div v-else-if="questions.length > 0" class="space-y-4">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="card"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm">
                    Q{{ index + 1 }}
                  </span>
                  <span class="text-xs text-gray-500 uppercase">
                    {{ question.type === 'qcm' ? 'QCM' : 'Vrai/Faux' }}
                  </span>
                </div>
                <p class="text-gray-900 font-medium">{{ question.question_text }}</p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="(option, i) in (typeof question.options === 'string' ? JSON.parse(question.options) : question.options)"
                    :key="i"
                    :class="[
                      'px-2 py-1 rounded text-sm',
                      option === question.correct_answer
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ option }}
                  </span>
                </div>
              </div>

              <div class="flex space-x-2 ml-4">
                <button
                  @click="editQuestion(question)"
                  class="text-primary-600 hover:text-primary-800"
                >
                  Modifier
                </button>
                <button
                  @click="deleteQuestion(question.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Message before quiz creation -->
      <div v-else class="card text-center py-8">
        <p class="text-gray-500">
          Creez d'abord le quiz pour pouvoir ajouter des questions
        </p>
      </div>
    </template>
  </div>
</template>
