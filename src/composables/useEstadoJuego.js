// =========================================================
// useEstadoJuego.js — Composable de estado global del juego
// Maneja: pantalla activa, identidad del héroe, progreso,
// inventario, logros, colección de recuerdos y checkpoints.
// =========================================================

import { ref, reactive, computed, watch } from 'vue'
import { useAudio } from './useAudio.js'

// --- Tipos de pantallas del juego ---
export const PANTALLAS = {
  INICIO:    'inicio',
  IDENTIDAD: 'identidad',
  MAPA:      'mapa',
  ACTIVIDADES: 'actividades',
  TRANSICION_NOCHE: 'transicion_noche',
  TRANSFORMACION: 'transformacion',
  VUELO:     'vuelo',
  JUEGO:     'juego',
  RESULTADO: 'resultado',
  NUEVO_DIA: 'nuevo_dia'
}

// --- Estado global reactivo (singleton por sesión) ---
const pantallaActual = ref(PANTALLAS.INICIO)
const estaCargando   = ref(false)
const esModoNocturno = ref(false)
const mensajeAlertaMapa = ref('')

// Watcher to guarantee pantallaActual is always valid and fallback to INICIO if invalid
watch(pantallaActual, (nueva) => {
  const PANTALLAS_VALIDAS = Object.values(PANTALLAS)
  if (!nueva || !PANTALLAS_VALIDAS.includes(nueva)) {
    console.warn(`[useEstadoJuego] pantallaActual con valor inválido ("${nueva}"). Restaurando a INICIO.`)
    pantallaActual.value = PANTALLAS.INICIO
  }
})

// reactive: para el objeto de identidad del héroe
const identidadHeroe = reactive({
  nombre:       '',
  edad:         '',
  universidad:  '',
  sedeUniversitaria: '',
  carrera:      '',
  deporte:      '',
  personalidad: '', // Representa el "Estilo inicial del héroe"
  aliasHeroe:   '',
  // Nuevos campos Fase 5
  semestre:     1,
  promedio:     0,
  creditosAprobados: 0,
  clubUniversitario: '',
  semanaAcademica: 1
})

const eventoSospechaMostradoHoy = ref(false)

// reactive: para estadísticas del juego
const estadisticasHeroe = reactive({
  energia:         80,
  conocimiento:    10,
  diversion:       10,
  responsabilidad: 80,
  reputacionNocturna: 50,
  sospechaIdentidad: 0
})

// reactive: copia de estadísticas antes de iniciar una misión para cálculo exacto de deltas
const estadisticasPreMision = reactive({
  energia:         80,
  conocimiento:    10,
  diversion:       10,
  responsabilidad: 80,
  reputacionNocturna: 50,
  sospechaIdentidad: 0
})

// ref: provincia/misión activa
const provinciaActiva = ref(null)

// ref: historial de misiones completadas
const misionesCompletadas = ref([])

// --- RUTA ORDENADA DE PROVINCIAS ---
const rutaOrdenada = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']

// ref: provincia desbloqueada en la misión actual para animación de progreso
const provinciaRecienDesbloqueada = ref(null)

// ref: registro de detalles del último patrullaje para Centro del Héroe
const ultimaMisionNombre = ref('')
const ultimaMisionResultado = ref('')
const ultimaRecompensa = ref('')

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
const misionAprobada = ref(true)
const misionEsPractica = ref(false)
const respuestasCorrectasMision = ref(0)
const totalPreguntasMision = ref(0)
const esSegundoIntento = ref(false)
const avanceMision = ref(null)

