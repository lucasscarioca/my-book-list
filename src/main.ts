import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

import axios from './plugins/axios'

const app = createApp(App)

app.use(axios, {
  baseUrl: `https://www.googleapis.com/books/v1/volumes?key=${import.meta.env.VITE_GBOOKS_API_KEY}`
})

app.mount('#app')
