<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const sessionId = route.query.session_id

  if (!sessionId) {
    error.value = 'Session de paiement invalide'
    loading.value = false
    return
  }

  try {
    // Verify payment with backend
    await api.get(`/payment/success?session_id=${sessionId}`)

    // Refresh user data to get updated premium status
    await authStore.fetchUser()

    success.value = true
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la verification du paiement'
  } finally {
    loading.value = false
  }
})

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Loading -->
      <div v-if="loading" class="card text-center">
        <div class="text-5xl mb-4">&#x23F3;</div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">Verification du paiement...</h1>
        <p class="text-gray-600">Veuillez patienter quelques instants</p>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="card text-center">
        <div class="text-6xl mb-4">&#x1F389;</div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Paiement reussi !</h1>

        <p class="text-gray-600 mb-6">
          Bienvenue dans la famille Premium ! Vous pouvez maintenant creer jusqu'a 20 quiz.
        </p>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p class="text-green-700 font-medium">Votre compte a ete mis a jour avec succes</p>
        </div>

        <button @click="goToDashboard" class="btn btn-primary w-full py-3">
          Aller au tableau de bord
        </button>
      </div>

      <!-- Error -->
      <div v-else class="card text-center">
        <div class="text-6xl mb-4">&#x26A0;</div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>

        <p class="text-red-600 mb-6">
          {{ error }}
        </p>

        <div class="space-y-3">
          <router-link to="/payment" class="btn btn-primary w-full">Reessayer</router-link>
          <router-link to="/dashboard" class="btn btn-secondary w-full">
            Retour au tableau de bord
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
