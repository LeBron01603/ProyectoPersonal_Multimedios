<template>
  <!-- PantallaNuevoDia: transición de amanecer tras una noche de patrullaje -->
  <section class="pantalla-nuevo-dia" aria-label="Pantalla de inicio de un nuevo día">
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
import { useEstadoJuego, PANTALLAS } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

const emit = defineEmits(['comenzar'])
const { navegarA, identidadHeroe, estadisticasHeroe, misionesCompletadas } = useEstadoJuego()
const { reproducirMusica, reproducirEfecto } = useAudio()

// Computar el día de la semana según misiones completadas
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const diaDeSemana = computed(() => {
  const count = misionesCompletadas.value.length
  return dias[count % 7]
})

function comenzarNuevoDia() {
  reproducirEfecto('click')
  navegarA(PANTALLAS.ACTIVIDADES)
  emit('comenzar')
}

onMounted(() => {
  reproducirMusica('amanecer')
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
}

.contenedor-nuevo-dia {
  width: 100%;
  max-width: 550px;
  background: rgba(26, 16, 46, 0.7);
  border: 1px solid rgba(255, 140, 0, 0.25);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 25px rgba(255, 140, 0, 0.15);
  backdrop-filter: blur(16px);
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
</style>
