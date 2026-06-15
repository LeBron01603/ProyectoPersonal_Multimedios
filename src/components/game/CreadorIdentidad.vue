<template>
  <!-- CreadorIdentidad: formulario para crear la identidad del héroe universitario -->
  <section class="pantalla-identidad" aria-label="Creador de identidad del héroe">
    <div class="contenedor-identidad animate-fade-in-scale">

      <!-- Header de la pantalla -->
      <header class="encabezado-identidad">
        <span class="icono-identidad animate-float" aria-hidden="true">🦸‍♂️</span>
        <h2 class="titulo-identidad">Crea tu identidad héroe</h2>
        <p class="subtitulo-identidad">
          Tu identidad universitaria determina tus habilidades especiales en cada provincia.
        </p>
      </header>

      <!-- Formulario de identidad -->
      <form class="formulario-identidad" @submit.prevent="alConfirmar" novalidate>

        <!-- Paso 1: Nombre del héroe -->
        <div class="grupo-formulario animate-slide-left delay-100">
          <label class="etiqueta-formulario" for="nombre-heroe">
            ⚡ Nombre de héroe
          </label>
          <input
            id="nombre-heroe"
            v-model="formulario.nombre"
            type="text"
            class="input-formulario"
            placeholder="ej: NocturnoCR, ElBicho404..."
            maxlength="30"
            autocomplete="off"
            :class="{ 'error-input': errores.nombre }"
          />
          <span v-if="errores.nombre" class="mensaje-error" role="alert">{{ errores.nombre }}</span>
        </div>

        <!-- Paso 2: Universidad -->
        <div class="grupo-formulario animate-slide-left delay-200" :class="{ 'selector-activo': selectorAbierto === 'universidad' }">
          <label class="etiqueta-formulario">
            🎓 Universidad
          </label>
          <SelectorPersonalizado
            v-model="formulario.universidad"
            :opciones="universidades"
            placeholder="Selecciona tu U..."
            :esta-abierto="selectorAbierto === 'universidad'"
            @abrir="selectorAbierto = 'universidad'"
            @cerrar="selectorAbierto = null"
          />
        </div>

        <!-- Paso 3: Carrera -->
        <div class="grupo-formulario animate-slide-left delay-300" :class="{ 'selector-activo': selectorAbierto === 'carrera' }">
          <label class="etiqueta-formulario">
            📚 Carrera
          </label>
          <SelectorPersonalizado
            v-model="formulario.carrera"
            :opciones="carrerasDisponibles"
            placeholder="Selecciona tu carrera..."
            :esta-abierto="selectorAbierto === 'carrera'"
            @abrir="selectorAbierto = 'carrera'"
            @cerrar="selectorAbierto = null"
          />
        </div>

        <!-- Paso 4: Deporte o actividad física -->
        <div class="grupo-formulario animate-slide-right delay-100" :class="{ 'selector-activo': selectorAbierto === 'deporte' }">
          <label class="etiqueta-formulario">
            🏃 Actividad física favorita
          </label>
          <SelectorPersonalizado
            v-model="formulario.deporte"
            :opciones="deportes"
            placeholder="Selecciona una actividad..."
            :esta-abierto="selectorAbierto === 'deporte'"
            @abrir="selectorAbierto = 'deporte'"
            @cerrar="selectorAbierto = null"
          />
        </div>

        <!-- Paso 5: Estilo inicial del héroe -->
        <div class="grupo-formulario animate-slide-right delay-200">
          <label class="etiqueta-formulario">🧠 Estilo inicial del héroe</label>
          
          <!-- Mensaje explicativo sobre la evolución del héroe -->
          <div class="alerta-evolucion" role="note">
            <span class="alerta-evolucion-icono" aria-hidden="true">💡</span>
            <p class="alerta-evolucion-texto">
              Este estilo representa tu punto de partida. Tus decisiones durante la aventura definirán el tipo de héroe en el que te convertirás.
            </p>
          </div>

          <!-- Selección visual con tarjetas de personalidad -->
          <div class="cuadricula-personalidad" role="radiogroup" aria-label="Estilos iniciales de héroe">
            <label
              v-for="p in personalidades"
              :key="p.value"
              class="tarjeta-personalidad"
              :class="{ selected: formulario.personalidad === p.value }"
              :aria-checked="formulario.personalidad === p.value"
            >
              <input
                type="radio"
                :value="p.value"
                v-model="formulario.personalidad"
                class="sr-only"
                :name="'personalidad'"
              />
              <span class="emoji-personalidad" aria-hidden="true">{{ p.emoji }}</span>
              <span class="nombre-personalidad">{{ p.label }}</span>
              <span class="bono-personalidad">{{ p.bonoTexto }}</span>
              <span class="desc-personalidad">{{ p.description }}</span>
            </label>
          </div>
        </div>

        <!-- Preview de identidad -->
        <div v-if="formularioParcialmenteLleno" class="preview-identidad animate-fade-in">
          <p class="etiqueta-preview">Vista previa de tu héroe:</p>
          <p class="nombre-preview">
            {{ formulario.nombre || 'Sin nombre' }}
            <span v-if="formulario.universidad" class="badge-preview">{{ formulario.universidad }}</span>
          </p>
          <p v-if="formulario.personalidad" class="personalidad-preview">
            {{ personalidadActual?.emoji }} Estilo inicial: {{ personalidadActual?.label }}
          </p>
        </div>

        <!-- Botones de acción -->
        <div class="acciones-formulario">
          <button
            type="button"
            class="btn btn-outline"
            @click="emit('volver')"
          >
            ← Volver
          </button>
          <button
            type="submit"
            class="btn btn-hero btn-lg"
            :disabled="!formularioValido"
            :class="{ 'btn-disabled': !formularioValido }"
            id="btn-confirmar-identidad"
          >
            🦸 Confirmar identidad
          </button>
        </div>

      </form>
    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, reactive, computed } from 'vue'

