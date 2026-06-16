<template>
  <section class="pantalla-vuelo" aria-label="Pantalla de vuelo hacia la misión">

    <!-- Rayas de velocidad de fondo -->
    <div class="speed-lines" aria-hidden="true">
      <div v-for="n in 12" :key="n" class="speed-line" :style="lineaVelocidadEstilo(n)"></div>
    </div>

    <div
      class="contenedor-vuelo card text-center"
      :class="{ 'fade-in-vuelo': mostrarContenido, 'fade-out-final': estaDesvaneciendo }"
    >

      <!-- Héroe + estela neón + estela de velocidad horizontal -->
      <div class="vuelo-avatar-container">
        <!-- Estela orbital -->
        <div class="estela-neon anim-estela"></div>
        <!-- Estelas de velocidad horizontales -->
        <div class="estela-vel estela-vel--1"></div>
        <div class="estela-vel estela-vel--2"></div>
        <div class="estela-vel estela-vel--3"></div>
        <div class="avatar-heroe-vuelo animate-float">🦸‍♂️</div>
      </div>

      <h2 class="titulo-vuelo text-neon-blue">¡Volando a la Misión!</h2>

      <!-- Destino prominente -->
      <div class="destino-badge" v-if="provinciaActiva">
        <span class="destino-label">📍 Destino</span>
        <span class="destino-nombre">{{ provinciaActiva.nombre }}</span>
        <span v-if="provinciaActiva.emoji" class="destino-emoji">{{ provinciaActiva.emoji }}</span>
      </div>

      <!-- Trayectoria SVG -->
      <div class="mapa-trayectoria-container">
        <svg class="linea-trayectoria-svg" viewBox="0 0 400 120" width="100%" height="120">
          <defs>
            <linearGradient id="gradient-vuelo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00c8ff" />
              <stop offset="100%" stop-color="#b026ff" />
            </linearGradient>
            <filter id="neon-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Camino guía punteado -->
          <path d="M 40,80 Q 200,20 360,80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3" stroke-dasharray="6 6" />

          <!-- Progreso neón -->
          <path
            d="M 40,80 Q 200,20 360,80"
            fill="none"
            stroke="url(#gradient-vuelo)"
            stroke-width="4"
            stroke-dasharray="350"
            :stroke-dashoffset="350 - (progreso / 100) * 350"
            filter="url(#neon-glow-blue)"
          />

          <!-- Campus -->
          <circle cx="40" cy="80" r="8" fill="#00c8ff" filter="drop-shadow(0 0 6px #00c8ff)" />
          <text x="40" y="105" text-anchor="middle" fill="#00c8ff" font-size="10" font-weight="bold">Campus</text>

          <!-- Destino -->
          <circle cx="360" cy="80" r="8" :fill="pasoActual === 4 ? '#39ff14' : '#ff007f'" :filter="`drop-shadow(0 0 6px ${pasoActual === 4 ? '#39ff14' : '#ff007f'})`" />
          <text x="360" y="105" text-anchor="middle" :fill="pasoActual === 4 ? '#39ff14' : '#ff007f'" font-size="10" font-weight="bold">
            {{ provinciaActiva?.nombre || 'Destino' }}
          </text>
        </svg>

        <!-- Héroe volando sobre la curva con micro-estela -->
        <div class="heroe-volador" :style="estiloHeroeVolador">
          <span class="heroe-micro-estela"></span>
          ⚡🦸‍♂️
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="progreso-vuelo-container">
        <div class="barra-vuelo">
          <div class="barra-vuelo-relleno" :style="{ width: `${progreso}%` }"></div>
        </div>
        <span class="progreso-texto">{{ progreso }}% del trayecto completado</span>
      </div>

      <!-- Hitos -->
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

      <!-- Narrativa -->
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

const { navegarA, provinciaActiva, esModoNocturno, mensajeAlertaMapa, PANTALLAS } = useEstadoJuego()
const { reproducirEfecto, reproducirMusica } = useAudio()

const emit = defineEmits(['completar'])

const progreso          = ref(0)
const pasoActual        = ref(1)
const estaDesvaneciendo = ref(false)
const mostrarContenido  = ref(false)   // controla el fade-in inicial
let timerProgreso       = null

// Héroe siguiendo la curva de Bezier cuadrática
const estiloHeroeVolador = computed(() => {
  const t  = progreso.value / 100
  const x  = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 200 + t * t * 360
  const y  = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 20  + t * t * 80
  return {
    left:      `${(x / 400) * 100}%`,
    top:       `${(y / 120) * 100}%`,
    transform: 'translate(-50%, -50%)'
  }
})

