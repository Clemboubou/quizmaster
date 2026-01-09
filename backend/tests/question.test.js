import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import express from 'express'

// Configuration env pour les tests
process.env.JWT_SECRET = 'test_secret_key_for_testing_purposes_only'
process.env.JWT_EXPIRES_IN = '24h'

// Mock du pool
const mockQuery = vi.fn()

// Helper pour generer un token prof
function getProfToken(userId = 1) {
    return jwt.sign({ userId, role: 'prof' }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res
            .status(401)
            .json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token manquant' } })
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token invalide' } })
    }
}

function requireProf(req, res, next) {
    if (req.user.role !== 'prof') {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Acces reserve aux professeurs' }
        })
    }
    next()
}

// Validation question
function validateQuestion(req, res, next) {
    const { quiz_id, type, question_text, options, correct_answer } = req.body
    if (!quiz_id) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'quiz_id requis', field: 'quiz_id' }
        })
    }
    if (!type) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'type requis', field: 'type' }
        })
    }
    if (!['qcm', 'vf'].includes(type)) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'type invalide', field: 'type' }
        })
    }
    if (!question_text) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'question_text requis',
                field: 'question_text'
            }
        })
    }
    if (question_text.length < 10) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'question_text trop court',
                field: 'question_text'
            }
        })
    }
    if (!options || !Array.isArray(options)) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'options requises', field: 'options' }
        })
    }
    if (type === 'qcm' && options.length !== 4) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'QCM: 4 options', field: 'options' }
        })
    }
    if (type === 'vf' && options.length !== 2) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'VF: 2 options', field: 'options' }
        })
    }
    if (!correct_answer) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'correct_answer requis',
                field: 'correct_answer'
            }
        })
    }
    if (!options.includes(correct_answer)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'correct_answer doit etre dans options',
                field: 'correct_answer'
            }
        })
    }
    next()
}

function createTestApp() {
    const app = express()
    app.use(express.json())
    const mockPool = { query: mockQuery }
    const questionRouter = express.Router()

    // GET /api/questions/quiz/:quizId
    questionRouter.get('/quiz/:quizId', authenticateToken, requireProf, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
                [req.params.quizId, req.user.userId]
            )
            if (quizzes.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                })
            }
            const [questions] = await mockPool.query('SELECT * FROM questions WHERE quiz_id = ?', [
                req.params.quizId
            ])
            return res.status(200).json({ success: true, data: questions })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    // POST /api/questions
    questionRouter.post('/', authenticateToken, requireProf, validateQuestion, async (req, res) => {
        try {
            const { quiz_id, type, question_text, options, correct_answer } = req.body
            const [quizzes] = await mockPool.query('SELECT * FROM quizzes WHERE id = ?', [quiz_id])
            if (quizzes.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                })
            }
            if (quizzes[0].user_id !== req.user.userId) {
                return res
                    .status(403)
                    .json({ success: false, error: { code: 'FORBIDDEN', message: 'Non autorise' } })
            }

            const [result] = await mockPool.query('INSERT INTO questions ...', [
                quiz_id,
                type,
                question_text,
                JSON.stringify(options),
                correct_answer
            ])
            const [questions] = await mockPool.query('SELECT * FROM questions WHERE id = ?', [
                result.insertId
            ])
            const question = questions[0]
            question.options = JSON.parse(question.options)
            return res.status(201).json({ success: true, data: question })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    // PUT /api/questions/:id
    questionRouter.put(
        '/:id',
        authenticateToken,
        requireProf,
        validateQuestion,
        async (req, res) => {
            try {
                const { type, question_text, options, correct_answer } = req.body
                const [questions] = await mockPool.query(
                    'SELECT q.*, qz.user_id as quiz_owner_id FROM questions q JOIN quizzes qz ON q.quiz_id = qz.id WHERE q.id = ?',
                    [req.params.id]
                )
                if (questions.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Question non trouvee' }
                    })
                }
                if (questions[0].quiz_owner_id !== req.user.userId) {
                    return res.status(403).json({
                        success: false,
                        error: { code: 'FORBIDDEN', message: 'Non autorise' }
                    })
                }

                await mockPool.query('UPDATE questions ...', [
                    type,
                    question_text,
                    JSON.stringify(options),
                    correct_answer,
                    req.params.id
                ])
                const [updatedQuestions] = await mockPool.query(
                    'SELECT * FROM questions WHERE id = ?',
                    [req.params.id]
                )
                const question = updatedQuestions[0]
                question.options = JSON.parse(question.options)
                return res.status(200).json({ success: true, data: question })
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
            }
        }
    )

    // DELETE /api/questions/:id
    questionRouter.delete('/:id', authenticateToken, requireProf, async (req, res) => {
        try {
            const [questions] = await mockPool.query(
                'SELECT q.*, qz.user_id as quiz_owner_id FROM questions q JOIN quizzes qz ON q.quiz_id = qz.id WHERE q.id = ?',
                [req.params.id]
            )
            if (questions.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Question non trouvee' }
                })
            }
            if (questions[0].quiz_owner_id !== req.user.userId) {
                return res
                    .status(403)
                    .json({ success: false, error: { code: 'FORBIDDEN', message: 'Non autorise' } })
            }

            await mockPool.query('DELETE FROM questions WHERE id = ?', [req.params.id])
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    app.use('/api/questions', questionRouter)
    return app
}

