<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const accessCode = ref('')
const error = ref('')
const loading = ref(false)

async function joinQuiz() {
  if (!accessCode.value.trim()) {
    error.value = 'Veuillez entrer un code d\'acces'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await quizStore.joinQuiz(accessCode.value.trim().toUpperCase())
    router.push('/play')
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Quiz non trouve'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Bienvenue sur <span class="text-primary-600">QuizMaster</span>
        </h1>
        <p class="text-xl text-gray-600 mb-12">
          Creez et partagez des quiz interactifs en quelques clics
        </p>

        <!-- Join Quiz Form -->
        <div class="max-w-md mx-auto">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Rejoindre un quiz
            </h2>

            <form @submit.prevent="joinQuiz" class="space-y-4">
              <div>
                <input
                  v-model="accessCode"
                  type="text"
                  placeholder="Entrez le code d'acces"
                  class="input text-center text-2xl tracking-widest uppercase"
                  maxlength="5"
                />
              </div>

              <p v-if="error" class="error-text">{{ error }}</p>

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full py-3"
              >
                {{ loading ? 'Chargement...' : 'Rejoindre' }}
              </button>
            </form>
          </div>
        </div>

        <!-- CTA for professors -->
        <div class="mt-12" v-if="!authStore.isAuthenticated">
          <p class="text-gray-600 mb-4">
            Vous etes professeur ? Creez vos propres quiz !
          </p>
          <router-link to="/auth" class="btn btn-secondary">
            Se connecter / S'inscrire
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Pourquoi choisir QuizMaster ?
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">&#x1F4DD;</div>
            <h3 class="text-lg font-semibold mb-2">Facile a creer</h3>
            <p class="text-gray-600">
              Creez des quiz QCM ou Vrai/Faux en quelques minutes
            </p>
          </div>

          <div class="text-center">
            <div class="text-4xl mb-4">&#x1F517;</div>
            <h3 class="text-lg font-semibold mb-2">Partage simplifie</h3>
            <p class="text-gray-600">
              Un code a 5 caracteres suffit pour rejoindre un quiz
            </p>
          </div>

          <div class="text-center">
            <div class="text-4xl mb-4">&#x1F4CA;</div>
            <h3 class="text-lg font-semibold mb-2">Resultats detailles</h3>
            <p class="text-gray-600">
              Suivez les performances de vos eleves en temps reel
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
