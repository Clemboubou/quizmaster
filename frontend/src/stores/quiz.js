import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const quizzes = ref([])
  const currentQuiz = ref(null)
  const questions = ref([])
  const results = ref([])
  const quizResults = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions - Quiz
  async function fetchQuizzes() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/quizzes')
      quizzes.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuiz(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/quizzes/${id}`)
      currentQuiz.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function createQuiz(title) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/quizzes', { title })
      quizzes.value.unshift(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la creation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQuiz(id, title) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/quizzes/${id}`, { title })
      const index = quizzes.value.findIndex(q => q.id === id)
      if (index !== -1) {
        quizzes.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la modification'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteQuiz(id) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/quizzes/${id}`)
      quizzes.value = quizzes.value.filter(q => q.id !== id)
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function joinQuiz(code) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/quizzes/join/${code}`)
      currentQuiz.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Code invalide'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Questions
  async function fetchQuestions(quizId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/questions/quiz/${quizId}`)
      questions.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuestionsForPlay(quizId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/questions/play/${quizId}`)
      questions.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function createQuestion(questionData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/questions', questionData)
      questions.value.push(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la creation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQuestion(id, questionData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/questions/${id}`, questionData)
      const index = questions.value.findIndex(q => q.id === id)
      if (index !== -1) {
        questions.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la modification'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteQuestion(id) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/questions/${id}`)
      questions.value = questions.value.filter(q => q.id !== id)
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Results
  async function submitResult(quizId, score, answers = []) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/results', { quiz_id: quizId, score, answers })
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors de l\'envoi'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchResultAnswers(resultId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/results/${resultId}/answers`)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyResults() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/results/me')
      results.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuizResults(quizId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/results/quiz/${quizId}`)
      quizResults.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  function clearCurrentQuiz() {
    currentQuiz.value = null
    questions.value = []
  }

  return {
    quizzes,
    currentQuiz,
    questions,
    results,
    quizResults,
    loading,
    error,
    fetchQuizzes,
    fetchQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    joinQuiz,
    fetchQuestions,
    fetchQuestionsForPlay,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    submitResult,
    fetchResultAnswers,
    fetchMyResults,
    fetchQuizResults,
    clearCurrentQuiz
  }
})
