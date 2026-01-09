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
  <form @submit.prevent="handleSubmit" class="card">
    <h3 class="text-lg font-semibold mb-4">
      {{ question ? 'Modifier la question' : 'Nouvelle question' }}
    </h3>

    <!-- Type -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select v-model="type" class="input">
        <option value="qcm">QCM (4 choix)</option>
        <option value="vf">Vrai / Faux</option>
      </select>
    </div>

    <!-- Question -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Question</label>
      <textarea
        v-model="questionText"
        class="input"
        rows="3"
        placeholder="Entrez votre question (min. 10 caracteres)"
      ></textarea>
      <p v-if="questionText.length > 0 && questionText.length < 10" class="error-text">
        Minimum 10 caracteres
      </p>
    </div>

    <!-- Options -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Options
        <span class="text-gray-400 font-normal">(cliquez pour selectionner la bonne reponse)</span>
      </label>
      <div class="space-y-2">
        <div
          v-for="(option, index) in options"
          :key="index"
          @click="(type === 'vf' || options[index]) && (correctAnswerIndex = index)"
          :class="[
            'flex items-center rounded-lg border-2 transition-all cursor-pointer',
            correctAnswerIndex === index
              ? 'border-green-500 bg-green-50'
              : correctAnswerIndex >= 0 && correctAnswerIndex !== index
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <input
            v-if="type === 'qcm'"
            v-model="options[index]"
            type="text"
            class="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3"
            :placeholder="`Option ${index + 1}`"
            @click.stop
          />
          <span v-else class="flex-1 px-4 py-3 font-medium">{{ option }}</span>
          <span v-if="correctAnswerIndex === index" class="px-3 text-green-600 font-medium">
            Correcte
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2">
      <button type="submit" :disabled="!isValid" class="btn btn-primary">
        {{ question ? 'Modifier' : 'Ajouter' }}
      </button>
      <button type="button" @click="emit('cancel')" class="btn btn-secondary">Annuler</button>
    </div>
  </form>
</template>
