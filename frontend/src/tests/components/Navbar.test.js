/**
 * Tests du composant Navbar
 *
 * Ce composant affiche la barre de navigation avec :
 * - Logo QuizMaster
 * - Liens de navigation
 * - Info utilisateur et deconnexion (si connecte)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import Navbar from '../../components/Navbar.vue'
import { useAuthStore } from '../../stores/auth'

// Configuration du router pour les tests
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/auth', component: { template: '<div>Auth</div>' } },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
  ]
})

describe('Navbar', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
  })

  // ============================================
  // Tests du rendu de base
  // ============================================
  describe('Rendu de base', () => {
    it('devrait afficher le logo QuizMaster', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('QuizMaster')
    })

    it("devrait avoir un lien vers l'accueil sur le logo", () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      const logo = wrapper.find('a')
      expect(logo.attributes('href')).toBe('/')
    })
  })

  // ============================================
  // Tests pour utilisateur non connecte
  // ============================================
  describe('Utilisateur non connecte', () => {
    it('devrait afficher le bouton Connexion', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Connexion')
    })

    it('devrait avoir un lien vers /auth', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      const authLink = wrapper.findAll('a').find(a => a.text().includes('Connexion'))
      expect(authLink.attributes('href')).toBe('/auth')
    })

    it('ne devrait pas afficher le bouton Deconnexion', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('Deconnexion')
    })

    it('ne devrait pas afficher le lien Tableau de bord', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('Tableau de bord')
    })
  })

  // ============================================
  // Tests pour utilisateur connecte
  // ============================================
  describe('Utilisateur connecte', () => {
    beforeEach(() => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'test@example.com',
        role: 'prof',
        is_premium: false
      }
    })

    it('devrait afficher le lien Tableau de bord', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Tableau de bord')
    })

    it("devrait afficher l'email de l'utilisateur", () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('test@example.com')
    })

    it('devrait afficher le bouton Deconnexion', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Deconnexion')
    })

    it('ne devrait pas afficher le bouton Connexion', () => {
      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('Connexion')
    })
  })

  // ============================================
  // Tests du badge Premium/Gratuit
  // ============================================
  describe('Badge Premium/Gratuit', () => {
    it('devrait afficher "Gratuit" pour un prof non premium', () => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'prof@test.com',
        role: 'prof',
        is_premium: false
      }

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Gratuit')
    })

    it('devrait afficher "Premium" pour un prof premium', () => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'prof@test.com',
        role: 'prof',
        is_premium: true
      }

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Premium')
    })

    it('ne devrait pas afficher de badge pour un eleve', () => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'eleve@test.com',
        role: 'eleve',
        is_premium: false
      }

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('Gratuit')
      expect(wrapper.text()).not.toContain('Premium')
    })

    it('devrait avoir un style jaune pour Premium', () => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'prof@test.com',
        role: 'prof',
        is_premium: true
      }

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      const badge = wrapper.find('.bg-yellow-100')
      expect(badge.exists()).toBe(true)
    })

    it('devrait avoir un style gris pour Gratuit', () => {
      authStore.token = 'test-token'
      authStore.user = {
        id: 1,
        email: 'prof@test.com',
        role: 'prof',
        is_premium: false
      }

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      const badge = wrapper.find('.bg-gray-100')
      expect(badge.exists()).toBe(true)
    })
  })

  // ============================================
  // Tests de la deconnexion
  // ============================================
  describe('Deconnexion', () => {
    it('devrait appeler logout au clic sur Deconnexion', async () => {
      authStore.token = 'test-token'
      authStore.user = { id: 1, email: 'test@test.com', role: 'prof' }

      const logoutSpy = vi.spyOn(authStore, 'logout')

      const wrapper = mount(Navbar, {
        global: { plugins: [router] }
      })

      const logoutButton = wrapper.find('button')
      await logoutButton.trigger('click')

      expect(logoutSpy).toHaveBeenCalled()
    })
  })
})
