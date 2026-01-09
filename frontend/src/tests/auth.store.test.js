/**
 * Tests unitaires pour le store d'authentification (Pinia)
 *
 * Ces tests verifient le fonctionnement du store auth :
 * - Etat initial
 * - Getters (isAuthenticated, isProf, etc.)
 * - Actions (login, logout, register)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// Mock du module API
vi.mock('../services/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}))

import api from '../services/api'

describe('Auth Store', () => {
    let store

    // Avant chaque test, on cree une nouvelle instance de Pinia
    beforeEach(() => {
        setActivePinia(createPinia())
        store = useAuthStore()
        vi.clearAllMocks()
    })

    // ============================================
    // Tests de l'etat initial
    // ============================================
    describe('Etat initial', () => {
        it('devrait avoir user a null par defaut', () => {
            expect(store.user).toBeNull()
        })

        it('devrait avoir token a null si rien dans localStorage', () => {
            expect(store.token).toBeNull()
        })

        it('devrait avoir isAuthenticated a false par defaut', () => {
            expect(store.isAuthenticated).toBe(false)
        })

        it('devrait avoir isProf a false par defaut', () => {
            expect(store.isProf).toBe(false)
        })

        it('devrait avoir isEleve a false par defaut', () => {
            expect(store.isEleve).toBe(false)
        })

        it('devrait avoir isPremium a false par defaut', () => {
            expect(store.isPremium).toBe(false)
        })
    })

    // ============================================
    // Tests des getters
    // ============================================
    describe('Getters', () => {
        it('isAuthenticated devrait etre true si token existe', () => {
            store.token = 'fake-token'
            expect(store.isAuthenticated).toBe(true)
        })

        it('isProf devrait etre true si user.role est "prof"', () => {
            store.user = { id: 1, email: 'prof@test.com', role: 'prof' }
            expect(store.isProf).toBe(true)
            expect(store.isEleve).toBe(false)
        })

        it('isEleve devrait etre true si user.role est "eleve"', () => {
            store.user = { id: 1, email: 'eleve@test.com', role: 'eleve' }
            expect(store.isEleve).toBe(true)
            expect(store.isProf).toBe(false)
        })

        it('isPremium devrait etre true si user.is_premium est 1', () => {
            store.user = { id: 1, role: 'prof', is_premium: 1 }
            expect(store.isPremium).toBe(true)
        })

        it('isPremium devrait etre true si user.is_premium est true', () => {
            store.user = { id: 1, role: 'prof', is_premium: true }
            expect(store.isPremium).toBe(true)
        })

        it('isPremium devrait etre false si user.is_premium est 0', () => {
            store.user = { id: 1, role: 'prof', is_premium: 0 }
            expect(store.isPremium).toBe(false)
        })
    })

    // ============================================
    // Tests de l'action login
    // ============================================
    describe('Action login', () => {
        it('devrait stocker le token et user apres login reussi', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        token: 'jwt-token-123',
                        user: {
                            id: 1,
                            email: 'test@test.com',
                            role: 'prof',
                            is_premium: false
                        }
                    }
                }
            }

            api.post.mockResolvedValue(mockResponse)

            await store.login('test@test.com', 'Password123')

            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@test.com',
                password: 'Password123'
            })
            expect(store.token).toBe('jwt-token-123')
            expect(store.user.email).toBe('test@test.com')
            expect(store.isAuthenticated).toBe(true)
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token-123')
        })

        it('devrait propager l\'erreur si login echoue', async () => {
            const mockError = new Error('Invalid credentials')
            api.post.mockRejectedValue(mockError)

            await expect(store.login('test@test.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials')

            expect(store.token).toBeNull()
            expect(store.user).toBeNull()
        })
    })

    // ============================================
    // Tests de l'action register
    // ============================================
    describe('Action register', () => {
        it('devrait stocker le token et user apres inscription reussie', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        token: 'jwt-token-new',
                        user: {
                            id: 2,
                            email: 'new@test.com',
                            role: 'eleve',
                            is_premium: false
                        }
                    }
                }
            }

            api.post.mockResolvedValue(mockResponse)

            await store.register('new@test.com', 'Password123', 'eleve')

            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                email: 'new@test.com',
                password: 'Password123',
                role: 'eleve'
            })
            expect(store.token).toBe('jwt-token-new')
            expect(store.user.role).toBe('eleve')
            expect(store.isEleve).toBe(true)
        })
    })

    // ============================================
    // Tests de l'action logout
    // ============================================
    describe('Action logout', () => {
        it('devrait reinitialiser le state lors du logout', () => {
            // Simuler un utilisateur connecte
            store.token = 'some-token'
            store.user = { id: 1, email: 'test@test.com', role: 'prof' }

            // Verifier qu'il est bien connecte
            expect(store.isAuthenticated).toBe(true)

            // Logout
            store.logout()

            // Verifier que tout est reinitialise
            expect(store.token).toBeNull()
            expect(store.user).toBeNull()
            expect(store.isAuthenticated).toBe(false)
            expect(localStorage.removeItem).toHaveBeenCalledWith('token')
        })
    })

    // ============================================
    // Tests de l'action fetchUser
    // ============================================
    describe('Action fetchUser', () => {
        it('devrait recuperer les infos utilisateur si token existe', async () => {
            store.token = 'valid-token'

            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        id: 1,
                        email: 'test@test.com',
                        role: 'prof',
                        is_premium: true
                    }
                }
            }

            api.get.mockResolvedValue(mockResponse)

            await store.fetchUser()

            expect(api.get).toHaveBeenCalledWith('/auth/me')
            expect(store.user.email).toBe('test@test.com')
            expect(store.isPremium).toBe(true)
        })

        it('ne devrait rien faire si pas de token', async () => {
            store.token = null

            await store.fetchUser()

            expect(api.get).not.toHaveBeenCalled()
        })

        it('devrait logout si erreur lors de fetchUser', async () => {
            store.token = 'invalid-token'
            store.user = { id: 1 }

            api.get.mockRejectedValue(new Error('Unauthorized'))

            await store.fetchUser()

            expect(store.token).toBeNull()
            expect(store.user).toBeNull()
        })
    })
})
