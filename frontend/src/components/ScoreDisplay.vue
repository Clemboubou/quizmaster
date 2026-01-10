<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  quizTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['back'])

const percentage = computed(() => Math.round((props.score / props.total) * 100))

const message = computed(() => {
  if (percentage.value === 100) return 'Parfait !'
  if (percentage.value >= 80) return 'Excellent !'
  if (percentage.value >= 60) return 'Bien joue !'
  if (percentage.value >= 40) return 'Pas mal !'
  return 'Continuez vos efforts !'
})

const emoji = computed(() => {
  if (percentage.value === 100) return '🏆'
  if (percentage.value >= 80) return '🌟'
  if (percentage.value >= 60) return '👍'
  if (percentage.value >= 40) return '💪'
  return '📚'
})
</script>

<template>
  <!--
    ACCESSIBILITE : Affichage du score accessible
    ==============================================
    - role="status" avec aria-live pour annoncer le resultat
    - aria-hidden sur les elements decoratifs (emoji)
    - Barre de progression avec role="progressbar"
    - Score annonce de maniere claire pour les lecteurs d'ecran
  -->
  <div
    class="card max-w-md mx-auto text-center"
    role="status"
    aria-live="polite"
    aria-label="Resultat du quiz"
  >
    <!-- Emoji decoratif : cache aux lecteurs d'ecran -->
    <div class="text-6xl mb-4" aria-hidden="true">{{ emoji }}</div>

    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ message }}</h2>

    <p v-if="quizTitle" class="text-gray-600 mb-6">{{ quizTitle }}</p>

    <!--
      SCORE : Accessible aux lecteurs d'ecran
      Le texte sr-only fournit une description complete pour les lecteurs d'ecran
    -->
    <div class="bg-gray-100 rounded-xl p-6 mb-6">
      <div class="text-5xl font-bold text-primary-600" aria-hidden="true">
        {{ score }} / {{ total }}
      </div>
      <div class="text-gray-500 mt-2" aria-hidden="true">{{ percentage }}% de reussite</div>
      <!-- Version accessible pour lecteurs d'ecran -->
      <span class="sr-only">
        Vous avez obtenu {{ score }} bonnes reponses sur {{ total }} questions, soit
        {{ percentage }} pourcent de reussite.
      </span>
    </div>

    <!--
      BARRE DE PROGRESSION : Avec role="progressbar"
      - aria-valuenow pour la valeur actuelle
      - aria-label pour decrire ce que represente la progression
    -->
    <div
      class="w-full bg-gray-200 rounded-full h-4 mb-6"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Score : ${percentage} pourcent`"
    >
      <div
        class="h-4 rounded-full transition-all duration-500"
        :class="{
          'bg-green-500': percentage >= 80,
          'bg-yellow-500': percentage >= 50 && percentage < 80,
          'bg-red-500': percentage < 50
        }"
        :style="{ width: `${percentage}%` }"
        aria-hidden="true"
      ></div>
    </div>

    <button
      type="button"
      class="btn btn-primary w-full focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      @click="emit('back')"
    >
      Retour au tableau de bord
    </button>
  </div>
</template>
