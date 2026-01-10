<script setup>
/**
 * App.vue - Composant racine de l'application
 *
 * ACCESSIBILITE : Skip Link (Lien d'evitement)
 * =============================================
 * Le "skip link" est un lien invisible qui apparait quand on appuie sur Tab.
 * Il permet aux utilisateurs de clavier de sauter directement au contenu principal
 * sans avoir a naviguer a travers tout le menu de navigation.
 *
 * C'est une exigence WCAG 2.1 niveau A (critere 2.4.1 - Bypass Blocks).
 * Sans ce lien, un utilisateur de clavier devrait presser Tab des dizaines
 * de fois pour atteindre le contenu principal a chaque changement de page.
 */
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!--
      SKIP LINK : Lien d'evitement pour l'accessibilite
      ==================================================
      - Position absolue hors ecran par defaut (-top-10)
      - Apparait quand il recoit le focus (focus:top-0)
      - Lien vers #main-content qui est sur le <main>
      - Style tres visible pour que l'utilisateur le voie
    -->
    <a
      href="#main-content"
      class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:text-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
    >
      Aller au contenu principal
    </a>

    <Navbar />

    <!--
      MAIN : Contenu principal avec id pour le skip link
      L'attribut id="main-content" permet au skip link de fonctionner.
      tabindex="-1" permet de recevoir le focus programmatiquement.
    -->
    <main id="main-content" tabindex="-1" class="focus:outline-none">
      <RouterView />
    </main>
  </div>
</template>
