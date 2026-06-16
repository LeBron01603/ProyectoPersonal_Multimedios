<template>
  <!-- PantallaInicio: pantalla inicial del juego -->
  <!-- Ciclo de vida: onMounted para iniciar la animación de entrada y música de menú -->
  <section class="pantalla-inicio" aria-label="Pantalla de inicio de Ruta Tica">

    <!-- Partículas de fondo decorativas -->
    <div class="particulas" aria-hidden="true">
      <span v-for="n in 20" :key="n" class="particula" :style="estiloParticula(n)"></span>
    </div>

    <!-- Contenido principal -->
    <div class="contenido-inicio animate-fade-in">

      <!-- Emblema del héroe -->
      <div class="emblema-heroe animate-float" aria-hidden="true">
        <div class="anillo-emblema anillo-emblema--exterior"></div>
        <div class="anillo-emblema anillo-emblema--interior"></div>
        <span class="icono-emblema">🦸</span>
      </div>

      <!-- Título del juego -->
      <header class="encabezado-inicio">
        <p class="lema-inicio animate-slide-left delay-100">🇨🇷 Juego Educativo Universitario</p>
        <h1 class="titulo-inicio animate-slide-right delay-200">
          <span class="titulo-ruta">Ruta Tica</span>
          <br />
          <span class="titulo-heroe">El Héroe del After</span>
        </h1>
        <div class="divisor-titulo" aria-hidden="true"></div>
      </header>

      <!-- Descripción del concepto -->
      <div class="descripcion-inicio animate-fade-in delay-300">
        <p class="descripcion-principal">
          De día estudias, entrenas y cumples tus responsabilidades universitarias.
          De noche, tu identidad secreta despierta para recorrer las 7 provincias de Costa Rica.
        </p>
        <p class="descripcion-mision">
          🗺️ Responde preguntas sobre turismo, cultura, historia y geografía.<br />
          ⚡ Defiende el equilibrio entre diversión, conocimiento y responsabilidad.
        </p>
      </div>

      <!-- Estadísticas del juego (decorativas) -->
      <div class="estadisticas-inicio animate-fade-in delay-400" aria-hidden="true">
        <div class="estadistica-inicio">
          <span class="numero-estadistica">7</span>
          <span class="etiqueta-estadistica">Provincias</span>
        </div>
        <div class="divisor-estadistica"></div>
        <div class="estadistica-inicio">
          <span class="numero-estadistica">4</span>
          <span class="etiqueta-estadistica">Atributos</span>
        </div>
        <div class="divisor-estadistica"></div>
        <div class="estadistica-inicio">
          <span class="numero-estadistica">∞</span>
          <span class="etiqueta-estadistica">Aventuras</span>
        </div>
      </div>

      <!-- Botón principal de acción -->
      <!-- emit: notifica al padre que debe cambiar de pantalla -->
      <div class="llamada-accion animate-fade-in delay-500">
        <button
          id="btn-iniciar-mision"
          class="btn btn-primary btn-lg animate-bounce-subtle"
          @click="alIniciar"
          aria-label="Iniciar misión y crear tu héroe"
        >
          ⚡ Iniciar misión
        </button>
        <p class="sugerencia-cta">Crea tu identidad de héroe universitario</p>
      </div>

      <!-- Nota de responsabilidad -->
      <p class="descargo-responsabilidad animate-fade-in delay-600">
        🌿 Este juego promueve el conocimiento, el equilibrio y la responsabilidad universitaria.
      </p>
    </div>

    <!-- Dialogo: Partida encontrada -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="mostrarPartidaEncontrada" class="modal-overlay" role="dialog" aria-modal="true">
          <div class="modal-wrapper">
            <div class="modal-card animate-fade-in-scale">
              <div class="modal-icon">💾</div>
              <div class="modal-header">
                <h3 class="modal-title">Partida Guardada Encontrada</h3>
              </div>
              <div class="modal-body">
                <p class="modal-message">
                  Hemos detectado una partida guardada anterior para el héroe:
                  <br /><strong class="texto-heroe-guardado">{{ nombreHeroeGuardado }}</strong>.
                  <br /><br />
                  ¿Deseas continuar tu patrullaje o empezar de nuevo desde cero?
                </p>
              </div>
              <div class="modal-actions-column">
                <button
                  type="button"
                  class="btn btn-hero btn-lg btn-block btn-continuar-partida"
                  @click="alContinuarPartida"
                >
                  📂 Continuar partida
                </button>
                <button
                  type="button"
                  class="btn btn-outline btn-block"
                  @click="alConfirmarNuevaPartida"
                >
                  ✨ Nueva partida
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal Confirmación para Nueva Partida -->
    <ModalConfirmacion
      :mostrar="mostrarConfirmarNuevaPartida"
      titulo="¿Iniciar nueva partida?"
      mensaje="¿Seguro que deseas iniciar una nueva partida? Esto eliminará de forma irreversible tu progreso anterior."
      textoConfirmar="Empezar de nuevo"
      textoCancelar="Cancelar"
      @confirmar="comenzarNuevaPartida"
      @cancelar="cerrarConfirmarNuevaPartida"
    />
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, onMounted } from 'vue'

