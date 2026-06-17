<template>
  <!-- PantallaTransicionNoche: transición cinemática de atardecer a noche -->
  <section class="pantalla-transicion-noche" :style="estiloCieloDinamico" aria-label="Transición al anochecer">
    <!-- Efectos visuales de fondo -->
    <div class="efectos-fondo" aria-hidden="true">
      <div class="estrellas" :style="{ opacity: porcentajeProgreso / 100 }">
        <div class="estrellas-centelleo"></div>
      </div>
      <div class="nebula cian"></div>
      <div class="nebula purpura"></div>
      <div class="luna-silueta" :style="{ opacity: Math.max(0, (porcentajeProgreso - 40) / 60), transform: `translateY(${30 - (porcentajeProgreso / 100) * 30}px)` }">🌙</div>
      <!-- Silueta de la ciudad en la noche -->
      <svg class="silueta-ciudad-svg" viewBox="0 0 800 300" preserveAspectRatio="none" :style="{ opacity: porcentajeProgreso / 100 }">
        <path d="M0,300 L0,230 L50,230 L50,210 L90,210 L90,240 L150,240 L150,200 L200,200 L200,240 L280,240 L280,250 L340,250 L340,180 L420,180 L420,250 L490,250 L490,220 L550,220 L550,240 L630,240 L630,195 L680,195 L680,240 L800,240 L800,300 Z" fill="rgba(0, 200, 255, 0.03)" />
        <path d="M0,300 L0,260 L30,260 L30,250 L80,250 L80,260 L140,260 L140,230 L180,230 L180,260 L240,260 L240,270 L300,270 L300,210 L370,210 L370,270 L450,270 L450,240 L510,240 L510,260 L580,260 L580,225 L630,225 L630,260 L800,260 L800,300 Z" fill="rgba(184, 79, 255, 0.02)" />
      </svg>
    </div>

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
  position: relative;
  overflow: hidden;
}

.contenedor-cinematico {
  width: 100%;
  max-width: 590px;
  background: rgba(8, 4, 15, 0.65);
  border: 1px solid rgba(0, 200, 255, 0.22);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 35px rgba(184, 79, 255, 0.2);
  backdrop-filter: blur(18px);
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

/* --- Efectos de fondo --- */
.efectos-fondo {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  user-select: none;
}

.estrellas {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 50px 160px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 80px 120px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 110px 220px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 150px 50px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 200px 180px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 250px 280px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 300px 90px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 330px 150px, #ffffff, rgba(0,0,0,0));
  background-size: 300px 300px;
  background-repeat: repeat;
  transition: opacity 0.5s ease;
}

.estrellas-centelleo {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1px 1px at 15px 85px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 95px 45px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 180px 115px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 220px 210px, #ffffff, rgba(0,0,0,0));
  background-size: 250px 250px;
  background-repeat: repeat;
  animation: centelleo-lento 5s ease-in-out infinite alternate;
}

@keyframes centelleo-lento {
  0% { opacity: 0.2; }
  50% { opacity: 0.9; }
  100% { opacity: 0.4; }
}

.nebula {
  position: absolute;
  width: 60vw;
  height: 60vh;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  mix-blend-mode: screen;
}

.nebula.cian {
  background: radial-gradient(circle, var(--color-neon-blue) 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation: flotar-nebula-1 30s ease-in-out infinite alternate;
}

.nebula.purpura {
  background: radial-gradient(circle, var(--color-neon-purple) 0%, transparent 70%);
  bottom: -15%;
  right: -15%;
  animation: flotar-nebula-2 35s ease-in-out infinite alternate;
}

@keyframes flotar-nebula-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(6vw, 4vh) scale(1.15); }
}

@keyframes flotar-nebula-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-6vw, -4vh) scale(1.2); }
}

.luna-silueta {
  position: absolute;
  top: 10%;
  right: 12%;
  font-size: 3.2rem;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.contenedor-cinematico {
  position: relative;
  z-index: 1;
}

/* --- Responsividad adicional --- */
@media (max-width: 480px) {
  .luna-silueta {
    font-size: 2.2rem;
    top: 8%;
    right: 8%;
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .estrellas-centelleo {
    animation: none !important;
  }
  .nebula.cian,
  .nebula.purpura {
    animation: none !important;
  }
  .luna-silueta {
    transition: opacity 0.5s ease !important;
    transform: none !important;
  }
}

.silueta-ciudad-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  z-index: 1;
  transition: opacity 0.5s ease;
}
</style>
