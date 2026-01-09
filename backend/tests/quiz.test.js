import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import express from 'express'

// Configuration env pour les tests
process.env.JWT_SECRET = 'test_secret_key_for_testing_purposes_only'
process.env.JWT_EXPIRES_IN = '24h'
process.env.FRONTEND_URL = 'http://localhost:5173'

// Mock du pool de base de donnees
const mockQuery = vi.fn()

// Helper pour generer un token prof
function getProfToken(userId = 1) {
    return jwt.sign({ userId, role: 'prof' }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Helper pour generer un token eleve
function getEleveToken(userId = 2) {
    return jwt.sign({ userId, role: 'eleve' }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token)
        return res
            .status(401)
            .json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token manquant' } })
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token invalide' } })
    }
}

// Middleware de role
function requireProf(req, res, next) {
    if (req.user.role !== 'prof')
        return res
            .status(403)
            .json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Acces reserve aux professeurs' }
            })
    next()
}

function requireEleve(req, res, next) {
    if (req.user.role !== 'eleve')
        return res
            .status(403)
            .json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Acces reserve aux eleves' }
            })
    next()
}

// Creation d'une app de test isolee
function createTestApp() {
    const app = express()
    app.use(express.json())
    const mockPool = { query: mockQuery }
    const quizRouter = express.Router()

    // Validation quiz
    function validateQuiz(req, res, next) {
        const { title } = req.body
        if (!title)
            return res
                .status(400)
                .json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Le titre est requis',
                        field: 'title'
                    }
                })
        if (title.length < 3)
            return res
                .status(400)
                .json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Le titre doit contenir au moins 3 caracteres',
                        field: 'title'
                    }
                })
        if (title.length > 100)
            return res
                .status(400)
                .json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Le titre ne doit pas depasser 100 caracteres',
                        field: 'title'
                    }
                })
        next()
    }

    // GET /api/quizzes - Liste des quiz du prof
    quizRouter.get('/', authenticateToken, requireProf, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT * FROM quizzes WHERE user_id = ? ORDER BY created_at DESC',
                [req.user.userId]
            )
            return res.status(200).json({ success: true, data: quizzes })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    // GET /api/quizzes/join/:code - Rejoindre un quiz (eleve)
    quizRouter.get('/join/:code', authenticateToken, requireEleve, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT id, title, access_code, created_at FROM quizzes WHERE access_code = ?',
                [req.params.code.toUpperCase()]
            )
            if (quizzes.length === 0)
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                    })
            const quiz = quizzes[0]
            const [questions] = await mockPool.query(
                'SELECT id, type, question_text, options FROM questions WHERE quiz_id = ?',
                [quiz.id]
            )
            return res.status(200).json({ success: true, data: { ...quiz, questions } })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    // GET /api/quizzes/:id - Detail d'un quiz
    quizRouter.get('/:id', authenticateToken, requireProf, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
                [req.params.id, req.user.userId]
            )
            if (quizzes.length === 0)
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                    })
            return res.status(200).json({ success: true, data: quizzes[0] })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    // POST /api/quizzes - Creer un quiz
    quizRouter.post('/', authenticateToken, requireProf, validateQuiz, async (req, res) => {
        try {
            const { title } = req.body
            const userId = req.user.userId

            const [users] = await mockPool.query('SELECT is_premium FROM users WHERE id = ?', [
                userId
            ])
            const isPremium = users[0].is_premium
            const maxQuizzes = isPremium ? 20 : 1

            const [countResult] = await mockPool.query(
                'SELECT COUNT(*) as count FROM quizzes WHERE user_id = ?',
                [userId]
            )
            if (countResult[0].count >= maxQuizzes) {
                return res
                    .status(403)
                    .json({
                        success: false,
                        error: {
                            code: 'FORBIDDEN',
                            message: `Limite de quiz atteinte (${maxQuizzes} quiz maximum)`
                        }
                    })
            }

            // Generer code unique
            let accessCode
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            let codeExists = true
            while (codeExists) {
                accessCode = ''
                for (let i = 0; i < 5; i++)
                    accessCode += chars.charAt(Math.floor(Math.random() * chars.length))
                const [existing] = await mockPool.query(
                    'SELECT id FROM quizzes WHERE access_code = ?',
                    [accessCode]
                )
                codeExists = existing.length > 0
            }

            const [result] = await mockPool.query(
                'INSERT INTO quizzes (user_id, title, access_code) VALUES (?, ?, ?)',
                [userId, title, accessCode]
            )
            const [quizzes] = await mockPool.query('SELECT * FROM quizzes WHERE id = ?', [
                result.insertId
            ])

            return res.status(201).json({ success: true, data: quizzes[0] })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    // PUT /api/quizzes/:id - Modifier un quiz
    quizRouter.put('/:id', authenticateToken, requireProf, validateQuiz, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
                [req.params.id, req.user.userId]
            )
            if (quizzes.length === 0)
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                    })

            await mockPool.query('UPDATE quizzes SET title = ? WHERE id = ?', [
                req.body.title,
                req.params.id
            ])
            const [updatedQuizzes] = await mockPool.query('SELECT * FROM quizzes WHERE id = ?', [
                req.params.id
            ])

            return res.status(200).json({ success: true, data: updatedQuizzes[0] })
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    // DELETE /api/quizzes/:id - Supprimer un quiz
    quizRouter.delete('/:id', authenticateToken, requireProf, async (req, res) => {
        try {
            const [quizzes] = await mockPool.query(
                'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
                [req.params.id, req.user.userId]
            )
            if (quizzes.length === 0)
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                    })

            await mockPool.query('DELETE FROM quizzes WHERE id = ?', [req.params.id])
            return res.status(204).send()
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
                })
        }
    })

    app.use('/api/quizzes', quizRouter)
    return app
}

