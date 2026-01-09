/**
 * Tests du composant QuestionDisplay
 *
 * Ce composant affiche une question avec ses options
 * et permet a l'utilisateur de selectionner une reponse.
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionDisplay from '../../components/QuestionDisplay.vue'

describe('QuestionDisplay', () => {
  const mockQuestion = {
    id: 1,
    question_text: 'Quelle est la capitale de la France ?',
    type: 'qcm',
    options: ['Londres', 'Paris', 'Berlin', 'Madrid'],
    correct_answer: 'Paris'
  }

  // ============================================
  // Tests du rendu de base
  // ============================================
  describe('Rendu de base', () => {
    it('devrait afficher le texte de la question', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('Quelle est la capitale de la France ?')
    })

    it('devrait afficher le numero de question', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 3,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('Question 3 / 10')
    })

    it('devrait afficher le pourcentage de progression', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 5,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('50%')
    })

    it('devrait afficher toutes les options', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('Londres')
      expect(wrapper.text()).toContain('Paris')
      expect(wrapper.text()).toContain('Berlin')
      expect(wrapper.text()).toContain('Madrid')
    })

    it('devrait afficher les lettres A, B, C, D', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('A.')
      expect(wrapper.text()).toContain('B.')
      expect(wrapper.text()).toContain('C.')
      expect(wrapper.text()).toContain('D.')
    })
  })

  // ============================================
  // Tests de la barre de progression
  // ============================================
  describe('Barre de progression', () => {
    it('devrait avoir la bonne largeur pour la question 1/10', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 10%')
    })

    it('devrait avoir la bonne largeur pour la question 5/10', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 5,
          totalQuestions: 10
        }
      })

      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 50%')
    })

    it('devrait avoir la bonne largeur pour la derniere question', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 10,
          totalQuestions: 10
        }
      })

      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })
  })

  // ============================================
  // Tests de la selection d'options
  // ============================================
  describe("Selection d'options", () => {
    it('devrait permettre de selectionner une option', async () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))
      await options[1].trigger('click') // Click sur "Paris"

      // L'option selectionnee devrait avoir la classe de selection
      expect(options[1].classes()).toContain('border-primary-600')
    })

    it('devrait changer la selection au clic sur une autre option', async () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))

      // Selectionner la premiere option
      await options[0].trigger('click')
      expect(options[0].classes()).toContain('border-primary-600')

      // Selectionner la deuxieme option
      await options[1].trigger('click')
      expect(options[1].classes()).toContain('border-primary-600')
      expect(options[0].classes()).not.toContain('border-primary-600')
    })
  })

  // ============================================
  // Tests du bouton de soumission
  // ============================================
  describe('Bouton de soumission', () => {
    it('devrait etre desactive si aucune option selectionnee', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      const submitButton = wrapper.find('button.btn-primary')
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.classes()).toContain('opacity-50')
    })

    it("devrait etre actif apres selection d'une option", async () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))
      await options[0].trigger('click')

      const submitButton = wrapper.find('button.btn-primary')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    it('devrait afficher "Question suivante" si pas la derniere question', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('Question suivante')
    })

    it('devrait afficher "Terminer" pour la derniere question', () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 10,
          totalQuestions: 10
        }
      })

      expect(wrapper.text()).toContain('Terminer')
    })

    it('devrait emettre "answer" avec la bonne valeur au clic', async () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      // Selectionner "Paris"
      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))
      await options[1].trigger('click')

      // Soumettre
      const submitButton = wrapper.find('button.btn-primary')
      await submitButton.trigger('click')

      expect(wrapper.emitted('answer')).toBeTruthy()
      expect(wrapper.emitted('answer')[0]).toEqual(['Paris'])
    })

    it('devrait reinitialiser la selection apres soumission', async () => {
      const wrapper = mount(QuestionDisplay, {
        props: {
          question: mockQuestion,
          questionNumber: 1,
          totalQuestions: 10
        }
      })

      // Selectionner et soumettre
      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))
      await options[0].trigger('click')

      const submitButton = wrapper.find('button.btn-primary')
      await submitButton.trigger('click')

      // Le bouton devrait etre a nouveau desactive
      expect(submitButton.attributes('disabled')).toBeDefined()
    })
  })

  // ============================================
  // Tests avec options en JSON string
  // ============================================
  describe('Options en JSON string', () => {
    it('devrait parser les options si elles sont en string JSON', () => {
      const questionWithStringOptions = {
        ...mockQuestion,
        options: JSON.stringify(['Option 1', 'Option 2'])
      }

      const wrapper = mount(QuestionDisplay, {
        props: {
          question: questionWithStringOptions,
          questionNumber: 1,
          totalQuestions: 1
        }
      })

      expect(wrapper.text()).toContain('Option 1')
      expect(wrapper.text()).toContain('Option 2')
    })
  })

  // ============================================
  // Tests avec question Vrai/Faux
  // ============================================
  describe('Question Vrai/Faux', () => {
    it('devrait afficher seulement 2 options pour V/F', () => {
      const vfQuestion = {
        id: 2,
        question_text: 'Paris est la capitale de la France',
        type: 'vf',
        options: ['Vrai', 'Faux'],
        correct_answer: 'Vrai'
      }

      const wrapper = mount(QuestionDisplay, {
        props: {
          question: vfQuestion,
          questionNumber: 1,
          totalQuestions: 1
        }
      })

      const options = wrapper.findAll('button').filter(b => b.text().includes('.'))
      expect(options.length).toBe(2)
      expect(wrapper.text()).toContain('Vrai')
      expect(wrapper.text()).toContain('Faux')
    })
  })
})
