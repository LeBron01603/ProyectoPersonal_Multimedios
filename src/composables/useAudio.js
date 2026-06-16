// =========================================================
// useAudio.js — Composable para manejo de audio del juego
// Preparado para cargar archivos desde public/audio/
// =========================================================

import { ref, onUnmounted } from 'vue'

// --- Estado del audio ---
const estaSilenciado           = ref(false)
const volumen                  = ref(0.6)
const musicaFondoActual        = ref(null)   // Audio de fondo activo
const audioHabilitadoPorUsuario = ref(false)
const musicaSolicitada          = ref(null)   // Guarda la última pista solicitada para reproducir tras la primera interacción

// Registro de instancias de Audio para limpieza
const instanciasAudio = new Map()

// =========================================================
// Rutas de audio públicas (mapean a la carpeta public/audio/)
// =========================================================
const RUTAS_AUDIO = {
  musica: {
    menu:           '/audio/bgm_menu.mp3',
    campus:         '/audio/bgm_campus.mp3',
    amanecer:       '/audio/bgm_sunrise.mp3',
    transformacion: '/audio/bgm_transformation.mp3',
    mapa:           '/audio/bgm_map.mp3',
    juego:          '/audio/bgm_game.mp3',
    desafio:        '/audio/bgm_boss.mp3',
    victoria:       '/audio/bgm_victory.mp3',
    derrota:        '/audio/bgm_defeat.mp3'
  },
  efecto: {
    click:     '/audio/sfx_click.mp3',
    correcto:  '/audio/sfx_correct.mp3',
    incorrecto: '/audio/sfx_wrong.mp3',
    subirNivel: '/audio/sfx_levelup.mp3',
    desbloquear:'/audio/sfx_unlock.mp3'
  }
}

/** Habilita la reproducción de audio tras interactuar con la pantalla */
function habilitarAudio() {
  if (audioHabilitadoPorUsuario.value) return
  audioHabilitadoPorUsuario.value = true
  console.info('[useAudio] Audio habilitado por interacción del usuario.')
  // Si había música solicitada en cola, la reproducimos ahora
  if (musicaSolicitada.value) {
    reproducirMusica(musicaSolicitada.value)
  }
}

// Registro global de primera interacción (click o tecla)
if (typeof window !== 'undefined') {
  const activarEnPrimerClick = () => {
    habilitarAudio()
    window.removeEventListener('click', activarEnPrimerClick)
    window.removeEventListener('keydown', activarEnPrimerClick)
  }
  window.addEventListener('click', activarEnPrimerClick)
  window.addEventListener('keydown', activarEnPrimerClick)
}

// =========================================================
// Funciones de audio
// =========================================================

/**
 * Reproduce un efecto de sonido (SFX) una sola vez.
 * @param {string} clave - Clave del efecto en RUTAS_AUDIO.efecto
 */
function reproducirEfecto(clave) {
  if (estaSilenciado.value || !audioHabilitadoPorUsuario.value) return

  const ruta = RUTAS_AUDIO.efecto[clave]
  if (!ruta) {
    console.warn(`[useAudio] Efecto no encontrado: ${clave}`)
    return
  }

  // Se crea una nueva instancia cada vez para permitir solapamiento
  const audio = new Audio(ruta)
  audio.volume = Math.min(volumen.value * 1.2, 1)
  audio.play().catch(err => {
    // Silenciar error y mostrar advertencia en consola
    console.warn(`[useAudio] Advertencia: No se pudo reproducir el efecto '${clave}' en ${ruta}:`, err.message)
  })
}

/**
 * Inicia la música de fondo (BGM) con loop.
 * Si hay música activa, la detiene primero.
 * @param {string} clave - Clave de la música en RUTAS_AUDIO.musica
 */
function reproducirMusica(clave) {
  musicaSolicitada.value = clave

  if (estaSilenciado.value) return

  if (!audioHabilitadoPorUsuario.value) {
    console.info(`[useAudio] Pista '${clave}' en cola hasta que el usuario interactúe.`)
    return
  }

  // Evitar reiniciar si ya está sonando la misma pista
  if (musicaFondoActual.value && musicaFondoActual.value.dataset && musicaFondoActual.value.dataset.clave === clave) {
    return
  }

  detenerMusica()

  const ruta = RUTAS_AUDIO.musica[clave]
  if (!ruta) {
    console.warn(`[useAudio] Música de fondo no encontrada: ${clave}`)
    return
  }

  const audio = new Audio(ruta)
  audio.volume = volumen.value
  audio.loop    = true
  audio.dataset.clave = clave
  
  audio.play().catch(err => {
    console.warn(`[useAudio] Advertencia: No se pudo reproducir la música '${clave}' en ${ruta}:`, err.message)
  })

  musicaFondoActual.value = audio
  instanciasAudio.set('musica', audio)
}

/** Detiene la música de fondo */
function detenerMusica() {
  if (!musicaFondoActual.value) return

  const audio = musicaFondoActual.value
  try {
    audio.pause()
    audio.currentTime = 0
  } catch (err) {
    console.warn('[useAudio] Error al detener música:', err.message)
  }

  musicaFondoActual.value = null
  instanciasAudio.delete('musica')
}

/** Alterna el modo silencio */
function alternarSilencio() {
  estaSilenciado.value = !estaSilenciado.value
  if (musicaFondoActual.value) {
    musicaFondoActual.value.volume = estaSilenciado.value ? 0 : volumen.value
  }
}

/** Ajusta el volumen global (0.0 - 1.0) */
function establecerVolumen(nuevoVolumen) {
  volumen.value = Math.max(0, Math.min(1, nuevoVolumen))
  if (musicaFondoActual.value) {
    musicaFondoActual.value.volume = volumen.value
  }
}

/** Limpia todos los recursos de audio (llamar en onUnmounted) */
function limpiarAudio() {
  detenerMusica()
  instanciasAudio.forEach(audio => {
    try {
      audio.pause()
      audio.src = ''
    } catch (e) {}
  })
  instanciasAudio.clear()
}

// =========================================================
// Export del composable
// =========================================================
export function useAudio() {
  return {
    // Estado
    estaSilenciado,
    volumen,
    musicaFondoActual,
    audioHabilitadoPorUsuario,

    // Acciones
    reproducirEfecto,
    reproducirMusica,
    detenerMusica,
    alternarSilencio,
    establecerVolumen,
    limpiarAudio,
    habilitarAudio,

    // Rutas
    RUTAS_AUDIO
  }
}
