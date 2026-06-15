// =========================================================
// useAudio.js — Composable para manejo de audio del juego
// Preparado para cargar archivos desde src/assets/audio/
// =========================================================

import { ref, onUnmounted } from 'vue'

// --- Estado del audio ---
const estaSilenciado       = ref(false)
const volumen              = ref(0.6)
const musicaFondoActual    = ref(null)   // Audio de fondo activo

// Registro de instancias de Audio para limpieza
const instanciasAudio = new Map()

// =========================================================
// Rutas de audio (se poblará en fases posteriores)
// =========================================================
const RUTAS_AUDIO = {
  musica: {
    menu:     '/src/assets/audio/bgm_menu.mp3',
    mapa:     '/src/assets/audio/bgm_map.mp3',
    juego:    '/src/assets/audio/bgm_game.mp3',
    victoria: '/src/assets/audio/bgm_victory.mp3'
  },
  efecto: {
    click:     '/src/assets/audio/sfx_click.mp3',
    correcto:  '/src/assets/audio/sfx_correct.mp3',
    incorrecto: '/src/assets/audio/sfx_wrong.mp3',
    subirNivel: '/src/assets/audio/sfx_levelup.mp3',
    desbloquear:'/src/assets/audio/sfx_unlock.mp3'
  }
}

// =========================================================
// Funciones de audio
// =========================================================

/**
 * Reproduce un efecto de sonido (SFX) una sola vez.
 * @param {string} clave - Clave del efecto en RUTAS_AUDIO.efecto
 */
function reproducirEfecto(clave) {
  if (estaSilenciado.value) return

  const ruta = RUTAS_AUDIO.efecto[clave]
  if (!ruta) {
    console.warn(`[useAudio] Efecto no encontrado: ${clave}`)
    return
  }

  // Se crea una nueva instancia cada vez para permitir solapamiento
  const audio = new Audio(ruta)
  audio.volumen = Math.min(volumen.value * 1.2, 1)
  audio.play().catch(err => {
    // Silenciar error de autoplay policy del navegador
    console.warn('[useAudio] No se pudo reproducir el efecto de sonido:', err.message)
  })
}

/**
 * Inicia la música de fondo (BGM) con loop.
 * Si hay música activa, la detiene primero.
 * @param {string} clave - Clave de la música en RUTAS_AUDIO.musica
 */
function reproducirMusica(clave) {
  detenerMusica()
  if (estaSilenciado.value) return

  const ruta = RUTAS_AUDIO.musica[clave]
  if (!ruta) {
    console.warn(`[useAudio] Música de fondo no encontrada: ${clave}`)
    return
  }

  const audio = new Audio(ruta)
  audio.volumen = volumen.value
  audio.loop    = true
  audio.play().catch(err => {
    console.warn('[useAudio] No se pudo reproducir la música de fondo:', err.message)
  })

  musicaFondoActual.value = audio
  instanciasAudio.set('musica', audio)
}

/** Detiene la música de fondo con fade out suave */
function detenerMusica() {
  if (!musicaFondoActual.value) return

  const audio = musicaFondoActual.value
  // Fade out en 500ms
  const intervaloDesvanecer = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume = Math.max(0, audio.volume - 0.05)
    } else {
      audio.pause()
      audio.currentTime = 0
      clearInterval(intervaloDesvanecer)
    }
  }, 30)

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
    audio.pause()
    audio.src = ''
  })
  instanciasAudio.clear()
}

// =========================================================
// Export del composable
// =========================================================
export function useAudio() {
  onUnmounted(() => {
    // Solo limpiar instancias secundarias, no detener la música global
  })

  return {
    // Estado
    estaSilenciado,
    volumen,
    musicaFondoActual,

    // Acciones
    reproducirEfecto,
    reproducirMusica,
    detenerMusica,
    alternarSilencio,
    establecerVolumen,
    limpiarAudio,

    // Rutas
    RUTAS_AUDIO
  }
}
