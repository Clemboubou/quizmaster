/**
 * Genere un code d'acces unique pour un quiz
 * Format: 5 caracteres alphanumeriques majuscules (ex: X9J2K)
 */
function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

module.exports = generateCode;
