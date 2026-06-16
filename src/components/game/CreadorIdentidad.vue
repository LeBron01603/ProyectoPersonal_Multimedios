<template>
  
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

        <!-- Paso 1: Nombre de estudiante (Civil) -->
        <div class="grupo-formulario animate-slide-left delay-100">
          <label class="etiqueta-formulario" for="nombre-civil">
            👤 Nombre de estudiante
          </label>
          <input
            id="nombre-civil"
            v-model="formulario.nombre"
            type="text"
            class="input-formulario"
            placeholder="ej: Emmanuel, Valeria..."
            maxlength="30"
            autocomplete="off"
            :class="{ 'error-input': errores.nombre }"
          />
          <span v-if="errores.nombre" class="mensaje-error" role="alert">{{ errores.nombre }}</span>
        </div>

        <!-- Paso 1.5: Edad (Nuevo) -->
        <div class="grupo-formulario animate-slide-left delay-150">
          <label class="etiqueta-formulario" for="edad-civil">
            🎂 Edad
          </label>
          <input
            id="edad-civil"
            v-model="formulario.edad"
            type="number"
            class="input-formulario"
            placeholder="Rango 17 a 45 años"
            min="17"
            max="45"
            autocomplete="off"
            :class="{ 'error-input': errores.edad }"
          />
          <span v-if="errores.edad" class="mensaje-error" role="alert">{{ errores.edad }}</span>
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

        <!-- Paso 2.5: Sede Universitaria -->
        <div class="grupo-formulario animate-slide-left delay-250" v-if="formulario.universidad" :class="{ 'selector-activo': selectorAbierto === 'sede' }">
          <label class="etiqueta-formulario">
            📍 Sede Universitaria
          </label>
          <SelectorPersonalizado
            v-model="formulario.sedeUniversitaria"
            :opciones="sedesDisponibles"
            placeholder="Selecciona tu sede..."
            :esta-abierto="selectorAbierto === 'sede'"
            @abrir="selectorAbierto = 'sede'"
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

        <!-- Paso 6: Alias Heroico (Nuevo) -->
        <div class="grupo-formulario animate-slide-right delay-300" :class="{ 'selector-activo': selectorAbierto === 'aliasHeroe' }">
          <label class="etiqueta-formulario">
            🦸‍♂️ Alias Heroico
          </label>
          <SelectorPersonalizado
            v-model="formulario.aliasHeroe"
            :opciones="[
              { value: 'Centinela Tico', label: '🛡️ Centinela Tico' },
              { value: 'Guardián Nocturno', label: '⚔️ Guardián Nocturno' },
              { value: 'Sombra Universitaria', label: '👥 Sombra Universitaria' },
              { value: 'Viajero de la Noche', label: '🌙 Viajero de la Noche' },
              { value: 'Otro', label: '✨ Personalizar alias...' }
            ]"
            placeholder="Selecciona tu alias..."
            :esta-abierto="selectorAbierto === 'aliasHeroe'"
            @abrir="selectorAbierto = 'aliasHeroe'"
            @cerrar="selectorAbierto = null"
          />
          <span v-if="errores.aliasHeroe" class="mensaje-error" role="alert">{{ errores.aliasHeroe }}</span>
          
          <input
            v-if="formulario.aliasHeroe === 'Otro'"
            id="alias-personalizado"
            v-model="formulario.aliasPersonalizado"
            type="text"
            class="input-formulario"
            placeholder="Ingresa tu alias personalizado..."
            maxlength="20"
            style="margin-top: 10px;"
          />
        </div>

        <!-- Preview de identidad -->
        <div v-if="formularioParcialmenteLleno" class="preview-identidad animate-fade-in">
          <p class="etiqueta-preview">Vista previa de Identidades:</p>
          <div class="preview-columnas">
            <!-- Columna Civil -->
            <div class="columna-preview">
              <span class="preview-header-sub">🎓 IDENTIDAD CIVIL</span>
              <p class="preview-item"><strong>Nombre:</strong> {{ formulario.nombre || '—' }}</p>
              <p class="preview-item"><strong>Edad:</strong> {{ formulario.edad || '—' }}</p>
              <p class="preview-item"><strong>Universidad:</strong> {{ formulario.universidad || '—' }}</p>
              <p class="preview-item"><strong>Sede:</strong> {{ nombreSedeLegible(formulario.universidad, formulario.sedeUniversitaria) }}</p>
              <p class="preview-item"><strong>Carrera:</strong> {{ formulario.carrera || '—' }}</p>
            </div>
            <!-- Columna Héroe -->
            <div class="columna-preview">
              <span class="preview-header-sub">🦸 ALIAS HEROICO</span>
              <p class="preview-item"><strong>Nombre héroe:</strong> {{ formulario.aliasHeroe === 'Otro' ? (formulario.aliasPersonalizado || 'Otro alias') : (formulario.aliasHeroe || '—') }}</p>
              <p class="preview-item"><strong>Nivel:</strong> 1 (Novato)</p>
              <p class="preview-item"><strong>Reputación:</strong> 50</p>
            </div>
          </div>
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
const selectorAbierto = ref(null) // Puede ser 'universidad', 'sede', 'carrera', 'deporte' o null

