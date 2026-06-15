<template>
  <!-- TarjetaProvincia: tarjeta reutilizable para cada provincia/misión -->
  <!-- Props: provincia (objeto), estaCompletada, estaActiva -->
  <article
    class="tarjeta-provincia"
    :class="{
      'tarjeta-provincia--bloqueada':  !provincia.desbloqueada,
      'tarjeta-provincia--completada': estaCompletada,
      'tarjeta-provincia--activa':     estaActiva
    }"
    :style="{ '--color-tarjeta': provincia.color }"
    :aria-label="`Provincia ${provincia.nombre}${provincia.desbloqueada ? '' : ' - Bloqueada'}`"
    role="button"
    :tabindex="provincia.desbloqueada ? 0 : -1"
    @click="alHacerClicTarjeta"
    @keyup.enter="alHacerClicTarjeta"
  >
    <!-- Badge de estado (completado / bloqueado) -->
    <div class="badge-estado-tarjeta" aria-hidden="true">
      <span v-if="estaCompletada">✅</span>
      <span v-else-if="!provincia.desbloqueada">🔒</span>
      <span v-else class="punto-pulso"></span>
    </div>

    <!-- Emoji / ícono de provincia -->
    <div class="emoji-tarjeta" aria-hidden="true">
      {{ provincia.emoji }}
    </div>

    <!-- Info principal -->
    <div class="info-tarjeta">
      <h3 class="nombre-tarjeta">{{ provincia.nombre }}</h3>
      <p class="region-tarjeta">{{ provincia.region }}</p>
      <p class="descripcion-tarjeta">{{ provincia.descripcion }}</p>
    </div>

    <!-- Dificultad -->
    <div class="dificultad-tarjeta" aria-label="Dificultad">
      <span
        v-for="n in 4"
        :key="n"
        class="estrella-dificultad"
        :class="{ activa: n <= provincia.dificultad }"
        aria-hidden="true"
      >★</span>
    </div>

    <!-- Stats rápidos de la misión -->
    <div class="estadisticas-tarjeta">
      <div class="mini-estadistica">
        <span class="icono-mini-estadistica">⚡</span>
        <span class="valor-mini-estadistica">{{ provincia.estadisticas.energia }}</span>
      </div>
      <div class="mini-estadistica">
        <span class="icono-mini-estadistica">📚</span>
        <span class="valor-mini-estadistica">{{ provincia.estadisticas.conocimiento }}</span>
      </div>
      <div class="mini-estadistica">
        <span class="icono-mini-estadistica">🎉</span>
        <span class="valor-mini-estadistica">{{ provincia.estadisticas.diversion }}</span>
      </div>
    </div>

    <!-- Botón de acción -->
    <button
      v-if="provincia.desbloqueada && !estaCompletada"
      class="btn btn-primary btn-sm cta-tarjeta"
      @click.stop="alIniciarMision"
    >
      ⚡ Iniciar misión
    </button>

    <div v-else-if="estaCompletada" class="etiqueta-completada-tarjeta">
      Misión completada 🏆
    </div>

    <div v-else class="etiqueta-bloqueada-tarjeta">
      Completa misiones anteriores para desbloquear
    </div>

    <!-- Overlay de bloqueo -->
    <div v-if="!provincia.desbloqueada" class="overlay-bloqueo-tarjeta" aria-hidden="true">
      <span class="icono-candado">🔒</span>
    </div>
  </article>
</template>

<script setup>
// --- Importaciones ---
import { defineProps, defineEmits } from 'vue'

// --- Props: datos de la provincia recibidos del padre ---
const props = defineProps({
  /** Objeto de provincia desde misiones.json */
  provincia: {
    type: Object,
    required: true
  },
  /** Si la misión de esta provincia ya fue completada */
  estaCompletada: {
    type: Boolean,
    default: false
  },
  /** Si es la provincia actualmente seleccionada */
  estaActiva: {
    type: Boolean,
    default: false
  }
})

// --- Emits: eventos hacia el componente padre ---
const emit = defineEmits(['iniciar-mision', 'seleccionar'])

function alHacerClicTarjeta() {
  if (!props.provincia.desbloqueada) return
  emit('seleccionar', props.provincia)
}

function alIniciarMision() {
  if (!props.provincia.desbloqueada) return
  emit('iniciar-mision', props.provincia)
}
</script>

<style scoped>
/* --- Tarjeta de provincia --- */
.tarjeta-provincia {
  position: relative;
  cursor: pointer;
  background: var(--gradient-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(10px);
  transition: all var(--transition-base);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  border-left: 3px solid var(--color-tarjeta, var(--color-neon-green));
}

.tarjeta-provincia::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 20% 20%,
    rgba(0, 255, 136, 0.06),
    transparent 60%
  );
  pointer-events: none;
}

/* --- Estados --- */
.tarjeta-provincia:not(.tarjeta-provincia--bloqueada):hover {
  transform: translateY(-4px) scale(1.01);
  border-color: var(--color-tarjeta, var(--color-neon-green));
  box-shadow: var(--shadow-card),
              0 0 20px rgba(0, 255, 136, 0.25);
}

.tarjeta-provincia--bloqueada {
  cursor: not-allowed;
  opacity: 0.55;
  filter: grayscale(0.4);
}

.tarjeta-provincia--completada {
  border-left-color: var(--color-neon-green);
  background: linear-gradient(145deg, rgba(0,255,136,0.06), rgba(10,14,26,0.95));
}

.tarjeta-provincia--activa {
  border-color: var(--color-tarjeta, var(--color-neon-green));
  box-shadow: var(--shadow-card), 0 0 0 2px var(--color-tarjeta, var(--color-neon-green));
}

/* --- Badge de estado (esquina superior derecha) --- */
.badge-estado-tarjeta {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  font-size: 1.1rem;
}

.punto-pulso {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neon-green);
  box-shadow: 0 0 6px var(--color-neon-green-glow);
  animation: pulse-neon 2s infinite;
}

/* --- Emoji --- */
.emoji-tarjeta {
  font-size: 2.5rem;
  line-height: 1;
}

/* --- Info --- */
.nombre-tarjeta {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.region-tarjeta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.descripcion-tarjeta {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* --- Dificultad --- */
.dificultad-tarjeta {
  display: flex;
  gap: 2px;
}

.estrella-dificultad {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.estrella-dificultad.activa {
  color: var(--color-neon-gold);
  text-shadow: 0 0 6px rgba(255,215,0,0.5);
}

/* --- Mini stats --- */
.estadisticas-tarjeta {
  display: flex;
  gap: var(--space-4);
}

.mini-estadistica {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.icono-mini-estadistica { font-size: 0.9rem; }
.valor-mini-estadistica {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
}

/* --- CTA --- */
.cta-tarjeta {
  margin-top: auto;
  align-self: flex-start;
}

.etiqueta-completada-tarjeta {
  font-size: var(--text-sm);
  color: var(--color-neon-green);
  font-weight: var(--font-semibold);
}

.etiqueta-bloqueada-tarjeta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-style: italic;
}

/* --- Overlay de bloqueo --- */
.overlay-bloqueo-tarjeta {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,14,26,0.35);
  border-radius: inherit;
}

.icono-candado {
  font-size: 2rem;
  opacity: 0.5;
}
</style>
