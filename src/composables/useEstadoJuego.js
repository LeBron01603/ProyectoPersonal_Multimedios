// =========================================================
// useEstadoJuego.js — Composable de estado global del juego
// Maneja: pantalla activa, identidad del héroe, progreso,
// inventario, logros, colección de recuerdos y checkpoints.
// =========================================================

import { ref, reactive, computed } from 'vue'
import { useAudio } from './useAudio.js'

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
  responsabilidad: 80,
  reputacionNocturna: 50
})

// reactive: copia de estadísticas antes de iniciar una misión para cálculo exacto de deltas
const estadisticasPreMision = reactive({
  energia:         80,
  conocimiento:    10,
  diversion:       10,
  responsabilidad: 80,
  reputacionNocturna: 50
})

// ref: provincia/misión activa
const provinciaActiva = ref(null)

// ref: historial de misiones completadas
const misionesCompletadas = ref([])

// --- NUEVOS ESTADOS FASE 2 PREP ---
// Checkpoints (Hitos de aventura) - Vinculados a la recompensa secundaria
const checkpointsDesbloqueados = ref([])

// Colección del After (Recuerdos / Trofeos culturales) - Vinculados a la recompensa principal
const coleccionAfter = ref([])

// Inventario del Héroe (Objetos recolectados)
const inventarioHeroe = ref([])

// Logros (Trofeos del sistema)
const logrosHeroe = ref([])

// --- SISTEMA DE EXPERIENCIA Y NIVEL ---
const experienciaHeroe = ref(0)
const nivelHeroe = ref(1)
const ultimoPuntajeMision = ref(0)

// --- TÍTULOS FINALES PREVISTOS ---
const titulosFinales = [
  { id: 'leyenda', nombre: 'Leyenda del After Responsable', emoji: '🌙', descripcion: 'Para quienes lideran con el ejemplo y la responsabilidad.' },
  { id: 'sabio', nombre: 'Sabio Nocturno', emoji: '📚', descripcion: 'Para quienes priorizan el conocimiento ante todo.' },
  { id: 'aventurero', nombre: 'Aventurero Costero', emoji: '🏄', descripcion: 'Para los apasionados de explorar los litorales y la naturaleza.' },
  { id: 'maestro', nombre: 'Maestro de la Diversión', emoji: '🎉', descripcion: 'Para quienes dominan el arte de disfrutar la fiesta al máximo.' },
  { id: 'heroe', nombre: 'Héroe Nacional del After', emoji: '🏆', descripcion: '¡Concedido al salvar las 7 provincias de Costa Rica!' }
]

// Título final proyectado basado en estadísticas dominantes (Lógica de preparación)
const tituloFinal = computed(() => {
  if (misionesCompletadas.value.length < 7) {
    return {
      nombre: 'Héroe en Entrenamiento',
      emoji: '🦸‍♂️',
      descripcion: 'Completa todas las provincias para obtener tu título definitivo.'
    }
  }

  // Si completó las 7 provincias, determinar el título final basado en las estadísticas
  const { conocimiento, diversion, responsabilidad } = estadisticasHeroe
  if (responsabilidad >= 85 && responsabilidad >= conocimiento && responsabilidad >= diversion) {
    return titulosFinales.find(t => t.id === 'leyenda')
  } else if (conocimiento >= 85 && conocimiento >= responsabilidad && conocimiento >= diversion) {
    return titulosFinales.find(t => t.id === 'sabio')
  } else if (diversion >= 85 && diversion >= responsabilidad && diversion >= conocimiento) {
    return titulosFinales.find(t => t.id === 'maestro')
  } else {
    return titulosFinales.find(t => t.id === 'heroe')
  }
})

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
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80, reputacionNocturna: 50 })
  
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

function aplicarBonificacionesCarrera(carrera) {
  if (carrera === 'EducacionFisica') {
    estadisticasHeroe.energia = Math.min(100, estadisticasHeroe.energia + 15)
  } else if (['Artes', 'Educacion', 'Otra'].includes(carrera)) {
    estadisticasHeroe.diversion = Math.min(100, estadisticasHeroe.diversion + 10)
  }
}

/** Guarda la identidad del héroe, aplica bonificaciones iniciales y va al mapa */
function confirmarIdentidad(identidad) {
  Object.assign(identidadHeroe, identidad)
  aplicarBonificacionesIniciales(identidad.personalidad)
  aplicarBonificacionesCarrera(identidad.carrera)
  navegarA(PANTALLAS.MAPA)
}

/** Edita la identidad del héroe sin reiniciar ningún progreso ni estadística */
function actualizarIdentidad(nuevaIdentidad) {
  Object.assign(identidadHeroe, nuevaIdentidad)
}

