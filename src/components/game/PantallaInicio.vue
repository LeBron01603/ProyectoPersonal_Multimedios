<template>
  <section class="pantalla-inicio" aria-label="Pantalla de inicio de Ruta Tica">
    <!-- Fondo fijo e inmutable detrás de la escena -->
    <div class="fondo-fijo-inicio" aria-hidden="true"></div>
    
    <!-- Capa de overlay holográfico con scanlines muy suaves -->
    <div class="hologram-scanlines" aria-hidden="true"></div>

    <!-- Efecto ambiental de partículas flotantes (Morpho y Luces) -->
    <div class="particulas-ambientales" aria-hidden="true">
      <!-- Mariposas Morpho Azul animadas -->
      <span v-for="n in 6" :key="'morpho-' + n" class="ambient-morpho" :style="estiloMorpho(n)">🦋</span>
      <!-- Chispas neón -->
      <span v-for="n in 12" :key="'spark-' + n" class="ambient-spark" :style="estiloSpark(n)"></span>
    </div>

    <div class="inicio-hero">
      <!-- Contenedor del Grid Principal (HUD de Videojuego AAA) -->
      <div class="hud-main-grid animate-fade-in">
        
        <!-- COLUMNA IZQUIERDA: Estado del Héroe (Glassmorphism) -->
        <aside class="hud-panel glass-panel panel-izquierdo">
          <div class="panel-header">
            <span class="panel-icon">👤</span>
            <h2>ESTADO DEL HÉROE</h2>
          </div>
          <div class="panel-body">
            <div v-if="tieneProgresoValido" class="stats-heroe-container">
              <div class="heroe-perfil-resumen">
                <div class="avatar-neon-wrapper">
                  <span class="avatar-emoji">🦸</span>
                  <div class="neon-ring"></div>
                </div>
                <div class="heroe-meta">
                  <h3 class="heroe-alias text-neon-blue">{{ identidadHeroe.aliasHeroe || 'Héroe del After' }}</h3>
                  <p class="heroe-carrera">{{ identidadHeroe.carrera }}</p>
                  <div class="heroe-nivel-badge">Nivel {{ nivelHeroe }}</div>
                </div>
              </div>

              <!-- Atributos -->
              <div class="atributos-lista">
                <div class="atributo-item">
                  <div class="atributo-meta">
                    <span>⚡ Energía</span>
                    <span>{{ estadisticasHeroe.energia }}/100</span>
                  </div>
                  <div class="barra-progreso-bg">
                    <div class="barra-progreso-fill bar-energia" :style="{ width: estadisticasHeroe.energia + '%' }"></div>
                  </div>
                </div>
                <div class="atributo-item">
                  <div class="atributo-meta">
                    <span>📚 Conocimiento</span>
                    <span>{{ estadisticasHeroe.conocimiento }}/100</span>
                  </div>
                  <div class="barra-progreso-bg">
                    <div class="barra-progreso-fill bar-conocimiento" :style="{ width: estadisticasHeroe.conocimiento + '%' }"></div>
                  </div>
                </div>
                <div class="atributo-item">
                  <div class="atributo-meta">
                    <span>🎓 Responsabilidad</span>
                    <span>{{ estadisticasHeroe.responsabilidad }}/100</span>
                  </div>
                  <div class="barra-progreso-bg">
                    <div class="barra-progreso-fill bar-responsabilidad" :style="{ width: estadisticasHeroe.responsabilidad + '%' }"></div>
                  </div>
                </div>
                <div class="atributo-item">
                  <div class="atributo-meta">
                    <span>🤝 Reputación</span>
                    <span>{{ estadisticasHeroe.reputacionNocturna }}/100</span>
                  </div>
                  <div class="barra-progreso-bg">
                    <div class="barra-progreso-fill bar-reputacion" :style="{ width: estadisticasHeroe.reputacionNocturna + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Sospecha de Identidad -->
              <div class="sospecha-seccion">
                <div class="sospecha-meta">
                  <span class="texto-advertencia-titulo">🕵️ Sospecha de Identidad</span>
                  <span class="valor-sospecha" :class="claseSospecha">{{ estadisticasHeroe.sospechaIdentidad }}%</span>
                </div>
                <div class="barra-progreso-bg">
                  <div class="barra-progreso-fill bar-sospecha" :class="claseSospecha" :style="{ width: estadisticasHeroe.sospechaIdentidad + '%' }"></div>
                </div>
                <p class="sospecha-mensaje" :class="claseSospecha">
                  {{ mensajeSospecha }}
                </p>
              </div>

              <!-- Próxima misión -->
              <div class="proxima-mision-caja">
                <div class="caja-etiqueta">PRÓXIMA PROVINCIA</div>
                <div class="caja-valor text-neon">{{ proximaMisionNombre }}</div>
              </div>
            </div>

            <div v-else class="lore-bienvenida">
              <p class="lore-texto">
                De día cumples tus responsabilidades académicas. De noche, recorres el territorio costarricense como el <strong>Héroe del After</strong>.
              </p>
              <div class="lore-valores">
                <div class="valor-ficha"><span class="emoji">🌸</span> <strong>Guaria Morada</strong> de Honor</div>
                <div class="valor-ficha"><span class="emoji">🛞</span> <strong>Carreta</strong> del Esfuerzo</div>
                <div class="valor-ficha"><span class="emoji">🦜</span> <strong>Lapa</strong> de la Sabiduría</div>
              </div>
              <div class="consejo-bienvenida">
                ¡Crea tu perfil de héroe y defiende la noche!
              </div>
            </div>
          </div>
        </aside>

        <!-- COLUMNA CENTRAL: Logo Cyberpunk Neón y Botones Centrados -->
        <main class="hud-centro">
          
          <!-- Logo Reconstruido Estilo Videojuego AAA -->
          <header class="logo-cyber-container">
            <p class="lema-juego-tico">🇨🇷 EL VIAJE HEROICO ACADÉMICO-CULTURAL 🇨🇷</p>
            <h1 class="titulo-juego-logo">
              <span class="logo-ruta-neon">RUTA TICA</span>
              <span class="logo-after-neon">EL HÉROE DEL AFTER</span>
            </h1>
            <div class="logo-divider-neon">
              <span class="logo-morpho-center">🦋</span>
            </div>
          </header>

          <!-- Botones de Acción Centrados -->
          <div class="acciones-centradas-container">
            
            <!-- Botón Principal (Comenzar / Continuar) -->
            <div class="btn-principal-wrapper">
              <button
                v-if="tieneProgresoValido"
                id="btn-continuar-aventura"
                class="btn-aaa btn-primary-aaa animate-pulse-glow"
                @click="alContinuarPartidaDirecto"
                aria-label="Continuar aventura"
              >
                <span class="aaa-glow"></span>
                📂 CONTINUAR AVENTURA
              </button>
              <button
                v-else
                id="btn-iniciar-mision"
                class="btn-aaa btn-primary-aaa animate-pulse-glow"
                @click="alIniciar"
                aria-label="Comenzar aventura"
              >
                <span class="aaa-glow"></span>
                ⚡ COMENZAR AVENTURA
              </button>
            </div>

            <!-- Botones Secundarios Opcionales -->
            <div class="botones-secundarios-wrapper" v-if="tieneProgresoValido">
              <button
                id="btn-nueva-aventura"
                class="btn-aaa btn-danger-aaa"
                @click="alConfirmarNuevaPartidaDirecto"
                aria-label="Reiniciar aventura"
              >
                🔄 REINICIAR AVENTURA
              </button>
              <button
                class="btn-aaa btn-secondary-aaa"
                @click="origenCentroHeroe = 'inicio'; navegarA(PANTALLAS.CENTRO_HEROE)"
                aria-label="Ver perfil del héroe"
              >
                👤 CENTRO DEL HÉROE
              </button>
            </div>
          </div>

          <!-- Tarjeta Académica Compacta Integrada -->
          <div class="tarjeta-academica-compacta glass-panel">
            <div class="academica-titulo text-neon-purple">Ruta Tica: El Héroe del After</div>
            <div class="academica-autor text-neon-blue">Emiliano Martínez • IF7102 Multimedios • UCR</div>
            <div class="academica-tech text-neon-gold">Vue 3 + Vite + JS • 2026</div>
          </div>
        </main>

        <!-- COLUMNA DERECHA: Datos del Sistema y Ranking (Glassmorphism) -->
        <aside class="hud-panel glass-panel panel-derecho">
          <div class="panel-header">
            <span class="panel-icon">📊</span>
            <h2>DATOS DEL SISTEMA</h2>
          </div>
          <div class="panel-body">
            
            <div class="grid-cards-datos">
              <!-- Provincias -->
              <div class="card-dato-neon">
                <span class="card-icon">🗺️</span>
                <div class="card-content">
                  <span class="card-title">Provincias</span>
                  <span class="card-num text-neon-blue">
                    {{ tieneProgresoValido && misionesCompletadas ? misionesCompletadas.length : '0' }}<span class="card-max">/7</span>
                  </span>
                </div>
              </div>

              <!-- Preguntas -->
              <div class="card-dato-neon">
                <span class="card-icon">❓</span>
                <div class="card-content">
                  <span class="card-title">Preguntas</span>
                  <span class="card-num text-neon-green">56</span>
                </div>
              </div>

              <!-- Misiones -->
              <div class="card-dato-neon">
                <span class="card-icon">⚡</span>
                <div class="card-content">
                  <span class="card-title">Misiones</span>
                  <span class="card-num text-neon-purple">7</span>
                </div>
              </div>

              <!-- Bosque Nuboso / Referencias -->
              <div class="card-dato-neon">
                <span class="card-icon">🌿</span>
                <div class="card-content">
                  <span class="card-title">Exploración</span>
                  <span class="card-num text-neon-gold">100%</span>
                </div>
              </div>
            </div>

            <!-- Bitácora de Viaje (Referencias a Cartago y Guanacaste) -->
            <div class="bitacora-viaje-neon">
              <div class="bitacora-header">🗺️ BITÁCORA DE VIAJE</div>
              <div class="bitacora-body">
                <div class="bitacora-item">
                  <span class="prov-badge cartago">Cartago</span>
                  <span class="prov-details">Volcán Irazú, Ruinas históricas y Bosque nuboso.</span>
                </div>
                <div class="bitacora-item">
                  <span class="prov-badge guanacaste">Guanacaste</span>
                  <span class="prov-details">Playas del Pacífico, Tradición y Anexión.</span>
                </div>
              </div>
            </div>

            <!-- Salón de la Fama -->
            <div class="ranking-panel-scroll">
              <div class="ranking-header">
                <h3>🏆 SALÓN DE LA FAMA</h3>
              </div>
              <div class="ranking-lista" v-if="rankingLocal && rankingLocal.length > 0">
                <div v-for="(entry, index) in rankingLocal.slice(0, 4)" :key="index" class="ranking-item">
                  <span class="ranking-pos" :class="'pos-' + (index + 1)">#{{ index + 1 }}</span>
                  <span class="ranking-alias">{{ entry.alias }}</span>
                </div>
              </div>
              <div class="ranking-vacio" v-else>
                Sin puntuaciones guardadas aún.
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>



    <!-- Modal Confirmación para Nueva Partida -->
    <ModalConfirmacion
      :mostrar="mostrarConfirmarNuevaPartida"
      titulo="¿Deseas borrar toda tu partida?"
      mensaje="Se perderán:
