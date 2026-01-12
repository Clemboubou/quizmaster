/**
 * Service Admin - Appels API pour l'administration
 */

import api from './api'

export const adminService = {
  // Dashboard
  async getDashboard() {
    const response = await api.get('/admin/dashboard')
    return response.data.data
  },

  // Utilisateurs
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params })
    return response.data.data
  },

  async getUserById(id) {
    const response = await api.get(`/admin/users/${id}`)
    return response.data.data
  },

  async createUser(userData) {
    const response = await api.post('/admin/users', userData)
    return response.data.data
  },

  async updateUser(id, userData) {
    const response = await api.put(`/admin/users/${id}`, userData)
    return response.data.data
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data.data
  },

  // Logs
  async getLogs(params = {}) {
    const response = await api.get('/admin/logs', { params })
    return response.data.data
  },

  async getLogsStats() {
    const response = await api.get('/admin/logs/stats')
    return response.data.data
  }
}

export default adminService
