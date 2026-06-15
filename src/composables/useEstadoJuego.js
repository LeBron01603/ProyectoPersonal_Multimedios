// =========================================================
// useEstadoJuego.js — Composable de estado global del juego
// Maneja: pantalla activa, identidad del héroe, progreso
// =========================================================

import { ref, reactive, computed } from 'vue'

// --- Tipos de pantallas del juego ---
export const PANTALLAS = {
  INICIO:    'inicio',
  IDENTIDAD: 'identidad',
  MAPA:      'mapa',
  JUEGO:     'juego',
  RESULTADO: 'resultado'
}

// --- Estado global reactivo (singleton por sesión) ---
const pantallaActual = ref(PANTALLAS.INICIO)
const estaCargando   = ref(false)

// reactive: para el objeto de identidad del héroe
const identidadHeroe = reactive({
  nombre:       '',
  universidad:  '',
  carrera:      '',
  deporte:      '',
  personalidad: ''
})

// reactive: para estadísticas del juego
const estadisticasHeroe = reactive({
  energia:         100,
  conocimiento:    0,
  diversion:       0,
  responsabilidad: 100
})

// ref: provincia/misión activa
const provinciaActiva = ref(null)

// ref: historial de misiones completadas
const misionesCompletadas = ref([])

// --- Computed: ¿identidad está completa? ---
const identidadCompleta = computed(() =>
  identidadHeroe.nombre.trim() !== '' &&
  identidadHeroe.universidad !== '' &&
  identidadHeroe.carrera !== '' &&
  identidadHeroe.personalidad !== ''
)

// --- Computed: porcentaje de misiones completadas ---
const porcentajeProgreso = computed(() => {
  if (misionesCompletadas.value.length === 0) return 0
  return Math.round((misionesCompletadas.value.length / 7) * 100)
})

// =========================================================
// Funciones de navegación
// =========================================================

/** Cambia la pantalla activa */
function navegarA(pantalla) {
  pantallaActual.value = pantalla
}

/** Guarda la identidad del héroe y va al mapa */
function confirmarIdentidad(identidad) {
  Object.assign(identidadHeroe, identidad)
  navegarA(PANTALLAS.MAPA)
}

/** Inicia misión en una provincia específica */
function iniciarMision(provincia) {
  provinciaActiva.value = provincia
  navegarA(PANTALLAS.JUEGO)
}

/** Registra misión completada y actualiza estadísticas */
function completarMision(idProvincia, puntaje) {
  if (!misionesCompletadas.value.includes(idProvincia)) {
    misionesCompletadas.value.push(idProvincia)
  }
  // Actualizar estadísticas según puntaje (0-100)
  estadisticasHeroe.conocimiento    = Math.min(100, estadisticasHeroe.conocimiento + Math.floor(puntaje * 0.3))
  estadisticasHeroe.diversion       = Math.min(100, estadisticasHeroe.diversion + Math.floor(puntaje * 0.2))
  estadisticasHeroe.responsabilidad = Math.min(100, estadisticasHeroe.responsabilidad + Math.floor(puntaje * 0.1))
  estadisticasHeroe.energia         = Math.max(0, estadisticasHeroe.energia - 10)

  navegarA(PANTALLAS.RESULTADO)
}

/** Reinicia el juego desde cero */
function reiniciarJuego() {
  pantallaActual.value = PANTALLAS.INICIO
  provinciaActiva.value = null
  misionesCompletadas.value = []
  Object.assign(identidadHeroe, { nombre: '', universidad: '', carrera: '', deporte: '', personalidad: '' })
  Object.assign(estadisticasHeroe, { energia: 100, conocimiento: 0, diversion: 0, responsabilidad: 100 })
}

// =========================================================
// Export del composable
// =========================================================
export function useEstadoJuego() {
  return {
    // Estado
    pantallaActual,
    estaCargando,
    identidadHeroe,
    estadisticasHeroe,
    provinciaActiva,
    misionesCompletadas,

    // Computed
    identidadCompleta,
    porcentajeProgreso,

    // Acciones
    navegarA,
    confirmarIdentidad,
    iniciarMision,
    completarMision,
    reiniciarJuego,

    // Constantes
    PANTALLAS
  }
}
