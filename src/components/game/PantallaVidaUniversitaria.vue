<template>
  <!-- PantallaVidaUniversitaria: actividades civiles diurnas del héroe -->
  <section class="pantalla-vida-u" aria-label="Pantalla de actividades universitarias">
    <!-- Partículas ambientales cibernéticas -->
    <div class="particles-background" aria-hidden="true">
      <span v-for="n in 8" :key="'particle-' + n" class="particle-leaf"></span>
    </div>

    <div class="contenedor-vida-u animate-fade-in-scale">
      
      <!-- Contexto Temporal -->
      <header class="encabezado-vida-u text-center">
        <div class="contexto-reloj animate-pulse">
          <span class="emoji-reloj">🕒</span>
          <span class="hora-reloj">3:00 PM</span>
        </div>
        <h2 class="titulo-vida-u">Vida Universitaria</h2>
        <p class="subtitulo-vida-u">
          Antes de que caiga la noche, dispones de tiempo libre en el campus. Elige exactamente <strong>2 actividades</strong> para prepararte.
        </p>
      </header>

      <!-- Bloque de Recomendaciones según Estadísticas -->
      <div v-if="recomendaciones.length > 0" class="panel-recomendaciones animate-fade-in">
        <h3 class="titulo-recomendaciones">💡 Recomendaciones para hoy</h3>
        <ul class="lista-recomendaciones">
          <li v-for="(rec, idx) in recomendaciones" :key="idx" class="recomendar-item" :class="rec.color">
            <span class="rec-icono">{{ rec.icono }}</span>
            <span class="rec-texto">{{ rec.texto }}</span>
          </li>
        </ul>
      </div>

      <!-- Panel de Información de la U (Noticias & Estado de Sospecha) -->
      <div class="panel-informacion-u animate-fade-in">
        <!-- Widget de Noticias -->
        <div v-if="noticiaDelDia" class="widget-noticias">
          <h3 class="titulo-widget">📰 Noticias del Campus</h3>
          <p class="noticia-titulo"><strong>{{ noticiaDelDia.titulo }}</strong></p>
          <p class="noticia-texto">{{ noticiaDelDia.texto }}</p>
        </div>

        <!-- Widget de Sospecha Civil -->
        <div class="widget-sospecha">
          <h3 class="titulo-widget">🔍 Estado de Sospecha</h3>
          <div class="rango-sospecha-contenedor">
            <span class="badge-rango-sospecha" :class="claseSospecha(estadisticasHeroe.sospechaIdentidad)">
              {{ etiquetaSospecha(estadisticasHeroe.sospechaIdentidad) }}
            </span>
            <div class="barra-sospecha-diurna">
              <div 
                class="barra-sospecha-diurna-relleno" 
                :style="{ width: `${estadisticasHeroe.sospechaIdentidad}%` }"
                :class="claseSospecha(estadisticasHeroe.sospechaIdentidad)"
              ></div>
            </div>
            <span class="porcentaje-sospecha-texto">{{ estadisticasHeroe.sospechaIdentidad }}% de sospecha acumulada</span>
          </div>
        </div>
      </div>

      <!-- Lista de Actividades -->
      <div class="cuadricula-actividades">
        <button
          v-for="act in actividades"
          :key="act.id"
          class="tarjeta-actividad"
          :class="{
            'selected': seleccionadas.includes(act.id),
            'disabled': seleccionadas.length >= 2 && !seleccionadas.includes(act.id)
          }"
          :disabled="seleccionadas.length >= 2 && !seleccionadas.includes(act.id)"
          @click="seleccionarActividad(act)"
          :aria-label="act.nombre"
        >
          <span class="act-emoji" aria-hidden="true">{{ act.emoji }}</span>
          <div class="act-info">
            <span class="act-nombre">{{ act.nombre }}</span>
            <span class="act-desc">{{ act.descripcion }}</span>
          </div>
          <!-- Bonificaciones visibles -->
          <div class="act-stats-badges">
            <span 
              v-for="(val, stat) in act.modificaciones" 
              :key="stat"
              class="stat-badge-mod"
              :class="val > 0 ? 'sube' : 'baja'"
            >
              {{ emojiStat(stat) }} {{ val > 0 ? '+' : '' }}{{ val }}
            </span>
          </div>
        </button>
      </div>

      <!-- Footer y Acciones -->
      <footer class="footer-vida-u">
        <div class="seleccion-info">
          <span>Actividades seleccionadas:</span>
          <strong class="texto-contador">{{ seleccionadas.length }} / 2</strong>
        </div>

        <div class="acciones-vida-u">
          <button class="btn btn-outline" @click="alCancelar">
            ↩ Volver al mapa
          </button>
          <button
            class="btn btn-hero btn-lg"
            :disabled="seleccionadas.length !== 2"
            @click="confirmarSeleccion"
            id="btn-confirmar-actividades"
          >
            ⚡ Confirmar y Avanzar
          </button>
        </div>
      </footer>

      <!-- Modal de Evento de Sospecha -->
      <transition name="modal-fade">
        <div v-if="eventoActivo && !consecuenciaTexto" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="suspicion-event-title">
          <div class="modal-wrapper" @click.self="() => {}">
            <div class="modal-card-suspicion animate-fade-in-scale">
              <!-- Ambientación Holográfica -->
              <div class="hologram-grid-overlay"></div>
              <div class="hologram-scanline"></div>
              <div class="hologram-particles">
                <span class="h-part hp1"></span>
                <span class="h-part hp2"></span>
                <span class="h-part hp3"></span>
                <span class="h-part hp4"></span>
              </div>

              <!-- Encabezado Heroico Premium -->
              <header class="suspicion-header text-center">
                <div class="incidente-insignia">🕵️</div>
                <h2 id="suspicion-event-title" class="incidente-titulo">ALERTA DEL CAMPUS</h2>
                <p class="incidente-subtitulo">Posible riesgo para tu identidad secreta</p>
                <div class="incidente-nivel-wrapper">
                  <span class="nivel-label">ESTADO ACTUAL:</span>
                  <span class="badge-rango-sospecha-tactico" :class="claseSospecha(estadisticasHeroe.sospechaIdentidad)">
                    <span v-if="exposicionRevelada || marcasExposicion >= 3">⚠️ Expuesto</span>
                    <span v-else-if="claseSospecha(estadisticasHeroe.sospechaIdentidad) === 'segura'">🟢 Identidad Segura</span>
                    <span v-else-if="claseSospecha(estadisticasHeroe.sospechaIdentidad) === 'rumores'">🟡 Rumores</span>
                    <span v-else-if="claseSospecha(estadisticasHeroe.sospechaIdentidad) === 'alta'">🟠 Sospechas</span>
                    <span v-else-if="claseSospecha(estadisticasHeroe.sospechaIdentidad) === 'investigacion'">🔴 Investigación</span>
                  </span>
                </div>
              </header>

              <!-- Tarjeta de Narrativa -->
              <div class="informe-narrativo-bloque">
                <div class="informe-narrativo-header">
                  <span class="hologram-ping"></span>
                  <span class="informe-titulo">📖 INFORME DEL CAMPUS</span>
                </div>
                <div class="narrativa-separador-linea"></div>
                <p class="texto-evento">{{ eventoActivo.texto }}</p>
                <div class="narrativa-separador-linea"></div>
              </div>

              <!-- Zona de Impacto Potencial (Fase Visual) -->
              <div class="zona-impacto-tactico">
                <div class="impacto-header">
                  <span>⚡ POSIBLES EFECTOS</span>
                </div>
                <div class="impacto-badges-grid">
                  <template v-if="opcionHovered">
                    <span 
                      v-for="(val, stat) in opcionHovered.modificaciones" 
                      :key="stat" 
                      class="stat-badge-mod"
                      :class="val > 0 ? 'sube' : 'baja'"
                    >
                      <span v-if="stat === 'energia'">⚡ {{ val > 0 ? '+' : '' }}{{ val }} Energía</span>
                      <span v-else-if="stat === 'conocimiento'">🎓 {{ val > 0 ? '+' : '' }}{{ val }} Conocimiento</span>
                      <span v-else-if="stat === 'responsabilidad'">📚 {{ val > 0 ? '+' : '' }}{{ val }} Responsabilidad</span>
                      <span v-else-if="stat === 'reputacionNocturna'">🛡️ {{ val > 0 ? '+' : '' }}{{ val }} Reputación</span>
                      <span v-else-if="stat === 'sospechaIdentidad'">🕵️ {{ val > 0 ? '+' : '' }}{{ val }} Sospecha</span>
                      <span v-else-if="stat === 'diversion'">🎉 {{ val > 0 ? '+' : '' }}{{ val }} Diversión</span>
                      <span v-else>{{ stat }}: {{ val > 0 ? '+' : '' }}{{ val }}</span>
                    </span>
                  </template>
                  <span v-else class="val-placeholder">Pasa el cursor por una respuesta para analizar su impacto...</span>
                </div>
              </div>

              <!-- Listado de Respuestas Premium -->
              <div class="opciones-evento-lista">
                <button 
                  v-for="(opc, idx) in eventoActivo.opciones" 
                  :key="idx" 
                  class="btn-opcion-evento-tactico"
                  @mouseenter="opcionHovered = opc"
                  @mouseleave="opcionHovered = null"
                  @click="seleccionarOpcionEvento(opc)"
                >
                  <span class="opcion-icono-bocadillo">💬</span>
                  <span class="opcion-texto-val">{{ opc.texto }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Modal de Consecuencia de Sospecha -->
      <transition name="modal-fade">
        <div v-if="consecuenciaTexto" class="modal-overlay" role="dialog" aria-modal="true">
          <div class="modal-wrapper" @click.self="() => {}">
            <div class="modal-card-suspicion consequence animate-fade-in-scale">
              <!-- Ambientación Holográfica -->
              <div class="hologram-grid-overlay"></div>
              <div class="hologram-scanline"></div>

              <header class="suspicion-header text-center">
                <div class="incidente-insignia blue">📢</div>
                <h2 class="incidente-titulo blue">INFORME DE RESOLUCIÓN</h2>
                <p class="incidente-subtitulo">Resultados del incidente de sospecha</p>
              </header>

              <div class="informe-narrativo-bloque">
                <div class="narrativa-separador-linea"></div>
                <p class="texto-evento-consecuencia">{{ consecuenciaTexto }}</p>
                <div class="narrativa-separador-linea"></div>
              </div>

              <button class="btn btn-hero btn-lg" @click="cerrarConsecuencia">
                Entendido
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 ---
// --- Importaciones de Vue 3 ---
import { ref, computed, onMounted } from 'vue'
import { EVENTOS_SOSPECHA } from '../../data/eventosSospecha.js'
import { NOTICIAS_CAMPUS } from '../../data/noticiasCampus.js'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Estado global del juego ---
const { navegarA, estadisticasHeroe, guardarProgreso, PANTALLAS, exposicionRevelada, marcasExposicion } = useEstadoJuego()
const { reproducirEfecto, reproducirMusica } = useAudio()

// --- Estado local ---
const seleccionadas = ref([])
const eventoActivo = ref(null)
const consecuenciaTexto = ref('')
const noticiaDelDia = ref(null)
const opcionHovered = ref(null)

onMounted(() => {
  reproducirMusica('campus')
  
  // Escoger noticia aleatoria del campus
  const idxNews = Math.floor(Math.random() * NOTICIAS_CAMPUS.length)
  noticiaDelDia.value = NOTICIAS_CAMPUS[idxNews]

  // Eventos de sospecha (si sospecha >= 30 y no se mostró hoy)
  const { sospechaIdentidad } = estadisticasHeroe
  const { eventoSospechaMostradoHoy } = useEstadoJuego()
  if (sospechaIdentidad >= 30 && !eventoSospechaMostradoHoy.value) {
    const idxSus = Math.floor(Math.random() * EVENTOS_SOSPECHA.length)
    eventoActivo.value = EVENTOS_SOSPECHA[idxSus]
  }
})


// --- Emits ---
const emit = defineEmits(['completar', 'salir'])

// --- Recomendaciones para hoy basadas en estadísticas ---
const recomendaciones = computed(() => {
  const recs = []
  if (estadisticasHeroe.energia < 40) {
    recs.push({
      icono: '⚡',
      texto: 'Tu energía está baja. Te sugerimos Descansar o realizar Entrenamiento Deportivo para recuperar fuerzas.',
      color: 'recomendar-energia'
    })
  }
  if (estadisticasHeroe.responsabilidad < 50) {
    recs.push({
      icono: '🎓',
      texto: 'Tu responsabilidad académica está descuidada. Te recomendamos Estudiar o Participar en actividades de la U.',
      color: 'recomendar-responsabilidad'
    })
  }
  if (estadisticasHeroe.sospechaIdentidad > 50) {
    recs.push({
      icono: '🔍',
      texto: '¡Sospecha alta! Los rumores aumentan en la facultad. Te recomendamos Estudiar o Participar en actividades de la U para disipar la sospecha.',
      color: 'recomendar-sospecha'
    })
  }
  if (estadisticasHeroe.conocimiento < 50) {
    recs.push({
      icono: '📚',
      texto: 'Tu nivel de conocimiento sobre Costa Rica es bajo. Te sugerimos Estudiar o Investigar destinos turísticos.',
      color: 'recomendar-conocimiento'
    })
  }
  return recs
})

// --- Actividades disponibles ---
const actividades = [
  {
    id: 'estudiar',
    emoji: '📚',
    nombre: 'Estudiar en la Biblioteca',
    descripcion: 'Repasa tus apuntes para la clase de mañana.',
    modificaciones: { conocimiento: 10, sospechaIdentidad: -5 }
  },
  {
    id: 'entrenar',
    emoji: '🏋️',
    nombre: 'Entrenamiento Deportivo',
    descripcion: 'Ejercítate para rendir mejor físicamente.',
    modificaciones: { energia: 10 }
  },
  {
    id: 'amigos',
    emoji: '👥',
    nombre: 'Salir con Amigos',
    descripcion: 'Socializa en las zonas verdes del campus.',
    modificaciones: { reputacionNocturna: 10 }
  },
  {
    id: 'descansar',
    emoji: '😴',
    nombre: 'Tomar una Siesta',
    descripcion: 'Descansa para recuperar vitalidad.',
    modificaciones: { energia: 5, responsabilidad: 5 }
  },
  {
    id: 'destinos',
    emoji: '🌎',
    nombre: 'Investigar Destinos Turísticos',
    descripcion: 'Aprende curiosidades geográficas del país.',
    modificaciones: { conocimiento: 5, reputacionNocturna: 5 }
  },
  {
    id: 'participar',
    emoji: '🤝',
    nombre: 'Participar en Actividades de la U',
    descripcion: 'Únete a comités universitarios visibles.',
    modificaciones: { responsabilidad: 5, reputacionNocturna: 5, sospechaIdentidad: -10 }
  }
]

// --- Métodos de Sospecha e Interacción ---
function seleccionarOpcionEvento(opcion) {
  reproducirEfecto('boton')
  consecuenciaTexto.value = opcion.consecuencia
  
  // Aplicar consecuencias en estadísticas
  if (opcion.modificaciones) {
    Object.keys(opcion.modificaciones).forEach(key => {
      const val = opcion.modificaciones[key]
      estadisticasHeroe[key] = Math.min(100, Math.max(0, estadisticasHeroe[key] + val))
    })
  }
}

function cerrarConsecuencia() {
  reproducirEfecto('click')
  const { eventoSospechaMostradoHoy } = useEstadoJuego()
  eventoSospechaMostradoHoy.value = true
  eventoActivo.value = null
  consecuenciaTexto.value = ''
  guardarProgreso()
}

function etiquetaSospecha(val) {
  if (val <= 25) return 'Identidad segura 🟢'
  if (val <= 50) return 'Rumores 🟡'
  if (val <= 75) return 'Sospecha alta 🟠'
  return 'Investigación activa 🔴'
}

function claseSospecha(val) {
  if (val <= 25) return 'segura'
  if (val <= 50) return 'rumores'
  if (val <= 75) return 'alta'
  return 'investigacion'
}

function emojiStat(stat) {
  if (stat === 'energia') return '⚡'
  if (stat === 'conocimiento') return '📚'
  if (stat === 'responsabilidad') return '🎓'
  if (stat === 'reputacionNocturna') return '🤝'
  if (stat === 'sospechaIdentidad') return '🔍'
  return '⭐'
}

function seleccionarActividad(act) {
  reproducirEfecto('boton')
  if (seleccionadas.value.includes(act.id)) {
    seleccionadas.value = seleccionadas.value.filter(id => id !== act.id)
  } else if (seleccionadas.value.length < 2) {
    seleccionadas.value.push(act.id)
  }
}

function confirmarSeleccion() {
  if (seleccionadas.value.length !== 2) return
  
  reproducirEfecto('subirNivel')

  // Aplicar cambios en las estadísticas globales
  seleccionadas.value.forEach(id => {
    const act = actividades.find(a => a.id === id)
    if (act && act.modificaciones) {
      Object.keys(act.modificaciones).forEach(key => {
        const val = act.modificaciones[key]
        let temp = estadisticasHeroe[key] + val
        // Limitar entre 0 y 100
        estadisticasHeroe[key] = Math.min(100, Math.max(0, temp))
      })
    }
  })

  guardarProgreso()
  emit('completar')
}

function alCancelar() {
  reproducirEfecto('click')
  emit('salir')
}
</script>

<style scoped>
.pantalla-vida-u {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  position: relative;
  background: radial-gradient(circle at 50% 30%, rgba(18, 24, 48, 0.95) 0%, rgba(5, 7, 18, 0.98) 100%);
  overflow: hidden;
}

.pantalla-vida-u::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(184, 79, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184, 79, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.pantalla-vida-u::after {
  content: '';
  position: absolute;
  top: -10%;
  left: 30%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(0, 200, 255, 0.08) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
  animation: background-glow-drift 12s infinite alternate ease-in-out;
}

@keyframes background-glow-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(100px, 50px) scale(1.2); }
}

