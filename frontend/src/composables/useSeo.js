/**
 * Composable useSeo - Gestion dynamique des meta tags SEO
 *
 * POURQUOI CE COMPOSABLE ?
 * ========================
 * Vue.js est une SPA (Single Page Application) : il n'y a qu'un seul fichier HTML.
 * Le probleme : les moteurs de recherche et les reseaux sociaux lisent les meta tags
 * au chargement initial de la page. Si on ne les met pas a jour dynamiquement,
 * toutes les pages auront les memes meta tags.
 *
 * Ce composable permet de :
 * 1. Changer le titre de la page (<title>)
 * 2. Mettre a jour la meta description
 * 3. Mettre a jour les tags Open Graph (partage Facebook, LinkedIn)
 * 4. Mettre a jour les tags Twitter Card
 *
 * COMMENT L'UTILISER ?
 * ====================
 * import { useSeo } from '@/composables/useSeo'
 *
 * // Dans un composant Vue
 * useSeo({
 *   title: 'Mon Quiz - QuizMaster',
 *   description: 'Passez ce quiz de mathematiques'
 * })
 */

/**
 * Met a jour ou cree une balise meta
 * @param {string} attribute - L'attribut a chercher (name ou property)
 * @param {string} value - La valeur de l'attribut
 * @param {string} content - Le contenu de la meta
 */
function updateMetaTag(attribute, value, content) {
  // Chercher la balise meta existante
  let element = document.querySelector(`meta[${attribute}="${value}"]`)

  if (element) {
    // Si elle existe, mettre a jour le contenu
    element.setAttribute('content', content)
  } else {
    // Sinon, creer une nouvelle balise meta
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    element.setAttribute('content', content)
    document.head.appendChild(element)
  }
}

/**
 * Composable pour gerer le SEO dynamiquement
 * @param {Object} options - Options SEO
 * @param {string} options.title - Titre de la page
 * @param {string} options.description - Description de la page
 * @param {string} options.image - URL de l'image pour le partage social
 * @param {string} options.url - URL canonique de la page
 */
export function useSeo(options = {}) {
  const defaults = {
    title: 'QuizMaster - Creez et partagez des quiz interactifs',
    description:
      'QuizMaster permet aux professeurs de creer des quiz interactifs et aux eleves de les passer en ligne.',
    image: 'https://quizmaster.app/og-image.png',
    url: window.location.href
  }

  // Fusionner les options avec les valeurs par defaut
  const config = { ...defaults, ...options }

  // 1. Mettre a jour le titre de la page
  // Le titre est CRITIQUE pour le SEO : c'est ce qui apparait dans Google
  document.title = config.title

  // 2. Mettre a jour la meta description
  // Apparait sous le titre dans les resultats Google (150-160 caracteres max)
  updateMetaTag('name', 'description', config.description)

  // 3. Mettre a jour les tags Open Graph (Facebook, LinkedIn, etc.)
  // Ces tags controlent l'apercu quand quelqu'un partage le lien
  updateMetaTag('property', 'og:title', config.title)
  updateMetaTag('property', 'og:description', config.description)
  updateMetaTag('property', 'og:image', config.image)
  updateMetaTag('property', 'og:url', config.url)

  // 4. Mettre a jour les tags Twitter Card
  // Meme principe que Open Graph mais pour Twitter/X
  updateMetaTag('name', 'twitter:title', config.title)
  updateMetaTag('name', 'twitter:description', config.description)
  updateMetaTag('name', 'twitter:image', config.image)
  updateMetaTag('name', 'twitter:url', config.url)

  // 5. Mettre a jour l'URL canonique
  // Evite le contenu duplique si la meme page est accessible via plusieurs URLs
  let canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', config.url)
  }
}

/**
 * Preset de SEO pour les pages communes
 * Simplifie l'utilisation en fournissant des configurations pre-faites
 */
export const seoPresets = {
  home: {
    title: 'QuizMaster - Creez et partagez des quiz interactifs',
    description:
      'Plateforme gratuite pour creer des quiz educatifs. Professeurs, creez vos QCM et Vrai/Faux. Eleves, testez vos connaissances.'
  },
  auth: {
    title: 'Connexion - QuizMaster',
    description: 'Connectez-vous ou creez un compte QuizMaster pour acceder a vos quiz.'
  },
  dashboard: {
    title: 'Tableau de bord - QuizMaster',
    description: 'Gerez vos quiz, consultez vos resultats et suivez votre progression.'
  },
  createQuiz: {
    title: 'Creer un quiz - QuizMaster',
    description: 'Creez un nouveau quiz avec des questions QCM ou Vrai/Faux. Simple et rapide.'
  },
  play: {
    title: 'Jouer - QuizMaster',
    description: 'Repondez aux questions et testez vos connaissances.'
  },
  payment: {
    title: 'Passer Premium - QuizMaster',
    description:
      "Debloquez toutes les fonctionnalites avec QuizMaster Premium. Creez jusqu'a 20 quiz."
  }
}