// --- TÍTULOS HEROICOS DINÁMICOS ---
const titulosFinales = [
  { id: 'sombra', nombre: 'Sombra Fugitiva', emoji: '👤', descripcion: 'La sospecha sobre tu identidad civil está por los cielos. Eres un misterio andante en el campus.' },
  { id: 'leyenda', nombre: 'Leyenda del After', emoji: '🌙', descripcion: 'Los estudiantes confían plenamente en ti. Eres el rey indiscutible de las noches seguras.' },
  { id: 'protector', nombre: 'Protector Universitario', emoji: '🛡️', descripcion: 'Priorizas la responsabilidad civil y el bienestar de los jóvenes en cada fiesta.' },
  { id: 'centinela', nombre: 'Centinela de la Cultura', emoji: '📚', descripcion: 'Tu amplio conocimiento de la geografía, historia y costumbres del país guía tu camino.' },
  { id: 'heroe', nombre: 'Guardián de Costa Rica', emoji: '🇨🇷', descripcion: '¡Leyenda nacional! Has resguardado las 7 provincias del territorio costarricense.' },
  { id: 'entrenamiento', nombre: 'Héroe en Entrenamiento', emoji: '🦸‍♂️', descripcion: 'Completa misiones y ajusta tus estadísticas para definir tu título heroico definitivo.' }
]

const tituloFinal = computed(() => {
  const { reputacionNocturna, conocimiento, responsabilidad, sospechaIdentidad } = estadisticasHeroe

  if (sospechaIdentidad >= 65) {
    return titulosFinales.find(t => t.id === 'sombra')
  }

  if (misionesCompletadas.value.length === 7) {
    return titulosFinales.find(t => t.id === 'heroe')
  }

  // Encontrar la estadística dominante entre las tres
  if (reputacionNocturna >= 70 && reputacionNocturna >= conocimiento && reputacionNocturna >= responsabilidad) {
    return titulosFinales.find(t => t.id === 'leyenda')
  }

  if (responsabilidad >= 70 && responsabilidad >= conocimiento && responsabilidad >= reputacionNocturna) {
    return titulosFinales.find(t => t.id === 'protector')
  }

  if (conocimiento >= 70 && conocimiento >= responsabilidad && conocimiento >= reputacionNocturna) {
    return titulosFinales.find(t => t.id === 'centinela')
  }

  return titulosFinales.find(t => t.id === 'entrenamiento')
})

// --- Computed: ¿identidad está completa? ---
const identidadCompleta = computed(() =>
  identidadHeroe.nombre.trim() !== '' &&
  identidadHeroe.edad !== '' &&
  identidadHeroe.universidad !== '' &&
  identidadHeroe.carrera !== '' &&
  identidadHeroe.personalidad !== '' &&
  identidadHeroe.aliasHeroe.trim() !== ''
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
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80, reputacionNocturna: 50, sospechaIdentidad: 0 })
  
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
  const PANTALLAS_VALIDAS = Object.values(PANTALLAS)
  if (!pantalla || !PANTALLAS_VALIDAS.includes(pantalla)) {
    console.warn(`[useEstadoJuego] Intento de navegar a pantalla inválida o nula: "${pantalla}". Redirigiendo a INICIO.`)
    pantallaActual.value = PANTALLAS.INICIO
  } else {
    pantallaActual.value = pantalla
  }
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
  
  // Generar campos expandidos iniciales Fase 5
  identidadHeroe.semestre = Math.floor(Math.random() * 4) + 2 // Semestre 2 a 5
  identidadHeroe.promedio = Number((Math.random() * 2 + 7.5).toFixed(1)) // Promedio 7.5 a 9.5
  identidadHeroe.creditosAprobados = identidadHeroe.semestre * 16
  
  const clubes = ['Club de Ajedrez', 'Club de Debate', 'Comunidad de Software Libre', 'Voluntariado Ecológico', 'Taller de Teatro', 'Club de Astronomía']
  identidadHeroe.clubUniversitario = clubes[Math.floor(Math.random() * clubes.length)]
  identidadHeroe.semanaAcademica = 1

  aplicarBonificacionesIniciales(identidad.personalidad)
  aplicarBonificacionesCarrera(identidad.carrera)
  esModoNocturno.value = false
  navegarA(PANTALLAS.MAPA)
  guardarProgreso()
}

/** Edita la identidad del héroe sin reiniciar ningún progreso ni estadística */
function actualizarIdentidad(nuevaIdentidad) {
  Object.assign(identidadHeroe, nuevaIdentidad)
  guardarProgreso()
}

