<template>
  <!-- PantallaResultado: pantalla de resultados al finalizar una misión -->
  <section class="pantalla-resultado" aria-label="Pantalla de resultados">
    <div class="contenedor-resultado animate-fade-in-scale">

      <!-- Ícono de resultado -->
      <div class="emblema-resultado animate-float" aria-hidden="true">
        <span class="emoji-resultado">{{ emojiResultado }}</span>
        <div class="anillo-resultado"></div>
      </div>

      <!-- Título de resultado -->
      <header class="encabezado-resultado">
        <p class="etiqueta-mision-resultado">{{ provinciaActiva?.nombre }} — Misión completada</p>
        <h2 class="titulo-resultado" :class="claseTituloResultado">{{ tituloResultado }}</h2>
        <p class="subtitulo-resultado">{{ subtituloResultado }}</p>
      </header>

      <!-- Estadísticas ganadas -->
      <div class="estadisticas-resultado animate-fade-in delay-200">
        <h3 class="titulo-cambio-estadisticas">Cambios en tus atributos:</h3>
        <div class="cuadricula-estadisticas">
          <div
            v-for="stat in cambiosEstadisticas"
            :key="stat.key"
            class="cambio-estadistica"
            :class="stat.delta > 0 ? 'cambio-estadistica--sube' : 'cambio-estadistica--baja'"
          >
            <span class="icono-cambio-estadistica">{{ stat.icon }}</span>
            <span class="nombre-cambio-estadistica">{{ stat.etiqueta }}</span>
            <span class="delta-cambio-estadistica">
              {{ stat.delta > 0 ? '+' : '' }}{{ stat.delta }}
            </span>
          </div>
        </div>
      </div>

      <!-- Mensaje motivacional -->
      <blockquote class="cita-resultado animate-fade-in delay-300">
        <p>{{ fraseMotivacional }}</p>
        <footer>— El héroe universitario tico 🇨🇷</footer>
      </blockquote>

      <!-- Botones de acción -->
      <div class="acciones-resultado animate-fade-in delay-400">
        <button class="btn btn-outline" @click="alVolverAlMapa">
          🗺️ Volver al mapa
        </button>
        <button class="btn btn-hero btn-lg" @click="alContinuar">
          ⚡ Siguiente provincia
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { computed } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits ---
const emit = defineEmits(['volver-al-mapa', 'continuar'])

// --- Estado del juego ---
const { provinciaActiva, navegarA, PANTALLAS } = useEstadoJuego()

// --- Audio ---
const { reproducirMusica } = useAudio()

// --- Computed: emoji y título según puntaje simulado ---
const puntajeSimulado = computed(() => 75)

const emojiResultado = computed(() => {
  if (puntajeSimulado.value >= 80) return '🏆'
  if (puntajeSimulado.value >= 50) return '⭐'
  return '💪'
})

const tituloResultado = computed(() => {
  if (puntajeSimulado.value >= 80) return '¡Misión completada con honor!'
  if (puntajeSimulado.value >= 50) return '¡Bien hecho, héroe!'
  return 'Sigue entrenando, héroe'
})

const claseTituloResultado = computed(() => {
  if (puntajeSimulado.value >= 80) return 'texto-neon'
  if (puntajeSimulado.value >= 50) return 'texto-neon-blue'
  return 'texto-neon-purple'
})

const subtituloResultado = computed(() =>
  `Provincia ${provinciaActiva.value?.nombre || ''} protegida. Tu conocimiento creció.`
)

// --- Cambios en estadísticas (simulados para fase 1) ---
const cambiosEstadisticas = computed(() => [
  { key: 'conocimiento',    etiqueta: 'Conocimiento',    icon: '📚', delta: +10 },
  { key: 'diversion',       etiqueta: 'Diversión',       icon: '🎉', delta: +8  },
  { key: 'responsabilidad', etiqueta: 'Responsabilidad', icon: '🎓', delta: +5  },
  { key: 'energia',         etiqueta: 'Energía',         icon: '⚡', delta: -10 }
])

// --- Frases motivacionales ---
const frases = [
  'El conocimiento es el verdadero superpoder universitario.',
  'Explorar Costa Rica es explorar quién eres.',
  'La diversión y la responsabilidad no son opuestos, son aliados.',
  'Cada provincia tiene una lección para el héroe que sabe escuchar.',
  'De día estudias, de noche salvas. Eso te hace único.'
]

const fraseMotivacional = computed(() =>
  frases[Math.floor(Math.random() * frases.length)]
)

// --- Navegación ---
function alVolverAlMapa() {
  navegarA(PANTALLAS.MAPA)
  emit('volver-al-mapa')
}

function alContinuar() {
  navegarA(PANTALLAS.MAPA)
  emit('continuar')
}
</script>

<style scoped>
.pantalla-resultado {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.contenedor-resultado {
  width: 100%;
  max-width: 600px;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-green);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  text-align: center;
}

/* --- Emblema --- */
.emblema-resultado {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-resultado { font-size: 3.5rem; position: relative; z-index: 1; }

.anillo-resultado {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--color-neon-green);
  box-shadow: 0 0 20px var(--color-neon-green-glow),
              inset 0 0 20px var(--color-neon-green-glow);
  animation: pulse-neon 2s ease-in-out infinite;
}

/* --- Header --- */
.etiqueta-mision-resultado {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-2);
}

.titulo-resultado {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-2);
}

.subtitulo-resultado {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0;
}

/* --- Stats --- */
.estadisticas-resultado {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.titulo-cambio-estadisticas {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-4);
  text-align: center;
}

.cuadricula-estadisticas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.cambio-estadistica {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.cambio-estadistica--sube {
  background: rgba(0,255,136,0.08);
  border: 1px solid rgba(0,255,136,0.2);
}

.cambio-estadistica--baja {
  background: rgba(255,70,70,0.08);
  border: 1px solid rgba(255,70,70,0.2);
}

.icono-cambio-estadistica { font-size: 1rem; }
.nombre-cambio-estadistica { flex: 1; color: var(--color-text-secondary); }

.delta-cambio-estadistica {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
}

.cambio-estadistica--sube .delta-cambio-estadistica { color: var(--color-neon-green); }
.cambio-estadistica--baja .delta-cambio-estadistica { color: #ff6b6b; }

/* --- Quote --- */
.cita-resultado {
  border-left: 3px solid var(--color-neon-blue);
  padding-left: var(--space-4);
  text-align: left;
  width: 100%;
}

.cita-resultado p {
  font-style: italic;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
  font-size: var(--text-base);
}

.cita-resultado footer {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-align: right;
}

/* --- Acciones --- */
.acciones-resultado {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

/* --- Responsive --- */
@media (max-width: 480px) {
  .contenedor-resultado {
    padding: var(--space-6) var(--space-4);
  }
  .cuadricula-estadisticas {
    grid-template-columns: 1fr;
  }
  .acciones-resultado {
    flex-direction: column;
    .btn { width: 100%; }
  }
}
</style>
