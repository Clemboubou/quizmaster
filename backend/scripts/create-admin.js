/**
 * Script pour creer un compte administrateur
 *
 * Usage: node scripts/create-admin.js [email] [password]
 *
 * Exemple: node scripts/create-admin.js admin@quizmaster.com Admin123!
 */

require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('../config/database')

async function createAdmin(email, password) {
    if (!email || !password) {
        console.error('Usage: node scripts/create-admin.js <email> <password>')
        console.error('Exemple: node scripts/create-admin.js admin@quizmaster.com Admin123!')
        process.exit(1)
    }

    try {
        // Verifier si l'email existe deja
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            console.error(`Erreur: L'email ${email} existe deja`)
            process.exit(1)
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Creer l'admin
        const [result] = await pool.query(
            `INSERT INTO users (email, password, role, is_premium)
             VALUES (?, ?, 'admin', true)`,
            [email, hashedPassword]
        )

        console.log('Compte admin cree avec succes!')
        console.log(`ID: ${result.insertId}`)
        console.log(`Email: ${email}`)
        console.log(`Role: admin`)

        process.exit(0)
    } catch (error) {
        console.error('Erreur lors de la creation:', error.message)
        process.exit(1)
    }
}

// Recuperer les arguments
const email = process.argv[2]
const password = process.argv[3]

createAdmin(email, password)
