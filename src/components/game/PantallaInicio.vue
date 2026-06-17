<template>
  <section class="pantalla-inicio" aria-label="Pantalla de inicio de Ruta Tica">

    <!-- Efectos de fondo premium animados -->
    <div class="grid-overlay" aria-hidden="true"></div>
    <div class="luces-ambiente" aria-hidden="true">
      <div class="luz-ambiente luz-azul"></div>
      <div class="luz-ambiente luz-verde"></div>
      <div class="luz-ambiente luz-purpura"></div>
    </div>

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
      <div class="llamada-accion animate-fade-in delay-500">
        <template v-if="tieneProgresoValido">
          <div class="opciones-inicio-botones">
            <button
              id="btn-continuar-aventura"
              class="btn btn-primary btn-lg btn-continuar-partida-inicio animate-bounce-subtle"
              @click="alContinuarPartidaDirecto"
              aria-label="Continuar aventura guardada"
            >
              📂 Continuar aventura
            </button>
            <button
              id="btn-nueva-aventura"
              class="btn btn-outline btn-lg"
              @click="alConfirmarNuevaPartidaDirecto"
              aria-label="Iniciar nueva aventura"
            >
              ✨ Nueva aventura
            </button>
          </div>
          <p class="sugerencia-cta">Continúa donde lo dejaste o crea una nueva historia</p>
        </template>
        <template v-else>
          <button
            id="btn-iniciar-mision"
            class="btn btn-primary btn-lg animate-bounce-subtle"
            @click="alIniciar"
            aria-label="Iniciar misión y crear tu héroe"
          >
            ⚡ Iniciar misión
          </button>
          <p class="sugerencia-cta">Crea tu identidad de héroe universitario</p>
        </template>
      </div>

      <!-- Nota de responsabilidad -->
      <p class="descargo-responsabilidad animate-fade-in delay-600">
        🌿 Este juego promueve el conocimiento, el equilibrio y la responsabilidad universitaria.
      </p>
    </div>

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
const tieneProgresoValido = ref(false)
const mostrarConfirmarNuevaPartida = ref(false)

// --- Emits: notifica al padre qué acción realizar ---
const emit = defineEmits(['iniciar'])

// --- Ciclo de vida: onMounted ---
onMounted(() => {
  // Iniciar música de menú
  reproducirMusica('menu')

  tieneProgresoValido.value = hayProgresoGuardado()
})

/** Emitir evento de inicio hacia App.vue */
function alIniciar() {
  emit('iniciar')
}

function alContinuarPartidaDirecto() {
  reproducirEfecto('subirNivel')
  cargarProgreso()
}

function alConfirmarNuevaPartidaDirecto() {
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
  tieneProgresoValido.value = false
  emit('iniciar')
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
/* --- Contenedor principal con gradiente neón animado --- */
.pantalla-inicio {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  overflow: hidden;
  background: linear-gradient(135deg, #05040f 0%, #060c20 35%, #120726 70%, #03040a 100%);
  background-size: 400% 400%;
  animation: inicioGradientBG 18s ease infinite;
}

/* Fondo decorativo con ondas de energía futuristas */
.pantalla-inicio::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(0, 200, 255, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(184, 79, 255, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

@keyframes inicioGradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* --- Cyber Grid Overlay --- */
.grid-overlay {
  position: absolute;
  inset: -100px;
  background-image: 
    linear-gradient(rgba(0, 200, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  transform: perspective(500px) rotateX(20deg);
  pointer-events: none;
  z-index: 0;
  opacity: 0.8;
  animation: grid-scroll 25s linear infinite;
  will-change: transform;
}

@keyframes grid-scroll {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 500px;
  }
}

/* --- Luces Ambientales (Auroras/Nebulosas) --- */
.luces-ambiente {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  filter: blur(140px);
  opacity: 0.65;
}

.luz-ambiente {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  will-change: transform;
}

.luz-azul {
  top: 10%;
  left: 15%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(0, 200, 255, 0.25) 0%, transparent 80%);
  animation: float-luz-1 20s ease-in-out infinite alternate;
}

.luz-verde {
  bottom: 10%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.18) 0%, transparent 80%);
  animation: float-luz-2 24s ease-in-out infinite alternate;
}

.luz-purpura {
  top: 40%;
  left: 50%;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(184, 79, 255, 0.2) 0%, transparent 80%);
  animation: float-luz-3 22s ease-in-out infinite alternate;
}

@keyframes float-luz-1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(80px, 50px, 0) scale(1.15); }
  100% { transform: translate3d(-40px, 90px, 0) scale(0.9); }
}

@keyframes float-luz-2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-90px, -60px, 0) scale(0.85); }
  100% { transform: translate3d(50px, 40px, 0) scale(1.1); }
}

@keyframes float-luz-3 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(60px, -80px, 0) scale(1.1); }
  100% { transform: translate3d(-70px, 50px, 0) scale(0.85); }
}

/* --- Partículas flotantes de energía --- */
.particulas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particula {
  position: absolute;
  border-radius: 50%;
  background: var(--color-neon-green);
  box-shadow: 0 0 8px var(--color-neon-green-glow);
  animation: particle-float linear infinite;
  will-change: transform, opacity;
}

