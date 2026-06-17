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
import { ref, onMounted, watch } from 'vue'

// --- Componentes hijos ---
import ModalConfirmacion from './ModalConfirmacion.vue'

// --- Composables ---
import { useAudio } from '../../composables/useAudio.js'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'

// --- Audio ---
const { reproducirMusica, reproducirEfecto } = useAudio()

// --- Estado global ---
const { hayProgresoGuardado, cargarProgreso, borrarProgreso, pantallaActual, PANTALLAS } = useEstadoJuego()

// --- Estado local ---
const tieneProgresoValido = ref(false)
const mostrarConfirmarNuevaPartida = ref(false)

// --- Emits: notifica al padre qué acción realizar ---
const emit = defineEmits(['iniciar'])

// --- Watcher para actualizar el estado al volver a Inicio ---
watch(pantallaActual, (nuevaPantalla) => {
  if (nuevaPantalla === PANTALLAS.INICIO) {
    tieneProgresoValido.value = hayProgresoGuardado()
  }
})

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
  background: radial-gradient(circle at center, #060a17 0%, #010205 100%);
}

/* Fondo decorativo con ondas de energía futuristas */
.pantalla-inicio::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(0, 200, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(184, 79, 255, 0.06) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* --- Cyber Grid Overlay --- */
.grid-overlay {
  position: absolute;
  inset: -100px;
  background-image: 
    linear-gradient(rgba(0, 200, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.03) 1px, transparent 1px);
  background-size: 55px 55px;
  background-position: center center;
  transform: perspective(500px) rotateX(25deg);
  pointer-events: none;
  z-index: 0;
  opacity: 0.85;
  animation: grid-scroll 20s linear infinite;
  will-change: transform;
}

@keyframes grid-scroll {
  from { background-position: 0 0; }
  to { background-position: 0 550px; }
}

/* --- Luces Ambientales (Auroras/Nebulosas) --- */
.luces-ambiente {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  filter: blur(120px);
  opacity: 0.8;
}

.luz-ambiente {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  will-change: transform;
}

.luz-azul {
  top: 5%;
  left: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 200, 255, 0.3) 0%, transparent 80%);
  animation: float-luz-1 22s ease-in-out infinite alternate;
}

.luz-verde {
  bottom: 5%;
  right: 5%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.22) 0%, transparent 80%);
  animation: float-luz-2 26s ease-in-out infinite alternate;
}

.luz-purpura {
  top: 35%;
  left: 45%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(184, 79, 255, 0.25) 0%, transparent 80%);
  animation: float-luz-3 24s ease-in-out infinite alternate;
}

@keyframes float-luz-1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(60px, 40px, 0) scale(1.1); }
  100% { transform: translate3d(-30px, 70px, 0) scale(0.95); }
}

@keyframes float-luz-2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-70px, -50px, 0) scale(0.9); }
  100% { transform: translate3d(40px, 30px, 0) scale(1.05); }
}

@keyframes float-luz-3 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(40px, -60px, 0) scale(1.05); }
  100% { transform: translate3d(-50px, 40px, 0) scale(0.9); }
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
  15% { opacity: 0.6; }
  85% { opacity: 0.6; }
  100% {
    transform: translateY(-20vh) translateX(30px) scale(1.1);
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
  gap: var(--space-8);
  width: 100%;
  max-width: 650px;
  text-align: center;
}

/* GRID LAYOUT EN ESCRITORIO */
@media (min-width: 850px) {
  .contenido-inicio {
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    grid-template-rows: auto auto auto auto;
    text-align: left;
    max-width: 1120px;
    gap: var(--space-6) var(--space-12);
    align-items: center;
  }
  
  .encabezado-inicio {
    grid-column: 1;
    grid-row: 1;
    align-items: flex-start !important;
    text-align: left !important;
  }
  
  .divisor-titulo {
    margin-left: 0 !important;
  }
  
  .descripcion-inicio {
    grid-column: 1;
    grid-row: 2;
    text-align: left;
  }
  
  .llamada-accion {
    grid-column: 1;
    grid-row: 3;
    align-items: flex-start !important;
  }
  
  .descargo-responsabilidad {
    grid-column: 1;
    grid-row: 4;
    text-align: left;
  }
  
  .emblema-heroe {
    grid-column: 2;
    grid-row: 1 / span 2;
    margin: 0 auto !important;
    transform: scale(1.2) !important;
  }
  
  .estadisticas-inicio {
    grid-column: 2;
    grid-row: 3 / span 2;
    margin: var(--space-4) auto 0 !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 290px !important;
    gap: var(--space-4) !important;
    padding: var(--space-6) var(--space-8) !important;
  }
  
  .divisor-estadistica {
    width: 100% !important;
    height: 1px !important;
  }
}

/* --- Emblema del héroe con Zoom y Glow Progresivo --- */
.emblema-heroe {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
  animation: introLogoZoom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.emblema-heroe::before {
  content: '';
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184, 79, 255, 0.18) 0%, rgba(0, 200, 255, 0.08) 45%, transparent 75%);
  filter: blur(20px);
  z-index: -1;
  animation: pulse-glow-hero 4s ease-in-out infinite alternate;
}

@keyframes pulse-glow-hero {
  0% { transform: scale(0.9); opacity: 0.7; }
  100% { transform: scale(1.15); opacity: 1; }
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
  font-size: 3.5rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
}

@keyframes introLogoZoom {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
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
  letter-spacing: 0.18em;
  margin: 0;
  font-weight: var(--font-bold);
  text-shadow: 0 0 8px var(--color-neon-blue-glow);
}