• Provincias completadas
• XP y nivel
• Estadísticas
• Progreso de historia

Nota: El ranking local se conserva."
      textoConfirmar="Reiniciar Aventura"
      textoCancelar="Cancelar"
      @confirmar="comenzarNuevaPartida"
      @cancelar="cerrarConfirmarNuevaPartida"
    />

  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import ModalConfirmacion from './ModalConfirmacion.vue'
import { useAudio } from '../../composables/useAudio.js'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'

// --- Audio ---
const { reproducirMusica, reproducirEfecto } = useAudio()

// --- Estado global reactivo ---
const {
  hayProgresoGuardado,
  cargarProgreso,
  borrarProgreso,
  pantallaActual,
  PANTALLAS,
  identidadHeroe,
  estadisticasHeroe,
  misionesCompletadas,
  nivelHeroe,
  experienciaHeroe,
  rankingLocal,
  navegarA,
  origenCentroHeroe
} = useEstadoJuego()

// --- Estado local ---
const tieneProgresoValido = ref(false)
const mostrarConfirmarNuevaPartida = ref(false)

const emit = defineEmits(['iniciar'])

// --- Watcher ---
watch(pantallaActual, (nuevaPantalla) => {
  if (nuevaPantalla === PANTALLAS.INICIO) {
    tieneProgresoValido.value = hayProgresoGuardado()
  }
})