describe('Question API', () => {
    let app

    beforeAll(() => {
        app = createTestApp()
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('GET /api/questions/quiz/:quizId', () => {
        it("devrait retourner les questions d'un quiz", async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[{ id: 1, user_id: 1 }]]).mockResolvedValueOnce([
                [
                    {
                        id: 1,
                        quiz_id: 1,
                        type: 'qcm',
                        question_text: 'Question 1?',
                        options: '["A","B","C","D"]',
                        correct_answer: 'A'
                    },
                    {
                        id: 2,
                        quiz_id: 1,
                        type: 'vf',
                        question_text: 'Question 2?',
                        options: '["Vrai","Faux"]',
                        correct_answer: 'Vrai'
                    }
                ]
            ])

            const res = await request(app)
                .get('/api/questions/quiz/1')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.data).toHaveLength(2)
        })

        it("devrait retourner 404 si le quiz n'existe pas", async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .get('/api/questions/quiz/999')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /api/questions', () => {
        it('devrait creer une question QCM', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1, user_id: 1 }]])
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            quiz_id: 1,
                            type: 'qcm',
                            question_text: 'Quelle est la capitale de la France ?',
                            options: '["Paris","Lyon","Marseille","Bordeaux"]',
                            correct_answer: 'Paris'
                        }
                    ]
                ])

            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: 'Quelle est la capitale de la France ?',
                    options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
                    correct_answer: 'Paris'
                })

            expect(res.status).toBe(201)
            expect(res.body.data.type).toBe('qcm')
            expect(res.body.data.options).toHaveLength(4)
        })

        it('devrait creer une question Vrai/Faux', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1, user_id: 1 }]])
                .mockResolvedValueOnce([{ insertId: 2 }])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 2,
                            quiz_id: 1,
                            type: 'vf',
                            question_text:
                                'La Terre est plate, cette affirmation est-elle correcte ?',
                            options: '["Vrai","Faux"]',
                            correct_answer: 'Faux'
                        }
                    ]
                ])

            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'vf',
                    question_text: 'La Terre est plate, cette affirmation est-elle correcte ?',
                    options: ['Vrai', 'Faux'],
                    correct_answer: 'Faux'
                })

            expect(res.status).toBe(201)
            expect(res.body.data.type).toBe('vf')
            expect(res.body.data.options).toHaveLength(2)
        })

        it('devrait rejeter un QCM sans 4 options', async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: 'Question avec seulement 2 options ?',
                    options: ['A', 'B'],
                    correct_answer: 'A'
                })

            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('options')
        })

        it('devrait rejeter un VF sans 2 options', async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'vf',
                    question_text: 'Question VF avec 4 options ?',
                    options: ['Vrai', 'Faux', 'Peut-etre', 'Jamais'],
                    correct_answer: 'Vrai'
                })

            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('options')
        })

        it("devrait rejeter si la reponse correcte n'est pas dans les options", async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: 'Question avec mauvaise reponse dans le test ?',
                    options: ['A', 'B', 'C', 'D'],
                    correct_answer: 'E'
                })

            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('correct_answer')
        })

        it('devrait rejeter un texte de question trop court', async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: 'Court?',
                    options: ['A', 'B', 'C', 'D'],
                    correct_answer: 'A'
                })

            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('question_text')
        })

        it("devrait rejeter si le quiz n'appartient pas au prof", async () => {
            const token = getProfToken(1)
            mockQuery.mockResolvedValueOnce([[{ id: 1, user_id: 2 }]])

            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: "Question pour un quiz qui ne m'appartient pas ?",
                    options: ['A', 'B', 'C', 'D'],
                    correct_answer: 'A'
                })

            expect(res.status).toBe(403)
        })

        it("devrait rejeter si le quiz n'existe pas", async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 999,
                    type: 'qcm',
                    question_text: 'Question pour un quiz inexistant dans le test ?',
                    options: ['A', 'B', 'C', 'D'],
                    correct_answer: 'A'
                })

            expect(res.status).toBe(404)
        })
    })

    describe('PUT /api/questions/:id', () => {
        it('devrait modifier une question', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1, quiz_id: 1, quiz_owner_id: 1 }]])
                .mockResolvedValueOnce([{}])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            quiz_id: 1,
                            type: 'qcm',
                            question_text: 'Question modifiee dans ce test ?',
                            options: '["A","B","C","D"]',
                            correct_answer: 'B'
                        }
                    ]
                ])

            const res = await request(app)
                .put('/api/questions/1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quiz_id: 1,
                    type: 'qcm',
                    question_text: 'Question modifiee dans ce test ?',
                    options: ['A', 'B', 'C', 'D'],
                    correct_answer: 'B'
                })

            expect(res.status).toBe(200)
            expect(res.body.data.correct_answer).toBe('B')
        })
    })

    describe('DELETE /api/questions/:id', () => {
        it('devrait supprimer une question', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1, quiz_id: 1, quiz_owner_id: 1 }]])
                .mockResolvedValueOnce([{}])

            const res = await request(app)
                .delete('/api/questions/1')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(204)
        })

        it('devrait retourner 404 pour une question inexistante', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .delete('/api/questions/999')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
        })
    })
})
