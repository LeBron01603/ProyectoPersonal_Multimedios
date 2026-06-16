<template>
  <!-- PantallaTransicionNoche: transición cinemática de atardecer a noche -->
  <section class="pantalla-transicion-noche" :style="estiloCieloDinamico" aria-label="Transición al anochecer">
    <div class="contenedor-cinematico card text-center animate-fade-in-scale">
      
      <!-- Reloj Cinemático Animado -->
      <div class="reloj-cinematico">
        <div class="circulo-reloj" :class="{ 'tick-pulse': tickActive }">
          <!-- Aguja de la hora -->
          <div class="aguja aguja-hora" :style="{ transform: `rotate(${anguloHora}deg)` }"></div>
          <!-- Aguja de los minutos -->
          <div class="aguja aguja-minuto" :style="{ transform: `rotate(${anguloMinuto}deg)` }"></div>
          <!-- Centro del reloj -->
          <div class="centro-punto"></div>
        </div>
        <div class="reloj-digital text-neon-blue">
          {{ horaFormateada }}
        </div>
      </div>

      <!-- Barra de progreso cinemática -->
      <div class="pista-progreso-reloj">
        <div class="relleno-progreso-reloj" :style="{ width: `${porcentajeProgreso}%` }"></div>
      </div>

      <!-- Mensajes narrativos desvanecidos -->
      <div class="contenedor-mensajes">
        <transition name="fade-message" mode="out-in">
          <p :key="mensajeActual" class="texto-narrativo-atardecer">
            {{ mensajeActual }}
          </p>
        </transition>
      </div>

      <!-- Botón de continuación, se muestra al final (10:00 PM) -->
      <div class="acciones-transicion">
        <transition name="fade-in-scale">
          <button 
            v-if="tiempoCompletado" 
            class="btn btn-hero btn-lg btn-danger btn-continuar-noche animate-pulse" 
            @click="alContinuar"
            id="btn-continuar-transicion-noche"
          >
            ⚡ Iniciar Transformación
          </button>
        </transition>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits ---
const emit = defineEmits(['continuar'])

// --- Audio ---
const { reproducirEfecto, reproducirMusica } = useAudio()

// --- Estado local ---
const horaActualVal = ref(17) // Comienza a las 5 PM (17:00)
const minutosActualVal = ref(0)
const tiempoCompletado = ref(false)
const tickActive = ref(false)
let timerId = null

// --- Mensajes narrativos según la hora ---
const MENSAJES_HORARIOS = {
  17: 'La universidad comienza a vaciarse... 🌇',
  18: 'Las luces del campus iluminan los pasillos vacíos... 💡',
  19: 'La ciudad sigue despierta... 🏙️',
  20: 'Los estudiantes comienzan sus actividades nocturnas... 🍻',
  21: 'Los rumores del after recorren la capital... 🗣️',
  22: 'Son las 10:00 PM. La noche te necesita... 🦸'
}

const mensajeActual = computed(() => {
  return MENSAJES_HORARIOS[horaActualVal.value] || 'El atardecer da paso a la noche...'
})

// --- Formato digital ---
const horaFormateada = computed(() => {
  const ampm = horaActualVal.value >= 12 ? 'PM' : 'AM'
  const hora12 = horaActualVal.value > 12 ? horaActualVal.value - 12 : (horaActualVal.value === 0 ? 12 : horaActualVal.value)
  const mins = minutosActualVal.value.toString().padStart(2, '0')
  return `${hora12}:${mins} ${ampm}`
})

// --- Ángulos de las agujas del reloj (grados) ---
const anguloHora = computed(() => {
  return (horaActualVal.value % 12) * 30 + minutosActualVal.value * 0.5
})

const anguloMinuto = computed(() => {
  return minutosActualVal.value * 6
})

const porcentajeProgreso = computed(() => {
  // 5 PM (17:00) a 10 PM (22:00) es un rango de 5 horas (300 minutos)
  const minutosTotales = (horaActualVal.value - 17) * 60 + minutosActualVal.value
  return Math.min(100, Math.round((minutosTotales / 300) * 100))
})