// --- Componentes hijos ---
import SelectorPersonalizado from './SelectorPersonalizado.vue'

// --- Composables ---
import { useAudio } from '../../composables/useAudio.js'

// --- Audio ---
const { reproducirEfecto } = useAudio()

// --- Emits: notifica al padre la acción a realizar ---
const emit = defineEmits(['confirmar', 'volver'])

// --- Estado para coordinar la apertura de selectores personalizados ---
const selectorAbierto = ref(null) // Puede ser 'universidad', 'carrera', 'deporte' o null

// --- Estado del formulario (reactive para objeto) ---
const formulario = reactive({
  nombre:       '',
  universidad:  '',
  carrera:      '',
  deporte:      '',
  personalidad: ''
})

// --- Errores de validación (reactive) ---
const errores = reactive({
  nombre: ''
})

// --- Datos de opciones ---
const universidades = [
  { value: 'UCR',      label: '🏛️ Universidad de Costa Rica (UCR)' },
  { value: 'TEC',      label: '⚙️ Instituto Tecnológico de C.R. (TEC)' },
  { value: 'UNA',      label: '🌿 Universidad Nacional (UNA)' },
  { value: 'UNED',     label: '📡 Universidad Estatal a Distancia (UNED)' },
  { value: 'CENFOTEC', label: '💻 Universidad CENFOTEC' },
  { value: 'ULACIT',   label: '🌐 ULACIT' },
  { value: 'ULATINA',  label: '🎨 Universidad Latina' },
  { value: 'Otra',     label: '🎓 Otra universidad' }
]

import { RELACION_U_CARRERAS } from '../../data/carrerasUniversitarias.js'
import { watch } from 'vue'

const carrerasDisponibles = computed(() => {
  if (!formulario.universidad) return []
  return RELACION_U_CARRERAS[formulario.universidad] || []
})

watch(() => formulario.universidad, (nuevaU) => {
  if (!nuevaU) {
    formulario.carrera = ''
    return
  }
  const listaValida = RELACION_U_CARRERAS[nuevaU] || []
  const existe = listaValida.some(c => c.value === formulario.carrera)
  if (!existe) {
    formulario.carrera = ''
  }
})

const deportes = [
  { value: 'Futbol',    label: '⚽ Fútbol' },
  { value: 'Natacion',  label: '🏊 Natación' },
  { value: 'Ciclismo',  label: '🚴 Ciclismo' },
  { value: 'Gimnasio',  label: '💪 Gimnasio / Pesas' },
  { value: 'Voleibol',  label: '🏐 Voleibol' },
  { value: 'Boxeo',     label: '🥊 Boxeo / Artes Marciales' },
  { value: 'Yoga',      label: '🧘 Yoga / Meditación' },
  { value: 'Correr',    label: '🏃 Correr / Running' },
  { value: 'Surf',      label: '🏄 Surf' },
  { value: 'Escalada',  label: '🧗 Escalada' },
  { value: 'Ninguna',   label: '😌 Solo estudio (también vale)' }
]

const personalidades = [
  {
    value:       'responsable',
    emoji:       '🎓',
    label:       'Responsable',
    bonoTexto:   '+20 Responsabilidad',
    description: 'Equilibrio total. Tareas antes que after.'
  },
  {
    value:       'aventurero',
    emoji:       '🗺️',
    label:       'Aventurero',
    bonoTexto:   '+20 Energía',
    description: 'Siempre listo para explorar algo nuevo.'
  },
  {
    value:       'equilibrado',
    emoji:       '⚖️',
    label:       'Fiestero equilibrado',
    bonoTexto:   '+10 Diversión, +10 Resp.',
    description: 'Sabe cuándo trabajar y cuándo disfrutar.'
  },
  {
    value:       'nocturno',
    emoji:       '🌙',
    label:       'Estudioso nocturno',
    bonoTexto:   '+20 Conocimiento',
    description: 'Más productivo cuando todos duermen.'
  }
]

