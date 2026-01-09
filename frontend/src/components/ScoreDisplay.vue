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
  <div class="card max-w-md mx-auto text-center">
    <div class="text-6xl mb-4">{{ emoji }}</div>

    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ message }}</h2>

    <p v-if="quizTitle" class="text-gray-600 mb-6">{{ quizTitle }}</p>

    <div class="bg-gray-100 rounded-xl p-6 mb-6">
      <div class="text-5xl font-bold text-primary-600">{{ score }} / {{ total }}</div>
      <div class="text-gray-500 mt-2">{{ percentage }}% de reussite</div>
    </div>

    <!-- Barre de progression -->
    <div class="w-full bg-gray-200 rounded-full h-4 mb-6">
      <div
        class="h-4 rounded-full transition-all duration-500"
        :class="{
          'bg-green-500': percentage >= 80,
          'bg-yellow-500': percentage >= 50 && percentage < 80,
          'bg-red-500': percentage < 50
        }"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>

    <button class="btn btn-primary w-full" @click="emit('back')">Retour au tableau de bord</button>
  </div>
</template>
