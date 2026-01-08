<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validateEmail, validatePassword } from '../utils/validators'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const role = ref('eleve')
const loading = ref(false)
const error = ref('')

const emailError = computed(() => {
  if (!email.value) return ''
  return validateEmail(email.value) ? '' : 'Email invalide'
})

const passwordError = computed(() => {
  if (!password.value) return ''
  const result = validatePassword(password.value)
  return result.valid ? '' : result.message
})

const isValid = computed(() => {
  return email.value &&
         password.value &&
         !emailError.value &&
         (isLogin.value || !passwordError.value)
})

async function handleSubmit() {
  if (!isValid.value) return

  loading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value, role.value)
    }

    router.push(authStore.isProf ? '/dashboard' : '/')
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="card">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">
          {{ isLogin ? 'Connexion' : 'Inscription' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              class="input"
              placeholder="votre@email.com"
            />
            <p v-if="emailError" class="error-text">{{ emailError }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="********"
            />
            <p v-if="passwordError && !isLogin" class="error-text">{{ passwordError }}</p>
          </div>

          <!-- Role (inscription only) -->
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Je suis
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="role"
                  value="eleve"
                  class="w-4 h-4 text-primary-600"
                />
                <span class="ml-2">Eleve</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="role"
                  value="prof"
                  class="w-4 h-4 text-primary-600"
                />
                <span class="ml-2">Professeur</span>
              </label>
            </div>
          </div>

          <!-- Error message -->
          <p v-if="error" class="error-text text-center">{{ error }}</p>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="!isValid || loading"
            class="btn btn-primary w-full py-3"
            :class="{ 'opacity-50 cursor-not-allowed': !isValid || loading }"
          >
            {{ loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire') }}
          </button>
        </form>

        <!-- Toggle mode -->
        <div class="mt-6 text-center">
          <button
            @click="toggleMode"
            class="text-primary-600 hover:text-primary-800 text-sm"
          >
            {{ isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Deja un compte ? Se connecter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