.contenedor-vida-u {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  background: rgba(6, 10, 24, 0.82);
  border: 1px solid rgba(184, 79, 255, 0.45);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: 0 0 25px rgba(184, 79, 255, 0.15), inset 0 0 15px rgba(184, 79, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.contenedor-vida-u:hover {
  border-color: rgba(0, 200, 255, 0.65);
  box-shadow: 0 0 35px rgba(0, 200, 255, 0.25), inset 0 0 20px rgba(0, 200, 255, 0.08);
}

/* --- Reloj context --- */
.contexto-reloj {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(184, 79, 255, 0.1);
  border: 1px solid rgba(184, 79, 255, 0.3);
  padding: 4px var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
}

.emoji-reloj { font-size: 1.1rem; }
.hora-reloj {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--color-neon-purple);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
}

.titulo-vida-u {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin: 0;
}

.subtitulo-vida-u {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0;
  max-width: 600px;
  margin-inline: auto;
  line-height: 1.5;
}

/* --- Grid de actividades --- */
.cuadricula-actividades {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-4);
}

.tarjeta-actividad {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  outline: none;
}

.tarjeta-actividad:hover:not(.disabled) {
  border-color: var(--color-neon-purple);
  background: rgba(184, 79, 255, 0.05);
  transform: translateY(-2px);
}

