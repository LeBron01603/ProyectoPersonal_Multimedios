<template>
  <!-- PantallaNuevoDia: transición de amanecer tras una noche de patrullaje -->
  <section class="pantalla-nuevo-dia" aria-label="Pantalla de inicio de un nuevo día">
    <!-- Efectos de fondo del amanecer -->
    <div class="efectos-fondo" aria-hidden="true">
      <div class="amanecer-glow"></div>
      <div class="particulas-calidas">
        <div class="particula p1"></div>
        <div class="particula p2"></div>
        <div class="particula p3"></div>
        <div class="particula p4"></div>
        <div class="particula p5"></div>
      </div>
      <!-- Silueta del campus minimalista -->
      <svg class="silueta-campus-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
        <path d="M0,300 L0,220 L60,220 L60,200 L120,200 L120,220 L180,220 L180,180 L220,180 L220,220 L280,220 L280,240 L350,240 L350,150 L450,150 L450,240 L520,240 L520,200 L600,200 L600,220 L680,220 L680,190 L740,190 L740,220 L800,220 L800,300 Z" fill="rgba(255, 140, 0, 0.04)" />
        <path d="M0,300 L0,250 L40,250 L40,240 L100,240 L100,250 L160,250 L160,210 L200,210 L200,250 L260,250 L260,260 L320,260 L320,180 L400,180 L400,260 L480,260 L480,220 L560,220 L560,250 L640,250 L640,210 L700,210 L700,250 L800,250 L800,300 Z" fill="rgba(255, 140, 0, 0.02)" />
      </svg>
    </div>

    <div class="contenedor-nuevo-dia card text-center animate-fade-in-scale">
      
      <!-- Reloj del amanecer -->
      <div class="reloj-amanecer animate-float">
        <span class="emoji-sol">🌅</span>
        <div class="info-tiempo-sol">
          <span class="dia-sol">{{ diaDeSemana }}</span>
          <span class="hora-sol">5:00 AM</span>
        </div>
      </div>

      <div class="divisoria-neon orange"></div>

      <!-- Texto descriptivo narrativo -->
      <p class="texto-narrativa-nuevo-dia">
        La misión terminó. Después de una larga noche, logras regresar al campus. Hoy empieza otro día y debes cuidar tu identidad.
      </p>

      <div class="estado-heroe-resumen">
        <p class="alias-resumen">🦸 {{ identidadHeroe.aliasHeroe || 'Héroe del After' }}</p>
        <div class="stats-fila">
          <span>⚡ Energía: {{ estadisticasHeroe.energia }}%</span>
          <span>🎓 Responsabilidad: {{ estadisticasHeroe.responsabilidad }}%</span>
          <span>🔍 Sospecha: {{ estadisticasHeroe.sospechaIdentidad }}%</span>
        </div>
      </div>

      <!-- Botón principal de acción -->
      <button class="btn btn-hero btn-lg btn-nuevo-dia animate-pulse" @click="comenzarNuevoDia">
        🏫 Comenzar nuevo día
      </button>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

const emit = defineEmits(['comenzar'])
const { identidadHeroe, estadisticasHeroe, misionesCompletadas } = useEstadoJuego()
const { reproducirMusica, reproducirEfecto } = useAudio()

// Computar el día de la semana según misiones completadas
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const diaDeSemana = computed(() => {
  const count = misionesCompletadas.value.length
  return dias[count % 7]
})

function comenzarNuevoDia() {
  reproducirEfecto('click')
  emit('comenzar')
}

onMounted(() => {
  reproducirMusica('campus')
})
</script>

<style scoped>
.pantalla-nuevo-dia {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: radial-gradient(circle at center, #1b1035 0%, #080612 100%);
  position: relative;
  overflow: hidden;
}

.contenedor-nuevo-dia {
  width: 100%;
  max-width: 590px;
  background: rgba(20, 10, 35, 0.55);
  border: 1px solid rgba(255, 140, 0, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 35px rgba(255, 140, 0, 0.25);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  justify-content: center;
}

/* --- Reloj --- */
.reloj-amanecer {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: rgba(255, 140, 0, 0.06);
  border: 1px solid rgba(255, 140, 0, 0.25);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-xl);
}

.emoji-sol {
  font-size: 2.2rem;
}

.info-tiempo-sol {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.2;
}

.dia-sol {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hora-sol {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: #ff9d00;
  text-shadow: 0 0 10px rgba(255, 157, 0, 0.5);
}

.divisoria-neon {
  width: 80px;
  height: 3px;
  background: #ff9d00;
  box-shadow: 0 0 8px #ff9d00;
  border-radius: var(--radius-full);
}

.texto-narrativa-nuevo-dia {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
  max-width: 440px;
}

.estado-heroe-resumen {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.alias-resumen {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.stats-fila {
  display: flex;
  justify-content: space-around;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.btn-nuevo-dia {
  background: linear-gradient(135deg, #ff9d00, #d45d00);
  border: 1px solid rgba(255, 140, 0, 0.4);
  color: var(--color-text-primary);
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.2);
}

.btn-nuevo-dia:hover {
  background: linear-gradient(135deg, #ffb33b, #ef6c00);
  box-shadow: 0 0 25px rgba(255, 140, 0, 0.4);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .contenedor-nuevo-dia {
    padding: var(--space-6) var(--space-4);
  }
  .stats-fila {
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
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

.amanecer-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vw;
  max-width: 800px;
  max-height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 120, 0, 0.1) 0%, rgba(255, 215, 0, 0.03) 45%, transparent 70%);
  filter: blur(50px);
  animation: pulso-amanecer 8s ease-in-out infinite alternate;
}

@keyframes pulso-amanecer {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

.silueta-campus-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  z-index: 1;
}

.particulas-calidas {
  position: absolute;
  inset: 0;
}

.particula {
  position: absolute;
  bottom: -20px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 140, 0, 0.2) 100%);
  border-radius: 50%;
  filter: blur(1px);
  animation: flotar-particula-sube linear infinite;
}

.p1 { left: 15%; width: 6px; height: 6px; animation-duration: 9s; animation-delay: 0s; }
.p2 { left: 35%; width: 8px; height: 8px; animation-duration: 12s; animation-delay: 2s; }
.p3 { left: 55%; width: 5px; height: 5px; animation-duration: 10s; animation-delay: 1s; }
.p4 { left: 75%; width: 7px; height: 7px; animation-duration: 14s; animation-delay: 3s; }
.p5 { left: 90%; width: 6px; height: 6px; animation-duration: 8s; animation-delay: 4s; }

@keyframes flotar-particula-sube {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-105vh) scale(0.8); opacity: 0; }
}

.contenedor-nuevo-dia {
  position: relative;
  z-index: 2;
  box-shadow: var(--shadow-card), 0 0 30px rgba(255, 140, 0, 0.22);
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .amanecer-glow {
    animation: none !important;
  }
  .particula {
    animation: none !important;
    display: none;
  }
}
</style>