// Estilo determinista para cada raya de velocidad (sin Math.random)
function lineaVelocidadEstilo(n) {
  const top    = ((n * 73)  % 90) + 5          // 5–94 %
  const width  = ((n * 47)  % 55) + 25         // 25–79 px
  const delay  = ((n * 37)  % 15) / 10         // 0–1.4 s
  const dur    = 0.4 + ((n * 23) % 6) / 10     // 0.4–1.0 s
  const opacity = 0.08 + ((n * 13) % 12) / 100 // 0.08–0.19
  return {
    top:              `${top}%`,
    width:            `${width}px`,
    animationDelay:   `${delay}s`,
    animationDuration:`${dur}s`,
    opacity
  }
}

const mensajeNarrativo = computed(() => {
  const nombre = provinciaActiva.value?.nombre || 'destino'
  if (pasoActual.value === 1) return 'Abandonando discretamente el campus por las sombras...'
  if (pasoActual.value === 2) return '¡Alas de energía activadas! Despegando sobre la ciudad...'
  if (pasoActual.value === 3) return 'Volando a toda velocidad sobre el espacio aéreo de Costa Rica...'
  return `Aterrizando sigilosamente en ${nombre}... ¡Prepárate!`
})

onMounted(() => {
  if (!provinciaActiva.value) {
    console.warn('[PantallaVuelo] Sin provincia seleccionada, redirigiendo...')
    mensajeAlertaMapa.value = 'Selecciona una provincia antes de patrullar'
    esModoNocturno.value = true
    navegarA(PANTALLAS.MAPA)
    return
  }

  // Fade-in al iniciar (pequeño delay para que Vue monte el elemento)
  requestAnimationFrame(() => {
    setTimeout(() => { mostrarContenido.value = true }, 30)
  })

  reproducirMusica('transformacion')
  reproducirEfecto('vuelo')

  const duracionTotal = 3500   // <= 3.5 s
  const intervaloMs   = 35
  const incremento    = 100 / (duracionTotal / intervaloMs)

  timerProgreso = setInterval(() => {
    progreso.value = Math.min(100, Number((progreso.value + incremento).toFixed(1)))

    if      (progreso.value <  25) pasoActual.value = 1
    else if (progreso.value <  55) pasoActual.value = 2
    else if (progreso.value <  85) pasoActual.value = 3
    else                           pasoActual.value = 4

    if (progreso.value >= 100) {
      clearInterval(timerProgreso)
      estaDesvaneciendo.value = true
      setTimeout(() => {
        navegarA(PANTALLAS.JUEGO)
        emit('completar')
      }, 500)
    }
  }, intervaloMs)
})

onUnmounted(() => {
  if (timerProgreso) clearInterval(timerProgreso)
})
</script>

<style scoped>
/* ===== Contenedor principal ===== */
.pantalla-vuelo {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: radial-gradient(circle at center, #070714 0%, #02020a 100%);
  overflow: hidden;
  position: relative;
}

/* ===== Rayas de velocidad (fondo) ===== */
.speed-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.speed-line {
  position: absolute;
  left: -80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00c8ff, transparent);
  border-radius: 9999px;
  animation: speed-streak linear infinite;
  filter: blur(0.5px);
}

@keyframes speed-streak {
  0%   { transform: translateX(0);      opacity: 0; }
  10%  {                                opacity: 1; }
  90%  {                                opacity: 1; }
  100% { transform: translateX(110vw);  opacity: 0; }
}

/* ===== Card principal ===== */
.contenedor-vuelo {
  width: 100%;
  max-width: 620px;
  background: rgba(8, 6, 18, 0.85);
  border: 1px solid rgba(0, 200, 255, 0.22);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-blue);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  position: relative;
  z-index: 2;
  /* Empieza invisible para fade-in */
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.contenedor-vuelo.fade-in-vuelo {
  opacity: 1;
  transform: scale(1);
}

.contenedor-vuelo.fade-out-final {
  opacity: 0;
  transform: scale(0.94);
}

/* ===== Avatar + estela ===== */
.vuelo-avatar-container {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-heroe-vuelo {
  font-size: 4rem;
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 0 12px rgba(0,200,255,0.6));
}

/* Aro orbital */
.estela-neon {
  position: absolute;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color-neon-blue);
  border-bottom-color: var(--color-neon-purple);
  filter: drop-shadow(0 0 8px var(--color-neon-blue));
  z-index: 1;
}
.anim-estela { animation: spin-flight 1.1s linear infinite; }
@keyframes spin-flight { to { transform: rotate(360deg); } }

