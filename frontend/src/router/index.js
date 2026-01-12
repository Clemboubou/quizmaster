import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import CreateQuizView from '../views/CreateQuizView.vue'
import PlayQuizView from '../views/PlayQuizView.vue'
import PaymentView from '../views/PaymentView.vue'
import PaymentSuccessView from '../views/PaymentSuccessView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-quiz',
    name: 'create-quiz',
    component: CreateQuizView,
    meta: { requiresAuth: true, role: 'prof' }
  },
  {
    path: '/play',
    name: 'play',
    component: PlayQuizView
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentView,
    meta: { requiresAuth: true, role: 'prof' }
  },
  {
    path: '/payment/success',
    name: 'payment-success',
    component: PaymentSuccessView,
    meta: { requiresAuth: true, role: 'prof' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardView,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Route necessitant authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'auth' })
  }

  // Route reservee aux invites (non connectes)
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // Verification du role
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
