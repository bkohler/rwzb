<script lang="ts">
import { ref } from 'vue'

// Used by ErrorBoundary component
export function _catchError(err: Error, info: string) {
  error.value = err
  errorInfo.value = info
  console.error('Error caught:', err, info)
}

export const error = ref<Error | null>(null)
export const errorInfo = ref<string>('')
</script>

<script setup lang="ts">
const error = ref<Error | null>(null)
// @ts-ignore - intentionally unused in template but used in exported function
const errorInfo = ref<string>('')
</script>

<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <h3>Something went wrong</h3>
    <p>{{ error.message }}</p>
    <button @click="error = null">Try again</button>
  </div>
</template>

<style scoped>
.error-boundary {
  padding: 1rem;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;
}
</style>