// --- Ciclo de vida ---
onMounted(() => {
  reproducirMusica('menu')
  tieneProgresoValido.value = hayProgresoGuardado()
})

// --- Acciones ---
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

// --- Computeds ---
const proximaMisionNombre = computed(() => {
  const rutaOrdenada = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']
  if (!misionesCompletadas.value) return 'San José'
  const proximaId = rutaOrdenada.find(id => !misionesCompletadas.value.includes(id))
  if (!proximaId) return '¡Todas completadas!'
  const nombres = {
    'san-jose': 'San José',
    'heredia': 'Heredia',
    'cartago': 'Cartago',
    'alajuela': 'Alajuela',
    'guanacaste': 'Guanacaste',
    'puntarenas': 'Puntarenas',
    'limon': 'Limón'
  }
  return nombres[proximaId] || proximaId
})

const claseSospecha = computed(() => {
  const val = estadisticasHeroe?.sospechaIdentidad || 0
  if (val >= 75) return 'sospecha-critica'
  if (val >= 50) return 'sospecha-advertencia'
  return 'sospecha-segura'
})

const mensajeSospecha = computed(() => {
  const val = estadisticasHeroe?.sospechaIdentidad || 0
  if (val >= 75) return '🚨 ¡Alerta Crítica! Sospecha muy alta.'
  if (val >= 50) return '⚠️ Compañeros notan tus ausencias.'
  return '👤 Identidad secreta resguardada.'
})

