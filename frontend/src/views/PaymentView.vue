<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

async function startCheckout() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/payment/create-checkout')

    // Redirect to Stripe Checkout
    if (response.data.data.url) {
      window.location.href = response.data.data.url
    }
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la creation du paiement'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="card text-center">
        <div class="text-5xl mb-4">&#x2B50;</div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Passer Premium</h1>

        <p class="text-gray-600 mb-6">Debloquez toutes les fonctionnalites de QuizMaster</p>

        <!-- Current status -->
        <div class="bg-gray-100 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-500 mb-2">Votre forfait actuel</p>
          <p class="text-lg font-semibold">
            {{ authStore.isPremium ? 'Premium' : 'Gratuit' }}
          </p>
        </div>

        <!-- Already premium -->
        <div v-if="authStore.isPremium" class="text-center">
          <p class="text-green-600 mb-4">Vous etes deja membre Premium !</p>
          <router-link to="/dashboard" class="btn btn-primary">
            Retour au tableau de bord
          </router-link>
        </div>

        <!-- Upgrade offer -->
        <template v-else>
          <div class="border-2 border-primary-200 rounded-xl p-6 mb-6">
            <h2 class="text-xl font-bold text-primary-600 mb-4">Forfait Premium</h2>

            <div class="text-4xl font-bold text-gray-900 mb-4">
              9.99 EUR
              <span class="text-base font-normal text-gray-500">/ unique</span>
            </div>

            <ul class="text-left space-y-3 mb-6">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">&#x2713;</span>
                Jusqu'a 20 quiz
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">&#x2713;</span>
                Questions illimitees par quiz
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">&#x2713;</span>
                Acces aux resultats detailles
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">&#x2713;</span>
                Support prioritaire
              </li>
            </ul>

            <button :disabled="loading" class="btn btn-primary w-full py-3" @click="startCheckout">
              {{ loading ? 'Redirection...' : 'Passer Premium' }}
            </button>

            <p v-if="error" class="error-text mt-2">{{ error }}</p>
          </div>

          <p class="text-xs text-gray-500">
            Paiement securise par Stripe. Paiement unique, pas d'abonnement.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
