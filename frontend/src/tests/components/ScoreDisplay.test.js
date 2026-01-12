/**
 * Tests du composant ScoreDisplay
 *
 * Ce composant affiche le score final apres un quiz.
 * Il calcule le pourcentage et affiche un message adapte.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoreDisplay from '../../components/ScoreDisplay.vue'

describe('ScoreDisplay', () => {
  // ============================================
  // Tests du rendu de base
  // ============================================
  describe('Rendu de base', () => {
    it('devrait afficher le score correctement', () => {
      const wrapper = mount(ScoreDisplay, {
        props: {
          score: 8,
          total: 10
        }
      })

      expect(wrapper.text()).toContain('8 / 10')
    })

    it('devrait afficher le pourcentage', () => {
      const wrapper = mount(ScoreDisplay, {
        props: {
          score: 8,
          total: 10
        }
      })

      expect(wrapper.text()).toContain('80%')
    })

    it('devrait afficher le titre du quiz si fourni', () => {
      const wrapper = mount(ScoreDisplay, {
        props: {
          score: 5,
          total: 5,
          quizTitle: 'Mon Super Quiz'
        }
      })

      expect(wrapper.text()).toContain('Mon Super Quiz')
    })

    it('ne devrait pas afficher de titre si non fourni', () => {
      const wrapper = mount(ScoreDisplay, {
        props: {
          score: 5,
          total: 5
        }
      })

      // Le titre par defaut est vide, donc pas d'element avec v-if
      const titleElement = wrapper.find('p.text-gray-600')
      expect(titleElement.exists()).toBe(false)
    })
  })

  // ============================================
  // Tests des messages selon le score
  // ============================================
  describe('Messages selon le score', () => {
    it('devrait afficher "Parfait !" pour 100%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 10, total: 10 }
      })

      expect(wrapper.text()).toContain('Parfait !')
    })

    it('devrait afficher "Excellent !" pour 80-99%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 8, total: 10 }
      })

      expect(wrapper.text()).toContain('Excellent !')
    })

    it('devrait afficher "Bien joue !" pour 60-79%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 7, total: 10 }
      })

      expect(wrapper.text()).toContain('Bien joue !')
    })

    it('devrait afficher "Pas mal !" pour 40-59%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 5, total: 10 }
      })

      expect(wrapper.text()).toContain('Pas mal !')
    })

    it('devrait afficher "Continuez vos efforts !" pour moins de 40%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 2, total: 10 }
      })

      expect(wrapper.text()).toContain('Continuez vos efforts !')
    })
  })

  // ============================================
  // Tests des emojis selon le score
  // ============================================
  describe('Emojis selon le score', () => {
    it('devrait afficher le trophee pour 100%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 5, total: 5 }
      })

      expect(wrapper.text()).toContain('🏆')
    })

    it("devrait afficher l'etoile pour 80%+", () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 9, total: 10 }
      })

      expect(wrapper.text()).toContain('🌟')
    })

    it('devrait afficher le pouce pour 60%+', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 6, total: 10 }
      })

      expect(wrapper.text()).toContain('👍')
    })

    it('devrait afficher le muscle pour 40%+', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 4, total: 10 }
      })

      expect(wrapper.text()).toContain('💪')
    })

    it('devrait afficher le livre pour moins de 40%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 1, total: 10 }
      })

      expect(wrapper.text()).toContain('📚')
    })
  })

  // ============================================
  // Tests de la barre de progression
  // ============================================
  describe('Barre de progression', () => {
    it('devrait avoir la bonne largeur selon le pourcentage', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 7, total: 10 }
      })

      const progressBar = wrapper.find('[style*="width"]')
      expect(progressBar.attributes('style')).toContain('width: 70%')
    })

    it('devrait etre verte pour 80%+', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 9, total: 10 }
      })

      const progressBar = wrapper.find('.bg-green-500')
      expect(progressBar.exists()).toBe(true)
    })

    it('devrait etre jaune pour 50-79%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 6, total: 10 }
      })

      const progressBar = wrapper.find('.bg-yellow-500')
      expect(progressBar.exists()).toBe(true)
    })

    it('devrait etre rouge pour moins de 50%', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 3, total: 10 }
      })

      const progressBar = wrapper.find('.bg-red-500')
      expect(progressBar.exists()).toBe(true)
    })
  })

  // ============================================
  // Tests des interactions
  // ============================================
  describe('Interactions', () => {
    it('devrait emettre "back" au clic sur le bouton retour', async () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 5, total: 10 }
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
      expect(wrapper.emitted('back').length).toBe(1)
    })
  })

  // ============================================
  // Tests des cas limites
  // ============================================
  describe('Cas limites', () => {
    it('devrait gerer un score de 0', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 0, total: 10 }
      })

      expect(wrapper.text()).toContain('0 / 10')
      expect(wrapper.text()).toContain('0%')
    })

    it('devrait gerer un total de 1', () => {
      const wrapper = mount(ScoreDisplay, {
        props: { score: 1, total: 1 }
      })

      expect(wrapper.text()).toContain('1 / 1')
      expect(wrapper.text()).toContain('100%')
    })
  })
})
