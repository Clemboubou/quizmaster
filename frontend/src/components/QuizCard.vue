<script setup>
import { ref } from 'vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit', 'delete', 'view-results'])

const showCode = ref(false)

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function copyCode() {
  navigator.clipboard.writeText(props.quiz.access_code)
  alert('Code copie !')
}
</script>

<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ quiz.title }}</h3>
        <p class="text-sm text-gray-500 mt-1">Cree le {{ formatDate(quiz.created_at) }}</p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          class="text-sm text-primary-600 hover:text-primary-800"
          @click="showCode = !showCode"
        >
          {{ showCode ? 'Masquer' : 'Voir le code' }}
        </button>
      </div>
    </div>

    <div v-if="showCode" class="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
      <span class="font-mono text-2xl font-bold text-primary-600">
        {{ quiz.access_code }}
      </span>
      <button class="text-sm text-gray-600 hover:text-gray-800" @click="copyCode">Copier</button>
    </div>

    <div v-if="showActions" class="mt-4 flex space-x-2">
      <router-link :to="`/create-quiz?edit=${quiz.id}`" class="btn btn-secondary text-sm">
        Modifier
      </router-link>
      <button class="btn btn-secondary text-sm" @click="emit('view-results', quiz.id)">
        Resultats
      </button>
      <button class="btn btn-danger text-sm" @click="emit('delete', quiz.id)">Supprimer</button>
    </div>
  </div>
</template>
