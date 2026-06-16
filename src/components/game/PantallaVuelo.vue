<template>
  <!-- PantallaVuelo: Cinemática corta de vuelo antes de iniciar la misión -->
  <section class="pantalla-vuelo" aria-label="Pantalla de vuelo hacia la misión">
    <div class="contenedor-vuelo card text-center animate-fade-in-scale">
      
      <!-- Icono de vuelo neón animado -->
      <div class="vuelo-avatar-container">
        <div class="estela-neon anim-estela"></div>
        <div class="avatar-heroe-vuelo animate-float">🦸‍♂️</div>
      </div>

      <h2 class="titulo-vuelo text-neon-blue">Volando a la Misión...</h2>
      
      <!-- Indicador de Destino -->
      <div class="destino-badge" v-if="provinciaActiva">
        <span>Destino: 📍 <strong>{{ provinciaActiva.nombre }}</strong></span>
      </div>

      <!-- Barra de Progreso del Vuelo -->
      <div class="progreso-vuelo-container">
        <div class="barra-vuelo">
          <div class="barra-vuelo-relleno" :style="{ width: `${progreso}%` }"></div>
        </div>
        <span class="progreso-texto">{{ progreso }}% del trayecto completado</span>
      </div>

      <!-- Secuencia de Pasos/Hitos de Vuelo -->
      <div class="pasos-vuelo">
        <div class="paso-vuelo-item" :class="{ 'activo': pasoActual >= 1, 'completado': pasoActual > 1 }">
          <span class="paso-icono">🏫</span>
          <span class="paso-etiqueta">Campus</span>
        </div>
        <div class="paso-flecha">→</div>
        <div class="paso-vuelo-item" :class="{ 'activo': pasoActual >= 2, 'completado': pasoActual > 2 }">
          <span class="paso-icono">⚡</span>
          <span class="paso-etiqueta">Despegue</span>
        </div>
        <div class="paso-flecha">→</div>
        <div class="paso-vuelo-item" :class="{ 'activo': pasoActual >= 3, 'completado': pasoActual > 3 }">
          <span class="paso-icono">🇨🇷</span>
          <span class="paso-etiqueta">Trayecto</span>
        </div>
        <div class="paso-flecha">→</div>
        <div class="paso-vuelo-item" :class="{ 'activo': pasoActual >= 4 }">
          <span class="paso-icono">📍</span>
          <span class="paso-etiqueta">{{ provinciaActiva?.nombre || 'Destino' }}</span>
        </div>
      </div>

      <!-- Mensaje Narrativo Dinámico -->
      <div class="narrativa-vuelo animate-fade-in" :key="pasoActual">
        <p class="texto-narrativo-vuelo">{{ mensajeNarrativo }}</p>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Composables del juego ---
const { navegarA, provinciaActiva, esModoNocturno, mensajeAlertaMapa, PANTALLAS } = useEstadoJuego()
const { reproducirEfecto, reproducirMusica, detenerMusica } = useAudio()

const emit = defineEmits(['completar'])

// --- Estado local ---
const progreso = ref(0)
const pasoActual = ref(1)
let timerProgreso = null

// Narrativas contextuales del vuelo
const mensajeNarrativo = computed(() => {
  if (pasoActual.value === 1) {
    return 'Abandonando discretamente el campus universitario por las sombras...'
  }
  if (pasoActual.value === 2) {
    return '¡Alas de energía activadas! Despegando y ganando altitud sobre la ciudad...'
  }
  if (pasoActual.value === 3) {
    return `Volando a toda velocidad sobre el espacio aéreo de Costa Rica...`
  }
  return `Aterrizando sigilosamente en la provincia de ${provinciaActiva.value?.nombre || 'destino'}... ¡Prepárate para el after party!`
})

// Redirección de seguridad
onMounted(() => {
  if (!provinciaActiva.value) {
    console.warn('[PantallaVuelo] No hay provincia seleccionada para patrullar. Redirigiendo...')
    mensajeAlertaMapa.value = 'Selecciona una provincia antes de patrullar'
    esModoNocturno.value = true
    navegarA(PANTALLAS.MAPA)
    return
  }

  // Reproducir música o efectos
  reproducirMusica('juego')
  reproducirEfecto('desbloquear')

  // Iniciar temporizador de la cinemática (3.5 segundos en total)
  const duracionTotal = 3500
  const intervaloMs = 35
  const incremento = 100 / (duracionTotal / intervaloMs)

  timerProgreso = setInterval(() => {
    progreso.value = Math.min(100, Number((progreso.value + incremento).toFixed(1)))
    
    // Calcular el paso actual según el porcentaje
    if (progreso.value < 25) {
      pasoActual.value = 1
    } else if (progreso.value < 55) {
      pasoActual.value = 2
    } else if (progreso.value < 85) {
      pasoActual.value = 3
    } else {
      pasoActual.value = 4
    }

    if (progreso.value >= 100) {
      clearInterval(timerProgreso)
      setTimeout(() => {
        navegarA(PANTALLAS.JUEGO)
        emit('completar')
      }, 300)
    }
  }, intervaloMs)
})

onUnmounted(() => {
  if (timerProgreso) {
    clearInterval(timerProgreso)
  }
})
</script>

<style scoped>
.pantalla-vuelo {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: radial-gradient(circle at center, #0a0a16 0%, #030308 100%);
}

.contenedor-vuelo {
  width: 100%;
  max-width: 620px;
  background: rgba(10, 8, 20, 0.8);
  border: 1px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-blue);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

/* --- Avatar & Estela animada --- */
.vuelo-avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
}

.avatar-heroe-vuelo {
  font-size: 4rem;
  z-index: 2;
}

.estela-neon {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color-neon-blue);
  border-bottom-color: var(--color-neon-purple);
  filter: drop-shadow(0 0 8px var(--color-neon-blue));
  z-index: 1;
}

.anim-estela {
  animation: spin-flight 1.2s linear infinite;
}

@keyframes spin-flight {
  to { transform: rotate(360deg); }
}

.titulo-vuelo {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-extrabold);
  margin: 0;
  letter-spacing: 0.05em;
}

.destino-badge {
  background: rgba(0, 200, 255, 0.08);
  border: 1px solid rgba(0, 200, 255, 0.3);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.1);
}

/* --- Barra de progreso --- */
.progreso-vuelo-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.barra-vuelo {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.barra-vuelo-relleno {
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  box-shadow: 0 0 12px var(--color-neon-blue);
  border-radius: var(--radius-full);
  transition: width 0.05s linear;
}

.progreso-texto {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* --- Pasos de vuelo --- */
.pasos-vuelo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-2) var(--space-4);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.paso-vuelo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  opacity: 0.35;
  transition: all 0.3s ease;
}

.paso-vuelo-item.activo {
  opacity: 1;
  transform: scale(1.1);
}

.paso-vuelo-item.completado {
  opacity: 0.8;
  color: var(--color-neon-green);
  transform: scale(0.95);
}

.paso-icono {
  font-size: 1.5rem;
}

.paso-etiqueta {
  font-size: 0.65rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.paso-flecha {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  opacity: 0.5;
}

/* --- Mensaje Narrativo --- */
.narrativa-vuelo {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.texto-narrativo-vuelo {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  font-style: italic;
  max-width: 420px;
}
</style>
