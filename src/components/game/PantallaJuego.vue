<template>
  <!-- PantallaJuego: pantalla de juego activo (preguntas de la misión) -->
  <!-- FASE ACTUAL: placeholder estructural. La lógica de preguntas se implementa en fases posteriores. -->
  <section class="pantalla-juego" aria-label="Pantalla de juego activo">
    <div class="contenedor-juego animate-fade-in-scale">

      <!-- Header de la misión -->
      <header class="encabezado-juego">
        <div class="insignia-mision">
          <span class="emoji-provincia-mision" aria-hidden="true">
            {{ provinciaActiva?.emoji }}
          </span>
          <div>
            <p class="etiqueta-mision">Misión activa</p>
            <h2 class="nombre-mision">{{ provinciaActiva?.tituloMision }}</h2>
          </div>
        </div>

        <!-- Indicador de progreso de preguntas -->
        <div class="progreso-preguntas">
          <span class="p-actual">{{ preguntaActual + 1 }}</span>
          <span class="p-separador">/</span>
          <span class="p-total">{{ totalPreguntas }}</span>
        </div>
      </header>

      <!-- Barra de progreso de preguntas -->
      <div class="barra-progreso-juego" aria-hidden="true">
        <div
          class="relleno-progreso-juego"
          :style="{ width: porcentajeProgresoPregunta + '%' }"
        ></div>
      </div>

      <!-- Área de pregunta -->
      <div class="area-pregunta">
        <div class="tarjeta-pregunta card animate-fade-in">
          <p class="categoria-pregunta" v-if="provinciaActiva">
            📂 {{ provinciaActiva?.region }}
          </p>
          <h3 class="texto-pregunta">
            <!-- Placeholder: la pregunta se cargará desde misiones.json en fase 2 -->
            🚧 Las preguntas educativas se implementarán en la siguiente fase del proyecto.
          </h3>
          <p class="sugerencia-pregunta">
            Por ahora puedes explorar la estructura de la pantalla de juego.
          </p>
        </div>

        <!-- Opciones de respuesta (placeholder) -->
        <div class="cuadricula-opciones">
          <button
            v-for="(opcion, idx) in opcionesSimuladas"
            :key="idx"
            class="boton-opcion"
            :class="{
              'opcion-correcta':   respuestaSeleccionada === idx && idx === 0,
              'opcion-incorrecta': respuestaSeleccionada === idx && idx !== 0,
              'opcion-revelada':   respuestaSeleccionada !== null && idx === 0
            }"
            :disabled="respuestaSeleccionada !== null"
            @click="seleccionarRespuesta(idx)"
            :aria-label="`Opción ${idx + 1}: ${opcion}`"
          >
            <span class="letra-opcion">{{ letrasOpciones[idx] }}</span>
            <span class="texto-opcion">{{ opcion }}</span>
          </button>
        </div>
      </div>

      <!-- Panel de resultado de respuesta -->
      <transition name="fade">
        <div v-if="respuestaSeleccionada !== null" class="retroalimentacion-respuesta" :class="esCorrecta ? 'retroalimentacion-correcta' : 'retroalimentacion-incorrecta'">
          <span class="icono-retroalimentacion">{{ esCorrecta ? '✅' : '❌' }}</span>
          <p class="texto-retroalimentacion">
            {{ esCorrecta ? '¡Correcto! Gran conocimiento tico.' : 'Casi. La respuesta correcta era la A.' }}
          </p>
        </div>
      </transition>

      <!-- Controles de juego -->
      <div class="controles-juego">
        <button class="btn btn-outline" @click="alSalir">
          ← Volver al mapa
        </button>
        <button
          v-if="respuestaSeleccionada !== null"
          class="btn btn-primary"
          @click="alSiguientePregunta"
        >
          {{ preguntaActual + 1 >= totalPreguntas ? '🏆 Ver resultados' : '→ Siguiente pregunta' }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, computed } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits ---
const emit = defineEmits(['salir', 'completar'])

// --- Estado del juego ---
const { provinciaActiva, completarMision, navegarA, PANTALLAS } = useEstadoJuego()

// --- Audio ---
const { reproducirEfecto } = useAudio()

