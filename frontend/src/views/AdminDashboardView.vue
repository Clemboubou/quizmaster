<script setup>
import { ref, onMounted } from 'vue'
import adminService from '../services/admin'

// State
const loading = ref(true)
const activeTab = ref('dashboard')
const error = ref('')

// Dashboard data
const dashboardData = ref(null)

// Users data
const users = ref([])
const usersPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })
const usersFilters = ref({ role: '', search: '', is_active: '' })
const loadingUsers = ref(false)
const selectedUser = ref(null)
const userDetails = ref(null)
const showUserModal = ref(false)
const showCreateModal = ref(false)
const newUser = ref({ email: '', password: '', role: 'eleve' })
const savingUser = ref(false)

// Logs data
const logs = ref([])
const logsPagination = ref({ page: 1, limit: 50, total: 0, totalPages: 0 })
const logsFilters = ref({ action: '', user_id: '', start_date: '', end_date: '' })
const loadingLogs = ref(false)

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load dashboard
async function loadDashboard() {
  try {
    dashboardData.value = await adminService.getDashboard()
  } catch (err) {
    error.value = 'Erreur lors du chargement du dashboard'
  }
}

// Load users
async function loadUsers() {
  loadingUsers.value = true
  try {
    const params = {
      page: usersPagination.value.page,
      limit: usersPagination.value.limit,
      ...usersFilters.value
    }
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') delete params[key]
    })
    const result = await adminService.getUsers(params)
    users.value = result.users
    usersPagination.value = result.pagination
  } catch (err) {
    error.value = 'Erreur lors du chargement des utilisateurs'
  } finally {
    loadingUsers.value = false
  }
}

// View user details
async function viewUser(user) {
  selectedUser.value = user
  showUserModal.value = true
  try {
    userDetails.value = await adminService.getUserById(user.id)
  } catch (err) {
    alert('Erreur lors du chargement des details')
  }
}

// Update user
async function updateUserField(field, value) {
  if (!selectedUser.value) return
  savingUser.value = true
  try {
    await adminService.updateUser(selectedUser.value.id, { [field]: value })
    // Refresh user details
    userDetails.value = await adminService.getUserById(selectedUser.value.id)
    // Refresh list
    await loadUsers()
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur lors de la mise a jour')
  } finally {
    savingUser.value = false
  }
}

// Delete user
async function deleteUser(userId) {
  if (!confirm('Supprimer cet utilisateur ? Cette action est irreversible.')) return
  try {
    await adminService.deleteUser(userId)
    showUserModal.value = false
    selectedUser.value = null
    userDetails.value = null
    await loadUsers()
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur lors de la suppression')
  }
}

// Create user
async function createUser() {
  if (!newUser.value.email || !newUser.value.password) {
    alert('Email et mot de passe requis')
    return
  }
  savingUser.value = true
  try {
    await adminService.createUser(newUser.value)
    showCreateModal.value = false
    newUser.value = { email: '', password: '', role: 'eleve' }
    await loadUsers()
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur lors de la creation')
  } finally {
    savingUser.value = false
  }
}

// Load logs
async function loadLogs() {
  loadingLogs.value = true
  try {
    const params = {
      page: logsPagination.value.page,
      limit: logsPagination.value.limit,
      ...logsFilters.value
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '') delete params[key]
    })
    const result = await adminService.getLogs(params)
    logs.value = result.logs
    logsPagination.value = result.pagination
  } catch (err) {
    error.value = 'Erreur lors du chargement des logs'
  } finally {
    loadingLogs.value = false
  }
}

// Tab change handler
function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'users' && users.value.length === 0) {
    loadUsers()
  } else if (tab === 'logs' && logs.value.length === 0) {
    loadLogs()
  }
}

// Role badge color
function getRoleBadge(role) {
  const badges = {
    admin: 'bg-red-100 text-red-800',
    prof: 'bg-blue-100 text-blue-800',
    eleve: 'bg-green-100 text-green-800'
  }
  return badges[role] || 'bg-gray-100 text-gray-800'
}

