import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'

console.log('Mounting Vue app...')
const app = createApp(App)
app.component('ErrorBoundary', ErrorBoundary)

const root = document.getElementById('app')
if (!root) {
  console.error('Failed to find mount element #app')
} else {
  console.log('Found mount element:', root)
  app.mount('#app')
  console.log('App mounted successfully')
}
