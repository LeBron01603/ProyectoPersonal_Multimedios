<template>
  <!-- MapaMisiones: pantalla del mapa de misiones por provincia -->
  <section class="mapa-misiones" aria-label="Mapa de misiones de Costa Rica">

    <!-- Header del mapa -->
    <div class="encabezado-mapa animate-fade-in">
      <div class="info-heroe-mapa">
        <span class="avatar-heroe-mapa" aria-hidden="true">🦸</span>
        <div>
          <h2 class="titulo-mapa">
            ¡Bienvenido, <span class="texto-nombre-heroe">{{ identidadHeroe.nombre }}</span>!
          </h2>
          <p class="subtitulo-mapa">
            Elige una provincia y comienza tu misión nocturna
          </p>
        </div>
      </div>

      <!-- Estadísticas del héroe en el mapa -->
      <div class="estadisticas-mapa">
        <IndicadorEstadistica
          v-for="stat in listaEstadisticasHeroe"
          :key="stat.key"
          :etiqueta="stat.etiqueta"
          :valor="stat.valor"
          :icono="stat.icono"
          :color="stat.color"
          tamano="md"
        />
      </div>
    </div>

    <!-- Progreso global -->
    <div class="progreso-mapa animate-fade-in delay-100">
      <div class="info-progreso">
        <span class="etiqueta-progreso">🗺️ Misiones completadas</span>
        <span class="valor-progreso">{{ misionesCompletadas.length }} / {{ provincias.length }}</span>
      </div>
      <div class="pista-progreso" role="progressbar" :aria-valuenow="porcentajeProgreso" aria-valuemin="0" aria-valuemax="100">
        <div class="relleno-progreso" :style="{ width: porcentajeProgreso + '%' }"></div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="estaCargando" class="carga-mapa animate-fade-in" aria-live="polite">
      <div class="spinner-carga" aria-hidden="true"></div>
      <p>Cargando misiones...</p>
    </div>

    <!-- Error de carga -->
    <div v-else-if="errorCarga" class="error-mapa animate-fade-in" role="alert">
      <p>⚠️ {{ errorCarga }}</p>
      <button class="btn btn-outline btn-sm" @click="cargarMisiones">🔄 Reintentar</button>
    </div>

    <!-- Grid de tarjetas de provincias -->
    <div v-else class="cuadricula-provincias">
      <TarjetaProvincia
        v-for="(provincia, index) in provincias"
        :key="provincia.id"
        :provincia="provincia"
        :esta-completada="misionesCompletadas.includes(provincia.id)"
        :esta-activa="idProvinciaActiva === provincia.id"
        class="animate-fade-in"
        :style="{ animationDelay: `${index * 0.08}s` }"
        @seleccionar="alSeleccionarProvincia"
        @iniciar-mision="alIniciarMision"
      />
    </div>

    <!-- Panel de detalle de provincia seleccionada -->
    <transition name="slide-up">
      <div v-if="provinciaSeleccionada && !idProvinciaActiva" class="detalle-provincia animate-fade-in">
        <h3 class="titulo-detalle">{{ provinciaSeleccionada.emoji }} {{ provinciaSeleccionada.tituloMision }}</h3>
        <p class="desc-detalle">{{ provinciaSeleccionada.descripcionMision }}</p>
        <button
          class="btn btn-primary btn-lg"
          @click="alIniciarMision(provinciaSeleccionada)"
          :disabled="!provinciaSeleccionada.desbloqueada"
          id="btn-iniciar-mision-mapa"
        >
          ⚡ Iniciar misión en {{ provinciaSeleccionada.nombre }}
        </button>
      </div>
    </transition>

  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, computed, onMounted } from 'vue'

// --- Componentes hijos ---
import TarjetaProvincia from './TarjetaProvincia.vue'
import IndicadorEstadistica from './IndicadorEstadistica.vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits: notifica al padre qué misión iniciar ---
const emit = defineEmits(['iniciar-mision'])

// --- Estado del juego ---
const {
  identidadHeroe,
  estadisticasHeroe,
  misionesCompletadas,
  porcentajeProgreso,
  iniciarMision
} = useEstadoJuego()