// --- Computed: validaciones ---
const formularioValido = computed(() =>
  formulario.nombre.trim().length >= 2 &&
  formulario.universidad !== '' &&
  formulario.carrera !== '' &&
  formulario.personalidad !== ''
)

const formularioParcialmenteLleno = computed(() =>
  formulario.nombre.trim() !== '' || formulario.universidad !== ''
)

const personalidadActual = computed(() =>
  personalidades.find(p => p.value === formulario.personalidad)
)

// --- Función de validación ---
function validar() {
  errores.nombre = ''
  if (formulario.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
    return false
  }
  return true
}

// --- Confirmar identidad: emitir datos al padre ---
function alConfirmar() {
  if (!validar() || !formularioValido.value) return
  reproducirEfecto('subirNivel')
  emit('confirmar', { ...formulario })
}
</script>

<style scoped>
/* --- Contenedor principal --- */
.pantalla-identidad {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.contenedor-identidad {
  width: 100%;
  max-width: 700px;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  backdrop-filter: blur(14px);
}

/* --- Header --- */
.encabezado-identidad {
  text-align: center;
  margin-bottom: var(--space-8);
}

.icono-identidad {
  font-size: 3rem;
  display: inline-block;
  margin-bottom: var(--space-3);
}

.titulo-identidad {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--color-neon-purple);
  text-shadow: 0 0 15px var(--color-neon-purple-glow);
  margin-bottom: var(--space-2);
}

.subtitulo-identidad {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  max-width: 450px;
  margin-inline: auto;
}

/* --- Formulario --- */
.formulario-identidad {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.grupo-formulario {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: relative;
  z-index: 1;
}

.grupo-formulario.selector-activo {
  z-index: 1000 !important;
}

.input-formulario {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: rgba(17, 24, 39, 0.75);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--text-base);
  transition: all var(--transition-base);
}

.input-formulario:focus {
  outline: none;
  border-color: var(--color-neon-purple);
  box-shadow: 0 0 0 3px var(--color-neon-purple-glow);
  background: rgba(17, 24, 39, 0.85);
}

.error-input {
  border-color: #ff4646 !important;
  box-shadow: 0 0 0 3px rgba(255, 70, 70, 0.2) !important;
}

.mensaje-error {
  font-size: var(--text-xs);
  color: #ff6b6b;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* --- Alerta Evolución --- */
.alerta-evolucion {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  background: rgba(0, 200, 255, 0.08);
  border: 1px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-2);
}

.alerta-evolucion-icono {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alerta-evolucion-texto {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* --- Personalidad grid --- */
.cuadricula-personalidad {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.tarjeta-personalidad {
  position: relative;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  transition: all var(--transition-base);
}

.tarjeta-personalidad:hover {
  border-color: var(--color-neon-purple);
  background: rgba(184, 79, 255, 0.08);
  transform: translateY(-2px);
}

.tarjeta-personalidad.selected {
  border-color: var(--color-neon-purple);
  background: rgba(184, 79, 255, 0.15);
  box-shadow: 0 0 15px var(--color-neon-purple-glow);
}

.tarjeta-personalidad.selected::after {
  content: '✓';
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-neon-purple);
  font-weight: var(--font-bold);
}

.emoji-personalidad { font-size: 1.6rem; }

.nombre-personalidad {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.bono-personalidad {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-neon-green);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-block: 2px;
}

.desc-personalidad {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.3;
}

/* --- Preview --- */
.preview-identidad {
  background: rgba(0, 200, 255, 0.06);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.etiqueta-preview {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 var(--space-2);
}

.nombre-preview {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.badge-preview {
  font-size: var(--text-xs);
  background: rgba(0, 200, 255, 0.15);
  color: var(--color-neon-blue);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: var(--radius-full);
  padding: 2px var(--space-2);
}

.personalidad-preview {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: var(--space-2) 0 0;
}

/* --- Acciones --- */
.acciones-formulario {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
}

.btn-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .contenedor-identidad {
    padding: var(--space-5) var(--space-4);
  }
  .cuadricula-personalidad {
    grid-template-columns: 1fr;
  }
  .acciones-formulario {
    flex-direction: column-reverse;
  }
  .acciones-formulario .btn {
    width: 100%;
  }
}
</style>
