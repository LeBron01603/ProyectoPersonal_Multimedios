// =========================================================
// useEstadoJuego.js — Composable de estado global del juego
// Maneja: pantalla activa, identidad del héroe, progreso,
// inventario, logros, colección de recuerdos y checkpoints.
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
  personalidad: '' // Representa el "Estilo inicial del héroe"
})

// reactive: para estadísticas del juego
const estadisticasHeroe = reactive({
  energia:         80,
  conocimiento:    10,
  diversion:       10,
  responsabilidad: 80
})

// ref: provincia/misión activa
const provinciaActiva = ref(null)

// ref: historial de misiones completadas
const misionesCompletadas = ref([])

// --- NUEVOS ESTADOS FASE 2 PREP ---
// Checkpoints (Hitos de aventura)
const checkpointsDesbloqueados = ref([])

// Colección del After (Recuerdos / Trofeos culturales)
const coleccionAfter = ref([])

// Inventario del Héroe (Objetos recolectados)
const inventarioHeroe = ref([])

// Logros (Trofeos del sistema)
const logrosHeroe = ref([])

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
// Funciones del ciclo de juego e identidad
// =========================================================

/** Aplica las bonificaciones iniciales basadas en el estilo inicial */
function aplicarBonificacionesIniciales(estilo) {
  // Inicializamos a base
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80 })
  
  switch (estilo) {
    case 'responsable':
      estadisticasHeroe.responsabilidad = 100
      break
    case 'aventurero':
      estadisticasHeroe.energia = 100
      break
    case 'equilibrado':
      estadisticasHeroe.diversion += 10
      estadisticasHeroe.responsabilidad += 10 // Representa equilibrio
      break
    case 'nocturno':
      estadisticasHeroe.conocimiento += 20
      break
  }
}

/** Cambia la pantalla activa */
function navegarA(pantalla) {
  pantallaActual.value = pantalla
}

/** Guarda la identidad del héroe, aplica bonificaciones iniciales y va al mapa */
function confirmarIdentidad(identidad) {
  Object.assign(identidadHeroe, identidad)
  aplicarBonificacionesIniciales(identidad.personalidad)
  navegarA(PANTALLAS.MAPA)
}

/** Edita la identidad del héroe sin reiniciar ningún progreso ni estadística */
function actualizarIdentidad(nuevaIdentidad) {
  Object.assign(identidadHeroe, nuevaIdentidad)
}

/** Inicia misión en una provincia específica */
function iniciarMision(provincia) {
  provinciaActiva.value = provincia
  navegarA(PANTALLAS.JUEGO)
}

/** Registra misión completada, otorga recompensas (coleccionables, checkpoints, objetos) y actualiza logros */
function completarMision(idProvincia, puntaje) {
  if (!misionesCompletadas.value.includes(idProvincia)) {
    misionesCompletadas.value.push(idProvincia)
  }

  // Actualizar estadísticas según puntaje (0-100)
  estadisticasHeroe.conocimiento    = Math.min(100, estadisticasHeroe.conocimiento + Math.floor(puntaje * 0.3))
  estadisticasHeroe.diversion       = Math.min(100, estadisticasHeroe.diversion + Math.floor(puntaje * 0.2))
  estadisticasHeroe.responsabilidad = Math.min(100, estadisticasHeroe.responsabilidad + Math.floor(puntaje * 0.1))
  estadisticasHeroe.energia         = Math.max(0, estadisticasHeroe.energia - 10)

  // Otorgar recompensas basadas en la provincia activa
  if (provinciaActiva.value) {
    const recompensaCol = provinciaActiva.value.recompensaColeccionable
    const recompensaCheck = provinciaActiva.value.recompensaCheckpoint

    // 1. Desbloquear Colección del After
    if (recompensaCol && !coleccionAfter.value.some(c => c.nombre === recompensaCol.nombre)) {
      coleccionAfter.value.push(recompensaCol)
      
      // Agregar al Inventario
      inventarioHeroe.value.push(recompensaCol)
    }

    // 2. Desbloquear Checkpoint
    if (recompensaCheck && !checkpointsDesbloqueados.value.some(ch => ch.nombre === recompensaCheck.nombre)) {
      checkpointsDesbloqueados.value.push(recompensaCheck)
    }

    // 3. Desbloquear Pases VIP específicos (Inventario adicional)
    if (idProvincia === 'san-jose') {
      const paseLaCali = { nombre: "Pase VIP La Cali", emoji: "🎟" }
      if (!inventarioHeroe.value.some(i => i.nombre === paseLaCali.nombre)) {
        inventarioHeroe.value.push(paseLaCali)
      }
    } else if (idProvincia === 'guanacaste') {
      const paseSharkys = { nombre: "Pase VIP Sharky's", emoji: "🎟" }
      if (!inventarioHeroe.value.some(i => i.nombre === paseSharkys.nombre)) {
        inventarioHeroe.value.push(paseSharkys)
      }
    } else if (idProvincia === 'limon') {
      const pasePuerto = { nombre: "Pase VIP Puerto Viejo", emoji: "🎟" }
      if (!inventarioHeroe.value.some(i => i.nombre === pasePuerto.nombre)) {
        inventarioHeroe.value.push(pasePuerto)
      }
    }
  }

  // 4. Sistema de Logros
  // Logro: Primer After
  if (misionesCompletadas.value.length === 1) {
    agregarLogro("Primer After", "🏆")
  }
  // Logro: Conquistador de Guanacaste
  if (idProvincia === 'guanacaste') {
    agregarLogro("Conquistador de Guanacaste", "🏆")
  }
  // Logro: Rey de la Cali
  if (idProvincia === 'san-jose') {
    agregarLogro("Rey de la Cali", "🏆")
  }
  // Logro: Leyenda Caribeña
  if (idProvincia === 'limon') {
    agregarLogro("Leyenda Caribeña", "🏆")
  }
  // Logro: Héroe Nacional
  if (misionesCompletadas.value.length === 7) {
    agregarLogro("Héroe Nacional", "🏆")
  }

  navegarA(PANTALLAS.RESULTADO)
}

/** Añade un logro si no ha sido desbloqueado anteriormente */
function agregarLogro(nombre, emoji) {
  if (!logrosHeroe.value.some(l => l.nombre === nombre)) {
    logrosHeroe.value.push({ nombre, emoji })
  }
}

/** Reinicia el juego desde cero */
function reiniciarJuego() {
  pantallaActual.value = PANTALLAS.INICIO
  provinciaActiva.value = null
  misionesCompletadas.value = []
  checkpointsDesbloqueados.value = []
  coleccionAfter.value = []
  inventarioHeroe.value = []
  logrosHeroe.value = []
  Object.assign(identidadHeroe, { nombre: '', universidad: '', carrera: '', deporte: '', personalidad: '' })
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80 })
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
    checkpointsDesbloqueados,
    coleccionAfter,
    inventarioHeroe,
    logrosHeroe,

    // Computed
    identidadCompleta,
    porcentajeProgreso,

    // Acciones
    navegarA,
    confirmarIdentidad,
    actualizarIdentidad,
    iniciarMision,
    completarMision,
    reiniciarJuego,

    // Constantes
    PANTALLAS
  }
}
