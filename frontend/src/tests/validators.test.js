/**
 * Tests unitaires pour les fonctions de validation
 *
 * Ces tests verifient que les validateurs fonctionnent correctement
 * pour differents cas d'utilisation (valides et invalides).
 */
import { describe, it, expect } from 'vitest'
import {
    validateEmail,
    validatePassword,
    validateQuizTitle,
    validateQuestionText,
    getPasswordErrors
} from '../utils/validators'

// ============================================
// Tests de validation d'email
// ============================================
describe('validateEmail', () => {
    // Cas valides
    it('devrait accepter un email valide simple', () => {
        expect(validateEmail('test@example.com')).toBe(true)
    })

    it('devrait accepter un email avec sous-domaine', () => {
        expect(validateEmail('user@mail.example.com')).toBe(true)
    })

    it('devrait accepter un email avec des chiffres', () => {
        expect(validateEmail('user123@example456.com')).toBe(true)
    })

    it('devrait accepter un email avec des points dans le nom', () => {
        expect(validateEmail('jean.dupont@example.com')).toBe(true)
    })

    it('devrait accepter un email avec un tiret', () => {
        expect(validateEmail('jean-pierre@example.com')).toBe(true)
    })

    // Cas invalides
    it('devrait rejeter un email sans @', () => {
        expect(validateEmail('testexample.com')).toBe(false)
    })

    it('devrait rejeter un email sans domaine', () => {
        expect(validateEmail('test@')).toBe(false)
    })

    it('devrait rejeter un email sans extension', () => {
        expect(validateEmail('test@example')).toBe(false)
    })

    it('devrait rejeter un email avec espaces', () => {
        expect(validateEmail('test @example.com')).toBe(false)
    })

    it('devrait rejeter une chaine vide', () => {
        expect(validateEmail('')).toBe(false)
    })
})

// ============================================
// Tests de validation de mot de passe
// ============================================
describe('validatePassword', () => {
    // Cas valides
    it('devrait accepter un mot de passe valide', () => {
        expect(validatePassword('Password123')).toBe(true)
    })

    it('devrait accepter un mot de passe avec caracteres speciaux', () => {
        expect(validatePassword('Password123!')).toBe(true)
    })

    it('devrait accepter un mot de passe long', () => {
        expect(validatePassword('MonSuperMotDePasse123')).toBe(true)
    })

    // Cas invalides - trop court
    it('devrait rejeter un mot de passe trop court', () => {
        expect(validatePassword('Pass1')).toBe(false)
    })

    it('devrait rejeter un mot de passe de 7 caracteres', () => {
        expect(validatePassword('Pass12a')).toBe(false)
    })

    // Cas invalides - manque majuscule
    it('devrait rejeter un mot de passe sans majuscule', () => {
        expect(validatePassword('password123')).toBe(false)
    })

    // Cas invalides - manque minuscule
    it('devrait rejeter un mot de passe sans minuscule', () => {
        expect(validatePassword('PASSWORD123')).toBe(false)
    })

    // Cas invalides - manque chiffre
    it('devrait rejeter un mot de passe sans chiffre', () => {
        expect(validatePassword('PasswordABC')).toBe(false)
    })

    // Cas limites
    it('devrait accepter un mot de passe de exactement 8 caracteres', () => {
        expect(validatePassword('Passwo1d')).toBe(true)
    })

    it('devrait rejeter une chaine vide', () => {
        expect(validatePassword('')).toBe(false)
    })
})

// ============================================
// Tests de validation du titre de quiz
// ============================================
describe('validateQuizTitle', () => {
    // Cas valides
    it('devrait accepter un titre de 3 caracteres (minimum)', () => {
        expect(validateQuizTitle('ABC')).toBe(true)
    })

    it('devrait accepter un titre normal', () => {
        expect(validateQuizTitle('Mon super quiz')).toBe(true)
    })

    it('devrait accepter un titre de 100 caracteres (maximum)', () => {
        expect(validateQuizTitle('A'.repeat(100))).toBe(true)
    })

    // Cas invalides
    it('devrait rejeter un titre trop court (2 caracteres)', () => {
        expect(validateQuizTitle('AB')).toBe(false)
    })

    it('devrait rejeter un titre vide', () => {
        expect(validateQuizTitle('')).toBe(false)
    })

    it('devrait rejeter un titre trop long (101 caracteres)', () => {
        expect(validateQuizTitle('A'.repeat(101))).toBe(false)
    })
})

// ============================================
// Tests de validation du texte de question
// ============================================
describe('validateQuestionText', () => {
    // Cas valides
    it('devrait accepter une question de 10 caracteres (minimum)', () => {
        expect(validateQuestionText('Question ?')).toBe(true)
    })

    it('devrait accepter une question normale', () => {
        expect(validateQuestionText('Quelle est la capitale de la France ?')).toBe(true)
    })

    it('devrait accepter une question de 500 caracteres (maximum)', () => {
        expect(validateQuestionText('A'.repeat(500))).toBe(true)
    })

    // Cas invalides
    it('devrait rejeter une question trop courte (9 caracteres)', () => {
        expect(validateQuestionText('Question?')).toBe(false)
    })

    it('devrait rejeter une question vide', () => {
        expect(validateQuestionText('')).toBe(false)
    })

    it('devrait rejeter une question trop longue (501 caracteres)', () => {
        expect(validateQuestionText('A'.repeat(501))).toBe(false)
    })
})

// ============================================
// Tests des messages d'erreur de mot de passe
// ============================================
describe('getPasswordErrors', () => {
    it('devrait retourner un tableau vide pour un mot de passe valide', () => {
        const errors = getPasswordErrors('Password123')
        expect(errors).toEqual([])
        expect(errors.length).toBe(0)
    })

    it('devrait retourner une erreur pour mot de passe trop court', () => {
        const errors = getPasswordErrors('Pass1')
        expect(errors).toContain('Au moins 8 caracteres')
    })

    it('devrait retourner une erreur si pas de majuscule', () => {
        const errors = getPasswordErrors('password123')
        expect(errors).toContain('Au moins une majuscule')
    })

    it('devrait retourner une erreur si pas de minuscule', () => {
        const errors = getPasswordErrors('PASSWORD123')
        expect(errors).toContain('Au moins une minuscule')
    })

    it('devrait retourner une erreur si pas de chiffre', () => {
        const errors = getPasswordErrors('PasswordABC')
        expect(errors).toContain('Au moins un chiffre')
    })

    it('devrait retourner plusieurs erreurs si plusieurs criteres manquent', () => {
        const errors = getPasswordErrors('abc')
        expect(errors.length).toBeGreaterThan(1)
        expect(errors).toContain('Au moins 8 caracteres')
        expect(errors).toContain('Au moins une majuscule')
        expect(errors).toContain('Au moins un chiffre')
    })

    it('devrait retourner toutes les erreurs pour une chaine vide', () => {
        const errors = getPasswordErrors('')
        expect(errors.length).toBe(4)
    })
})
