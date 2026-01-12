<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600">QuizMaster</router-link>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="text-gray-600 hover:text-primary-600">
              Tableau de bord
            </router-link>

            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="text-red-600 hover:text-red-700 font-medium"
            >
              Admin
            </router-link>

            <span class="text-sm text-gray-500">
              {{ authStore.user?.email }}
            </span>

            <span
              v-if="authStore.isAdmin"
              class="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full"
            >
              Admin
            </span>

            <span
              v-else-if="authStore.isProf"
              :class="
                authStore.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              "
              class="px-2 py-1 text-xs rounded-full"
            >
              {{ authStore.isPremium ? 'Premium' : 'Gratuit' }}
            </span>

            <button class="btn btn-secondary text-sm" @click="handleLogout">Deconnexion</button>
          </template>

          <template v-else>
            <router-link to="/auth" class="btn btn-primary">Connexion</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
