<template>
  <!-- IndicadorEstadistica: componente reutilizable para mostrar estadísticas del héroe -->
  <!-- Recibe: etiqueta, valor (0-100), icono, color, tamano -->
  <div
    class="indicador-estadistica"
    :class="[`indicador-estadistica--${color}`, `indicador-estadistica--${tamano}`]"
    :title="`${etiqueta}: ${valor}/100`"
    role="meter"
    :aria-valuenow="valor"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`${etiqueta}: ${valor} de 100`"
  >
    <!-- Ícono de la estadística -->
    <span class="stat-icono" aria-hidden="true">{{ icono }}</span>

    <div class="stat-contenido">
      <!-- Etiqueta (oculta en tamaño sm para ahorrar espacio) -->
      <span v-if="tamano !== 'sm'" class="stat-etiqueta">{{ etiqueta }}</span>

      <!-- Valor numérico -->
      <span class="stat-valor">{{ valor }}</span>

      <!-- Barra de progreso -->
      <div class="stat-barra" aria-hidden="true">
        <div
          class="stat-barra-relleno"
          :style="{ width: `${valorLimitado}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { computed } from 'vue'

// --- Props: datos recibidos del componente padre ---
const props = defineProps({
  /** Nombre de la estadística */
  etiqueta: {
    type: String,
    required: true
  },
  /** Valor numérico (0-100) */
  valor: {
    type: Number,
    default: 0
  },
  /** Emoji o símbolo del ícono */
  icono: {
    type: String,
    default: '⭐'
  },
  /** Color temático: 'green' | 'blue' | 'purple' | 'gold' */
  color: {
    type: String,
    default: 'green',
    validator: (v) => ['green', 'blue', 'purple', 'gold'].includes(v)
  },
  /** Tamaño: 'sm' | 'md' | 'lg' */
  tamano: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

// computed: asegurar que el valor esté entre 0 y 100
const valorLimitado = computed(() => Math.max(0, Math.min(100, props.valor)))
</script>

<style scoped>
/* --- Base del badge --- */
.indicador-estadistica {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  backdrop-filter: blur(8px);
  transition: all var(--transition-base);
  min-width: 80px;
}

.indicador-estadistica:hover {
  transform: translateY(-1px);
}

/* --- Tamaños --- */
.indicador-estadistica--sm {
  padding: var(--space-1) var(--space-2);
  min-width: 60px;
  gap: var(--space-1);
}
.indicador-estadistica--lg {
  padding: var(--space-3) var(--space-5);
  min-width: 120px;
  gap: var(--space-3);
}

/* --- Ícono --- */
.stat-icono {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.indicador-estadistica--sm .stat-icono { font-size: 0.9rem; }
.indicador-estadistica--lg .stat-icono { font-size: 1.4rem; }

/* --- Contenido --- */
.stat-contenido {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-etiqueta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.stat-valor {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  line-height: 1;
}
.indicador-estadistica--lg .stat-valor { font-size: var(--text-lg); }

/* --- Barra de progreso --- */
.stat-barra {
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stat-barra-relleno {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

/* --- Variantes de color --- */
.indicador-estadistica--green .stat-valor { color: var(--color-neon-green); }
.indicador-estadistica--green .stat-barra-relleno {
  background: linear-gradient(90deg, var(--color-neon-green-dim), var(--color-neon-green));
  box-shadow: 0 0 6px var(--color-neon-green-glow);
}
.indicador-estadistica--green { border-color: rgba(0,255,136,0.25); }

.indicador-estadistica--blue .stat-valor { color: var(--color-neon-blue); }
.indicador-estadistica--blue .stat-barra-relleno {
  background: linear-gradient(90deg, var(--color-neon-blue-dim), var(--color-neon-blue));
  box-shadow: 0 0 6px var(--color-neon-blue-glow);
}
.indicador-estadistica--blue { border-color: rgba(0,200,255,0.25); }

.indicador-estadistica--purple .stat-valor { color: var(--color-neon-purple); }
.indicador-estadistica--purple .stat-barra-relleno {
  background: linear-gradient(90deg, var(--color-neon-purple-dim), var(--color-neon-purple));
  box-shadow: 0 0 6px var(--color-neon-purple-glow);
}
.indicador-estadistica--purple { border-color: rgba(184,79,255,0.25); }

.indicador-estadistica--gold .stat-valor { color: var(--color-neon-gold); }
.indicador-estadistica--gold .stat-barra-relleno {
  background: linear-gradient(90deg, var(--color-neon-gold-dim), var(--color-neon-gold));
  box-shadow: 0 0 6px rgba(255,215,0,0.35);
}
.indicador-estadistica--gold { border-color: rgba(255,215,0,0.25); }
</style>