describe('Quiz API', () => {
    let app

    beforeAll(() => {
        app = createTestApp()
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('GET /api/quizzes', () => {
        it('devrait retourner la liste des quiz du professeur', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([
                [
                    {
                        id: 1,
                        user_id: 1,
                        title: 'Quiz 1',
                        access_code: 'ABC12',
                        created_at: new Date()
                    },
                    {
                        id: 2,
                        user_id: 1,
                        title: 'Quiz 2',
                        access_code: 'XYZ99',
                        created_at: new Date()
                    }
                ]
            ])

            const res = await request(app)
                .get('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toHaveLength(2)
        })

        it("devrait refuser l'acces a un eleve", async () => {
            const token = getEleveToken()
            const res = await request(app)
                .get('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(403)
            expect(res.body.error.code).toBe('FORBIDDEN')
        })
    })

    describe('POST /api/quizzes', () => {
        it('devrait creer un quiz pour un prof gratuit (limite 1)', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ is_premium: false }]])
                .mockResolvedValueOnce([[{ count: 0 }]])
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            user_id: 1,
                            title: 'Mon Quiz',
                            access_code: 'ABC12',
                            created_at: new Date()
                        }
                    ]
                ])

            const res = await request(app)
                .post('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Mon Quiz' })

            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.title).toBe('Mon Quiz')
            expect(res.body.data.access_code).toBeDefined()
        })

        it('devrait refuser un quiz si limite atteinte (prof gratuit)', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ is_premium: false }]])
                .mockResolvedValueOnce([[{ count: 1 }]])

            const res = await request(app)
                .post('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Mon Quiz' })

            expect(res.status).toBe(403)
            expect(res.body.error.code).toBe('FORBIDDEN')
        })

        it('devrait permettre 20 quiz pour un prof premium', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ is_premium: true }]])
                .mockResolvedValueOnce([[{ count: 19 }]])
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([{ insertId: 20 }])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 20,
                            user_id: 1,
                            title: 'Quiz 20',
                            access_code: 'ZZZ99',
                            created_at: new Date()
                        }
                    ]
                ])

            const res = await request(app)
                .post('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Quiz 20' })

            expect(res.status).toBe(201)
        })

        it('devrait rejeter un titre trop court', async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'AB' })
            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('title')
        })

        it('devrait rejeter un titre manquant', async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/quizzes')
                .set('Authorization', `Bearer ${token}`)
                .send({})
            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('title')
        })
    })

    describe('GET /api/quizzes/:id', () => {
        it('devrait retourner un quiz specifique', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([
                [
                    {
                        id: 1,
                        user_id: 1,
                        title: 'Mon Quiz',
                        access_code: 'ABC12',
                        created_at: new Date()
                    }
                ]
            ])

            const res = await request(app)
                .get('/api/quizzes/1')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data.id).toBe(1)
        })

        it('devrait retourner 404 pour un quiz inexistant', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .get('/api/quizzes/999')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(404)
        })
    })

    describe('PUT /api/quizzes/:id', () => {
        it('devrait modifier un quiz', async () => {
            const token = getProfToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1, user_id: 1 }]])
                .mockResolvedValueOnce([{}])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            user_id: 1,
                            title: 'Quiz Modifie',
                            access_code: 'ABC12',
                            created_at: new Date()
                        }
                    ]
                ])

            const res = await request(app)
                .put('/api/quizzes/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Quiz Modifie' })

            expect(res.status).toBe(200)
            expect(res.body.data.title).toBe('Quiz Modifie')
        })
    })

    describe('DELETE /api/quizzes/:id', () => {
        it('devrait supprimer un quiz', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[{ id: 1, user_id: 1 }]]).mockResolvedValueOnce([{}])

            const res = await request(app)
                .delete('/api/quizzes/1')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(204)
        })

        it('devrait retourner 404 pour un quiz inexistant', async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .delete('/api/quizzes/999')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(404)
        })
    })

    describe('GET /api/quizzes/join/:code', () => {
        it('devrait permettre a un eleve de rejoindre un quiz', async () => {
            const token = getEleveToken()
            mockQuery
                .mockResolvedValueOnce([
                    [{ id: 1, title: 'Quiz Test', access_code: 'ABC12', created_at: new Date() }]
                ])
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            type: 'qcm',
                            question_text: 'Question 1?',
                            options: '["A","B","C","D"]'
                        }
                    ]
                ])

            const res = await request(app)
                .get('/api/quizzes/join/ABC12')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data.title).toBe('Quiz Test')
            expect(res.body.data.questions).toBeDefined()
        })

        it('devrait retourner 404 pour un code invalide', async () => {
            const token = getEleveToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .get('/api/quizzes/join/XXXXX')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(404)
        })

        it("devrait refuser l'acces a un prof", async () => {
            const token = getProfToken()
            const res = await request(app)
                .get('/api/quizzes/join/ABC12')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(403)
        })
    })
})
