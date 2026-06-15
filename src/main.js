// =========================================================
// main.js — Punto de entrada de la aplicación Vue 3
// Ruta Tica: El Héroe del After
// =========================================================

import { createApp } from 'vue'
import App from './App.vue'

// Importar estilos globales (base importa variables y animaciones)
import './styles/base.css'

// Crear e iniciar la aplicación Vue
const app = createApp(App)

// En fases posteriores se pueden registrar plugins aquí:
// - Vue Router (si se migra a rutas nombradas)
// - Pinia (gestión de estado global persistente)
// - i18n (internacionalización)

app.mount('#app')