.tarjeta-actividad.selected {
  border-color: var(--color-neon-purple);
  background: rgba(184, 79, 255, 0.12);
  box-shadow: 0 0 15px var(--color-neon-purple-glow);
}

.tarjeta-actividad.selected::before {
  content: '✓';
  position: absolute;
  top: var(--space-3);
  right: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-neon-purple);
  font-weight: var(--font-bold);
}

.tarjeta-actividad.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.act-emoji {
  font-size: 2rem;
  line-height: 1;
}

.act-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.act-nombre {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}

.act-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* --- Badges de stats --- */
.act-stats-badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: auto;
}

.stat-badge-mod {
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

.stat-badge-mod.sube {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  color: var(--color-neon-green);
}

.stat-badge-mod.baja {
  background: rgba(0, 200, 255, 0.08);
  border: 1px solid rgba(0, 200, 255, 0.25);
  color: var(--color-neon-blue);
}

/* --- Footer --- */
.footer-vida-u {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.seleccion-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.texto-contador {
  font-family: var(--font-display);
  font-size: var(--text-base);
  color: var(--color-neon-purple);
  text-shadow: 0 0 8px var(--color-neon-purple-glow);
}

.acciones-vida-u {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 640px) {
  .contenedor-vida-u {
    padding: var(--space-6) var(--space-4);
  }
  .cuadricula-actividades {
    grid-template-columns: 1fr;
  }
  .footer-vida-u {
    flex-direction: column;
    align-items: stretch;
  }
  .acciones-vida-u {
    flex-direction: column;
  }
  .acciones-vida-u .btn {
    width: 100%;
  }
}

/* --- Bloque de Recomendaciones --- */
.panel-recomendaciones {
  background: rgba(255, 255, 255, 0.015);
  border: 1px dashed rgba(184, 79, 255, 0.35);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-1);
  text-align: left;
}

.titulo-recomendaciones {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-neon-purple);
  margin: 0 0 var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-bold);
  text-shadow: 0 0 6px var(--color-neon-purple-glow);
}

