<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['answer'])

const selectedAnswer = ref(null)

const options = computed(() => {
  return typeof props.question.options === 'string'
    ? JSON.parse(props.question.options)
    : props.question.options
})

function submitAnswer() {
  if (selectedAnswer.value) {
    emit('answer', selectedAnswer.value)
    selectedAnswer.value = null
  }
}
</script>

<template>
  <!--
    ACCESSIBILITE : Affichage de question accessible
    =================================================
    - Barre de progression avec aria-label et aria-valuenow
    - Question annoncee avec aria-live pour le changement
    - Options navigables au clavier avec role="radiogroup"
    - Raccourcis clavier 1-4 ou A-D pour selection rapide
    - Focus visible sur toutes les options
  -->
  <div class="card max-w-2xl mx-auto" role="region" aria-label="Question du quiz">
    <!--
      BARRE DE PROGRESSION : Accessible aux lecteurs d'ecran
      - role="progressbar" indique que c'est une barre de progression
      - aria-valuenow/min/max pour la valeur actuelle
      - aria-label pour decrire ce que represente la progression
    -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>Question {{ questionNumber }} / {{ totalQuestions }}</span>
        <span aria-hidden="true">{{ Math.round((questionNumber / totalQuestions) * 100) }}%</span>
      </div>
      <div
        class="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        :aria-valuenow="questionNumber"
        :aria-valuemin="1"
        :aria-valuemax="totalQuestions"
        :aria-label="`Progression : question ${questionNumber} sur ${totalQuestions}`"
      >
        <div
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(questionNumber / totalQuestions) * 100}%` }"
          aria-hidden="true"
        ></div>
      </div>
    </div>

    <!--
      QUESTION : Annoncee aux lecteurs d'ecran
      aria-live="polite" annonce le changement de question
    -->
    <h2 id="current-question" class="text-xl font-semibold text-gray-900 mb-6" aria-live="polite">
      {{ question.question_text }}
    </h2>

    <!--
      OPTIONS : Navigation clavier complete
      - role="radiogroup" pour les lecteurs d'ecran
      - Chaque option est un bouton focusable
      - Raccourcis : touches 1-4 ou A-D pour selectionner
      - Tab pour naviguer, Entree pour valider
    -->
    <fieldset class="mb-6 border-0 p-0 m-0">
      <legend class="sr-only">
        Choisissez votre reponse. Utilisez les touches 1 a {{ options.length }} ou A a
        {{ String.fromCharCode(64 + options.length) }} pour selectionner rapidement.
      </legend>
      <div class="space-y-3" role="radiogroup" aria-labelledby="current-question">
        <button
          v-for="(option, index) in options"
          :key="index"
          type="button"
          role="radio"
          :aria-checked="selectedAnswer === option"
          :aria-label="`Option ${String.fromCharCode(65 + index)}: ${option}`"
          :class="[
            'w-full p-4 text-left rounded-lg border-2 transition-all focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none',
            selectedAnswer === option
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          ]"
          @click="selectedAnswer = option"
          @keydown.1="options[0] && (selectedAnswer = options[0])"
          @keydown.2="options[1] && (selectedAnswer = options[1])"
          @keydown.3="options[2] && (selectedAnswer = options[2])"
          @keydown.4="options[3] && (selectedAnswer = options[3])"
          @keydown.a="options[0] && (selectedAnswer = options[0])"
          @keydown.b="options[1] && (selectedAnswer = options[1])"
          @keydown.c="options[2] && (selectedAnswer = options[2])"
          @keydown.d="options[3] && (selectedAnswer = options[3])"
        >
          <span class="font-medium" aria-hidden="true">{{ String.fromCharCode(65 + index) }}.</span>
          {{ option }}
        </button>
      </div>
    </fieldset>

    <!--
      BOUTON VALIDER : Etats accessibles
      - aria-disabled pour indiquer l'etat
      - Message clair sur l'action
    -->
    <button
      type="button"
      :disabled="!selectedAnswer"
      :aria-disabled="!selectedAnswer"
      class="btn btn-primary w-full py-3 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      :class="{ 'opacity-50 cursor-not-allowed': !selectedAnswer }"
      @click="submitAnswer"
    >
      {{ questionNumber === totalQuestions ? 'Terminer le quiz' : 'Question suivante' }}
    </button>

    <!-- Instructions clavier (visibles uniquement au focus clavier) -->
    <p class="sr-only">
      Appuyez sur les touches 1 a {{ options.length }} ou A a
      {{ String.fromCharCode(64 + options.length) }} pour selectionner une reponse rapidement.
    </p>
  </div>
</template>