// Action badge color
function getActionBadge(action) {
  if (action.includes('DELETE') || action.includes('FAILED')) {
    return 'bg-red-100 text-red-800'
  }
  if (action.includes('CREATE') || action.includes('REGISTER')) {
    return 'bg-green-100 text-green-800'
  }
  if (action.includes('UPDATE') || action.includes('CHANGE')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  return 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  try {
    await loadDashboard()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Administration</h1>
      <p class="text-gray-600 mt-1">Gerez les utilisateurs et consultez les logs systeme</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <template v-else>
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            @click="switchTab('dashboard')"
          >
            Dashboard
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            @click="switchTab('users')"
          >
            Utilisateurs
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="
              activeTab === 'logs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            @click="switchTab('logs')"
          >
            Logs
          </button>
        </nav>
      </div>

      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Stats Cards -->
        <div v-if="dashboardData" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="card text-center">
            <div class="text-3xl font-bold text-primary-600">
              {{ dashboardData.users?.total || 0 }}
            </div>
            <div class="text-sm text-gray-500">Utilisateurs</div>
            <div class="text-xs text-gray-400 mt-1">
              +{{ dashboardData.users?.new_this_week || 0 }} cette semaine
            </div>
          </div>
          <div class="card text-center">
            <div class="text-3xl font-bold text-blue-600">
              {{ dashboardData.quizzes?.total || 0 }}
            </div>
            <div class="text-sm text-gray-500">Quiz</div>
            <div class="text-xs text-gray-400 mt-1">
              +{{ dashboardData.quizzes?.new_this_week || 0 }} cette semaine
            </div>
          </div>
          <div class="card text-center">
            <div class="text-3xl font-bold text-green-600">
              {{ dashboardData.results?.total || 0 }}
            </div>
            <div class="text-sm text-gray-500">Parties jouees</div>
            <div class="text-xs text-gray-400 mt-1">
              Moy: {{ dashboardData.results?.avg_score || 0 }} pts
            </div>
          </div>
          <div class="card text-center">
            <div class="text-3xl font-bold text-yellow-600">
              {{ ((dashboardData.payments?.total_revenue || 0) / 100).toFixed(0) }} EUR
            </div>
            <div class="text-sm text-gray-500">Revenus</div>
            <div class="text-xs text-gray-400 mt-1">
              {{ dashboardData.users?.premium || 0 }} premium
            </div>
          </div>
        </div>

        <!-- User breakdown -->
        <div v-if="dashboardData" class="card">
          <h3 class="font-semibold mb-4">Repartition des utilisateurs</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-xl font-bold text-blue-600">
                {{ dashboardData.users?.profs || 0 }}
              </div>
              <div class="text-sm text-gray-600">Professeurs</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-xl font-bold text-green-600">
                {{ dashboardData.users?.eleves || 0 }}
              </div>
              <div class="text-sm text-gray-600">Eleves</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
              <div class="text-xl font-bold text-red-600">
                {{ dashboardData.users?.admins || 0 }}
              </div>
              <div class="text-sm text-gray-600">Admins</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-xl font-bold text-yellow-600">
                {{ dashboardData.users?.premium || 0 }}
              </div>
              <div class="text-sm text-gray-600">Premium</div>
            </div>
            <div class="text-center p-3 bg-gray-100 rounded-lg">
              <div class="text-xl font-bold text-gray-600">
                {{ dashboardData.users?.inactive || 0 }}
              </div>
              <div class="text-sm text-gray-600">Inactifs</div>
            </div>
          </div>
        </div>

        <!-- Recent Logs -->
        <div v-if="dashboardData?.recentLogs" class="card">
          <h3 class="font-semibold mb-4">Dernieres activites</h3>
          <div class="space-y-2">
            <div
              v-for="log in dashboardData.recentLogs"
              :key="log.id"
              class="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div class="flex items-center space-x-3">
                <span :class="getActionBadge(log.action)" class="px-2 py-1 text-xs rounded-full">
                  {{ log.action }}
                </span>
                <span class="text-sm text-gray-600">{{ log.user_email || 'Anonyme' }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ formatDate(log.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <!-- Filters -->
        <div class="card">
          <div class="flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <input
                v-model="usersFilters.search"
                type="text"
                placeholder="Email..."
                class="input"
                @keyup.enter="loadUsers"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="usersFilters.role" class="input" @change="loadUsers">
                <option value="">Tous</option>
                <option value="prof">Professeur</option>
                <option value="eleve">Eleve</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select v-model="usersFilters.is_active" class="input" @change="loadUsers">
                <option value="">Tous</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>
            </div>
            <button class="btn btn-primary" @click="loadUsers">Filtrer</button>
            <button class="btn btn-secondary" @click="showCreateModal = true">+ Creer</button>
          </div>
        </div>

        <!-- Users List -->
        <div class="card overflow-hidden">
          <div v-if="loadingUsers" class="text-center py-8">
            <p class="text-gray-500">Chargement...</p>
          </div>

          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Premium
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actif
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Inscription
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stats
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadge(user.role)" class="px-2 py-1 text-xs rounded-full">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.is_premium" class="text-yellow-500">Oui</span>
                  <span v-else class="text-gray-400">Non</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.is_active" class="text-green-500">Actif</span>
                  <span v-else class="text-red-500">Inactif</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="user.quiz_count !== undefined">{{ user.quiz_count }} quiz</span>
                  <span v-else-if="user.result_count !== undefined">
                    {{ user.result_count }} parties
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button class="text-primary-600 hover:text-primary-800" @click="viewUser(user)">
                    Voir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div
            v-if="usersPagination.totalPages > 1"
            class="px-6 py-4 border-t flex items-center justify-between"
          >
            <span class="text-sm text-gray-500">{{ usersPagination.total }} utilisateurs</span>
            <div class="flex space-x-2">
              <button
                class="btn btn-secondary text-sm"
                :disabled="usersPagination.page <= 1"
                @click="
                  usersPagination.page--
                  loadUsers()
                "
              >
                Precedent
              </button>
              <span class="px-3 py-2 text-sm">
                {{ usersPagination.page }} / {{ usersPagination.totalPages }}
              </span>
              <button
                class="btn btn-secondary text-sm"
                :disabled="usersPagination.page >= usersPagination.totalPages"
                @click="
                  usersPagination.page++
                  loadUsers()
                "
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Tab -->
      <div v-if="activeTab === 'logs'" class="space-y-6">
        <!-- Filters -->
        <div class="card">
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select v-model="logsFilters.action" class="input" @change="loadLogs">
                <option value="">Toutes</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGIN_FAILED">LOGIN_FAILED</option>
                <option value="REGISTER">REGISTER</option>
                <option value="QUIZ_CREATED">QUIZ_CREATED</option>
                <option value="QUIZ_DELETED">QUIZ_DELETED</option>
                <option value="USER_CREATED">USER_CREATED</option>
                <option value="USER_UPDATED">USER_UPDATED</option>
                <option value="USER_DELETED">USER_DELETED</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date debut</label>
              <input v-model="logsFilters.start_date" type="date" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input v-model="logsFilters.end_date" type="date" class="input" />
            </div>
            <button class="btn btn-primary" @click="loadLogs">Filtrer</button>
          </div>
        </div>

        <!-- Logs List -->
        <div class="card overflow-hidden">
          <div v-if="loadingLogs" class="text-center py-8">
            <p class="text-gray-500">Chargement...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utilisateur
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cible
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(log.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getActionBadge(log.action)"
                      class="px-2 py-1 text-xs rounded-full"
                    >
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ log.user_email || 'Anonyme' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="log.target_type">{{ log.target_type }} #{{ log.target_id }}</span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ log.ip_address || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ log.details ? JSON.stringify(log.details) : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="logsPagination.totalPages > 1"
            class="px-6 py-4 border-t flex items-center justify-between"
          >
            <span class="text-sm text-gray-500">{{ logsPagination.total }} logs</span>
            <div class="flex space-x-2">
              <button
                class="btn btn-secondary text-sm"
                :disabled="logsPagination.page <= 1"
                @click="
                  logsPagination.page--
                  loadLogs()
                "
              >
                Precedent
              </button>
              <span class="px-3 py-2 text-sm">
                {{ logsPagination.page }} / {{ logsPagination.totalPages }}
              </span>
              <button
                class="btn btn-secondary text-sm"
                :disabled="logsPagination.page >= logsPagination.totalPages"
                @click="
                  logsPagination.page++
                  loadLogs()
                "
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- User Details Modal -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showUserModal = false"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">Details utilisateur</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showUserModal = false">
            X
          </button>
        </div>

        <div v-if="userDetails">
          <!-- User Info -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ userDetails.user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Inscription</label>
              <p class="text-gray-900">{{ formatDate(userDetails.user.created_at) }}</p>
            </div>
          </div>

          <!-- Role -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-500 mb-2">Role</label>
            <div class="flex space-x-2">
              <button
                v-for="role in ['eleve', 'prof', 'admin']"
                :key="role"
                :class="
                  userDetails.user.role === role
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg text-sm font-medium"
                :disabled="savingUser"
                @click="updateUserField('role', role)"
              >
                {{ role }}
              </button>
            </div>
          </div>

          <!-- Premium & Active toggles -->
          <div class="flex space-x-6 mb-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="userDetails.user.is_premium"
                :disabled="savingUser"
                class="form-checkbox h-5 w-5 text-primary-600 rounded"
                @change="updateUserField('is_premium', $event.target.checked)"
              />
              <span class="text-gray-700">Premium</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="userDetails.user.is_active"
                :disabled="savingUser"
                class="form-checkbox h-5 w-5 text-primary-600 rounded"
                @change="updateUserField('is_active', $event.target.checked)"
              />
              <span class="text-gray-700">Actif</span>
            </label>
          </div>

          <!-- Quizzes (for profs) -->
          <div v-if="userDetails.quizzes?.length > 0" class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">Quiz ({{ userDetails.quizzes.length }})</h4>
            <div class="space-y-2">
              <div
                v-for="quiz in userDetails.quizzes"
                :key="quiz.id"
                class="p-3 bg-gray-50 rounded-lg flex justify-between"
              >
                <span>{{ quiz.title }}</span>
                <span class="text-sm text-gray-500">{{ quiz.question_count }} questions</span>
              </div>
            </div>
          </div>

          <!-- Results (for eleves) -->
          <div v-if="userDetails.results?.length > 0" class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">
              Resultats ({{ userDetails.results.length }})
            </h4>
            <div class="space-y-2">
              <div
                v-for="result in userDetails.results"
                :key="result.id"
                class="p-3 bg-gray-50 rounded-lg flex justify-between"
              >
                <span>{{ result.quiz_title }}</span>
                <span class="text-sm text-gray-500">{{ result.score }} pts</span>
              </div>
            </div>
          </div>

          <!-- Recent logs -->
          <div v-if="userDetails.logs?.length > 0" class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">Activite recente</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <div
                v-for="log in userDetails.logs"
                :key="log.id"
                class="flex justify-between items-center py-1 text-sm"
              >
                <span :class="getActionBadge(log.action)" class="px-2 py-1 text-xs rounded-full">
                  {{ log.action }}
                </span>
                <span class="text-gray-400">{{ formatDate(log.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Delete button -->
          <div class="pt-4 border-t flex justify-between">
            <button class="btn btn-secondary" @click="showUserModal = false">Fermer</button>
            <button
              class="btn bg-red-600 text-white hover:bg-red-700"
              @click="deleteUser(userDetails.user.id)"
            >
              Supprimer l'utilisateur
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">Creer un utilisateur</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showCreateModal = false">
            X
          </button>
        </div>

        <form @submit.prevent="createUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="newUser.email" type="email" class="input w-full" required />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              v-model="newUser.password"
              type="password"
              class="input w-full"
              required
              minlength="6"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="newUser.role" class="input w-full">
              <option value="eleve">Eleve</option>
              <option value="prof">Professeur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex space-x-3">
            <button type="button" class="btn btn-secondary flex-1" @click="showCreateModal = false">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary flex-1" :disabled="savingUser">
              {{ savingUser ? 'Creation...' : 'Creer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