// --- Audio ---
const { reproducirMusica, reproducirEfecto } = useAudio()

// --- Estado local del mapa ---
const provincias            = ref([])
const estaCargando          = ref(false)
const errorCarga            = ref(null)
const provinciaSeleccionada = ref(null)
const idProvinciaActiva     = ref(null)

// --- Computed: lista de estadísticas del héroe ---
const listaEstadisticasHeroe = computed(() => [
  { key: 'energia',         etiqueta: 'Energía',         valor: estadisticasHeroe.energia,         icono: '⚡', color: 'gold'   },
  { key: 'conocimiento',    etiqueta: 'Conocimiento',    valor: estadisticasHeroe.conocimiento,    icono: '📚', color: 'blue'   },
  { key: 'diversion',       etiqueta: 'Diversión',       valor: estadisticasHeroe.diversion,       icono: '🎉', color: 'purple' },
  { key: 'responsabilidad', etiqueta: 'Resp.',            valor: estadisticasHeroe.responsabilidad, icono: '🎓', color: 'green'  }
])

// =========================================================
// Carga de misiones desde JSON
// =========================================================

/**
 * Carga los datos de provincias/misiones desde misiones.json.
 */
async function cargarMisiones() {
  estaCargando.value = true
  errorCarga.value = null

  try {
    const response = await fetch('/misiones.json')

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    provincias.value = data.provincias

  } catch (err) {
    console.error('[MapaMisiones] Error cargando misiones:', err)
    provincias.value = obtenerProvinciasFallback()
    errorCarga.value = null
  } finally {
    estaCargando.value = false
  }
}

/**
 * Datos de fallback en caso de que el fetch falle durante desarrollo.
 */
function obtenerProvinciasFallback() {
  return [
    {
      id: 'san-jose', nombre: 'San José', emoji: '🏙️', region: 'Valle Central',
      dificultad: 1, descripcion: 'La capital costarricense.', color: '#00ff88',
      desbloqueada: true, tituloMision: 'La Noche Josefina',
      descripcionMision: 'El caos universitario llegó a San José.',
      estadisticas: { energia: 70, conocimiento: 85, diversion: 75, responsabilidad: 80 }, preguntas: []
    },
    {
      id: 'cartago', nombre: 'Cartago', emoji: '⛪', region: 'Valle Central',
      dificultad: 1, descripcion: 'La primera capital de Costa Rica.', color: '#00c8ff',
      desbloqueada: true, tituloMision: 'El Misterio del Valle',
      descripcionMision: 'Cartago guarda secretos históricos.',
      estadisticas: { energia: 60, conocimiento: 90, diversion: 55, responsabilidad: 85 }, preguntas: []
    },
    {
      id: 'heredia', nombre: 'Heredia', emoji: '🌺', region: 'Valle Central',
      dificultad: 2, descripcion: 'La ciudad de las flores.', color: '#b84fff',
      desbloqueada: false, tituloMision: 'Entre Flores y Libros',
      descripcionMision: 'Heredia te espera.',
      estadisticas: { energia: 65, conocimiento: 88, diversion: 70, responsabilidad: 82 }, preguntas: []
    },
    {
      id: 'alajuela', nombre: 'Alajuela', emoji: '⚔️', region: 'Valle Central',
      dificultad: 2, descripcion: 'Tierra de héroes nacionales.', color: '#ffd700',
      desbloqueada: false, tituloMision: 'La Tierra de Mora',
      descripcionMision: 'Alajuela honra a sus héroes.',
      estadisticas: { energia: 80, conocimiento: 82, diversion: 72, responsabilidad: 78 }, preguntas: []
    },
    {
      id: 'guanacaste', nombre: 'Guanacaste', emoji: '🌊', region: 'Pacífico Norte',
      dificultad: 3, descripcion: 'Playas y cultura sabanera.', color: '#ff6b35',
      desbloqueada: false, tituloMision: 'El Llamado del Pacífico',
      descripcionMision: 'Las playas de Guanacaste te llaman.',
      estadisticas: { energia: 90, conocimiento: 75, diversion: 95, responsabilidad: 65 }, preguntas: []
    },
    {
      id: 'puntarenas', nombre: 'Puntarenas', emoji: '🐊', region: 'Pacífico Central',
      dificultad: 3, descripcion: 'Puerto del Pacífico.', color: '#00e5cc',
      desbloqueada: false, tituloMision: 'La Perla del Pacífico',
      descripcionMision: 'El Pacífico guarda secretos.',
      estadisticas: { energia: 85, conocimiento: 78, diversion: 88, responsabilidad: 70 }, preguntas: []
    },
    {
      id: 'limon', nombre: 'Limón', emoji: '🌴', region: 'Caribe',
      dificultad: 4, descripcion: 'Cultura afrocostarricense y biodiversidad.', color: '#ff4b6e',
      desbloqueada: false, tituloMision: 'Ritmo Caribeño',
      descripcionMision: 'El Caribe vibra con su energía.',
      estadisticas: { energia: 95, conocimiento: 72, diversion: 98, responsabilidad: 60 }, preguntas: []
    }
  ]
}