// --- Estado del formulario (reactive para objeto) ---
const formulario = reactive({
  nombre:             '',
  edad:               '',
  universidad:        '',
  sedeUniversitaria:  '',
  carrera:            '',
  deporte:            '',
  personalidad:       '',
  aliasHeroe:         '',
  aliasPersonalizado: ''
})

// --- Errores de validación (reactive) ---
const errores = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: ''
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

import { RELACION_U_CARRERAS, RELACION_U_SEDES } from '../../data/carrerasUniversitarias.js'
import { watch } from 'vue'

const sedesDisponibles = computed(() => {
  if (!formulario.universidad) return []
  return RELACION_U_SEDES[formulario.universidad] || []
})

const carrerasDisponibles = computed(() => {
  if (!formulario.universidad) return []
  return RELACION_U_CARRERAS[formulario.universidad] || []
})

watch(() => formulario.universidad, (nuevaU) => {
  if (!nuevaU) {
    formulario.carrera = ''
    formulario.sedeUniversitaria = ''
    return
  }
  const listaValidaCarreras = RELACION_U_CARRERAS[nuevaU] || []
  const existeCarrera = listaValidaCarreras.some(c => c.value === formulario.carrera)
  if (!existeCarrera) {
    formulario.carrera = ''
  }

  const listaValidaSedes = RELACION_U_SEDES[nuevaU] || []
  const existeSede = listaValidaSedes.some(s => s.value === formulario.sedeUniversitaria)
  if (!existeSede) {
    formulario.sedeUniversitaria = ''
  }
})

watch(() => formulario.personalidad, (nuevaP) => {
  if (nuevaP) {
    reproducirEfecto('boton')
  }
})

const deportes = [
  { value: 'Futbol',    label: '⚽ Fútbol' },
  { value: 'Natacion',  label: '🏊 Natación' },
  { value: 'Ciclismo',  label: '🚴 Ciclismo' },
  { value: 'Gimnasio',  label: '💪 Gimnasio / Pesas' },
  { value: 'Voleibol',  label: '🏐 Voleibol' },
  { value: 'Boxeo',     label: '🥊 Boxeo / Artes Marciales' },
  { value: 'Basketball',label: '🏀 Basketball / Baloncesto' },
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
const formularioValido = computed(() => {
  const edadNum = Number(formulario.edad)
  const edadValida = !isNaN(edadNum) && edadNum >= 17 && edadNum <= 45
  
  const aliasValido = formulario.aliasHeroe !== '' && 
    (formulario.aliasHeroe !== 'Otro' || formulario.aliasPersonalizado.trim().length >= 3)

  return formulario.nombre.trim().length >= 2 &&
    edadValida &&
    formulario.universidad !== '' &&
    formulario.sedeUniversitaria !== '' &&
    formulario.carrera !== '' &&
    formulario.personalidad !== '' &&
    aliasValido
})

function nombreSedeLegible(uni, value) {
  if (!uni || !value) return '—'
  const list = RELACION_U_SEDES[uni] || []
  const found = list.find(s => s.value === value)
  return found ? found.label : value
}

const formularioParcialmenteLleno = computed(() =>
  formulario.nombre.trim() !== '' || formulario.edad !== '' || formulario.universidad !== ''
)

const personalidadActual = computed(() =>
  personalidades.find(p => p.value === formulario.personalidad)
)

// --- Función de validación ---
function validar() {
  errores.nombre = ''
  errores.edad = ''
  errores.aliasHeroe = ''

  let esValido = true

  if (formulario.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
    esValido = false
  }

  const edadNum = Number(formulario.edad)
  if (formulario.edad === '' || isNaN(edadNum)) {
    errores.edad = 'La edad debe ser un número válido.'
    esValido = false
  } else if (edadNum < 17 || edadNum > 45) {
    errores.edad = 'La edad debe estar en el rango permitido de 17 a 45 años.'
    esValido = false
  }

  if (formulario.aliasHeroe === '') {
    errores.aliasHeroe = 'Debes seleccionar un alias heroico.'
    esValido = false
  } else if (formulario.aliasHeroe === 'Otro' && formulario.aliasPersonalizado.trim().length < 3) {
    errores.aliasHeroe = 'El alias personalizado debe tener al menos 3 caracteres.'
    esValido = false
  }

  return esValido
}

// --- Confirmar identidad: emitir datos al padre ---
function alConfirmar() {
  if (!validar() || !formularioValido.value) return
  reproducirEfecto('subirNivel')
  
  const aliasFinal = formulario.aliasHeroe === 'Otro' ? formulario.aliasPersonalizado.trim() : formulario.aliasHeroe
  
  emit('confirmar', {
    nombre: formulario.nombre.trim(),
    edad: Number(formulario.edad),
    universidad: formulario.universidad,
    sedeUniversitaria: formulario.sedeUniversitaria,
    carrera: formulario.carrera,
    deporte: formulario.deporte,
    personalidad: formulario.personalidad,
    aliasHeroe: aliasFinal
  })
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
  background: rgba(0, 200, 255, 0.04);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  text-align: left;
}

.etiqueta-preview {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 var(--space-4);
  text-align: center;
  font-weight: var(--font-bold);
}

.preview-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.columna-preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.01);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.03);
}

.preview-header-sub {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
  padding-bottom: var(--space-1);
  margin-bottom: var(--space-2);
}

.preview-item {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0;
}
.preview-item strong {
  color: var(--color-text-primary);
}

@media (max-width: 480px) {
  .preview-columnas {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
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
