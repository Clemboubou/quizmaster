/**
 * Tests unitaires pour le store quiz (Pinia)
 *
 * Ces tests verifient le fonctionnement du store quiz :
 * - Etat initial
 * - Actions CRUD quiz
 * - Actions questions
 * - Actions resultats
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '../stores/quiz'

// Mock du module API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import api from '../services/api'

describe('Quiz Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useQuizStore()
    vi.clearAllMocks()
  })

  // ============================================
  // Tests de l'etat initial
  // ============================================
  describe('Etat initial', () => {
    it('devrait avoir quizzes comme tableau vide', () => {
      expect(store.quizzes).toEqual([])
    })

    it('devrait avoir currentQuiz a null', () => {
      expect(store.currentQuiz).toBeNull()
    })

    it('devrait avoir questions comme tableau vide', () => {
      expect(store.questions).toEqual([])
    })

    it('devrait avoir results comme tableau vide', () => {
      expect(store.results).toEqual([])
    })

    it('devrait avoir loading a false', () => {
      expect(store.loading).toBe(false)
    })

    it('devrait avoir error a null', () => {
      expect(store.error).toBeNull()
    })
  })

  // ============================================
  // Tests des actions Quiz
  // ============================================
  describe('Action fetchQuizzes', () => {
    it('devrait recuperer la liste des quiz', async () => {
      const mockQuizzes = [
        { id: 1, title: 'Quiz 1', access_code: 'ABC12' },
        { id: 2, title: 'Quiz 2', access_code: 'XYZ99' }
      ]

      api.get.mockResolvedValue({ data: { success: true, data: mockQuizzes } })

      await store.fetchQuizzes()

      expect(api.get).toHaveBeenCalledWith('/quizzes')
      expect(store.quizzes).toEqual(mockQuizzes)
      expect(store.quizzes.length).toBe(2)
    })

    it('devrait gerer les erreurs', async () => {
      api.get.mockRejectedValue({
        response: { data: { error: { message: 'Erreur serveur' } } }
      })

      await store.fetchQuizzes()

      expect(store.error).toBe('Erreur serveur')
    })
  })

  describe('Action createQuiz', () => {
    it('devrait creer un nouveau quiz', async () => {
      const newQuiz = { id: 1, title: 'Mon Quiz', access_code: 'NEW01' }

      api.post.mockResolvedValue({ data: { success: true, data: newQuiz } })

      const result = await store.createQuiz('Mon Quiz')

      expect(api.post).toHaveBeenCalledWith('/quizzes', { title: 'Mon Quiz' })
      expect(store.quizzes).toContainEqual(newQuiz)
      expect(result).toEqual(newQuiz)
    })

    it('devrait ajouter le quiz en debut de liste', async () => {
      store.quizzes = [{ id: 1, title: 'Ancien Quiz' }]
      const newQuiz = { id: 2, title: 'Nouveau Quiz', access_code: 'NEW02' }

      api.post.mockResolvedValue({ data: { success: true, data: newQuiz } })

      await store.createQuiz('Nouveau Quiz')

      expect(store.quizzes[0]).toEqual(newQuiz)
      expect(store.quizzes.length).toBe(2)
    })
  })

  describe('Action updateQuiz', () => {
    it('devrait mettre a jour un quiz existant', async () => {
      store.quizzes = [{ id: 1, title: 'Ancien titre', access_code: 'ABC12' }]

      const updatedQuiz = { id: 1, title: 'Nouveau titre', access_code: 'ABC12' }
      api.put.mockResolvedValue({ data: { success: true, data: updatedQuiz } })

      await store.updateQuiz(1, 'Nouveau titre')

      expect(api.put).toHaveBeenCalledWith('/quizzes/1', { title: 'Nouveau titre' })
      expect(store.quizzes[0].title).toBe('Nouveau titre')
    })
  })

  describe('Action deleteQuiz', () => {
    it('devrait supprimer un quiz', async () => {
      store.quizzes = [
        { id: 1, title: 'Quiz 1' },
        { id: 2, title: 'Quiz 2' }
      ]

      api.delete.mockResolvedValue({ data: { success: true } })

      await store.deleteQuiz(1)

      expect(api.delete).toHaveBeenCalledWith('/quizzes/1')
      expect(store.quizzes.length).toBe(1)
      expect(store.quizzes[0].id).toBe(2)
    })
  })

  describe('Action joinQuiz', () => {
    it('devrait rejoindre un quiz avec un code', async () => {
      const quiz = { id: 1, title: 'Quiz Test', access_code: 'TEST1' }

      api.get.mockResolvedValue({ data: { success: true, data: quiz } })

      const result = await store.joinQuiz('TEST1')

      expect(api.get).toHaveBeenCalledWith('/quizzes/join/TEST1')
      expect(store.currentQuiz).toEqual(quiz)
      expect(result).toEqual(quiz)
    })

    it('devrait gerer un code invalide', async () => {
      api.get.mockRejectedValue({
        response: { data: { error: { message: 'Code invalide' } } }
      })

      await expect(store.joinQuiz('WRONG')).rejects.toBeDefined()
      expect(store.error).toBe('Code invalide')
    })
  })

  // ============================================
  // Tests des actions Questions
  // ============================================
  describe('Action fetchQuestions', () => {
    it("devrait recuperer les questions d'un quiz", async () => {
      const mockQuestions = [
        { id: 1, question_text: 'Question 1', type: 'qcm' },
        { id: 2, question_text: 'Question 2', type: 'vf' }
      ]

      api.get.mockResolvedValue({ data: { success: true, data: mockQuestions } })

      await store.fetchQuestions(1)

      expect(api.get).toHaveBeenCalledWith('/questions/quiz/1')
      expect(store.questions).toEqual(mockQuestions)
    })
  })

  describe('Action fetchQuestionsForPlay', () => {
    it('devrait recuperer les questions pour jouer', async () => {
      const mockQuestions = [{ id: 1, question_text: 'Question 1', options: ['A', 'B', 'C', 'D'] }]

      api.get.mockResolvedValue({ data: { success: true, data: mockQuestions } })

      await store.fetchQuestionsForPlay(1)

      expect(api.get).toHaveBeenCalledWith('/questions/play/1')
      expect(store.questions).toEqual(mockQuestions)
    })
  })

  describe('Action createQuestion', () => {
    it('devrait creer une nouvelle question', async () => {
      const newQuestion = {
        id: 1,
        quiz_id: 1,
        type: 'qcm',
        question_text: 'Nouvelle question ?',
        options: ['A', 'B', 'C', 'D'],
        correct_answer: 'A'
      }

      api.post.mockResolvedValue({ data: { success: true, data: newQuestion } })

      const result = await store.createQuestion({
        quiz_id: 1,
        type: 'qcm',
        question_text: 'Nouvelle question ?',
        options: ['A', 'B', 'C', 'D'],
        correct_answer: 'A'
      })

      expect(api.post).toHaveBeenCalledWith('/questions', expect.any(Object))
      expect(store.questions).toContainEqual(newQuestion)
      expect(result).toEqual(newQuestion)
    })
  })

  describe('Action deleteQuestion', () => {
    it('devrait supprimer une question', async () => {
      store.questions = [
        { id: 1, question_text: 'Q1' },
        { id: 2, question_text: 'Q2' }
      ]

      api.delete.mockResolvedValue({ data: { success: true } })

      await store.deleteQuestion(1)

      expect(api.delete).toHaveBeenCalledWith('/questions/1')
      expect(store.questions.length).toBe(1)
      expect(store.questions[0].id).toBe(2)
    })
  })

  // ============================================
  // Tests des actions Resultats
  // ============================================
  describe('Action submitResult', () => {
    it('devrait soumettre un resultat avec score et reponses', async () => {
      const mockResult = { id: 1, quiz_id: 1, score: 8 }
      const answers = [
        { question_id: 1, user_answer: 'A', is_correct: true },
        { question_id: 2, user_answer: 'B', is_correct: false }
      ]

      api.post.mockResolvedValue({ data: { success: true, data: mockResult } })

      const result = await store.submitResult(1, 8, answers)

      expect(api.post).toHaveBeenCalledWith('/results', {
        quiz_id: 1,
        score: 8,
        answers
      })
      expect(result).toEqual(mockResult)
    })

    it('devrait soumettre un resultat sans reponses detaillees', async () => {
      const mockResult = { id: 1, quiz_id: 1, score: 5 }

      api.post.mockResolvedValue({ data: { success: true, data: mockResult } })

      await store.submitResult(1, 5)

      expect(api.post).toHaveBeenCalledWith('/results', {
        quiz_id: 1,
        score: 5,
        answers: []
      })
    })
  })

  describe('Action fetchMyResults', () => {
    it('devrait recuperer mes resultats', async () => {
      const mockResults = [
        { id: 1, quiz_title: 'Quiz 1', score: 8, total_questions: 10 },
        { id: 2, quiz_title: 'Quiz 2', score: 5, total_questions: 5 }
      ]

      api.get.mockResolvedValue({ data: { success: true, data: mockResults } })

      await store.fetchMyResults()

      expect(api.get).toHaveBeenCalledWith('/results/me')
      expect(store.results).toEqual(mockResults)
    })
  })

  describe('Action fetchQuizResults', () => {
    it("devrait recuperer les resultats d'un quiz (prof)", async () => {
      const mockResults = [
        { id: 1, student_email: 'eleve1@test.com', score: 8 },
        { id: 2, student_email: 'eleve2@test.com', score: 6 }
      ]

      api.get.mockResolvedValue({ data: { success: true, data: mockResults } })

      await store.fetchQuizResults(1)

      expect(api.get).toHaveBeenCalledWith('/results/quiz/1')
      expect(store.quizResults).toEqual(mockResults)
    })
  })

  // ============================================
  // Tests utilitaires
  // ============================================
  describe('Action clearCurrentQuiz', () => {
    it('devrait reinitialiser le quiz courant et les questions', () => {
      store.currentQuiz = { id: 1, title: 'Test' }
      store.questions = [{ id: 1 }, { id: 2 }]

      store.clearCurrentQuiz()

      expect(store.currentQuiz).toBeNull()
      expect(store.questions).toEqual([])
    })
  })
})