// --- Estado local de la pantalla de juego ---
const preguntaActual       = ref(0)
const totalPreguntas       = ref(3)
const respuestaSeleccionada = ref(null)
const puntaje              = ref(0)

// --- Letras de opciones ---
const letrasOpciones = ['A', 'B', 'C', 'D']

// --- Opciones de placeholder (fase 1) ---
const opcionesSimuladas = [
  'Esta será la respuesta correcta',
  'Esta será la opción B',
  'Esta será la opción C',
  'Esta será la opción D'
]

// --- Computed: porcentaje de progreso de preguntas ---
const porcentajeProgresoPregunta = computed(() =>
  ((preguntaActual.value) / totalPreguntas.value) * 100
)

// --- Computed: si la respuesta seleccionada es correcta (simulado: siempre A = índice 0) ---
const esCorrecta = computed(() => respuestaSeleccionada.value === 0)

// --- Seleccionar una respuesta ---
function seleccionarRespuesta(idx) {
  if (respuestaSeleccionada.value !== null) return
  respuestaSeleccionada.value = idx
  reproducirEfecto(idx === 0 ? 'correcto' : 'incorrecto')
  if (idx === 0) puntaje.value += 33
}

// --- Siguiente pregunta o finalizar misión ---
function alSiguientePregunta() {
  if (preguntaActual.value + 1 >= totalPreguntas.value) {
    // Finalizar misión
    completarMision(provinciaActiva.value?.id, puntaje.value)
    emit('completar', { idProvincia: provinciaActiva.value?.id, puntaje: puntaje.value })
  } else {
    preguntaActual.value++
    respuestaSeleccionada.value = null
  }
}

// --- Salir al mapa ---
function alSalir() {
  navegarA(PANTALLAS.MAPA)
  emit('salir')
}
</script>

<style scoped>
.pantalla-juego {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.contenedor-juego {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* --- Header --- */
.encabezado-juego {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.insignia-mision {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.emoji-provincia-mision {
  font-size: 2.5rem;
}

.etiqueta-mision {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.nombre-mision {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-neon-green);
  margin: 0;
}

.progreso-preguntas {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.p-actual { color: var(--color-neon-green); }
.p-separador, .p-total { color: var(--color-text-muted); font-size: var(--text-lg); }

/* --- Barra de progreso --- */
.barra-progreso-juego {
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.relleno-progreso-juego {
  height: 100%;
  background: var(--gradient-btn);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

/* --- Área de pregunta --- */
.area-pregunta {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.categoria-pregunta {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-2);
}

.texto-pregunta {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  line-height: 1.4;
  margin: 0 0 var(--space-2);
}

.sugerencia-pregunta {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
  font-style: italic;
}

/* --- Opciones --- */
.cuadricula-opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.boton-opcion {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(255,255,255,0.04);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
}

.boton-opcion:not(:disabled):hover {
  border-color: var(--color-neon-blue);
  background: rgba(0,200,255,0.08);
  transform: translateX(3px);
}

.boton-opcion:disabled { cursor: default; }

.letra-opcion {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  font-size: var(--text-base);
  min-width: 20px;
}

.opcion-correcta {
  border-color: var(--color-neon-green) !important;
  background: rgba(0,255,136,0.12) !important;
}

.opcion-incorrecta {
  border-color: #ff4646 !important;
  background: rgba(255,70,70,0.10) !important;
}

.opcion-revelada {
  border-color: var(--color-neon-green) !important;
  background: rgba(0,255,136,0.08) !important;
}

/* --- Feedback --- */
.retroalimentacion-respuesta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid;
}

.retroalimentacion-correcta {
  background: rgba(0,255,136,0.10);
  border-color: var(--color-neon-green);
}

.retroalimentacion-incorrecta {
  background: rgba(255,70,70,0.10);
  border-color: #ff4646;
}

.icono-retroalimentacion { font-size: 1.4rem; }

.texto-retroalimentacion {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* --- Controles --- */
.controles-juego {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

/* --- Transición --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* --- Responsive --- */
@media (max-width: 640px) {
  .cuadricula-opciones {
    grid-template-columns: 1fr;
  }
  .controles-juego {
    flex-direction: column-reverse;
  }
  .controles-juego .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