/** Inicia misión en una provincia específica */
function iniciarMision(provincia) {
  Object.assign(estadisticasPreMision, estadisticasHeroe)
  provinciaActiva.value = provincia
  misionEsPractica.value = misionesCompletadas.value.includes(provincia.id)
  esSegundoIntento.value = false
  mensajeAlertaMapa.value = ''
  navegarA(PANTALLAS.VUELO)
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
function completarMision(idProvincia, puntaje, correctasCount, totalPreguntasCount) {
  // Limpiar avance parcial de la misión al completarla o fallarla
  avanceMision.value = null

  // 1. Determinar si aprueba
  let aprobado = false
  if (totalPreguntasCount === 8) {
    aprobado = correctasCount >= 5
  } else if (totalPreguntasCount > 0) {
    aprobado = (correctasCount / totalPreguntasCount) >= 0.625
  } else {
    aprobado = puntaje >= 62.5 // fallback
  }

  misionAprobada.value = aprobado
  ultimoPuntajeMision.value = puntaje
  respuestasCorrectasMision.value = correctasCount
  totalPreguntasMision.value = totalPreguntasCount

  // Registrar detalles del último patrullaje
  ultimaMisionNombre.value = provinciaActiva.value?.nombre || idProvincia
  ultimaMisionResultado.value = `${correctasCount}/${totalPreguntasCount}`
  if (aprobado && provinciaActiva.value?.recompensaPrincipal) {
    ultimaRecompensa.value = `${provinciaActiva.value.recompensaPrincipal.emoji} ${provinciaActiva.value.recompensaPrincipal.nombre}`
  } else if (aprobado) {
    ultimaRecompensa.value = 'Ninguna'
  } else {
    ultimaRecompensa.value = 'Sin recompensa (reprobado)'
  }

  const yaCompletada = misionesCompletadas.value.includes(idProvincia)

  // 2. Si aprueba:
  if (aprobado) {
    identidadHeroe.semanaAcademica = Math.min(16, (identidadHeroe.semanaAcademica || 1) + 1)

    // Si no estaba completada, la agregamos al progreso y otorgamos las recompensas únicas
    if (!yaCompletada) {
      misionesCompletadas.value.push(idProvincia)

      // Registrar provincia recién desbloqueada para animación en el mapa
      const idx = rutaOrdenada.indexOf(idProvincia)
      if (idx !== -1 && idx + 1 < rutaOrdenada.length) {
        const siguienteProvId = rutaOrdenada[idx + 1]
        provinciaRecienDesbloqueada.value = siguienteProvId
        console.info(`[useEstadoJuego] Nueva provincia desbloqueada para animación: ${siguienteProvId}`)
      }

      // Otorgar recompensas basadas en la provincia activa
      if (provinciaActiva.value) {
        const recompensaPri = provinciaActiva.value.recompensaPrincipal
        const recompensaSec = provinciaActiva.value.recompensaSecundaria

        // 1. Desbloquear Colección del After (Principal)
        if (recompensaPri && !coleccionAfter.value.some(c => c.nombre === recompensaPri.nombre)) {
          coleccionAfter.value.push(recompensaPri)
          inventarioHeroe.value.push(recompensaPri)
        }

        // 2. Desbloquear Checkpoint (Secundaria)
        if (recompensaSec && !checkpointsDesbloqueados.value.some(ch => ch.nombre === recompensaSec.nombre)) {
          checkpointsDesbloqueados.value.push(recompensaSec)
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

      // 4. Sistema de Logros (Solo se otorgan si la provincia no estaba completada)
      if (misionesCompletadas.value.length === 1) {
        agregarLogro("Primer After", "🏆")
      }
      if (idProvincia === 'guanacaste') {
        agregarLogro("Conquistador de Guanacaste", "🏆")
      }
      if (idProvincia === 'san-jose') {
        agregarLogro("Rey de la Cali", "🏆")
      }
      if (idProvincia === 'limon') {
        agregarLogro("Leyenda Caribeña", "🏆")
      }
      if (misionesCompletadas.value.length === 7) {
        agregarLogro("Héroe Nacional", "🏆")
      }
    }

    // Ganar experiencia base solo si no era práctica
    if (!yaCompletada) {
      ganarExperiencia(50)
    }
  }

  // 3. Actualizar estadísticas globales (se aplican siempre, gane o pierda, excepto las recompensas únicas)
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

  // Lógica de sospecha acumulada al terminar el día
  if (estadisticasHeroe.responsabilidad < 50) {
    estadisticasHeroe.sospechaIdentidad = Math.min(100, estadisticasHeroe.sospechaIdentidad + 10)
  }
  if (estadisticasHeroe.energia < 30) {
    estadisticasHeroe.sospechaIdentidad = Math.min(100, estadisticasHeroe.sospechaIdentidad + 8)
  }

  if (aprobado) {
    registrarEnRanking(
      identidadHeroe.aliasHeroe,
      provinciaActiva.value?.nombre || idProvincia,
      puntaje,
      correctasCount,
      totalPreguntasCount
    )
  }

  eventoSospechaMostradoHoy.value = false
  esModoNocturno.value = false
  navegarA(PANTALLAS.RESULTADO)
  guardarProgreso()
}

/** Añade un logro si no ha sido desbloqueado anteriormente */
function agregarLogro(nombre, emoji) {
  if (!logrosHeroe.value.some(l => l.nombre === nombre)) {
    logrosHeroe.value.push({ nombre, emoji })
    guardarProgreso()
  }
}

const SAVE_KEY = 'rutaTicaHeroeAfterProgreso'

/** Guarda el progreso del juego en localStorage */
function guardarProgreso() {
  try {
    const data = {
      avanceMision: avanceMision.value,
      identidadHeroe: { ...identidadHeroe },
      estadisticasHeroe: { ...estadisticasHeroe },
      experienciaHeroe: experienciaHeroe.value,
      nivelHeroe: nivelHeroe.value,
      misionesCompletadas: [...misionesCompletadas.value],
      checkpointsDesbloqueados: [...checkpointsDesbloqueados.value],
      coleccionAfter: [...coleccionAfter.value],
      inventarioHeroe: [...inventarioHeroe.value],
      logrosHeroe: [...logrosHeroe.value],
      pantallaActual: pantallaActual.value,
      esModoNocturno: esModoNocturno.value,
      provinciaRecienDesbloqueada: provinciaRecienDesbloqueada.value,
      ultimaMisionNombre: ultimaMisionNombre.value,
      ultimaMisionResultado: ultimaMisionResultado.value,
      ultimaRecompensa: ultimaRecompensa.value
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    console.info('[RutaTica] Progreso guardado correctamente.')
  } catch (error) {
    console.error('[RutaTica] Error al guardar progreso:', error)
  }
}

/** Auxiliar para validar la integridad de los datos de progreso guardados */
function validarProgresoData(data) {
  // 1. Validar que data sea un objeto
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false
  }

  // 2. Validar identidadHeroe y sus campos obligatorios
  if (!data.identidadHeroe || typeof data.identidadHeroe !== 'object' || Array.isArray(data.identidadHeroe)) {
    return false
  }
  const { nombre, universidad, carrera, personalidad, aliasHeroe } = data.identidadHeroe
  if (
    typeof nombre !== 'string' || nombre.trim() === '' ||
    typeof universidad !== 'string' || universidad.trim() === '' ||
    typeof carrera !== 'string' || carrera.trim() === '' ||
    typeof personalidad !== 'string' || personalidad.trim() === '' ||
    typeof aliasHeroe !== 'string' || aliasHeroe.trim() === ''
  ) {
    return false
  }

  // 3. Validar estadisticasHeroe y que todos sus campos obligatorios existan y sean numéricos
  if (!data.estadisticasHeroe || typeof data.estadisticasHeroe !== 'object' || Array.isArray(data.estadisticasHeroe)) {
    return false
  }
  const statsRequeridas = ['energia', 'conocimiento', 'diversion', 'responsabilidad', 'reputacionNocturna', 'sospechaIdentidad']
  for (const stat of statsRequeridas) {
    const val = data.estadisticasHeroe[stat]
    if (typeof val !== 'number' || isNaN(val)) {
      return false
    }
  }

  // 4. Validar colecciones obligatorias
  if (
    !Array.isArray(data.misionesCompletadas) ||
    !Array.isArray(data.checkpointsDesbloqueados) ||
    !Array.isArray(data.coleccionAfter) ||
    !Array.isArray(data.inventarioHeroe) ||
    !Array.isArray(data.logrosHeroe)
  ) {
    return false
  }

  // 5. Validar pantallaActual y que pertenezca a PANTALLAS
  const PANTALLAS_VALIDAS = Object.values(PANTALLAS)
  if (!data.pantallaActual || !PANTALLAS_VALIDAS.includes(data.pantallaActual)) {
    return false
  }

  return true
}

/** Carga el progreso del juego desde localStorage con validación robusta */
function cargarProgreso() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    
    const data = JSON.parse(raw)
    
    if (!validarProgresoData(data)) {
      throw new Error('Estructura de progreso corrupta, incompleta o inválida')
    }

    // Si todo es válido, aplicamos las asignaciones de forma segura
    Object.assign(identidadHeroe, data.identidadHeroe)
    Object.assign(estadisticasHeroe, data.estadisticasHeroe)
    if (data.experienciaHeroe !== undefined) experienciaHeroe.value = data.experienciaHeroe
    if (data.nivelHeroe !== undefined) nivelHeroe.value = data.nivelHeroe
    misionesCompletadas.value = data.misionesCompletadas
    checkpointsDesbloqueados.value = data.checkpointsDesbloqueados
    coleccionAfter.value = data.coleccionAfter
    inventarioHeroe.value = data.inventarioHeroe
    logrosHeroe.value = data.logrosHeroe
    if (data.esModoNocturno !== undefined) esModoNocturno.value = data.esModoNocturno
    if (data.provinciaRecienDesbloqueada !== undefined) provinciaRecienDesbloqueada.value = data.provinciaRecienDesbloqueada
    if (data.ultimaMisionNombre !== undefined) ultimaMisionNombre.value = data.ultimaMisionNombre
    if (data.ultimaMisionResultado !== undefined) ultimaMisionResultado.value = data.ultimaMisionResultado
    if (data.ultimaRecompensa !== undefined) ultimaRecompensa.value = data.ultimaRecompensa
    if (data.avanceMision !== undefined) avanceMision.value = data.avanceMision

    // Pantallas transitorias que no deben restaurarse (no tienen estado persistente propio)
    const pantallasTransitorias = [
      PANTALLAS.JUEGO, PANTALLAS.VUELO, PANTALLAS.NUEVO_DIA,
      PANTALLAS.ACTIVIDADES, PANTALLAS.TRANSICION_NOCHE, PANTALLAS.TRANSFORMACION
    ]
    if (pantallasTransitorias.includes(data.pantallaActual)) {
      pantallaActual.value = PANTALLAS.MAPA
    } else {
      pantallaActual.value = data.pantallaActual
    }

    console.info('[RutaTica] Progreso cargado y validado correctamente.')
    return true
  } catch (error) {
    console.error('[RutaTica] Error al cargar progreso (posible formato incompatible). Limpiando datos corruptos:', error.message || error)
    try {
      localStorage.removeItem(SAVE_KEY)
      reiniciarJuego()
    } catch (cleanErr) {
      console.error('[RutaTica] Error secundario al intentar borrar save corrupto:', cleanErr)
    }
    return false
  }
}

/** Borra el progreso del juego de localStorage y reinicia el estado y vuelve a Inicio */
function borrarProgreso() {
  try {
    localStorage.removeItem(SAVE_KEY)
    reiniciarJuego()
    pantallaActual.value = PANTALLAS.INICIO
    console.info('[RutaTica] Progreso borrado correctamente.')
  } catch (error) {
    console.error('[RutaTica] Error al borrar progreso:', error)
  }
}

/** Reinicia la aventura borrando localStorage, reseteando el estado y volviendo a Inicio */
function reiniciarProgreso() {
  try {
    localStorage.removeItem(SAVE_KEY)
    reiniciarJuego()
    pantallaActual.value = PANTALLAS.INICIO
    console.info('[RutaTica] Aventura reiniciada correctamente.')
  } catch (error) {
    console.error('[RutaTica] Error al reiniciar la aventura:', error)
  }
}

/** Comprueba si hay una partida guardada válida */
function hayProgresoGuardado() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    const esValido = validarProgresoData(parsed)
    if (!esValido) {
      console.warn('[useEstadoJuego] Progreso guardado corrupto detectado. Limpiando localStorage.')
      localStorage.removeItem(SAVE_KEY)
      return false
    }
    return true
  } catch {
    try {
      localStorage.removeItem(SAVE_KEY)
    } catch {}
    return false
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
  misionAprobada.value = true
  misionEsPractica.value = false
  esSegundoIntento.value = false
  avanceMision.value = null
  respuestasCorrectasMision.value = 0
  totalPreguntasMision.value = 0
  eventoSospechaMostradoHoy.value = false
  esModoNocturno.value = false
  mensajeAlertaMapa.value = ''
  provinciaRecienDesbloqueada.value = null
  ultimaMisionNombre.value = ''
  ultimaMisionResultado.value = ''
  ultimaRecompensa.value = ''
  Object.assign(identidadHeroe, { 
    nombre: '', 
    edad: '', 
    universidad: '', 
    sedeUniversitaria: '',
    carrera: '', 
    deporte: '', 
    personalidad: '', 
    aliasHeroe: '',
    semestre: 1,
    promedio: 0,
    creditosAprobados: 0,
    clubUniversitario: '',
    semanaAcademica: 1
  })
  Object.assign(estadisticasHeroe, { energia: 80, conocimiento: 10, diversion: 10, responsabilidad: 80, reputacionNocturna: 50, sospechaIdentidad: 0 })
}