// --- Componentes hijos ---
import ModalConfirmacion from './ModalConfirmacion.vue'

// --- Composables ---
import { useAudio } from '../../composables/useAudio.js'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'

// --- Audio ---
const { reproducirMusica, reproducirEfecto } = useAudio()

// --- Estado global ---
const { hayProgresoGuardado, cargarProgreso, borrarProgreso } = useEstadoJuego()

// --- Estado local ---
const mostrarPartidaEncontrada = ref(false)
const mostrarConfirmarNuevaPartida = ref(false)
const nombreHeroeGuardado = ref('')

// --- Emits: notifica al padre qué acción realizar ---
const emit = defineEmits(['iniciar'])

// --- Ciclo de vida: onMounted ---
onMounted(() => {
  // Iniciar música de menú
  reproducirMusica('menu')

  if (hayProgresoGuardado()) {
    try {
      const raw = localStorage.getItem('rutaTicaHeroeAfterProgreso')
      if (raw) {
        const parsed = JSON.parse(raw)
        nombreHeroeGuardado.value = parsed.identidadHeroe?.nombre || 'Héroe del After'
        mostrarPartidaEncontrada.value = true
      }
    } catch (e) {
      console.error('Error al detectar save en PantallaInicio:', e)
    }
  }
})

/** Emitir evento de inicio hacia App.vue */
function alIniciar() {
  emit('iniciar')
}

function alContinuarPartida() {
  reproducirEfecto('subirNivel')
  cargarProgreso()
  mostrarPartidaEncontrada.value = false
}

function alConfirmarNuevaPartida() {
  reproducirEfecto('click')
  mostrarConfirmarNuevaPartida.value = true
}

function cerrarConfirmarNuevaPartida() {
  reproducirEfecto('click')
  mostrarConfirmarNuevaPartida.value = false
}

function comenzarNuevaPartida() {
  reproducirEfecto('subirNivel')
  borrarProgreso()
  mostrarConfirmarNuevaPartida.value = false
  mostrarPartidaEncontrada.value = false
}

/**
 * Genera estilos aleatorios para cada partícula decorativa.
 * @param {number} n - Índice de la partícula (1-20)
 */
function estiloParticula(n) {
  const x = (n * 37 + 15) % 100
  const y = (n * 53 + 10) % 100
  const size = ((n * 7) % 3) + 2
  const delay = (n * 0.3) % 3
  const duration = 4 + (n % 4)
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.3 + (n % 4) * 0.1
  }
}
</script>

<style scoped>
/* --- Contenedor principal --- */
.pantalla-inicio {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  overflow: hidden;
}

/* --- Partículas flotantes --- */
.particulas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particula {
  position: absolute;
  border-radius: 50%;
  background: var(--color-neon-green);
  box-shadow: 0 0 6px var(--color-neon-green-glow);
  animation: particle-drift linear infinite;
}