.titulo-inicio {
  font-family: var(--font-display);
  margin: 0;
  line-height: 1.1;
}

.titulo-ruta {
  font-size: clamp(3.2rem, 9vw, 5.4rem);
  font-weight: var(--font-extrabold);
  background: linear-gradient(135deg, #00ff88, #00c8ff, #b84fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.45)) drop-shadow(0 0 35px rgba(0, 200, 255, 0.25));
  letter-spacing: -0.01em;
}

.titulo-heroe {
  font-size: clamp(1.3rem, 4.2vw, 2.1rem);
  color: #f1f5f9;
  font-weight: var(--font-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 200, 255, 0.3);
}

.divisor-titulo {
  width: 140px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-neon-green), var(--color-neon-blue), transparent);
  border-radius: var(--radius-full);
  box-shadow: 0 0 12px var(--color-neon-green-glow);
  margin-top: var(--space-2);
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
  color: #f8fafc;
  line-height: 1.65;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}

.descripcion-mision {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  background: rgba(8, 12, 28, 0.7);
  border: 1px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin: 0;
  backdrop-filter: blur(8px);
  box-shadow: inset 0 0 20px rgba(0, 200, 255, 0.08);
}

/* --- Stats decorativas --- */
.estadisticas-inicio {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: var(--space-6);
  background: rgba(7, 10, 25, 0.75);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 200, 255, 0.15), inset 0 0 10px rgba(0, 200, 255, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.estadisticas-inicio:hover {
  border-color: rgba(0, 255, 136, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 255, 136, 0.2), inset 0 0 10px rgba(0, 255, 136, 0.05);
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
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.divisor-estadistica {
  width: 1px;
  height: 40px;
  background: rgba(0, 200, 255, 0.15);
}

/* --- CTA con Pulso Neón --- */
.llamada-accion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.llamada-accion .btn {
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s ease, background 0.25s ease;
}

.llamada-accion .btn-primary {
  padding: var(--space-4) var(--space-10);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-neon-green) 0%, #00a85d 100%);
  border: 1px solid rgba(0, 255, 136, 0.6);
  box-shadow: 0 0 22px rgba(0, 255, 136, 0.35);
  animation: pulseNeonCTA 2.5s infinite ease-in-out;
}

.llamada-accion .btn-primary:hover {
  background: linear-gradient(135deg, #00ffaa 0%, #00c069 100%);
  box-shadow: 0 0 35px rgba(0, 255, 136, 0.65), 0 0 15px rgba(0, 200, 255, 0.35);
  transform: scale(1.06) translateY(-3px);
}

@keyframes pulseNeonCTA {
  0% { box-shadow: 0 0 18px rgba(0, 255, 136, 0.3); }
  50% { box-shadow: 0 0 32px rgba(0, 255, 136, 0.6), 0 0 15px rgba(0, 200, 255, 0.35); }
  100% { box-shadow: 0 0 18px rgba(0, 255, 136, 0.3); }
}

.llamada-accion .btn-outline {
  border-color: rgba(0, 200, 255, 0.4);
  color: var(--color-neon-blue);
  background: rgba(0, 200, 255, 0.03);
}

.llamada-accion .btn-outline:hover {
  background: rgba(0, 200, 255, 0.1);
  border-color: var(--color-neon-blue);
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.35);
  transform: scale(1.05) translateY(-2px);
}

.sugerencia-cta {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
  opacity: 0.95;
}

/* --- Disclaimer --- */
.descargo-responsabilidad {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  max-width: 480px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.85;
}

/* --- Estilos Modal de Partida Encontrada --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(3, 4, 10, 0.92);
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
  border: 1px solid rgba(184, 79, 255, 0.4);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 25px rgba(184, 79, 255, 0.2);
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
  animation: pulseNeonCTA-blue 2.5s infinite ease-in-out;
}

@keyframes pulseNeonCTA-blue {
  0% { box-shadow: 0 0 15px rgba(0, 200, 255, 0.25); }
  50% { box-shadow: 0 0 25px rgba(0, 200, 255, 0.5), 0 0 10px rgba(184, 79, 255, 0.25); }
  100% { box-shadow: 0 0 15px rgba(0, 200, 255, 0.25); }
}

.btn-continuar-partida-inicio:hover {
  background: linear-gradient(135deg, #33ccff 0%, #0088cc 100%);
  box-shadow: 0 0 25px rgba(0, 200, 255, 0.55);
  transform: scale(1.06) translateY(-3px);
}

/* --- Responsive adicional --- */
@media (max-width: 640px) {
  .estadisticas-inicio {
    gap: var(--space-4);
    padding: var(--space-3) var(--space-5);
  }
  .numero-estadistica {
    font-size: var(--text-2xl);
  }
  .emblema-heroe {
    width: 100px;
    height: 100px;
  }
  .icono-emblema {
    font-size: 3rem;
  }
  .contenido-inicio {
    gap: var(--space-6);
  }
  .opciones-inicio-botones {
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }
  .opciones-inicio-botones .btn {
    width: 100%;
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .grid-overlay,
  .luz-azul,
  .luz-verde,
  .luz-purpura,
  .particula,
  .emblema-heroe::before,
  .anillo-emblema,
  .llamada-accion .btn-primary,
  .btn-continuar-partida-inicio,
  .modal-icon {
    animation: none !important;
  }
  .particula {
    display: none;
  }
  .btn {
    transition: none !important;
  }
}
</style>
