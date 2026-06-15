<template>
  <!-- EncabezadoApp: encabezado persistente del juego -->
  <header class="encabezado-app">
    <div class="header-inner container">
      <!-- Logo / Brand -->
      <div class="header-brand">
        <span class="brand-icon animate-float">🦸</span>
        <div class="brand-text">
          <span class="brand-title">Ruta Tica</span>
          <span class="brand-subtitle">El Héroe del After</span>
        </div>
      </div>

      <!-- Estadísticas del héroe (visibles solo si hay identidad) -->
      <div v-if="mostrarEstadisticas" class="header-stats">
        <IndicadorEstadistica
          v-for="stat in estadisticasVisibles"
          :key="stat.key"
          :etiqueta="stat.etiqueta"
          :valor="stat.valor"
          :icono="stat.icono"
          :color="stat.color"
          tamano="sm"
        />
      </div>

      <!-- Controles de header -->
      <div class="header-controls">
        <!-- Botón de sonido -->
        <button
          class="control-btn"
          :class="{ muted: estaSilenciado }"
          :title="estaSilenciado ? 'Activar sonido' : 'Silenciar'"
          :aria-label="estaSilenciado ? 'Activar sonido' : 'Silenciar'"
          @click="alternarSilencio"
        >
          {{ estaSilenciado ? '🔇' : '🔊' }}
        </button>

        <!-- Botón de reset (visible si no estamos en pantalla inicial) -->
        <button
          v-if="mostrarReiniciar"
          class="control-btn control-btn--danger"
          title="Reiniciar juego"
          aria-label="Reiniciar juego"
          @click="alReiniciar"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- Barra de progreso decorativa -->
    <div class="header-progress-bar">
      <div
        class="header-progress-fill"
        :style="{ width: porcentajeProgreso + '%' }"
      ></div>
    </div>
  </header>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { computed } from 'vue'

// --- Componentes hijos ---
import IndicadorEstadistica from '../game/IndicadorEstadistica.vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Estado del juego ---
const {
  pantallaActual,
  estadisticasHeroe,
  identidadHeroe,
  porcentajeProgreso,
  reiniciarJuego,
  PANTALLAS
} = useEstadoJuego()

// --- Audio ---
const { estaSilenciado, alternarSilencio } = useAudio()

// --- Computed: mostrar estadísticas solo en pantallas de juego ---
const mostrarEstadisticas = computed(() =>
  identidadHeroe.nombre !== '' &&
  [PANTALLAS.MAPA, PANTALLAS.JUEGO, PANTALLAS.RESULTADO].includes(pantallaActual.value)
)

// --- Computed: mostrar botón de reset si no estamos en INICIO ---
const mostrarReiniciar = computed(() => pantallaActual.value !== PANTALLAS.INICIO)

// --- Stats a mostrar en el header ---
const estadisticasVisibles = computed(() => [
  { key: 'energia',         etiqueta: 'Energía',         valor: estadisticasHeroe.energia,         icono: '⚡', color: 'gold'   },
  { key: 'conocimiento',    etiqueta: 'Conocimiento',    valor: estadisticasHeroe.conocimiento,    icono: '📚', color: 'blue'   },
  { key: 'responsabilidad', etiqueta: 'Responsabilidad', valor: estadisticasHeroe.responsabilidad, icono: '🎓', color: 'green'  }
])

// --- Emit: notificar reset al padre si es necesario ---
const emit = defineEmits(['reiniciar'])

function alReiniciar() {
  if (confirm('¿Reiniciar el juego? Perderás tu progreso actual.')) {
    reiniciarJuego()
    emit('reiniciar')
  }
}
</script>

<style scoped>
/* --- Header principal --- */
.encabezado-app {
  position: sticky;
  top: 0;
  z-index: var(--z-overlay);
  background: rgba(10, 14, 26, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-3);
  min-height: 64px;
}

/* --- Brand --- */
.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.brand-icon {
  font-size: 1.8rem;
  display: inline-block;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  font-family: var(--font-display);
  font-weight: var(--font-extrabold);
  font-size: var(--text-lg);
  color: var(--color-neon-green);
  text-shadow: 0 0 10px var(--color-neon-green-glow);
  letter-spacing: 0.04em;
}

.brand-subtitle {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* --- Stats --- */
.header-stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  justify-content: center;
}

/* --- Controles --- */
.header-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.control-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn:hover {
  background: rgba(0,255,136,0.12);
  border-color: var(--color-neon-green);
  transform: scale(1.05);
}

.control-btn.muted {
  opacity: 0.5;
}

.control-btn--danger:hover {
  background: rgba(255, 70, 70, 0.15);
  border-color: #ff4646;
}

/* --- Barra de progreso --- */
.header-progress-bar {
  height: 2px;
  background: rgba(255,255,255,0.06);
}

.header-progress-fill {
  height: 100%;
  background: var(--gradient-btn);
  transition: width 0.8s ease;
  box-shadow: 0 0 8px var(--color-neon-green-glow);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .header-stats {
    display: none;
  }
  .brand-subtitle {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-inner {
    min-height: 52px;
  }
  .brand-icon {
    font-size: 1.4rem;
  }
  .brand-title {
    font-size: var(--text-base);
  }
}
</style>
