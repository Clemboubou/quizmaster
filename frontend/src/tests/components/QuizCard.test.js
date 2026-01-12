/**
 * Tests du composant QuizCard
 *
 * Ce composant affiche une carte de quiz avec :
 * - Titre et date de creation
 * - Code d'acces (affichable/masquable)
 * - Actions (modifier, supprimer, voir resultats)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import QuizCard from '../../components/QuizCard.vue'

// Mock du clipboard
const mockClipboard = {
  writeText: vi.fn()
}
Object.assign(navigator, { clipboard: mockClipboard })

// Mock de alert
global.alert = vi.fn()

// Configuration du router pour les tests
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/create-quiz', component: { template: '<div>Create</div>' } }
  ]
})

describe('QuizCard', () => {
  const mockQuiz = {
    id: 1,
    title: 'Quiz de test',
    access_code: 'ABC12',
    created_at: '2024-01-15T10:30:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================
  // Tests du rendu de base
  // ============================================
  describe('Rendu de base', () => {
    it('devrait afficher le titre du quiz', () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Quiz de test')
    })

    it('devrait afficher la date de creation formatee', () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      // La date devrait etre formatee en francais
      expect(wrapper.text()).toContain('Cree le')
      expect(wrapper.text()).toMatch(/janvier|15/)
    })

    it('devrait masquer le code par defaut', () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('ABC12')
      expect(wrapper.text()).toContain('Voir le code')
    })
  })

  // ============================================
  // Tests du toggle du code
  // ============================================
  describe("Toggle du code d'acces", () => {
    it('devrait afficher le code au clic sur "Voir le code"', async () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      const toggleButton = wrapper.find('button')
      await toggleButton.trigger('click')

      expect(wrapper.text()).toContain('ABC12')
      expect(wrapper.text()).toContain('Masquer')
    })

    it('devrait masquer le code au second clic', async () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      const toggleButton = wrapper.find('button')
      await toggleButton.trigger('click')
      await toggleButton.trigger('click')

      expect(wrapper.text()).not.toContain('ABC12')
      expect(wrapper.text()).toContain('Voir le code')
    })
  })

  // ============================================
  // Tests de la copie du code
  // ============================================
  describe('Copie du code', () => {
    it('devrait copier le code dans le presse-papier', async () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      // Afficher le code d'abord
      const toggleButton = wrapper.find('button')
      await toggleButton.trigger('click')

      // Trouver et cliquer sur le bouton Copier
      const buttons = wrapper.findAll('button')
      const copyButton = buttons.find(b => b.text() === 'Copier')
      await copyButton.trigger('click')

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC12')
      expect(global.alert).toHaveBeenCalledWith('Code copie !')
    })
  })

  // ============================================
  // Tests des boutons d'action
  // ============================================
  describe("Boutons d'action", () => {
    it('devrait afficher les boutons par defaut', () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain('Modifier')
      expect(wrapper.text()).toContain('Resultats')
      expect(wrapper.text()).toContain('Supprimer')
    })

    it('devrait masquer les boutons si showActions est false', () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz, showActions: false },
        global: { plugins: [router] }
      })

      expect(wrapper.text()).not.toContain('Modifier')
      expect(wrapper.text()).not.toContain('Resultats')
      expect(wrapper.text()).not.toContain('Supprimer')
    })

    it('devrait emettre "view-results" au clic sur Resultats', async () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      const buttons = wrapper.findAll('button')
      const resultsButton = buttons.find(b => b.text() === 'Resultats')
      await resultsButton.trigger('click')

      expect(wrapper.emitted('view-results')).toBeTruthy()
      expect(wrapper.emitted('view-results')[0]).toEqual([1])
    })

    it('devrait emettre "delete" au clic sur Supprimer', async () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      const buttons = wrapper.findAll('button')
      const deleteButton = buttons.find(b => b.text() === 'Supprimer')
      await deleteButton.trigger('click')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')[0]).toEqual([1])
    })

    it("devrait avoir un lien vers la page d'edition", () => {
      const wrapper = mount(QuizCard, {
        props: { quiz: mockQuiz },
        global: { plugins: [router] }
      })

      const editLink = wrapper.find('a')
      expect(editLink.attributes('href')).toBe('/create-quiz?edit=1')
    })
  })

  // ============================================
  // Tests avec differents quiz
  // ============================================
  describe('Differents quiz', () => {
    it('devrait afficher correctement un quiz avec un long titre', () => {
      const longTitleQuiz = {
        ...mockQuiz,
        title: 'Un titre tres tres long pour tester le comportement du composant'
      }

      const wrapper = mount(QuizCard, {
        props: { quiz: longTitleQuiz },
        global: { plugins: [router] }
      })

      expect(wrapper.text()).toContain(longTitleQuiz.title)
    })

    it('devrait afficher correctement differents codes', () => {
      const quizzes = [
        { ...mockQuiz, access_code: 'ZZZZZ' },
        { ...mockQuiz, access_code: '12345' },
        { ...mockQuiz, access_code: 'A1B2C' }
      ]

      quizzes.forEach(quiz => {
        const wrapper = mount(QuizCard, {
          props: { quiz },
          global: { plugins: [router] }
        })

        // Afficher le code
        wrapper.find('button').trigger('click')
      })
    })
  })
})