.lista-recomendaciones {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.recomendar-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--text-xs);
  line-height: 1.4;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border-left: 3px solid transparent;
}

.recomendar-energia {
  background: rgba(255, 215, 0, 0.04);
  border-left-color: var(--color-neon-gold);
  color: var(--color-text-secondary);
}

.recomendar-responsabilidad {
  background: rgba(0, 255, 136, 0.04);
  border-left-color: var(--color-neon-green);
  color: var(--color-text-secondary);
}

.recomendar-sospecha {
  background: rgba(255, 70, 70, 0.05);
  border-left-color: #ff4646;
  color: var(--color-text-secondary);
}

.recomendar-conocimiento {
  background: rgba(0, 200, 255, 0.04);
  border-left-color: var(--color-neon-blue);
  color: var(--color-text-secondary);
}

.rec-icono {
  font-size: 1rem;
  line-height: 1;
}

.rec-texto {
  flex: 1;
}

/* --- Panel de Información de la U (Noticias & Sospecha) --- */
.panel-informacion-u {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.widget-noticias, .widget-sospecha {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.widget-noticias {
  border-left: 3px solid var(--color-neon-blue);
  background: linear-gradient(145deg, rgba(0, 200, 255, 0.02), transparent);
}

.widget-sospecha {
  border-left: 3px solid var(--color-neon-purple);
  background: linear-gradient(145deg, rgba(184, 79, 255, 0.02), transparent);
}

.titulo-widget {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 2px;
  font-weight: var(--font-bold);
}

.noticia-titulo {
  font-size: var(--text-sm);
  color: var(--color-neon-blue);
  margin: 0;
}

.noticia-texto {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
  margin: 0;
}

.rango-sospecha-contenedor {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: 4px;
}

.badge-rango-sospecha {
  font-size: 0.75rem;
  font-weight: var(--font-bold);
  padding: 3px var(--space-3);
  border-radius: var(--radius-full);
  align-self: flex-start;
  text-transform: uppercase;
}

.badge-rango-sospecha.segura {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: var(--color-neon-green);
}

.badge-rango-sospecha.rumores {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: var(--color-neon-gold);
}

.badge-rango-sospecha.alta {
  background: rgba(255, 140, 0, 0.1);
  border: 1px solid rgba(255, 140, 0, 0.3);
  color: #ff8c00;
}

.badge-rango-sospecha.investigacion {
  background: rgba(255, 70, 70, 0.1);
  border: 1px solid rgba(255, 70, 70, 0.3);
  color: #ff4646;
}

.barra-sospecha-diurna {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.barra-sospecha-diurna-relleno {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.barra-sospecha-diurna-relleno.segura { background: var(--color-neon-green); }
.barra-sospecha-diurna-relleno.rumores { background: var(--color-neon-gold); }
.barra-sospecha-diurna-relleno.alta { background: #ff8c00; }
.barra-sospecha-diurna-relleno.investigacion { background: #ff4646; }

.porcentaje-sospecha-texto {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* --- Modales de Evento de Sospecha --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(3, 8, 20, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  box-shadow: inset 0 0 100px rgba(255, 157, 0, 0.15);
  animation: screen-alert-pulse 4s infinite alternate ease-in-out;
}

@keyframes screen-alert-pulse {
  0% { box-shadow: inset 0 0 80px rgba(255, 157, 0, 0.15); }
  100% { box-shadow: inset 0 0 120px rgba(255, 157, 0, 0.25); }
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tarjeta Narrativa Premium */
.modal-card-suspicion {
  width: 100%;
  max-width: 550px;
  background: radial-gradient(circle at top, #0f162c 0%, #060913 100%);
  border: 1.5px solid rgba(0, 200, 255, 0.45);
  box-shadow: 0 0 30px rgba(184, 79, 255, 0.25), inset 0 0 20px rgba(0, 200, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  color: var(--color-text-primary);
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
}

.modal-card-suspicion.consequence {
  border-color: rgba(184, 79, 255, 0.45);
  box-shadow: 0 0 30px rgba(0, 200, 255, 0.25), inset 0 0 20px rgba(184, 79, 255, 0.1);
}

/* Ambientación Holográfica */
.hologram-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px);
  background-size: 25px 25px;
  mask-image: radial-gradient(circle, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, black 60%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.hologram-scanline {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent);
  animation: hologram-scan 6s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes hologram-scan {
  0% { top: -5%; }
  100% { top: 105%; }
}

.hologram-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.h-part {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--color-neon-blue);
  border-radius: 50%;
  opacity: 0.25;
  box-shadow: 0 0 5px var(--color-neon-blue);
}

.hp1 { top: 25%; left: 10%; animation: float-h-part 15s infinite ease-in-out; }
.hp2 { top: 65%; left: 85%; animation: float-h-part 18s infinite ease-in-out -4s; }
.hp3 { top: 80%; left: 20%; animation: float-h-part 14s infinite ease-in-out -8s; }
.hp4 { top: 15%; left: 75%; animation: float-h-part 20s infinite ease-in-out -12s; }

@keyframes float-h-part {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
  50% { transform: translate(10px, -20px) scale(1.3); opacity: 0.45; }
}

/* Encabezado Heroico */
.suspicion-header {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.incidente-insignia {
  font-size: 2.8rem;
  line-height: 1;
  filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.6));
  animation: pulse-insignia 2s infinite ease-in-out;
  margin-bottom: var(--space-2);
}

.incidente-insignia.blue {
  filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.6));
}

@keyframes pulse-insignia {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.incidente-titulo {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 1.45rem;
  font-weight: 900;
  color: #ff9d00;
  text-shadow: 0 0 12px rgba(255, 157, 0, 0.5);
  margin: 0;
  letter-spacing: 0.08em;
}

.incidente-titulo.blue {
  color: var(--color-neon-blue);
  text-shadow: 0 0 12px var(--color-neon-blue-glow);
}

.incidente-subtitulo {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 4px 0 0;
}

.incidente-nivel-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.nivel-label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.badge-rango-sospecha-tactico {
  font-size: 0.68rem;
  font-weight: var(--font-bold);
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  border: 1px solid transparent;
}

.badge-rango-sospecha-tactico.segura {
  background: rgba(0, 255, 136, 0.06);
  border-color: rgba(0, 255, 136, 0.3);
  color: var(--color-neon-green);
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.2);
}

.badge-rango-sospecha-tactico.rumores {
  background: rgba(255, 215, 0, 0.06);
  border-color: rgba(255, 215, 0, 0.3);
  color: var(--color-neon-gold);
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.badge-rango-sospecha-tactico.alta {
  background: rgba(255, 140, 0, 0.06);
  border-color: rgba(255, 140, 0, 0.3);
  color: #ff8c00;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.2);
}

.badge-rango-sospecha-tactico.investigacion {
  background: rgba(255, 70, 70, 0.06);
  border-color: rgba(255, 70, 70, 0.3);
  color: #ff4646;
  box-shadow: 0 0 8px rgba(255, 70, 70, 0.2);
}

/* Tarjeta de Narrativa */
.informe-narrativo-bloque {
  position: relative;
  z-index: 2;
  background: rgba(10, 14, 26, 0.4);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.informe-narrativo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.hologram-ping {
  width: 6px;
  height: 6px;
  background: var(--color-neon-purple);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-neon-purple);
}

.informe-titulo {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: bold;
  color: var(--color-neon-purple);
  letter-spacing: 0.06em;
}

.narrativa-separador-linea {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184, 79, 255, 0.2), transparent);
  margin-block: var(--space-3);
}

.texto-evento {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: #e8f4f8;
  line-height: 1.6;
  margin: 0;
  text-align: left;
  font-style: italic;
}

.texto-evento-consecuencia {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: #e8f4f8;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

/* Zona de Impacto */
.zona-impacto-tactico {
  position: relative;
  z-index: 2;
  border: 1px dashed rgba(0, 240, 255, 0.2);
  background: rgba(0, 240, 255, 0.02);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  text-align: left;
}

.impacto-header {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--color-neon-blue);
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.impacto-badges-grid {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  min-height: 20px;
  align-items: center;
}

.val-placeholder {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  font-style: italic;
}

/* Listado de Respuestas */
.opciones-evento-lista {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-opcion-evento-tactico {
  background: rgba(10, 14, 26, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  text-align: left;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  outline: none;
}

.opcion-icono-bocadillo {
  font-size: 1rem;
  line-height: 1.2;
  flex-shrink: 0;
  opacity: 0.7;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.btn-opcion-evento-tactico:hover {
  border-color: var(--color-neon-blue);
  background: rgba(0, 240, 255, 0.1);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.35);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

.btn-opcion-evento-tactico:hover .opcion-icono-bocadillo {
  transform: scale(1.2) rotate(-5deg);
  opacity: 1;
}

.btn-opcion-evento-tactico:active {
  transform: translateY(1px);
}

@media (max-width: 640px) {
  .panel-informacion-u {
    grid-template-columns: 1fr;
  }
}

/* --- Ambient Particles --- */
.particles-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.particle-leaf {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(0, 200, 255, 0.25);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
  border-radius: 50%;
  animation: float-particle 10s infinite linear;
}

.particle-leaf:nth-child(even) {
  background: rgba(184, 79, 255, 0.25);
  box-shadow: 0 0 10px rgba(184, 79, 255, 0.5);
}

.particle-leaf:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; animation-duration: 8s; }
.particle-leaf:nth-child(2) { left: 85%; top: 15%; animation-delay: 2s; animation-duration: 12s; }
.particle-leaf:nth-child(3) { left: 25%; top: 70%; animation-delay: 1s; animation-duration: 9s; }
.particle-leaf:nth-child(4) { left: 70%; top: 65%; animation-delay: 3s; animation-duration: 11s; }
.particle-leaf:nth-child(5) { left: 45%; top: 85%; animation-delay: 4s; animation-duration: 10s; }
.particle-leaf:nth-child(6) { left: 50%; top: 10%; animation-delay: 1.5s; animation-duration: 13s; }
.particle-leaf:nth-child(7) { left: 90%; top: 80%; animation-delay: 5s; animation-duration: 7s; }
.particle-leaf:nth-child(8) { left: 5%; top: 60%; animation-delay: 2.5s; animation-duration: 14s; }

@keyframes float-particle {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

/* --- Animaciones de Transición del Modal --- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card-suspicion {
  animation: modal-card-in 0.35s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}
.modal-fade-leave-active .modal-card-suspicion {
  animation: modal-card-out 0.3s ease forwards;
}

@keyframes modal-card-in {
  from { transform: translateY(-30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes modal-card-out {
  from { transform: translateY(0) scale(1); opacity: 1; }
  to { transform: translateY(15px) scale(0.97); opacity: 0; }
}
</style>
