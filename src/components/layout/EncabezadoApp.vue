<template>
  <!-- EncabezadoApp: encabezado persistente del juego -->
  <header class="encabezado-app" :class="{ 'header-inicio': pantallaActual === PANTALLAS.INICIO }">
    <div class="header-inner container">
      <!-- Logo / Brand -->
      <div v-if="pantallaActual !== PANTALLAS.INICIO" class="header-brand">
        <div class="brand-logo-wrapper">
          <span class="brand-icon animate-float">🦸</span>
          <div class="brand-glow-bg"></div>
        </div>
        <div class="brand-text">
          <span class="brand-title">RUTA TICA</span>
          <span class="brand-subtitle">El Héroe del After</span>
          <span class="brand-insignia">🛡️ Protector Universitario</span>
        </div>
      </div>
      <div v-else class="header-brand-placeholder"></div>

      <!-- Estadísticas del héroe (visibles solo si hay identidad) -->
      <div v-if="mostrarEstadisticas" class="header-stats">
        <div class="indicador-nivel-header" title="Nivel y Experiencia de tu Héroe">
          <span class="emoji-nivel" aria-hidden="true">⭐</span>
          <span class="texto-nivel">Nvl {{ nivelHeroe }}</span>
          <span class="xp-nivel">{{ experienciaHeroe }} XP</span>
        </div>
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
        <!-- Botón de Centro del Héroe (visible si hay identidad) -->
        <button
          v-if="identidadHeroe.nombre !== ''"
          class="control-btn"
          title="Centro del Héroe"
          aria-label="Ver perfil de héroe"
          @click="mostrarCentroHeroe = true"
        >
          👤
        </button>

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
          @click="abrirConfirmarReinicio"
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

    <!-- Modal de confirmación de reinicio personalizado -->
    <ModalConfirmacion
      :mostrar="mostrarModalConfirmar"
      titulo="¿Reiniciar partida?"
      mensaje="¿Seguro que deseas reiniciar tu viaje? Perderás todo tu progreso actual de misiones, logros, checkpoints, colección del after e inventario."
      textoConfirmar="Reiniciar Partida"
      textoCancelar="Cancelar"
      @confirmar="confirmarReinicio"
      @cancelar="cerrarConfirmarReinicio"
    />

    <!-- Componente del Centro del Héroe (Modal) -->
    <CentroHeroe
      :mostrar="mostrarCentroHeroe"
      @cerrar="mostrarCentroHeroe = false"
    />
  </header>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, computed } from 'vue'

// --- Componentes hijos ---
import IndicadorEstadistica from '../game/IndicadorEstadistica.vue'
import ModalConfirmacion from '../game/ModalConfirmacion.vue'
import CentroHeroe from '../game/CentroHeroe.vue'

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
  nivelHeroe,
  experienciaHeroe,
  PANTALLAS
} = useEstadoJuego()

// --- Audio ---
const { estaSilenciado, alternarSilencio, reproducirEfecto } = useAudio()

// --- Estado local para modal ---
const mostrarCentroHeroe = ref(false)
const mostrarModalConfirmar = ref(false)

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
  { key: 'responsabilidad', etiqueta: 'Resp.',            valor: estadisticasHeroe.responsabilidad, icono: '🎓', color: 'green'  },
  { key: 'reputacionNocturna', etiqueta: 'Reputación',      valor: estadisticasHeroe.reputacionNocturna, icono: '🤝', color: 'purple' }
])

// --- Emit: notificar reset al padre si es necesario ---
const emit = defineEmits(['reiniciar'])

function abrirConfirmarReinicio() {
  reproducirEfecto('click')
  mostrarModalConfirmar.value = true
}

function cerrarConfirmarReinicio() {
  reproducirEfecto('click')
  mostrarModalConfirmar.value = false
}

function confirmarReinicio() {
  reproducirEfecto('subirNivel')
  reiniciarJuego()
  emit('reiniciar')
  mostrarModalConfirmar.value = false
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

.encabezado-app.header-inicio {
  position: absolute;
  width: 100%;
  background: transparent;
  border-bottom: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  pointer-events: none;
}

.encabezado-app.header-inicio .header-controls {
  pointer-events: auto;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-3);
  min-height: 64px;
}

/* --- Brand (Credencial Heroica) --- */
.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(13, 20, 35, 0.9) 100%);
  border: 1.5px solid rgba(0, 212, 255, 0.4);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.25), inset 0 0 10px rgba(0, 212, 255, 0.1);
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: all 0.3s ease;
  overflow: hidden;
}

.header-brand::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: skewX(-25deg);
  pointer-events: none;
}

.header-brand:hover {
  border-color: #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.45), inset 0 0 12px rgba(0, 212, 255, 0.2);
}

.header-brand:hover::before {
  left: 150%;
  transition: 0.75s ease-in-out;
}

.brand-logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 200, 255, 0.1);
  border: 1.5px solid var(--color-neon-blue);
  border-radius: var(--radius-md);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.35);
}

.brand-glow-bg {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--color-neon-blue), var(--color-neon-purple));
  opacity: 0.3;
  filter: blur(6px);
  z-index: -1;
}

.brand-icon {
  font-size: 1.4rem;
  display: inline-block;
  z-index: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-title {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-weight: 900;
  font-size: 1.1rem;
  background: linear-gradient(90deg, var(--color-neon-blue) 0%, var(--color-neon-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.55));
  letter-spacing: 0.06em;
  line-height: 1.0;
}

.brand-subtitle {
  font-family: var(--font-display);
  font-size: 0.65rem;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: var(--font-semibold);
}

.brand-insignia {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 0.58rem;
  font-weight: 800;
  color: var(--color-neon-purple);
  text-shadow: 0 0 6px var(--color-neon-purple-glow);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 1px;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* --- Stats --- */
.header-stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  justify-content: center;
}

/* --- Controles (Cápsulas Tecnológicas) --- */
.header-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.control-btn {
  background: rgba(10, 15, 30, 0.85);
  border: 1.5px solid rgba(0, 212, 255, 0.4);
  border-radius: 20px; /* Cápsula tecnológica */
  color: var(--color-text-primary);
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.2), inset 0 0 4px rgba(0, 212, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-btn:hover {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.12);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.55), inset 0 0 6px rgba(0, 212, 255, 0.25);
  transform: translateY(-1.5px) scale(1.05);
  filter: brightness(1.2) saturate(1.1);
}

.control-btn.muted {
  opacity: 0.45;
  border-color: rgba(255, 255, 255, 0.2);
}

.control-btn--danger {
  border-color: rgba(255, 70, 70, 0.4);
  box-shadow: 0 0 8px rgba(255, 70, 70, 0.2);
}

.control-btn--danger:hover {
  background: rgba(255, 70, 70, 0.15);
  border-color: #ff4646;
  box-shadow: 0 0 15px rgba(255, 70, 70, 0.55);
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

.indicador-nivel-header {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: var(--radius-full);
  padding: 3px var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-neon-gold);
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.2);
  flex-shrink: 0;
}
.xp-nivel {
  color: var(--color-text-muted);
  font-weight: var(--font-normal);
  font-size: 0.75rem;
  margin-left: 2px;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .header-stats {
    display: none;
  }
  .brand-subtitle,
  .brand-insignia {
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