// --- Interpolación dinámica de colores de fondo del cielo (día -> atardecer -> noche) ---
const estiloCieloDinamico = computed(() => {
  const p = porcentajeProgreso.value / 100
  if (p < 0.5) {
    const factor = p / 0.5
    const r1 = 255
    const g1 = Math.round(208 - factor * 114) // 208 -> 94
    const b1 = 0
    const r2 = Math.round(factor * 62)
    const g2 = Math.round(200 - factor * 200)
    const b2 = Math.round(255 - factor * 148)
    return {
      background: `radial-gradient(circle at center, rgb(${r1}, ${g1}, ${b1}) 0%, rgb(${r2}, ${g2}, ${b2}) 100%)`
    }
  } else {
    const factor = (p - 0.5) / 0.5
    const r1 = Math.round(255 - factor * 240)
    const g1 = Math.round(94 - factor * 92)
    const b1 = Math.round(factor * 28)
    const r2 = Math.round(62 - factor * 58)
    const g2 = 0
    const b2 = Math.round(107 - factor * 99)
    return {
      background: `radial-gradient(circle at center, rgb(${r1}, ${g1}, ${b1}) 0%, rgb(${r2}, ${g2}, ${b2}) 100%)`
    }
  }
})

// --- Avanzar reloj automáticamente ---
function iniciarSimulacionReloj() {
  const intervaloMs = 25 // Avanza 5 minutos simulados cada 25ms (~1.5s de duración total)
  timerId = setInterval(() => {
    if (horaActualVal.value >= 22) {
      clearInterval(timerId)
      tiempoCompletado.value = true
      reproducirEfecto('subirNivel')
      return
    }

    minutosActualVal.value += 5
    if (minutosActualVal.value >= 60) {
      minutosActualVal.value = 0
      horaActualVal.value += 1
      reproducirEfecto('click')
      tickActive.value = true
      setTimeout(() => {
        tickActive.value = false
      }, 150)
    }
  }, intervaloMs)
}

function alContinuar() {
  reproducirEfecto('click')
  emit('continuar')
}

onMounted(() => {
  // Disparar sonido de transición ambiental
  reproducirEfecto('transicion')
  // Mantener música relajada o de campus en transición
  reproducirMusica('campus')
  iniciarSimulacionReloj()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<style scoped>
.pantalla-transicion-noche {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: radial-gradient(circle at center, #1b0a2a 0%, #06050b 100%);
}

.contenedor-cinematico {
  width: 100%;
  max-width: 550px;
  background: rgba(12, 6, 20, 0.8);
  border: 1px solid rgba(0, 200, 255, 0.15);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 25px rgba(184, 79, 255, 0.15);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  min-height: 480px;
  justify-content: space-between;
}

/* --- Reloj Cinemático Estilo Analógico --- */
.reloj-cinematico {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.circulo-reloj {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--color-neon-blue);
  box-shadow: 0 0 15px var(--color-neon-blue-glow),
              inset 0 0 15px var(--color-neon-blue-glow);
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.15s ease, border-color 0.15s ease;
}

.circulo-reloj.tick-pulse {
  transform: scale(1.08);
  box-shadow: 0 0 25px var(--color-neon-blue),
              inset 0 0 20px var(--color-neon-blue);
  border-color: #ffffff;
}

.aguja {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  background: var(--color-text-primary);
  border-radius: var(--radius-full);
}

.aguja-hora {
  width: 4px;
  height: 40px;
  margin-left: -2px;
  background: var(--color-neon-blue);
  box-shadow: 0 0 5px var(--color-neon-blue-glow);
}

.aguja-minuto {
  width: 2px;
  height: 55px;
  margin-left: -1px;
  background: var(--color-text-primary);
}

.centro-punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neon-purple);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px var(--color-neon-purple-glow);
}

.reloj-digital {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  text-shadow: 0 0 8px var(--color-neon-blue-glow);
}

/* --- Barra de Progreso Temporal --- */
.pista-progreso-reloj {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.relleno-progreso-reloj {
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

/* --- Contenedor Mensajes --- */
.contenedor-mensajes {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-2);
}

.texto-narrativo-atardecer {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

/* --- Acciones --- */
.acciones-transicion {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.btn-continuar-noche {
  box-shadow: 0 0 15px rgba(255, 70, 70, 0.25);
}

/* Transición de Mensajes (fade out / in) */
.fade-message-enter-active,
.fade-message-leave-active {
  transition: all 0.4s ease;
}

.fade-message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transición del Botón */
.fade-in-scale-enter-active {
  animation: fadeInScale 0.4s ease both;
}
</style>
