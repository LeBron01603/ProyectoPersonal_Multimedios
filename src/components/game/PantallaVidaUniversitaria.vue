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

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 ---
import { ref, computed } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Estado global del juego ---
const { navegarA, estadisticasHeroe, PANTALLAS } = useEstadoJuego()
const { reproducirEfecto } = useAudio()

// --- Emits ---
const emit = defineEmits(['completar', 'salir'])

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

// --- Estado local ---
const seleccionadas = ref([])

function emojiStat(stat) {
  if (stat === 'energia') return '⚡'
  if (stat === 'conocimiento') return '📚'
  if (stat === 'responsabilidad') return '🎓'
  if (stat === 'reputacionNocturna') return '🤝'
  if (stat === 'sospechaIdentidad') return '🔍'
  return '⭐'
}

function seleccionarActividad(act) {
  reproducirEfecto('click')
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
</style>
