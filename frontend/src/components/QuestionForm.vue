<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    default: null
  },
  quizId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const type = ref('qcm')
const questionText = ref('')
const options = ref(['', '', '', ''])
const correctAnswerIndex = ref(-1)

// Si modification, remplir les champs
watch(
  () => props.question,
  newQuestion => {
    if (newQuestion) {
      type.value = newQuestion.type
      questionText.value = newQuestion.question_text
      const parsedOptions =
        typeof newQuestion.options === 'string'
          ? JSON.parse(newQuestion.options)
          : [...newQuestion.options]
      options.value = parsedOptions
      correctAnswerIndex.value = parsedOptions.indexOf(newQuestion.correct_answer)
    } else {
      // Reset form
      type.value = 'qcm'
      questionText.value = ''
      options.value = ['', '', '', '']
      correctAnswerIndex.value = -1
    }
  },
  { immediate: true }
)

// Ajuster les options selon le type
watch(type, newType => {
  if (newType === 'vf') {
    options.value = ['Vrai', 'Faux']
  } else if (options.value.length === 2) {
    options.value = ['', '', '', '']
  }
  correctAnswerIndex.value = -1
})

const isValid = computed(() => {
  if (questionText.value.length < 10) return false
  if (type.value === 'qcm' && options.value.some(o => !o.trim())) return false
  if (correctAnswerIndex.value < 0) return false
  if (!options.value[correctAnswerIndex.value]) return false
  return true
})

function handleSubmit() {
  if (!isValid.value) return

  emit('submit', {
    quiz_id: props.quizId,
    type: type.value,
    question_text: questionText.value,
    options: options.value,
    correct_answer: options.value[correctAnswerIndex.value]
  })

  // Reset form
  if (!props.question) {
    questionText.value = ''
    options.value = type.value === 'vf' ? ['Vrai', 'Faux'] : ['', '', '', '']
    correctAnswerIndex.value = -1
  }
}
</script>

<template>
  <!--
    ACCESSIBILITE : Formulaire de question accessible
    ==================================================
    - Labels lies aux champs par for/id
    - Groupe d'options avec role="radiogroup"
    - Navigation clavier avec Enter/Space pour selectionner
    - Annonces aux lecteurs d'ecran
  -->
  <form class="card" aria-label="Formulaire de question" @submit.prevent="handleSubmit">
    <h3 id="question-form-title" class="text-lg font-semibold mb-4">
      {{ question ? 'Modifier la question' : 'Nouvelle question' }}
    </h3>

    <!-- Type de question -->
    <div class="mb-4">
      <label for="question-type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select id="question-type" v-model="type" class="input">
        <option value="qcm">QCM (4 choix)</option>
        <option value="vf">Vrai / Faux</option>
      </select>
    </div>

    <!-- Texte de la question -->
    <div class="mb-4">
      <label for="question-text" class="block text-sm font-medium text-gray-700 mb-1">
        Question
      </label>
      <textarea
        id="question-text"
        v-model="questionText"
        class="input"
        rows="3"
        placeholder="Entrez votre question (min. 10 caracteres)"
        :aria-describedby="
          questionText.length > 0 && questionText.length < 10 ? 'question-error' : undefined
        "
        :aria-invalid="questionText.length > 0 && questionText.length < 10"
      ></textarea>
      <p
        v-if="questionText.length > 0 && questionText.length < 10"
        id="question-error"
        role="alert"
        class="error-text"
      >
        Minimum 10 caracteres
      </p>
    </div>

    <!--
      OPTIONS : Groupe de selection de la bonne reponse
      - role="radiogroup" pour les lecteurs d'ecran
      - Chaque option est focusable avec tabindex
      - Navigation clavier avec Enter et Space
    -->
    <fieldset class="mb-4 border-0 p-0 m-0">
      <legend class="block text-sm font-medium text-gray-700 mb-1">
        Options
        <span class="text-gray-400 font-normal">
          (cliquez ou appuyez Entree pour selectionner la bonne reponse)
        </span>
      </legend>
      <div class="space-y-2" role="radiogroup" aria-label="Selection de la bonne reponse">
        <div
          v-for="(option, index) in options"
          :key="index"
          role="radio"
          :tabindex="type === 'vf' || options[index] ? 0 : -1"
          :aria-checked="correctAnswerIndex === index"
          :aria-label="type === 'vf' ? option : `Option ${index + 1}: ${options[index] || 'vide'}`"
          :class="[
            'flex items-center rounded-lg border-2 transition-all',
            type === 'vf' || options[index]
              ? 'cursor-pointer focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              : '',
            correctAnswerIndex === index
              ? 'border-green-500 bg-green-50'
              : correctAnswerIndex >= 0 && correctAnswerIndex !== index
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
          ]"
          @click="(type === 'vf' || options[index]) && (correctAnswerIndex = index)"
          @keydown.enter.prevent="(type === 'vf' || options[index]) && (correctAnswerIndex = index)"
          @keydown.space.prevent="(type === 'vf' || options[index]) && (correctAnswerIndex = index)"
        >
          <label v-if="type === 'qcm'" :for="`option-${index}`" class="sr-only">
            Option {{ index + 1 }}
          </label>
          <input
            v-if="type === 'qcm'"
            :id="`option-${index}`"
            v-model="options[index]"
            type="text"
            class="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3"
            :placeholder="`Option ${index + 1}`"
            @click.stop
          />
          <span v-else class="flex-1 px-4 py-3 font-medium">{{ option }}</span>
          <span
            v-if="correctAnswerIndex === index"
            class="px-3 text-green-600 font-medium"
            aria-hidden="true"
          >
            Correcte
          </span>
        </div>
      </div>
    </fieldset>

    <!-- Actions -->
    <div class="flex space-x-2">
      <button
        type="submit"
        :disabled="!isValid"
        :aria-disabled="!isValid"
        class="btn btn-primary"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
      >
        {{ question ? 'Modifier' : 'Ajouter' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>
