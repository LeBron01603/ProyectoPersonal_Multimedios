<template>
  <!-- PantallaVidaUniversitaria: actividades civiles diurnas del héroe -->
  <section class="pantalla-vida-u" aria-label="Pantalla de actividades universitarias">
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
              <header class="suspicion-header text-center">
                <span class="emoji-alerta animate-pulse" aria-hidden="true">🕵️‍♂️</span>
                <h2 id="suspicion-event-title" class="texto-neon-orange">Evento de Sospecha</h2>
                <p class="advertencia-sus-rango">
                  Nivel de Sospecha: 
                  <span class="badge-rango-sospecha" :class="claseSospecha(estadisticasHeroe.sospechaIdentidad)">
                    {{ etiquetaSospecha(estadisticasHeroe.sospechaIdentidad) }}
                  </span>
                </p>
              </header>
              
              <p class="texto-evento">{{ eventoActivo.texto }}</p>
              
              <div class="opciones-evento-lista">
                <button 
                  v-for="(opc, idx) in eventoActivo.opciones" 
                  :key="idx" 
                  class="btn btn-outline btn-opcion-evento"
                  @click="seleccionarOpcionEvento(opc)"
                >
                  {{ opc.texto }}
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
              <header class="suspicion-header text-center">
                <span class="emoji-alerta" aria-hidden="true">📢</span>
                <h2 class="texto-neon-blue">Consecuencias</h2>
              </header>
              
              <p class="texto-evento">{{ consecuenciaTexto }}</p>
              
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
const { navegarA, estadisticasHeroe, guardarProgreso, PANTALLAS } = useEstadoJuego()
const { reproducirEfecto, reproducirMusica } = useAudio()

// --- Estado local ---
const seleccionadas = ref([])
const eventoActivo = ref(null)
const consecuenciaTexto = ref('')
const noticiaDelDia = ref(null)

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
  navegarA(PANTALLAS.MAPA)
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
}

.contenedor-vida-u {
  width: 100%;
  max-width: 800px;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
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
  background: rgba(4, 5, 12, 0.95);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card-suspicion {
  width: 100%;
  max-width: 520px;
  background: var(--gradient-card);
  border: 1px solid rgba(255, 140, 0, 0.25);
  box-shadow: var(--shadow-card), 0 0 25px rgba(255, 140, 0, 0.15);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  color: var(--color-text-primary);
}

.modal-card-suspicion.consequence {
  border-color: rgba(0, 200, 255, 0.25);
  box-shadow: var(--shadow-card), 0 0 25px rgba(0, 200, 255, 0.15);
}

.emoji-alerta {
  font-size: 3.5rem;
  line-height: 1;
}

.texto-neon-orange {
  color: #ff9d00;
  text-shadow: 0 0 10px rgba(255, 157, 0, 0.4);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  margin: 0;
}

.advertencia-sus-rango {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.texto-evento {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

.opciones-evento-lista {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-opcion-evento {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
  line-height: 1.4;
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-opcion-evento:hover {
  border-color: #ff9d00;
  background: rgba(255, 157, 0, 0.05);
}

@media (max-width: 640px) {
  .panel-informacion-u {
    grid-template-columns: 1fr;
  }
}
</style>
