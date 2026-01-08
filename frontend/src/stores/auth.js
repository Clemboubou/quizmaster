import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isProf = computed(() => user.value?.role === 'prof')
  const isEleve = computed(() => user.value?.role === 'eleve')
  const isPremium = computed(() => user.value?.is_premium === 1 || user.value?.is_premium === true)

  // Actions
  async function register(email, password, role) {
    const response = await api.post('/auth/register', { email, password, role })
    token.value = response.data.data.token
    user.value = response.data.data.user
    localStorage.setItem('token', token.value)
    return response.data
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.data.token
    user.value = response.data.data.user
    localStorage.setItem('token', token.value)
    return response.data
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.data
    } catch (error) {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // Initialiser l'utilisateur si un token existe
  if (token.value) {
    fetchUser()
  }

  return {
    user,
    token,
    isAuthenticated,
    isProf,
    isEleve,
    isPremium,
    register,
    login,
    fetchUser,
    logout
  }
})