.particula:nth-child(odd) {
  background: var(--color-neon-blue);
  box-shadow: 0 0 6px var(--color-neon-blue-glow);
}

.particula:nth-child(3n) {
  background: var(--color-neon-purple);
  box-shadow: 0 0 6px var(--color-neon-purple-glow);
}

/* --- Contenido --- */
.contenido-inicio {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  max-width: 700px;
  width: 100%;
  text-align: center;
}

/* --- Emblema del héroe --- */
.emblema-heroe {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anillo-emblema {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spin-slow linear infinite;
}

.anillo-emblema--exterior {
  inset: 0;
  border-color: var(--color-neon-green);
  box-shadow: 0 0 15px var(--color-neon-green-glow),
              inset 0 0 15px var(--color-neon-green-glow);
  animation-duration: 8s;
}

.anillo-emblema--interior {
  inset: 12px;
  border-color: var(--color-neon-blue);
  box-shadow: 0 0 10px var(--color-neon-blue-glow);
  animation-duration: 5s;
  animation-direction: reverse;
}

.icono-emblema {
  font-size: 2.8rem;
  position: relative;
  z-index: 1;
}

/* --- Header --- */
.encabezado-inicio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.lema-inicio {
  font-size: var(--text-sm);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0;
  font-weight: var(--font-semibold);
}

.titulo-inicio {
  font-family: var(--font-display);
  margin: 0;
  line-height: 1.1;
}

.titulo-ruta {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: var(--font-extrabold);
  background: var(--gradient-text-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  animation: glow-text 3s ease-in-out infinite;
  color: var(--color-neon-green);
}

.titulo-heroe {
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: var(--color-text-secondary);
  font-weight: var(--font-semibold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.divisor-titulo {
  width: 80px;
  height: 2px;
  background: var(--gradient-btn);
  border-radius: var(--radius-full);
  box-shadow: 0 0 10px var(--color-neon-green-glow);
}

/* --- Descripción --- */
.descripcion-inicio {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 560px;
}

.descripcion-principal {
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

.descripcion-mision {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  background: rgba(0,200,255,0.06);
  border: 1px solid rgba(0,200,255,0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin: 0;
}

/* --- Stats decorativas --- */
.estadisticas-inicio {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-8);
  backdrop-filter: blur(8px);
}

.estadistica-inicio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.numero-estadistica {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--color-neon-green);
  text-shadow: 0 0 10px var(--color-neon-green-glow);
  line-height: 1;
}

.etiqueta-estadistica {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.divisor-estadistica {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* --- CTA --- */
.llamada-accion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.sugerencia-cta {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* --- Disclaimer --- */
.descargo-responsabilidad {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  max-width: 480px;
  line-height: 1.5;
  margin: 0;
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .estadisticas-inicio {
    gap: var(--space-4);
    padding: var(--space-3) var(--space-5);
  }
  .numero-estadistica {
    font-size: var(--text-2xl);
  }
  .emblema-heroe {
    width: 90px;
    height: 90px;
  }
  .icono-emblema {
    font-size: 2.5rem;
  }
  .contenido-inicio {
    gap: var(--space-6);
  }
}

/* --- Estilos Modal de Partida Encontrada --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(5, 8, 20, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-card {
  width: 100%;
  max-width: 440px;
  background: var(--gradient-card);
  border: 1px solid rgba(184, 79, 255, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 25px rgba(184, 79, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.modal-icon {
  font-size: 2.8rem;
  animation: pulse-neon 2.5s infinite;
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-purple);
  text-shadow: 0 0 10px var(--color-neon-purple-glow);
  margin: 0;
}

.modal-message {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.texto-heroe-guardado {
  color: var(--color-neon-blue);
  text-shadow: 0 0 5px var(--color-neon-blue-glow);
}

.modal-actions-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-2);
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.btn-continuar-partida {
  background: linear-gradient(135deg, var(--color-neon-blue), #005a9c);
  border-color: rgba(0, 200, 255, 0.4);
}

.btn-continuar-partida:hover {
  background: linear-gradient(135deg, #33ccff, #0088cc);
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.4);
}
</style>