.particula:nth-child(odd) {
  background: var(--color-neon-blue);
  box-shadow: 0 0 8px var(--color-neon-blue-glow);
}

.particula:nth-child(3n) {
  background: var(--color-neon-purple);
  box-shadow: 0 0 8px var(--color-neon-purple-glow);
}

@keyframes particle-float {
  0% {
    transform: translateY(120vh) translateX(0) scale(0.6);
    opacity: 0;
  }
  15% {
    opacity: 0.7;
  }
  85% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-20vh) translateX(40px) scale(1.1);
    opacity: 0;
  }
}

/* --- Contenido --- */
.contenido-inicio {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  max-width: 700px;
  width: 100%;
  text-align: center;
}

/* --- Emblema del héroe con Zoom y Glow Progresivo --- */
.emblema-heroe {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
  animation: introLogoZoom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.anillo-emblema {
  position: absolute;
  border-radius: 50%;
  border: 2.5px solid transparent;
  animation: spin-slow linear infinite;
}

.anillo-emblema--exterior {
  inset: 0;
  border-color: var(--color-neon-green);
  box-shadow: 0 0 20px var(--color-neon-green-glow),
              inset 0 0 12px var(--color-neon-green-glow);
  animation-duration: 9s;
}

.anillo-emblema--interior {
  inset: 15px;
  border-color: var(--color-neon-blue);
  box-shadow: 0 0 12px var(--color-neon-blue-glow);
  animation-duration: 6s;
  animation-direction: reverse;
}

.icono-emblema {
  font-size: 3.2rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

@keyframes introLogoZoom {
  0% {
    transform: scale(0.5);
    opacity: 0;
    filter: brightness(2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1);
  }
}

/* --- Header --- */
.encabezado-inicio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.lema-inicio {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin: 0;
  font-weight: var(--font-bold);
  text-shadow: 0 0 8px var(--color-neon-blue-glow);
}

.titulo-inicio {
  font-family: var(--font-display);
  margin: 0;
  line-height: 1.1;
  animation: introTitleGlow 1.8s ease-out forwards;
}

.titulo-ruta {
  font-size: clamp(2.8rem, 8vw, 4.8rem);
  font-weight: var(--font-extrabold);
  background: linear-gradient(135deg, #00ff88, #00c8ff, #b84fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
}

.titulo-heroe {
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  color: var(--color-text-secondary);
  font-weight: var(--font-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.divisor-titulo {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-neon-green), var(--color-neon-blue), transparent);
  border-radius: var(--radius-full);
  box-shadow: 0 0 12px var(--color-neon-green-glow);
  margin-top: var(--space-2);
}

@keyframes introTitleGlow {
  0% {
    filter: drop-shadow(0 0 0px transparent);
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.25));
  }
}

/* --- Descripción --- */
.descripcion-inicio {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 580px;
}

.descripcion-principal {
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  line-height: 1.65;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.descripcion-mision {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  background: rgba(13, 20, 41, 0.6);
  border: 1px solid rgba(0, 200, 255, 0.18);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin: 0;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 0 15px rgba(0, 200, 255, 0.05);
}

/* --- Stats decorativas --- */
.estadisticas-inicio {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  background: rgba(15, 10, 30, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
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
  text-shadow: 0 0 12px var(--color-neon-green-glow);
  line-height: 1;
}

.etiqueta-estadistica {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.divisor-estadistica {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
}

/* --- CTA con Pulso Neón --- */
.llamada-accion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.llamada-accion .btn-primary {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, var(--color-neon-green) 0%, #009955 100%);
  border: 1px solid rgba(0, 255, 136, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.25);
  animation: pulseNeonCTA 2s infinite ease-in-out;
}

.llamada-accion .btn-primary:hover {
  background: linear-gradient(135deg, #00ffaa 0%, #00b362 100%);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
  transform: scale(1.05) translateY(-2px);
}

@keyframes pulseNeonCTA {
  0% {
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.25);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.55), 0 0 10px rgba(0, 200, 255, 0.3);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.25);
  }
}

.sugerencia-cta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

/* --- Disclaimer --- */
.descargo-responsabilidad {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  max-width: 480px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
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
  background: rgba(4, 5, 12, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  animation: pulse-neon-purple 2.5s infinite;
}

@keyframes pulse-neon-purple {
  0% { filter: drop-shadow(0 0 4px rgba(184, 79, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(184, 79, 255, 0.8)); }
  100% { filter: drop-shadow(0 0 4px rgba(184, 79, 255, 0.3)); }
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

.opciones-inicio-botones {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--space-4);
  width: 100%;
}

.opciones-inicio-botones .btn {
  min-width: 200px;
}

.btn-continuar-partida-inicio {
  background: linear-gradient(135deg, var(--color-neon-blue) 0%, #005a9c 100%);
  border-color: rgba(0, 200, 255, 0.4);
  animation: pulseNeonCTA 2s infinite ease-in-out;
}

.btn-continuar-partida-inicio:hover {
  background: linear-gradient(135deg, #33ccff 0%, #0088cc 100%);
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.5);
  transform: scale(1.05) translateY(-2px);
}

@media (max-width: 640px) {
  .opciones-inicio-botones {
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }
}
</style>