// =========================================================
// Sistema de Ranking Local (Salón de la Fama)
// =========================================================
const rankingLocal = ref([])
const RANKING_KEY = 'rutaTicaHeroeAfterRanking'

function cargarRankingLocal() {
  try {
    const raw = localStorage.getItem(RANKING_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        rankingLocal.value = parsed
        return
      }
    }
    rankingLocal.value = []
  } catch (error) {
    console.error('[RutaTica] Error al cargar ranking local:', error)
    rankingLocal.value = []
  }
}

function registrarEnRanking(alias, provincia, puntaje, correctas, total) {
  try {
    const raw = localStorage.getItem(RANKING_KEY)
    let ranking = []
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        ranking = parsed
      }
    }
    
    const ahora = new Date()
    const fechaStr = `${ahora.getDate().toString().padStart(2, '0')}/${(ahora.getMonth() + 1).toString().padStart(2, '0')}/${ahora.getFullYear()} ${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`
    
    const nuevaEntrada = {
      alias: alias || 'Héroe del After',
      provincia: provincia || 'Desconocida',
      puntaje: typeof puntaje === 'number' ? puntaje : 0,
      resultado: `${correctas}/${total}`,
      fecha: fechaStr
    }
    
    ranking.push(nuevaEntrada)
    
    // Ordenar de mejor a menor puntaje
    ranking.sort((a, b) => b.puntaje - a.puntaje)
    
    // Mantener máximo 10 registros
    if (ranking.length > 10) {
      ranking = ranking.slice(0, 10)
    }
    
    rankingLocal.value = ranking
    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking))
    console.info('[RutaTica] Ranking actualizado en localStorage.')
  } catch (error) {
    console.error('[RutaTica] Error al guardar en ranking:', error)
  }
}

// Cargar ranking una vez al evaluar el script
cargarRankingLocal()

// =========================================================
// Export del composable
// =========================================================
export function useEstadoJuego() {
  return {
    // Estado
    pantallaActual,
    estaCargando,
    esModoNocturno,
    mensajeAlertaMapa,
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
    misionAprobada,
    misionEsPractica,
    respuestasCorrectasMision,
    totalPreguntasMision,
    esSegundoIntento,
    avanceMision,
    eventoSospechaMostradoHoy,
    provinciaRecienDesbloqueada,
    ultimaMisionNombre,
    ultimaMisionResultado,
    ultimaRecompensa,
    rankingLocal,

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
    guardarProgreso,
    cargarProgreso,
    borrarProgreso,
    reiniciarProgreso,
    hayProgresoGuardado,
    cargarRankingLocal,

    // Constantes
    PANTALLAS
  }
}