/* Estelas de velocidad horizontales alrededor del héroe */
.estela-vel {
  position: absolute;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, #00c8ff);
  right: 88px;
  animation: vel-streak 0.7s ease-out infinite;
  pointer-events: none;
}
.estela-vel--1 { width: 36px; top: 38%; animation-delay: 0s;    opacity: 0.7; }
.estela-vel--2 { width: 22px; top: 50%; animation-delay: 0.15s; opacity: 0.5; }
.estela-vel--3 { width: 14px; top: 62%; animation-delay: 0.3s;  opacity: 0.35; }

@keyframes vel-streak {
  0%   { transform: scaleX(1);   opacity: inherit; }
  60%  { transform: scaleX(0.3); opacity: 0; }
  100% { transform: scaleX(1);   opacity: inherit; }
}

/* ===== Título ===== */
.titulo-vuelo {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-extrabold);
  margin: 0;
  letter-spacing: 0.05em;
  text-shadow: 0 0 18px rgba(0,200,255,0.5);
}

/* ===== Badge de destino (más prominente) ===== */
.destino-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(0, 200, 255, 0.07);
  border: 1px solid rgba(0, 200, 255, 0.35);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  box-shadow: 0 0 14px rgba(0,200,255,0.12), inset 0 0 8px rgba(0,200,255,0.04);
  animation: pulse-badge 2s ease-in-out infinite;
}
.destino-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.destino-nombre {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  text-shadow: 0 0 10px rgba(0,200,255,0.5);
}
.destino-emoji {
  font-size: 1.3rem;
}
@keyframes pulse-badge {
  0%, 100% { box-shadow: 0 0 14px rgba(0,200,255,0.12); }
  50%       { box-shadow: 0 0 22px rgba(0,200,255,0.28); }
}

/* ===== Barra de progreso ===== */
.progreso-vuelo-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.barra-vuelo {
  width: 100%;
  height: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius-full);
  overflow: visible;
  border: 1px solid rgba(255,255,255,0.04);
  position: relative;
}
.barra-vuelo-relleno {
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  box-shadow: 0 0 15px var(--color-neon-blue);
  border-radius: var(--radius-full);
  transition: width 0.05s linear;
  position: relative;
}
.barra-vuelo-relleno::after {
  content: '⚡';
  position: absolute;
  right: -10px;
  top: -8px;
  font-size: 1.1rem;
  animation: float 1s infinite alternate;
  text-shadow: 0 0 8px var(--color-neon-blue);
}
.progreso-texto {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* ===== Hitos de vuelo ===== */
.pasos-vuelo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-2) var(--space-4);
  background: rgba(255,255,255,0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.04);
}
.paso-vuelo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  opacity: 0.3;
  transition: all 0.3s ease;
}
.paso-vuelo-item.activo    { opacity: 1; transform: scale(1.1); }
.paso-vuelo-item.completado{ opacity: 0.75; color: var(--color-neon-green); transform: scale(0.95); }
.paso-icono   { font-size: 1.5rem; }
.paso-etiqueta{ font-size: 0.65rem; font-weight: var(--font-bold); text-transform: uppercase; }
.paso-flecha  { font-size: 0.85rem; color: var(--color-text-muted); opacity: 0.4; }

/* ===== Narrativa ===== */
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
  text-align: center;
}

/* ===== Trayecto SVG ===== */
.mapa-trayectoria-container {
  position: relative;
  width: 100%;
  max-width: 440px;
  height: 120px;
  margin: 0 auto;
  background: rgba(255,255,255,0.015);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 10px;
  overflow: visible;
}
.linea-trayectoria-svg { overflow: visible; }

/* Héroe volador con micro-estela */
.heroe-volador {
  position: absolute;
  font-size: 2.2rem;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 0 10px var(--color-neon-blue));
  transition: left 0.05s linear, top 0.05s linear;
  display: flex;
  align-items: center;
}
.heroe-micro-estela {
  display: inline-block;
  width: 28px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(0,200,255,0.7));
  border-radius: 9999px;
  margin-right: 2px;
  filter: blur(1px);
  animation: micro-estela-pulse 0.6s ease-in-out infinite alternate;
}
@keyframes micro-estela-pulse {
  from { opacity: 0.4; transform: scaleX(0.6); }
  to   { opacity: 1;   transform: scaleX(1); }
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .contenedor-vuelo { padding: var(--space-6) var(--space-4); }
  .titulo-vuelo     { font-size: var(--text-xl); }
  .destino-nombre   { font-size: var(--text-base); }
}
</style>
