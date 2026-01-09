import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import express from 'express'

// Configuration env pour les tests
process.env.JWT_SECRET = 'test_secret_key_for_testing_purposes_only'
process.env.JWT_EXPIRES_IN = '24h'

// Mock du pool
const mockQuery = vi.fn()

// Helpers token
function getProfToken(userId = 1) {
    return jwt.sign({ userId, role: 'prof' }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

function getEleveToken(userId = 2) {
    return jwt.sign({ userId, role: 'eleve' }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Middlewares
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

function requireEleve(req, res, next) {
    if (req.user.role !== 'eleve') {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Acces reserve aux eleves' }
        })
    }
    next()
}

function createTestApp() {
    const app = express()
    app.use(express.json())
    const mockPool = { query: mockQuery }
    const resultRouter = express.Router()

    // POST /api/results
    resultRouter.post('/', authenticateToken, requireEleve, async (req, res) => {
        try {
            const { quiz_id, score } = req.body
            if (typeof score !== 'number' || score < 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Score invalide',
                        field: 'score'
                    }
                })
            }
            const [quizzes] = await mockPool.query('SELECT * FROM quizzes WHERE id = ?', [quiz_id])
            if (quizzes.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Quiz non trouve' }
                })
            }

            const [result] = await mockPool.query('INSERT INTO results ...', [
                req.user.userId,
                quiz_id,
                score
            ])
            const [results] = await mockPool.query('SELECT * FROM results WHERE id = ?', [
                result.insertId
            ])
            return res.status(201).json({ success: true, data: results[0] })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    // GET /api/results/me
    resultRouter.get('/me', authenticateToken, requireEleve, async (req, res) => {
        try {
            const [results] = await mockPool.query(
                'SELECT r.id, r.score, r.played_at, q.title as quiz_title FROM results r JOIN quizzes q ON r.quiz_id = q.id WHERE r.user_id = ? ORDER BY r.played_at DESC',
                [req.user.userId]
            )
            return res.status(200).json({ success: true, data: results })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    // GET /api/results/quiz/:quizId
    resultRouter.get('/quiz/:quizId', authenticateToken, requireProf, async (req, res) => {
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

            const [results] = await mockPool.query(
                'SELECT r.id, r.score, r.played_at, u.email as student_email FROM results r JOIN users u ON r.user_id = u.id WHERE r.quiz_id = ? ORDER BY r.played_at DESC',
                [req.params.quizId]
            )
            return res.status(200).json({ success: true, data: results })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' }
            })
        }
    })

    app.use('/api/results', resultRouter)
    return app
}

describe('Result API', () => {
    let app

    beforeAll(() => {
        app = createTestApp()
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('POST /api/results', () => {
        it('devrait enregistrer un score pour un eleve', async () => {
            const token = getEleveToken()
            mockQuery
                .mockResolvedValueOnce([[{ id: 1 }]])
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce([
                    [{ id: 1, user_id: 2, quiz_id: 1, score: 8, played_at: new Date() }]
                ])

            const res = await request(app)
                .post('/api/results')
                .set('Authorization', `Bearer ${token}`)
                .send({ quiz_id: 1, score: 8 })

            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.score).toBe(8)
        })

        it('devrait rejeter un score negatif', async () => {
            const token = getEleveToken()
            const res = await request(app)
                .post('/api/results')
                .set('Authorization', `Bearer ${token}`)
                .send({ quiz_id: 1, score: -5 })

            expect(res.status).toBe(400)
            expect(res.body.error.field).toBe('score')
        })

        it("devrait rejeter si le quiz n'existe pas", async () => {
            const token = getEleveToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .post('/api/results')
                .set('Authorization', `Bearer ${token}`)
                .send({ quiz_id: 999, score: 8 })

            expect(res.status).toBe(404)
        })

        it("devrait refuser l'acces a un prof", async () => {
            const token = getProfToken()
            const res = await request(app)
                .post('/api/results')
                .set('Authorization', `Bearer ${token}`)
                .send({ quiz_id: 1, score: 8 })

            expect(res.status).toBe(403)
        })
    })

    describe('GET /api/results/me', () => {
        it("devrait retourner les resultats d'un eleve", async () => {
            const token = getEleveToken()
            mockQuery.mockResolvedValueOnce([
                [
                    { id: 1, score: 8, played_at: new Date(), quiz_title: 'Quiz 1' },
                    { id: 2, score: 10, played_at: new Date(), quiz_title: 'Quiz 2' }
                ]
            ])

            const res = await request(app)
                .get('/api/results/me')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveLength(2)
            expect(res.body.data[0].quiz_title).toBeDefined()
        })

        it("devrait refuser l'acces a un prof", async () => {
            const token = getProfToken()
            const res = await request(app)
                .get('/api/results/me')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(403)
        })
    })

    describe('GET /api/results/quiz/:quizId', () => {
        it("devrait retourner les resultats d'un quiz pour le prof", async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[{ id: 1, user_id: 1 }]]).mockResolvedValueOnce([
                [
                    { id: 1, score: 8, played_at: new Date(), student_email: 'eleve1@test.com' },
                    { id: 2, score: 6, played_at: new Date(), student_email: 'eleve2@test.com' }
                ]
            ])

            const res = await request(app)
                .get('/api/results/quiz/1')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveLength(2)
            expect(res.body.data[0].student_email).toBeDefined()
        })

        it("devrait retourner 404 si le quiz n'existe pas", async () => {
            const token = getProfToken()
            mockQuery.mockResolvedValueOnce([[]])

            const res = await request(app)
                .get('/api/results/quiz/999')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(404)
        })

        it("devrait refuser l'acces a un eleve", async () => {
            const token = getEleveToken()
            const res = await request(app)
                .get('/api/results/quiz/1')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(403)
        })
    })
})
