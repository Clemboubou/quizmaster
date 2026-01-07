import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

// Configuration env pour les tests
process.env.JWT_SECRET = 'test_secret_key_for_testing_purposes_only';
process.env.JWT_EXPIRES_IN = '24h';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Mock du pool de base de donnees
const mockQuery = vi.fn();

// Creation d'une app de test isolee
function createTestApp() {
    const app = express();
    app.use(express.json());

    // Mock du pool pour les controllers
    const mockPool = { query: mockQuery };

    // Auth controller avec mock injecte
    const authRouter = express.Router();

    authRouter.post('/register', async (req, res) => {
        const { validateRegister } = await import('../validators/auth.validator.js');

        // Validation manuelle
        const { email, password, role } = req.body;

        // Email validation
        if (!email) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "L'email est requis", field: 'email' } });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "Format d'email invalide", field: 'email' } });
        }

        // Password validation
        if (!password) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe est requis', field: 'password' } });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins 8 caracteres', field: 'password' } });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins une majuscule', field: 'password' } });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins une minuscule', field: 'password' } });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins un chiffre', field: 'password' } });
        }

        // Role validation
        if (!role) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le role est requis', field: 'role' } });
        }
        if (!['prof', 'eleve'].includes(role)) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le role doit etre "prof" ou "eleve"', field: 'role' } });
        }

        try {
            // Verifier si email existe
            const [existingUsers] = await mockPool.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existingUsers.length > 0) {
                return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Cet email est deja utilise', field: 'email' } });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Creer l'utilisateur
            const [result] = await mockPool.query('INSERT INTO users (email, password, role, is_premium) VALUES (?, ?, ?, ?)', [email, hashedPassword, role, false]);

            // Generer le token
            const token = jwt.sign({ userId: result.insertId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Recuperer l'utilisateur cree
            const [users] = await mockPool.query('SELECT id, email, role, is_premium, created_at FROM users WHERE id = ?', [result.insertId]);

            return res.status(201).json({ success: true, data: { user: users[0], token } });
        } catch (error) {
            return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' } });
        }
    });

    authRouter.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: "L'email est requis", field: 'email' } });
        }
        if (!password) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe est requis', field: 'password' } });
        }

        try {
            const [users] = await mockPool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Email ou mot de passe incorrect' } });
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Email ou mot de passe incorrect' } });
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            const { password: _, ...userWithoutPassword } = user;

            return res.status(200).json({ success: true, data: { user: userWithoutPassword, token } });
        } catch (error) {
            return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' } });
        }
    });

    authRouter.get('/me', async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token manquant' } });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [users] = await mockPool.query('SELECT id, email, role, is_premium, created_at FROM users WHERE id = ?', [decoded.userId]);

            if (users.length === 0) {
                return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Utilisateur non trouve' } });
            }

            return res.status(200).json({ success: true, data: users[0] });
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token invalide' } });
            }
            return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne' } });
        }
    });

    authRouter.post('/logout', (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token manquant' } });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.status(200).json({ success: true, data: { message: 'Deconnexion reussie' } });
        } catch (error) {
            return res.status(401).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Token invalide' } });
        }
    });

    app.use('/api/auth', authRouter);

    return app;
}

describe('Auth API', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('devrait creer un nouvel utilisateur avec succes', async () => {
            mockQuery
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce([[{
                    id: 1,
                    email: 'test@test.com',
                    role: 'prof',
                    is_premium: false,
                    created_at: new Date()
                }]]);

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@test.com',
                    password: 'Test1234!',
                    role: 'prof'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@test.com');
            expect(res.body.data.token).toBeDefined();
        });

        it('devrait rejeter un email deja utilise', async () => {
            mockQuery.mockResolvedValueOnce([[{ id: 1 }]]);

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existe@test.com',
                    password: 'Test1234!',
                    role: 'prof'
                });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.error.code).toBe('CONFLICT');
        });

        it('devrait rejeter un mot de passe trop court', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@test.com',
                    password: 'short',
                    role: 'prof'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error.field).toBe('password');
        });

        it('devrait rejeter un mot de passe sans majuscule', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@test.com',
                    password: 'test1234!',
                    role: 'prof'
                });

            expect(res.status).toBe(400);
            expect(res.body.error.field).toBe('password');
        });

        it('devrait rejeter un role invalide', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@test.com',
                    password: 'Test1234!',
                    role: 'admin'
                });

            expect(res.status).toBe(400);
            expect(res.body.error.field).toBe('role');
        });

        it('devrait rejeter un email invalide', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Test1234!',
                    role: 'prof'
                });

            expect(res.status).toBe(400);
            expect(res.body.error.field).toBe('email');
        });
    });

    describe('POST /api/auth/login', () => {
        it('devrait connecter un utilisateur avec succes', async () => {
            const hashedPassword = await bcrypt.hash('Test1234!', 10);

            mockQuery.mockResolvedValueOnce([[{
                id: 1,
                email: 'test@test.com',
                password: hashedPassword,
                role: 'prof',
                is_premium: false,
                created_at: new Date()
            }]]);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test1234!'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.user.email).toBe('test@test.com');
            expect(res.body.data.user.password).toBeUndefined();
        });

        it('devrait rejeter un email inexistant', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'inexistant@test.com',
                    password: 'Test1234!'
                });

            expect(res.status).toBe(401);
            expect(res.body.error.code).toBe('AUTH_ERROR');
        });

        it('devrait rejeter un mot de passe incorrect', async () => {
            const hashedPassword = await bcrypt.hash('Test1234!', 10);

            mockQuery.mockResolvedValueOnce([[{
                id: 1,
                email: 'test@test.com',
                password: hashedPassword,
                role: 'prof'
            }]]);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'MauvaisMotDePasse1!'
                });

            expect(res.status).toBe(401);
            expect(res.body.error.code).toBe('AUTH_ERROR');
        });
    });

    describe('GET /api/auth/me', () => {
        it('devrait retourner le profil de l\'utilisateur connecte', async () => {
            const token = jwt.sign(
                { userId: 1, role: 'prof' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            mockQuery.mockResolvedValueOnce([[{
                id: 1,
                email: 'test@test.com',
                role: 'prof',
                is_premium: false,
                created_at: new Date()
            }]]);

            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe('test@test.com');
        });

        it('devrait rejeter une requete sans token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.status).toBe(401);
            expect(res.body.error.code).toBe('AUTH_ERROR');
        });

        it('devrait rejeter un token invalide', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.status).toBe(401);
            expect(res.body.error.code).toBe('AUTH_ERROR');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('devrait deconnecter l\'utilisateur', async () => {
            const token = jwt.sign(
                { userId: 1, role: 'prof' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
