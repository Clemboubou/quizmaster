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
  <div class="card max-w-2xl mx-auto">
    <!-- Progress -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>Question {{ questionNumber }} / {{ totalQuestions }}</span>
        <span>{{ Math.round((questionNumber / totalQuestions) * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(questionNumber / totalQuestions) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Question -->
    <h2 class="text-xl font-semibold text-gray-900 mb-6">
      {{ question.question_text }}
    </h2>

    <!-- Options -->
    <div class="space-y-3 mb-6">
      <button
        v-for="(option, index) in options"
        :key="index"
        :class="[
          'w-full p-4 text-left rounded-lg border-2 transition-all',
          selectedAnswer === option
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
        @click="selectedAnswer = option"
      >
        <span class="font-medium">{{ String.fromCharCode(65 + index) }}.</span>
        {{ option }}
      </button>
    </div>

    <!-- Submit -->
    <button
      :disabled="!selectedAnswer"
      class="btn btn-primary w-full py-3"
      :class="{ 'opacity-50 cursor-not-allowed': !selectedAnswer }"
      @click="submitAnswer"
    >
      {{ questionNumber === totalQuestions ? 'Terminer' : 'Question suivante' }}
    </button>
  </div>
</template>
