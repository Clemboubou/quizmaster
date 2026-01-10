/**
 * Tailwind CSS Configuration
 *
 * ACCESSIBILITE : Focus Visible
 * ==============================
 * Les styles de focus sont CRITIQUES pour l'accessibilite.
 * Les utilisateurs de clavier doivent TOUJOURS voir quel element est selectionne.
 *
 * WCAG 2.1 Critere 2.4.7 (niveau AA) : "Focus Visible"
 * Le focus doit etre clairement visible sur tous les elements interactifs.
 *
 * On personnalise le ring de focus pour qu'il soit :
 * - Plus epais (3px au lieu de 2px par defaut)
 * - Avec un offset pour ne pas coller a l'element
 * - Couleur contrastee (primary-500)
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      /**
       * RING : Personnalisation du focus ring
       * Le "ring" est l'anneau qui apparait autour des elements focuses.
       * On augmente l'epaisseur par defaut pour plus de visibilite.
       */
      ringWidth: {
        DEFAULT: '3px'
      },
      ringOffsetWidth: {
        DEFAULT: '2px'
      }
    }
  },
  plugins: []
}
