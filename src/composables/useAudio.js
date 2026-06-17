// =========================================================
// useAudio.js — Composable para el manejo global de audio
// Volumen real en tiempo real, mute/unmute sin perder slider,
// persistencia en localStorage.
// =========================================================

import { ref, computed, watch } from 'vue'

const KEY_MUSICA_HABILITADA   = 'rutaTicaAudioMusicaHabilitada'
const KEY_EFECTOS_HABILITADOS  = 'rutaTicaAudioEfectosHabilitados'
const KEY_VOLUMEN_MUSICA      = 'rutaTicaAudioVolumenMusica'
const KEY_VOLUMEN_EFECTOS     = 'rutaTicaAudioVolumenEfectos'
const KEY_ESTA_SILENCIADO      = 'rutaTicaAudioEstaSilenciado'

function getStorageBool(key, def) {
  if (typeof window === 'undefined') return def
  const val = localStorage.getItem(key)
  return val !== null ? val === 'true' : def
}

function getStorageNum(key, def) {
  if (typeof window === 'undefined') return def
  const val = localStorage.getItem(key)
  return val !== null ? parseFloat(val) : def
}

// --- Estado reactivo global persistente ---
const musicaHabilitada         = ref(getStorageBool(KEY_MUSICA_HABILITADA, true))
const efectosHabilitados       = ref(getStorageBool(KEY_EFECTOS_HABILITADOS, true))
const volumenMusica            = ref(getStorageNum(KEY_VOLUMEN_MUSICA, 0.35))
const volumenEfectos           = ref(getStorageNum(KEY_VOLUMEN_EFECTOS, 0.60))
const estaSilenciado           = ref(getStorageBool(KEY_ESTA_SILENCIADO, false))
const audioHabilitadoPorUsuario = ref(false)

// Computed: la música está efectivamente silenciada
const musicaSilenciada = computed(() => !musicaHabilitada.value || estaSilenciado.value)
const efectosSilenciados = computed(() => !efectosHabilitados.value || estaSilenciado.value)

const musicaFondoActual        = ref(null)
const musicaSolicitada          = ref(null)

const instanciasAudio = new Map()

// =========================================================
// Rutas de audio públicas
// =========================================================
const RUTAS_AUDIO = {
  musica: {
    menu:           '/audio/bgm_menu.mp3',
    campus:         '/audio/bgm_campus.mp3',
    amanecer:       '/audio/bgm_amanecer.mp3',
    transformacion: '/audio/bgm_transformacion.mp3',
    mapa:           '/audio/bgm_mapa.mp3',
    juego:          '/audio/bgm_juego.mp3',
    desafio:        '/audio/bgm_desafio.mp3',
    victoria:       '/audio/bgm_victoria.mp3',
    derrota:        '/audio/bgm_derrota.mp3'
  },
  efecto: {
    acierto:        '/audio/sfx_acierto.mp3',
    correcto:       '/audio/sfx_acierto.mp3',
    error:          '/audio/sfx_error.mp3',
    incorrecto:     '/audio/sfx_error.mp3',
    checkpoint:     '/audio/sfx_checkpoint.mp3',
    desbloquear:    '/audio/sfx_checkpoint.mp3',
    logro:          '/audio/sfx_logro.mp3',
    subirNivel:     '/audio/sfx_logro.mp3',
    boton:          '/audio/sfx_boton.mp3',
    click:          '/audio/sfx_boton.mp3',
    vuelo:          '/audio/sfx_vuelo.mp3',
    transicion:     '/audio/sfx_transicion.mp3'
  }
}

/** Calcula el volumen efectivo de la pista BGM actual */
function obtenerVolumenPista(clave) {
  const base = volumenMusica.value
  if (clave === 'juego')   return base * 0.12
  if (clave === 'desafio') return base * 0.18
  return base
}

// =========================================================
// Watcher: actualiza el volumen del elemento de audio activo
// en tiempo real cuando el slider cambia (sin restart).
// =========================================================
watch(volumenMusica, (nuevo) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY_VOLUMEN_MUSICA, nuevo.toString())
  }
  if (musicaFondoActual.value) {
    const clave = musicaFondoActual.value.dataset?.clave || ''
    if (musicaSilenciada.value) {
      musicaFondoActual.value.volume = 0
    } else {
      musicaFondoActual.value.volume = obtenerVolumenPista(clave)
    }
  }
})

watch(volumenEfectos, (nuevo) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY_VOLUMEN_EFECTOS, nuevo.toString())
  }
})

watch(musicaSilenciada, (silenciada) => {
  if (!musicaFondoActual.value) return
  const clave = musicaFondoActual.value.dataset?.clave || ''
  if (silenciada) {
    musicaFondoActual.value.volume = 0
    musicaFondoActual.value.pause()
  } else {
    musicaFondoActual.value.volume = obtenerVolumenPista(clave)
    musicaFondoActual.value.play().catch(() => {})
  }
})

watch(efectosSilenciados, () => {
  // SFX se aplican al reproducirse, no hay instancia persistente.
})

/** Habilita la reproducción de audio tras la primera interacción */
function habilitarAudio() {
  if (audioHabilitadoPorUsuario.value) return
  audioHabilitadoPorUsuario.value = true
  console.info('[useAudio] Audio habilitado por interacción del usuario.')
  if (musicaSolicitada.value && !musicaSilenciada.value) {
    reproducirMusica(musicaSolicitada.value)
  }
}

if (typeof window !== 'undefined') {
  const activarEnPrimerClick = () => {
    habilitarAudio()
    window.removeEventListener('click', activarEnPrimerClick, { capture: true })
    window.removeEventListener('keydown', activarEnPrimerClick, { capture: true })
  }
  window.addEventListener('click', activarEnPrimerClick, { capture: true })
  window.addEventListener('keydown', activarEnPrimerClick, { capture: true })
}

