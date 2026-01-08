/**
 * Valide un email
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valide un mot de passe (min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre)
 */
export function validatePassword(password) {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Valide un titre de quiz (3-100 caracteres)
 */
export function validateQuizTitle(title) {
  return title.length >= 3 && title.length <= 100
}

/**
 * Valide un texte de question (10-500 caracteres)
 */
export function validateQuestionText(text) {
  return text.length >= 10 && text.length <= 500
}

/**
 * Messages d'erreur pour le mot de passe
 */
export function getPasswordErrors(password) {
  const errors = []
  if (password.length < 8) errors.push('Au moins 8 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Au moins une majuscule')
  if (!/[a-z]/.test(password)) errors.push('Au moins une minuscule')
  if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre')
  return errors
}