/** Inicia misión en una provincia específica */
function iniciarMision(provincia) {
  Object.assign(estadisticasPreMision, estadisticasHeroe)
  provinciaActiva.value = provincia
  navegarA(PANTALLAS.JUEGO)
}

/** Agrega puntos de experiencia y evalúa si sube de nivel */
function ganarExperiencia(cantidad) {
  experienciaHeroe.value += cantidad
  
  // Umbrales de nivel:
  // Nivel 1: 0 - 99 XP
  // Nivel 2: 100 - 249 XP
  // Nivel 3: 250 - 449 XP
  // Nivel 4: 450 - 699 XP
  // Nivel 5: 700+ XP (Héroe Máximo)
  let nuevoNivel = 1
  if (experienciaHeroe.value >= 700) {
    nuevoNivel = 5
  } else if (experienciaHeroe.value >= 450) {
    nuevoNivel = 4
  } else if (experienciaHeroe.value >= 250) {
    nuevoNivel = 3
  } else if (experienciaHeroe.value >= 100) {
    nuevoNivel = 2
  }

  if (nuevoNivel > nivelHeroe.value) {
    nivelHeroe.value = nuevoNivel
    const { reproducirEfecto } = useAudio()
    reproducirEfecto('subirNivel')
  }
}

/** Registra misión completada, otorga recompensas (principales, secundarias) y actualiza logros */
function completarMision(idProvincia, puntaje) {
  if (!misionesCompletadas.value.includes(idProvincia)) {
    misionesCompletadas.value.push(idProvincia)
  }
  ultimoPuntajeMision.value = puntaje

  // Actualizar estadísticas según puntaje (0-100)
  estadisticasHeroe.conocimiento    = Math.min(100, estadisticasHeroe.conocimiento + Math.floor(puntaje * 0.3))
  estadisticasHeroe.diversion       = Math.min(100, estadisticasHeroe.diversion + Math.floor(puntaje * 0.2))
  
  // Responsabilidad: si el puntaje es bajo (< 50) se pierde responsabilidad. Derecho reduce esta pérdida a la mitad.
  let cambioResponsabilidad = Math.floor(puntaje * 0.1)
  if (puntaje < 50) {
    let perdida = Math.floor((50 - puntaje) * 0.2) // Máx 10 de pérdida
    if (identidadHeroe.carrera === 'Derecho') {
      perdida = Math.floor(perdida / 2)
    }
    estadisticasHeroe.responsabilidad = Math.max(0, estadisticasHeroe.responsabilidad - perdida)
  } else {
    estadisticasHeroe.responsabilidad = Math.min(100, estadisticasHeroe.responsabilidad + cambioResponsabilidad)
  }

  estadisticasHeroe.energia         = Math.max(0, estadisticasHeroe.energia - 10)

  // Otorgar experiencia extra (+50 XP por completar misión)
  ganarExperiencia(50)

  // Otorgar recompensas basadas en la provincia activa
  if (provinciaActiva.value) {
    const recompensaPri = provinciaActiva.value.recompensaPrincipal
    const recompensaSec = provinciaActiva.value.recompensaSecundaria

    // 1. Desbloquear Colección del After (Principal)
    if (recompensaPri && !coleccionAfter.value.some(c => c.nombre === recompensaPri.nombre)) {
      coleccionAfter.value.push(recompensaPri)
      
      // Agregar al Inventario
      inventarioHeroe.value.push(recompensaPri)
    }

    // 2. Desbloquear Checkpoint (Secundaria)
    if (recompensaSec && !checkpointsDesbloqueados.value.some(ch => ch.nombre === recompensaSec.nombre)) {
      checkpointsDesbloqueados.value.push(recompensaSec)
      
      // Si la recompensa secundaria es un objeto físico (como Jägermeister), agregar también al inventario
      if (recompensaSec.nombre === "Jägermeister") {
        inventarioHeroe.value.push(recompensaSec)
      }
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
  experienciaHeroe.value = 0
  nivelHeroe.value = 1
  ultimoPuntajeMision.value = 0
  Object.assign(identidadHeroe, { nombre: '', universidad: '', carrera: '', deporte: '', personalidad: '' })
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80, reputacionNocturna: 50 })
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
    estadisticasPreMision,
    provinciaActiva,
    misionesCompletadas,
    checkpointsDesbloqueados,
    coleccionAfter,
    inventarioHeroe,
    logrosHeroe,
    experienciaHeroe,
    nivelHeroe,
    ultimoPuntajeMision,

    // Computed
    identidadCompleta,
    porcentajeProgreso,
    titulosFinales,
    tituloFinal,

    // Acciones
    navegarA,
    confirmarIdentidad,
    actualizarIdentidad,
    iniciarMision,
    ganarExperiencia,
    completarMision,
    reiniciarJuego,

    // Constantes
    PANTALLAS
  }
}