// =========================================================
// Reproducción de SFX
// =========================================================
function reproducirEfecto(clave) {
  if (efectosSilenciados.value) return

  const ruta = RUTAS_AUDIO.efecto[clave]
  if (!ruta) {
    console.warn(`[useAudio] Efecto no encontrado: ${clave}`)
    return
  }

  const audio = new Audio(ruta)
  audio.volume = volumenEfectos.value   // Aplica volumen actual de efectos
  audio.play().then(() => {
    if (!audioHabilitadoPorUsuario.value) {
      habilitarAudio()
    }
  }).catch(err => {
    console.warn(`[useAudio] No se pudo reproducir efecto '${clave}':`, err.message)
  })
}

// =========================================================
// Reproducción de música BGM
// =========================================================
function reproducirMusica(clave, loop = true) {
  musicaSolicitada.value = clave

  if (!audioHabilitadoPorUsuario.value) {
    console.info(`[useAudio] Pista '${clave}' en cola hasta interacción del usuario.`)
    return
  }

  // Evitar reiniciar si ya está sonando la misma pista
  if (musicaFondoActual.value?.dataset?.clave === clave) {
    musicaFondoActual.value.loop = loop
    if (musicaSilenciada.value) {
      musicaFondoActual.value.volume = 0
      musicaFondoActual.value.pause()
    } else {
      musicaFondoActual.value.volume = obtenerVolumenPista(clave)
      if (musicaFondoActual.value.paused) {
        musicaFondoActual.value.play().catch(() => {})
      }
    }
    return
  }

  detenerMusica()

  const ruta = RUTAS_AUDIO.musica[clave]
  if (!ruta) {
    console.warn(`[useAudio] Música no encontrada: ${clave}`)
    return
  }

  const audio = new Audio(ruta)
  audio.loop = loop
  audio.dataset.clave = clave
  musicaFondoActual.value = audio
  instanciasAudio.set('musica', audio)

  if (musicaSilenciada.value) {
    audio.volume = 0
    // No se reproduce: queda pausada
  } else {
    audio.volume = obtenerVolumenPista(clave)
    audio.play().catch(err => {
      console.warn(`[useAudio] No se pudo reproducir música '${clave}':`, err.message)
    })
  }
}

/** Detiene la música de fondo */
function detenerMusica() {
  if (!musicaFondoActual.value) return
  try {
    musicaFondoActual.value.pause()
    musicaFondoActual.value.currentTime = 0
  } catch {}
  musicaFondoActual.value = null
  instanciasAudio.delete('musica')
}

// =========================================================
// Controles expuestos al UI — guardan en localStorage
// =========================================================

/** Toggle música ON/OFF — no borra el slider, solo pausa/reanuda */
function establecerMusicaHabilitada(val) {
  musicaHabilitada.value = val
  localStorage.setItem(KEY_MUSICA_HABILITADA, val ? 'true' : 'false')
  // El watcher de musicaSilenciada aplica la pausa/reanudación automáticamente
  if (!musicaSilenciada.value && musicaSolicitada.value && !musicaFondoActual.value) {
    reproducirMusica(musicaSolicitada.value)
  }
}

/** Toggle efectos ON/OFF */
function establecerEfectosHabilitados(val) {
  efectosHabilitados.value = val
  localStorage.setItem(KEY_EFECTOS_HABILITADOS, val ? 'true' : 'false')
}

/**
 * Ajusta el volumen de la música (0.0 – 1.0).
 * El watcher de volumenMusica aplica el cambio en tiempo real.
 */
function establecerVolumenMusica(val) {
  volumenMusica.value = Math.max(0, Math.min(1, val))
  // Si volumen > 0 y había música en cola pero pausada por silencio anterior, reanudar
  if (volumenMusica.value > 0 && !musicaSilenciada.value && musicaSolicitada.value) {
    if (!musicaFondoActual.value) {
      reproducirMusica(musicaSolicitada.value)
    } else if (musicaFondoActual.value.paused) {
      musicaFondoActual.value.play().catch(() => {})
    }
  }
}

/** Ajusta el volumen de los efectos (0.0 – 1.0). El watcher guarda en localStorage. */
function establecerVolumenEfectos(val) {
  volumenEfectos.value = Math.max(0, Math.min(1, val))
}

/** Alterna mute global — NO modifica los sliders */
function alternarSilencio() {
  estaSilenciado.value = !estaSilenciado.value
  localStorage.setItem(KEY_ESTA_SILENCIADO, estaSilenciado.value ? 'true' : 'false')
  // El watcher de musicaSilenciada maneja pausa/reanudación automáticamente
}

/** Limpia todos los recursos de audio */
function limpiarAudio() {
  detenerMusica()
  instanciasAudio.forEach(audio => {
    try { audio.pause(); audio.src = '' } catch {}
  })
  instanciasAudio.clear()
}

// =========================================================
// Export
// =========================================================
export function useAudio() {
  return {
    musicaHabilitada,
    efectosHabilitados,
    volumenMusica,
    volumenEfectos,
    estaSilenciado,
    musicaSilenciada,
    efectosSilenciados,
    musicaFondoActual,
    audioHabilitadoPorUsuario,

    reproducirEfecto,
    reproducirMusica,
    detenerMusica,
    establecerMusicaHabilitada,
    establecerEfectosHabilitados,
    establecerVolumenMusica,
    establecerVolumenEfectos,
    alternarSilencio,
    limpiarAudio,
    habilitarAudio,

    RUTAS_AUDIO
  }
}
