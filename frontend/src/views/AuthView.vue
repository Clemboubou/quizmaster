<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validateEmail, validatePassword } from '../utils/validators'
import { useSeo, seoPresets } from '../composables/useSeo'

// SEO : Meta tags pour la page d'authentification
useSeo(seoPresets.auth)

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
  return (
    email.value && password.value && !emailError.value && (isLogin.value || !passwordError.value)
  )
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
  <!--
    ACCESSIBILITE : Formulaire d'authentification accessible
    =========================================================
    Chaque champ a :
    - Un label avec attribut "for" lie a l'id du champ
    - Des attributs aria-describedby pour les messages d'erreur
    - Des attributs aria-invalid pour indiquer l'etat d'erreur
    - role="alert" sur les messages d'erreur pour les annoncer
  -->
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="card">
        <h1 class="text-2xl font-bold text-center text-gray-900 mb-8">
          {{ isLogin ? 'Connexion' : 'Inscription' }}
        </h1>

        <form
          class="space-y-6"
          aria-label="Formulaire d'authentification"
          @submit.prevent="handleSubmit"
        >
          <!--
            CHAMP EMAIL : Liaison label-input
            - for="auth-email" correspond a id="auth-email"
            - aria-describedby pointe vers l'id du message d'erreur
            - aria-invalid indique si le champ est en erreur
          -->
          <div>
            <label for="auth-email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="auth-email"
              v-model="email"
              type="email"
              class="input"
              placeholder="votre@email.com"
              autocomplete="email"
              :aria-describedby="emailError ? 'email-error' : undefined"
              :aria-invalid="!!emailError"
            />
            <p v-if="emailError" id="email-error" role="alert" class="error-text">
              {{ emailError }}
            </p>
          </div>

          <!--
            CHAMP MOT DE PASSE : Meme principe
            autocomplete aide les gestionnaires de mots de passe
          -->
          <div>
            <label for="auth-password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="auth-password"
              v-model="password"
              type="password"
              class="input"
              placeholder="********"
              :autocomplete="isLogin ? 'current-password' : 'new-password'"
              :aria-describedby="passwordError && !isLogin ? 'password-error' : undefined"
              :aria-invalid="!!(passwordError && !isLogin)"
            />
            <p v-if="passwordError && !isLogin" id="password-error" role="alert" class="error-text">
              {{ passwordError }}
            </p>
          </div>

          <!--
            GROUPE RADIO : Role utilisateur
            - fieldset/legend groupent semantiquement les radios
            - Chaque radio a son propre id et label
          -->
          <fieldset v-if="!isLogin" class="border-0 p-0 m-0">
            <legend class="block text-sm font-medium text-gray-700 mb-1">Je suis</legend>
            <div class="flex space-x-4" role="radiogroup">
              <label for="role-eleve" class="flex items-center cursor-pointer">
                <input
                  id="role-eleve"
                  v-model="role"
                  type="radio"
                  value="eleve"
                  name="role"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2">Eleve</span>
              </label>
              <label for="role-prof" class="flex items-center cursor-pointer">
                <input
                  id="role-prof"
                  v-model="role"
                  type="radio"
                  value="prof"
                  name="role"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2">Professeur</span>
              </label>
            </div>
          </fieldset>

          <!-- Message d'erreur global avec role="alert" -->
          <p v-if="error" role="alert" aria-live="assertive" class="error-text text-center">
            {{ error }}
          </p>

          <!--
            BOUTON SUBMIT : Etats accessibles
            - aria-busy indique le chargement
            - aria-disabled indique que le bouton est desactive
          -->
          <button
            type="submit"
            :disabled="!isValid || loading"
            :aria-busy="loading"
            :aria-disabled="!isValid || loading"
            class="btn btn-primary w-full py-3"
            :class="{ 'opacity-50 cursor-not-allowed': !isValid || loading }"
          >
            {{ loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire" }}
          </button>
        </form>

        <!-- Toggle mode - bouton accessible -->
        <div class="mt-6 text-center">
          <button
            type="button"
            class="text-primary-600 hover:text-primary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
            @click="toggleMode"
          >
            {{ isLogin ? "Pas encore de compte ? S'inscrire" : 'Deja un compte ? Se connecter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