// --- Seleccionar una provincia (sin iniciar aún) ---
function alSeleccionarProvincia(provincia) {
  provinciaSeleccionada.value = provincia
  reproducirEfecto('click')
}

// --- Iniciar misión en la provincia seleccionada ---
function alIniciarMision(provincia) {
  if (!provincia.desbloqueada) return
  idProvinciaActiva.value = provincia.id
  reproducirEfecto('click')
  iniciarMision(provincia)
  emit('iniciar-mision', provincia)
}

// --- Ciclo de vida: onMounted ---
onMounted(async () => {
  reproducirMusica('mapa')
  await cargarMisiones()
})
</script>

<style scoped>
/* --- Pantalla del mapa --- */
.mapa-misiones {
  min-height: calc(100vh - 64px);
  padding: var(--space-8) var(--space-4);
  max-width: 1200px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* --- Header --- */
.encabezado-mapa {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.info-heroe-mapa {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.avatar-heroe-mapa {
  font-size: 3rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.titulo-mapa {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-1);
  color: var(--color-text-primary);
}

.texto-nombre-heroe {
  color: var(--color-neon-green);
  text-shadow: 0 0 12px var(--color-neon-green-glow);
}

.subtitulo-mapa {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: var(--text-base);
}

.estadisticas-mapa {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* --- Progreso --- */
.progreso-mapa {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  backdrop-filter: blur(8px);
}

.info-progreso {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.etiqueta-progreso {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.valor-progreso {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--color-neon-green);
  font-size: var(--text-sm);
}

.pista-progreso {
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.relleno-progreso {
  height: 100%;
  background: var(--gradient-btn);
  border-radius: var(--radius-full);
  transition: width 0.8s ease;
  box-shadow: 0 0 10px var(--color-neon-green-glow);
}

/* --- Loading --- */
.carga-mapa {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-12);
  color: var(--color-text-secondary);
}

.spinner-carga {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-neon-green);
  border-radius: 50%;
  animation: spin-slow 0.8s linear infinite;
}

/* --- Error --- */
.error-mapa {
  text-align: center;
  padding: var(--space-8);
  color: #ff6b6b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

/* --- Grid de provincias --- */
.cuadricula-provincias {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-5);
}

/* --- Panel de detalle --- */
.detalle-provincia {
  background: var(--gradient-card);
  border: 1px solid var(--color-neon-purple);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}

.titulo-detalle {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-neon-purple);
  margin: 0;
}

.desc-detalle {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  max-width: 500px;
  margin: 0;
}

/* --- Transición del panel --- */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .encabezado-mapa {
    flex-direction: column;
  }
  .estadisticas-mapa {
    width: 100%;
    justify-content: center;
  }
  .cuadricula-provincias {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .titulo-mapa {
    font-size: var(--text-2xl);
  }
  .avatar-heroe-mapa {
    font-size: 2rem;
  }
}
</style>