// --- Estilos para elementos dinámicos costarricenses ---
function estiloMorpho(n) {
  const x = (n * 17 + 8) % 100
  const y = (n * 23 + 15) % 100
  const delay = n * 1.5
  const size = 1.0 + (n % 3) * 0.2
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `scale(${size})`,
    animationDelay: `${delay}s`,
    animationDuration: `${12 + (n % 4) * 3}s`
  }
}

function estiloSpark(n) {
  const x = (n * 31 + 5) % 100
  const y = (n * 41 + 10) % 100
  const size = ((n * 5) % 3) + 2
  const delay = n * 0.4
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${5 + (n % 3) * 2}s`
  }
}
</script>

<style scoped>
.pantalla-inicio {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  overflow: hidden; /* Entire screen fits in one view without scroll on desktop */
  z-index: 1;
}

@media (max-width: 1100px) {
  .pantalla-inicio {
    overflow-y: auto; /* Scroll allowed on smaller viewports where content wraps */
  }
}

.inicio-hero {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-6);
  box-sizing: border-box;
}

/* Integrated compact academic card styles */
.tarjeta-academica-compacta {
  padding: var(--space-3) var(--space-4) !important;
  background: rgba(5, 10, 25, 0.65);
  border: 1.5px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 460px;
  margin-top: var(--space-2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}
.academica-titulo {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.academica-autor {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}
.academica-tech {
  font-size: 0.65rem;
  font-family: 'Orbitron', sans-serif;
  color: var(--color-text-muted);
}


/* Fondo fijo e inmutable */
.fondo-fijo-inicio {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/fondo-ruta-tica-inicio.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
}

.fondo-fijo-inicio::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%);
  pointer-events: none;
}

/* Hologram Scanlines Effect */
.hologram-scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0.3;
}

/* Mariposas Morpho Azul flotantes */
.particulas-ambientales {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.ambient-morpho {
  position: absolute;
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.9));
  animation: morpho-flutter 15s linear infinite;
  opacity: 0;
}

@keyframes morpho-flutter {
  0% {
    transform: translate3d(0, 100vh, 0) scale(0.6) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% {
    transform: translate3d(-100px, -20vh, 0) scale(1.1) rotate(360deg);
    opacity: 0;
  }
}

.ambient-spark {
  position: absolute;
  border-radius: 50%;
  background: var(--color-neon-green);
  box-shadow: 0 0 8px var(--color-neon-green-glow);
  animation: spark-float 8s linear infinite;
  opacity: 0.3;
}

@keyframes spark-float {
  0% {
    transform: translateY(110vh) scale(0.5);
    opacity: 0;
  }
  20% { opacity: 0.6; }
  80% { opacity: 0.6; }
  100% {
    transform: translateY(-10vh) scale(1.2);
    opacity: 0;
  }
}

/* HUD Grid de Videojuego AAA */
.hud-main-grid {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 330px 1fr 330px;
  gap: var(--space-8);
  width: 100%;
  max-width: 1440px;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}

/* Paneles Estilo Glassmorphic con Neon suave */
.glass-panel {
  background: rgba(5, 10, 25, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 200, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.glass-panel:hover {
  border-color: rgba(0, 255, 136, 0.45);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 255, 136, 0.2);
}

.panel-header {
  background: rgba(0, 200, 255, 0.08);
  border-bottom: 1px solid rgba(0, 200, 255, 0.2);
  padding: var(--space-3) var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.panel-header h2 {
  font-size: var(--text-sm);
  font-family: 'Orbitron', var(--font-display), sans-serif;
  letter-spacing: 0.12em;
  color: var(--color-neon-blue);
  text-shadow: 0 0 8px var(--color-neon-blue-glow);
  margin: 0;
}

.panel-body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Lado izquierdo - Estadísticas */
.heroe-perfil-resumen {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
}

.avatar-neon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(184, 79, 255, 0.15);
  border-radius: 50%;
  border: 2px solid var(--color-neon-purple);
  box-shadow: 0 0 10px var(--color-neon-purple-glow);
}

.avatar-emoji { font-size: 1.6rem; }

.heroe-meta { display: flex; flex-direction: column; }
.heroe-alias { font-size: var(--text-base); font-family: 'Orbitron', sans-serif; margin: 0; }
.heroe-carrera { font-size: 0.72rem; color: var(--color-text-muted); margin: 0; }

.heroe-nivel-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.68rem;
  background: var(--color-neon-purple-glow);
  color: var(--color-neon-purple);
  border: 1px solid var(--color-neon-purple);
  border-radius: var(--radius-sm);
  padding: 1px var(--space-2);
  margin-top: var(--space-1);
  font-weight: var(--font-bold);
}

.atributos-lista {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.atributo-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.atributo-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.barra-progreso-bg {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.barra-progreso-fill {
  height: 100%;
  border-radius: var(--radius-full);
}

.bar-energia { background: var(--color-neon-gold); box-shadow: 0 0 8px var(--color-neon-gold-glow); }
.bar-conocimiento { background: var(--color-neon-blue); box-shadow: 0 0 8px var(--color-neon-blue-glow); }
.bar-responsabilidad { background: var(--color-neon-green); box-shadow: 0 0 8px var(--color-neon-green-glow); }
.bar-reputacion { background: var(--color-neon-purple); box-shadow: 0 0 8px var(--color-neon-purple-glow); }

.sospecha-seccion {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sospecha-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.valor-sospecha.sospecha-segura { color: var(--color-neon-blue); }
.valor-sospecha.sospecha-advertencia { color: var(--color-neon-gold); }
.valor-sospecha.sospecha-critica { color: #ff4646; }

.bar-sospecha.sospecha-segura { background: var(--color-neon-blue); box-shadow: 0 0 6px var(--color-neon-blue-glow); }
.bar-sospecha.sospecha-advertencia { background: var(--color-neon-gold); box-shadow: 0 0 6px var(--color-neon-gold-glow); }
.bar-sospecha.sospecha-critica { background: #ff4646; box-shadow: 0 0 8px rgba(255, 70, 70, 0.6); }

.sospecha-mensaje { font-size: 0.7rem; margin: 0; line-height: 1.35; }
.sospecha-mensaje.sospecha-segura { color: var(--color-text-muted); }
.sospecha-mensaje.sospecha-advertencia { color: var(--color-neon-gold); }
.sospecha-mensaje.sospecha-critica { color: #ff8c8c; font-weight: bold; }

.proxima-mision-caja {
  background: rgba(0, 200, 255, 0.05);
  border: 1px dashed rgba(0, 200, 255, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  text-align: center;
}

.caja-etiqueta { font-size: 0.65rem; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 2px; }
.caja-valor { font-family: 'Orbitron', var(--font-display), sans-serif; font-size: var(--text-base); font-weight: var(--font-bold); }

/* Lore de bienvenida */
.lore-bienvenida { display: flex; flex-direction: column; gap: var(--space-4); }
.lore-texto { font-size: 0.82rem; line-height: 1.6; color: var(--color-text-secondary); margin: 0; }
.lore-valores { display: flex; flex-direction: column; gap: var(--space-2); }
.valor-ficha {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.consejo-bienvenida {
  font-size: 0.75rem;
  color: var(--color-neon-blue);
  text-shadow: 0 0 6px var(--color-neon-blue-glow);
  text-align: center;
  border-top: 1px solid rgba(0, 200, 255, 0.15);
  padding-top: var(--space-3);
}

/* COLUMNA CENTRAL: Logo y Botones */
.hud-centro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  gap: var(--space-10);
  text-align: center;
}

.logo-cyber-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.lema-juego-tico {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  text-shadow: 0 0 10px var(--color-neon-blue-glow);
  margin: 0;
  font-weight: 700;
}

.titulo-juego-logo {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.0;
}

.logo-ruta-neon {
  font-size: clamp(3.8rem, 8vw, 6rem);
  font-weight: 900;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #00ffaa 0%, #00f0ff 50%, #d800ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 15px rgba(0, 255, 170, 0.75));
}

.logo-after-neon {
  font-size: clamp(1rem, 2.5vw, 1.6rem);
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(216, 0, 255, 0.8);
  margin-top: var(--space-2);
}

.logo-divider-neon {
  position: relative;
  width: 250px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-neon-green), var(--color-neon-blue), transparent);
  margin-top: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-morpho-center {
  position: absolute;
  font-size: 1.1rem;
  background: #03040a;
  padding-inline: var(--space-2);
  filter: drop-shadow(0 0 6px var(--color-neon-blue-glow));
}

/* Botones de acción AAA Centrados */
.acciones-centradas-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 420px;
  align-items: center;
  margin-top: var(--space-4);
}

.btn-principal-wrapper {
  width: 100%;
}

.btn-aaa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-weight: 900;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
}

.btn-primary-aaa {
  width: 100%;
  padding: var(--space-4) var(--space-12);
  font-size: var(--text-xl);
  background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 50%, #ff007f 100%);
  color: #ffffff;
  border: 1.5px solid rgba(255, 0, 127, 0.85);
  box-shadow: 0 0 30px rgba(255, 0, 127, 0.45), 0 0 45px rgba(157, 78, 221, 0.25), inset 0 0 10px rgba(255, 0, 127, 0.25);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
}

.btn-primary-aaa:hover {
  background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 50%, #ff007f 100%);
  filter: brightness(1.2) saturate(1.2);
  box-shadow: 0 0 45px rgba(255, 0, 127, 0.75), 0 0 60px rgba(157, 78, 221, 0.45), inset 0 0 12px rgba(255, 255, 255, 0.35);
  transform: translateY(-4px) scale(1.03);
}

.btn-secondary-aaa {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  background: rgba(5, 10, 25, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(184, 79, 255, 0.5);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(184, 79, 255, 0.2);
  text-shadow: 0 0 6px rgba(184, 79, 255, 0.6);
  flex: 1;
}

.btn-secondary-aaa:hover {
  border-color: #d800ff;
  background: rgba(184, 79, 255, 0.2);
  box-shadow: 0 0 25px rgba(184, 79, 255, 0.6);
  transform: translateY(-2px);
}

.btn-danger-aaa {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  background: rgba(15, 5, 5, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255, 70, 70, 0.5);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(255, 70, 70, 0.2);
  text-shadow: 0 0 6px rgba(255, 70, 70, 0.6);
  flex: 1;
}

.btn-danger-aaa:hover {
  border-color: #ff4646;
  background: rgba(255, 70, 70, 0.2);
  box-shadow: 0 0 25px rgba(255, 70, 70, 0.6);
  transform: translateY(-2px);
}

.botones-secundarios-wrapper {
  display: flex;
  gap: var(--space-3);
  width: 100%;
}

.aaa-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: skewX(-20deg);
  animation: shine-sweep 5s infinite linear;
}

@keyframes shine-sweep {
  0% { left: -100%; }
  25% { left: 150%; }
  100% { left: 150%; }
}

.fauna-flora-decoracion {
  display: flex;
  gap: var(--space-6);
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
}

.decor-item {
  cursor: help;
  transition: transform 0.3s ease;
}
.decor-item:hover {
  transform: scale(1.3) rotate(10deg);
}

/* COLUMNA DERECHA - Datos del Sistema */
.grid-cards-datos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.card-dato-neon {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 200, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.card-dato-neon:hover {
  border-color: rgba(0, 200, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.15);
}

.card-icon { font-size: 1.25rem; }
.card-content { display: flex; flex-direction: column; }
.card-title { font-size: 0.65rem; color: var(--color-text-muted); text-transform: uppercase; }
.card-num { font-size: var(--text-base); font-weight: 800; font-family: 'Orbitron', sans-serif; }
.card-max { font-size: 0.72rem; color: var(--color-text-muted); font-weight: normal; }

/* Bitácora de Viaje */
.bitacora-viaje-neon {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(184, 79, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.bitacora-header {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: bold;
  color: var(--color-neon-purple);
  text-shadow: 0 0 8px var(--color-neon-purple-glow);
  letter-spacing: 0.05em;
}

.bitacora-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.bitacora-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.prov-badge {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  align-self: flex-start;
  padding: 1px 6px;
  border-radius: 4px;
}
.prov-badge.cartago {
  color: var(--color-neon-blue);
  background: rgba(0, 200, 255, 0.12);
  border: 1px solid rgba(0, 200, 255, 0.25);
}
.prov-badge.guanacaste {
  color: var(--color-neon-green);
  background: rgba(0, 255, 136, 0.12);
  border: 1px solid rgba(0, 255, 136, 0.25);
}

.prov-details {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

/* Ranking de Jugadores */
.ranking-panel-scroll {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ranking-header h3 {
  font-size: 0.72rem;
  color: var(--color-neon-gold);
  text-shadow: 0 0 6px var(--color-neon-gold-glow);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.08em;
  margin: 0;
}

.ranking-lista {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ranking-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 4px var(--space-3);
  font-size: 0.75rem;
}

.ranking-pos {
  font-weight: bold;
  font-size: 0.7rem;
  margin-right: var(--space-2);
  width: 20px;
}
.ranking-pos.pos-1 { color: var(--color-neon-gold); }
.ranking-pos.pos-2 { color: #cbd5e1; }
.ranking-pos.pos-3 { color: #cd7f32; }

.ranking-alias {
  flex: 1;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-score { font-weight: bold; }
.ranking-vacio { font-size: 0.72rem; color: var(--color-text-muted); text-align: center; }

/* RESPONSIVE LAYOUTS */
@media (max-width: 1100px) {
  .hud-main-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    max-width: 800px;
  }
  .hud-centro {
    grid-column: 1 / span 2;
    grid-row: 1;
  }
}

@media (max-width: 768px) {
  .hud-main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    max-width: 420px;
    gap: var(--space-6);
  }
  .hud-centro {
    grid-column: 1;
    grid-row: 1;
  }
  .glass-panel {
    background: rgba(5, 10, 25, 0.65); /* slightly higher opacity for reading on mobile */
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .ambient-morpho, .ambient-spark, .aaa-glow {
    animation: none !important;
  }
  .btn-aaa {
    transition: none !important;
  }
}

/* FOOTER ACADÉMICO COHERENTE CON NEÓN/GLASSMORPHISM */
.footer-academico {
  width: 100%;
  max-width: 1440px;
  margin-top: var(--space-8);
  margin-bottom: 0;
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  border-bottom: none;
  background: rgba(5, 10, 25, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1.5px solid rgba(0, 200, 255, 0.3);
  border-left: 1.5px solid rgba(0, 200, 255, 0.15);
  border-right: 1.5px solid rgba(0, 200, 255, 0.15);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 200, 255, 0.08);
  flex-shrink: 0;
}

.footer-academico:hover {
  border-top-color: rgba(0, 255, 136, 0.45);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 255, 136, 0.2);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: var(--space-6);
  align-items: center;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.project-title {
  font-family: 'Orbitron', sans-serif;
  font-size: var(--text-base);
  font-weight: 800;
  letter-spacing: 0.05em;
}

.project-option {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
}

.footer-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.author-name {
  font-family: 'Orbitron', sans-serif;
  font-size: var(--text-sm);
  font-weight: 700;
}

.academic-info {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.tech-badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: 2px;
  margin-bottom: var(--space-2);
}

.tech-badge {
  font-size: 0.68rem;
  font-family: 'Orbitron', sans-serif;
  padding: 2px 8px;
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.3);
  color: var(--color-neon-blue);
  border-radius: var(--radius-sm);
  text-shadow: 0 0 4px var(--color-neon-blue-glow);
}

.year-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.75rem;
}

.year-val {
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
}

/* Ajustes Responsive */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    text-align: center;
  }
  .footer-col {
    align-items: center;
  }
  .tech-badges {
    justify-content: center;
  }
  .footer-academico {
    border-radius: var(--radius-xl);
    border-bottom: 1.5px solid rgba(0, 200, 255, 0.25);
    margin-bottom: var(--space-4);
  }
}
</style>
