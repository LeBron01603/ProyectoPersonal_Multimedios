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
          <div class="perfil-nivel-info">
            <span class="badge-nivel-mapa">⭐ Nivel {{ nivelHeroe }}</span>
            <div class="xp-bar-mapa" title="Experiencia actual">
              <div class="xp-bar-fill" :style="{ width: porcentajeXPNivelActual + '%' }"></div>
              <span class="xp-bar-texto">{{ experienciaHeroe }} XP / {{ proximoNivelXP }} XP</span>
            </div>
          </div>
          <p class="subtitulo-mapa">
            Elige una provincia y comienza tu misión nocturna
          </p>
        </div>
      </div>

      <!-- Controles y perfil -->
      <div class="controles-perfil-mapa">
        <button class="btn btn-outline btn-sm btn-editar-perfil" @click="abrirEditarPerfil">
          ⚙️ Editar Perfil
        </button>
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
    </div>

    <!-- Progreso global -->
    <div class="progreso-mapa animate-fade-in delay-100">
      <div class="info-progreso">
        <span class="etiqueta-progreso">🗺️ Misiones completadas</span>
        <span class="valor-progreso">{{ misionesCompletadas.length }} / {{ provinciasProcesadas.length }}</span>
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

    <!-- Contenedor principal: Mapa y Detalle -->
    <div v-else class="contenido-mapa-grid">
      <!-- Grid de tarjetas de provincias -->
      <div class="cuadricula-provincias">
        <TarjetaProvincia
          v-for="(provincia, index) in provinciasProcesadas"
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
          <div class="tipo-mision-badge" :style="{ background: provinciaSeleccionada.color + '25', borderColor: provinciaSeleccionada.color }">
            🏝️ {{ provinciaSeleccionada.tipoMision || 'Misión Nocturna' }}
          </div>
          <h3 class="titulo-detalle">{{ provinciaSeleccionada.emoji }} {{ provinciaSeleccionada.tituloMision }}</h3>
          
          <div class="detalles-lugares">
            <p><strong>📍 Principal:</strong> {{ provinciaSeleccionada.lugarPrincipal }}</p>
            <p><strong>🍻 After Party:</strong> {{ provinciaSeleccionada.lugarAfter }}</p>
          </div>

          <p class="desc-detalle">{{ provinciaSeleccionada.descripcionMision }}</p>
          
          <!-- Recompensas de la misión -->
          <div class="detalles-recompensas" v-if="provinciaSeleccionada.recompensaPrincipal">
            <p class="titulo-recompensas-mision">🎁 Recompensas de Misión:</p>
            <div class="recompensas-iconos-grid">
              <span class="recompensa-item-badge" title="Recompensa Principal">
                {{ provinciaSeleccionada.recompensaPrincipal.emoji }} {{ provinciaSeleccionada.recompensaPrincipal.nombre }}
              </span>
              <span class="recompensa-item-badge" title="Recompensa Secundaria">
                {{ provinciaSeleccionada.recompensaSecundaria.emoji }} {{ provinciaSeleccionada.recompensaSecundaria.nombre }}
              </span>
            </div>
          </div>

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
    </div>

    <!-- SECCIÓN DE PROGRESO DEL HÉROE (INVENTARIO, LOGROS, COLECCIÓN, CHECKPOINTS) -->
    <div class="seccion-progreso-heroe animate-fade-in delay-200">
      <h3 class="titulo-seccion-progreso">🎒 Bitácora y Equipamiento del Héroe</h3>
      
      <!-- Navegación de pestañas internas -->
      <div class="pestañas-progreso">
        <button
          v-for="pestana in pestañas"
          :key="pestana.id"
          class="btn-pestana"
          :class="{ 'activo': pestanaActiva === pestana.id }"
          @click="cambiarPestana(pestana.id)"
        >
          <span class="pestana-icono">{{ pestana.icono }}</span>
          <span class="pestana-etiqueta">{{ pestana.etiqueta }}</span>
          <span class="pestana-contador" v-if="obtenerContadorPestana(pestana.id) > 0">
            {{ obtenerContadorPestana(pestana.id) }}
          </span>
        </button>
      </div>

      <!-- Contenido de las pestañas -->
      <div class="contenido-pestana-wrapper">
        <!-- Pestaña: Perfil Dual -->
        <div v-if="pestanaActiva === 'perfil'" class="contenido-pestana">
          <div class="perfil-dual-grid">
            <!-- Bloque Civil -->
            <div class="bloque-identidad civil">
              <span class="bloque-titulo">🎓 IDENTIDAD CIVIL</span>
              <div class="bloque-detalles">
                <p class="bloque-item"><strong>Nombre:</strong> {{ identidadHeroe.nombre }}</p>
                <p class="bloque-item"><strong>Edad:</strong> {{ identidadHeroe.edad || '—' }} años</p>
                <p class="bloque-item"><strong>Universidad:</strong> {{ identidadHeroe.universidad }}</p>
                <p class="bloque-item"><strong>Carrera:</strong> {{ identidadHeroe.carrera }}</p>
                <p class="bloque-item"><strong>Deporte:</strong> {{ identidadHeroe.deporte || 'Ninguno' }}</p>
              </div>
            </div>

            <!-- Bloque Héroe -->
            <div class="bloque-identidad heroico">
              <span class="bloque-titulo">🦸 ALIAS HEROICO</span>
              <div class="bloque-detalles">
                <p class="bloque-item"><strong>Alias:</strong> {{ identidadHeroe.aliasHeroe || 'Sin alias' }}</p>
                <p class="bloque-item"><strong>Nivel:</strong> {{ nivelHeroe }}</p>
                <p class="bloque-item"><strong>Experiencia:</strong> {{ experienciaHeroe }} XP</p>
                <p class="bloque-item"><strong>Reputación:</strong> {{ estadisticasHeroe.reputacionNocturna }}</p>
                
                <div class="progreso-sospecha-container">
                  <span class="progreso-sospecha-label">
                    <strong>Sospecha:</strong> {{ estadisticasHeroe.sospechaIdentidad }}%
                  </span>
                  <div class="pista-sospecha-mapa" title="Nivel de Sospecha Secreta">
                    <div 
                      class="relleno-sospecha-mapa" 
                      :style="{ width: estadisticasHeroe.sospechaIdentidad + '%' }"
                      :class="{ 'alerta-sospecha': estadisticasHeroe.sospechaIdentidad > 50 }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestaña: Inventario -->
        <div v-if="pestanaActiva === 'inventario'" class="contenido-pestana">
          <div class="grid-elementos-progreso" v-if="inventarioHeroe.length > 0">
            <div v-for="(obj, i) in inventarioHeroe" :key="i" class="tarjeta-elemento-progreso-simple">
              <span class="elemento-progreso-icono">{{ obj.emoji }}</span>
              <span class="elemento-progreso-nombre">{{ obj.nombre }}</span>
            </div>
          </div>
          <p class="mensaje-vacio-progreso" v-else>
            🎒 Tu mochila está vacía. ¡Salva provincias para recolectar objetos y pases VIP!
          </p>
        </div>

        <!-- Pestaña: Colección -->
        <div v-if="pestanaActiva === 'coleccion'" class="contenido-pestana">
          <div class="grid-elementos-progreso" v-if="coleccionAfter.length > 0">
            <div v-for="(obj, i) in coleccionAfter" :key="i" class="tarjeta-elemento-progreso-simple tarjeta-after">
              <span class="elemento-progreso-icono">{{ obj.emoji }}</span>
              <span class="elemento-progreso-nombre">{{ obj.nombre }}</span>
            </div>
          </div>
          <p class="mensaje-vacio-progreso" v-else>
            🍹 Aún no tienes recuerdos de after parties. ¡Supera misiones en las provincias para desbloquearlos!
          </p>
        </div>

        <!-- Pestaña: Checkpoints -->
        <div v-if="pestanaActiva === 'checkpoints'" class="contenido-pestana">
          <div class="grid-elementos-progreso" v-if="checkpointsDesbloqueados.length > 0">
            <div v-for="(obj, i) in checkpointsDesbloqueados" :key="i" class="tarjeta-elemento-progreso-simple tarjeta-checkpoint">
              <span class="elemento-progreso-icono">{{ obj.emoji }}</span>
              <span class="elemento-progreso-nombre">{{ obj.nombre }}</span>
            </div>
          </div>
          <p class="mensaje-vacio-progreso" v-else>
            🚩 No has alcanzado ningún checkpoint. ¡Ayuda a salvar el after en las provincias desbloqueadas!
          </p>
        </div>

        <!-- Pestaña: Logros -->
        <div v-if="pestanaActiva === 'logros'" class="contenido-pestana">
          <div class="grid-elementos-progreso" v-if="logrosHeroe.length > 0">
            <div v-for="(obj, i) in logrosHeroe" :key="i" class="tarjeta-elemento-progreso-simple tarjeta-logro">
              <span class="elemento-progreso-icono">{{ obj.emoji }}</span>
              <span class="elemento-progreso-nombre">{{ obj.nombre }}</span>
            </div>
          </div>
          <p class="mensaje-vacio-progreso" v-else>
            🏆 Aún no has desbloqueado logros. ¿Podrás convertirte en la leyenda del after?
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL DE EDICIÓN DE PERFIL -->
    <transition name="modal-fade">
      <div v-if="mostrarModalEdicion" class="modal-overlay" role="dialog" aria-modal="true">
        <div class="modal-wrapper" @click.self="cerrarEditarPerfil">
          <div class="modal-card-edicion animate-fade-in-scale">
            
            <header class="edicion-header">
              <h3>⚙️ Editar Identidad de Héroe</h3>
              <p>Cambia tus datos sin reiniciar tu progreso actual.</p>
            </header>

            <form class="formulario-edicion" @submit.prevent="guardarEdicion" novalidate>
              
              <!-- Campo: Nombre -->
              <div class="form-group-edicion">
                <label for="edit-nombre">Nombre de estudiante</label>
                <input
                  id="edit-nombre"
                  v-model="formularioEdicion.nombre"
                  type="text"
                  class="input-formulario-edicion"
                  placeholder="ej: Emmanuel"
                  maxlength="30"
                  required
                />
                <span v-if="erroresEdicion.nombre" class="error-edicion">{{ erroresEdicion.nombre }}</span>
              </div>

              <!-- Campo: Edad -->
              <div class="form-group-edicion">
                <label for="edit-edad">Edad</label>
                <input
                  id="edit-edad"
                  v-model="formularioEdicion.edad"
                  type="number"
                  class="input-formulario-edicion"
                  placeholder="Rango 17 a 45"
                  min="17"
                  max="45"
                  required
                />
                <span v-if="erroresEdicion.edad" class="error-edicion">{{ erroresEdicion.edad }}</span>
              </div>

              <!-- Campo: Universidad -->
              <div class="form-group-edicion" :class="{ 'selector-activo': selectorAbiertoEdicion === 'universidad' }">
                <label>Universidad</label>
                <SelectorPersonalizado
                  v-model="formularioEdicion.universidad"
                  :opciones="universidades"
                  placeholder="Selecciona tu U..."
                  :esta-abierto="selectorAbiertoEdicion === 'universidad'"
                  @abrir="selectorAbiertoEdicion = 'universidad'"
                  @cerrar="selectorAbiertoEdicion = null"
                />
              </div>

              <!-- Campo: Carrera -->
              <div class="form-group-edicion" :class="{ 'selector-activo': selectorAbiertoEdicion === 'carrera' }">
                <label>Carrera</label>
                <SelectorPersonalizado
                  v-model="formularioEdicion.carrera"
                  :opciones="carrerasDisponiblesEdicion"
                  placeholder="Selecciona tu carrera..."
                  :esta-abierto="selectorAbiertoEdicion === 'carrera'"
                  @abrir="selectorAbiertoEdicion = 'carrera'"
                  @cerrar="selectorAbiertoEdicion = null"
                />
              </div>

              <!-- Campo: Actividad física -->
              <div class="form-group-edicion" :class="{ 'selector-activo': selectorAbiertoEdicion === 'deporte' }">
                <label>Actividad física</label>
                <SelectorPersonalizado
                  v-model="formularioEdicion.deporte"
                  :opciones="deportes"
                  placeholder="Selecciona una actividad..."
                  :esta-abierto="selectorAbiertoEdicion === 'deporte'"
                  @abrir="selectorAbiertoEdicion = 'deporte'"
                  @cerrar="selectorAbiertoEdicion = null"
                />
              </div>

              <!-- Campo: Estilo Inicial -->
              <div class="form-group-edicion">
                <label>Estilo inicial del héroe</label>
                <div class="cuadricula-personalidad-edicion">
                  <label
                    v-for="p in personalidades"
                    :key="p.value"
                    class="tarjeta-personalidad-edicion"
                    :class="{ selected: formularioEdicion.personalidad === p.value }"
                  >
                    <input
                      type="radio"
                      :value="p.value"
                      v-model="formularioEdicion.personalidad"
                      class="sr-only"
                    />
                    <span class="emoji-p-edicion">{{ p.emoji }}</span>
                    <span class="nombre-p-edicion">{{ p.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Campo: Alias Heroico -->
              <div class="form-group-edicion" :class="{ 'selector-activo': selectorAbiertoEdicion === 'aliasHeroe' }">
                <label>Alias Heroico</label>
                <SelectorPersonalizado
                  v-model="formularioEdicion.aliasHeroe"
                  :opciones="[
                    { value: 'Centinela Tico', label: '🛡️ Centinela Tico' },
                    { value: 'Guardián Nocturno', label: '⚔️ Guardián Nocturno' },
                    { value: 'Sombra Universitaria', label: '👥 Sombra Universitaria' },
                    { value: 'Viajero de la Noche', label: '🌙 Viajero de la Noche' },
                    { value: 'Otro', label: '✨ Personalizar alias...' }
                  ]"
                  placeholder="Selecciona tu alias..."
                  :esta-abierto="selectorAbiertoEdicion === 'aliasHeroe'"
                  @abrir="selectorAbiertoEdicion = 'aliasHeroe'"
                  @cerrar="selectorAbiertoEdicion = null"
                />
                <span v-if="erroresEdicion.aliasHeroe" class="error-edicion">{{ erroresEdicion.aliasHeroe }}</span>
                
                <input
                  v-if="formularioEdicion.aliasHeroe === 'Otro'"
                  id="edit-alias-personalizado"
                  v-model="formularioEdicion.aliasPersonalizado"
                  type="text"
                  class="input-formulario-edicion"
                  placeholder="Ingresa tu alias personalizado..."
                  maxlength="20"
                  style="margin-top: 10px;"
                />
              </div>

              <!-- Acciones del Formulario -->
              <div class="acciones-edicion">
                <button type="button" class="btn btn-outline" @click="cerrarEditarPerfil">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="!formularioEdicionValido">
                  Guardar Cambios
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </transition>

  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { RELACION_U_CARRERAS } from '../../data/carrerasUniversitarias.js'

// --- Componentes hijos ---
import TarjetaProvincia from './TarjetaProvincia.vue'
import IndicadorEstadistica from './IndicadorEstadistica.vue'
import SelectorPersonalizado from './SelectorPersonalizado.vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits ---
const emit = defineEmits(['iniciar-mision'])

// --- Estado del juego global ---
const {
  identidadHeroe,
  estadisticasHeroe,
  misionesCompletadas,
  porcentajeProgreso,
  checkpointsDesbloqueados,
  coleccionAfter,
  inventarioHeroe,
  logrosHeroe,
  nivelHeroe,
  experienciaHeroe,
  iniciarMision,
  actualizarIdentidad
} = useEstadoJuego()

// --- Secuencia de progresión geográfica ---
const secuenciaProvincias = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']

// Procesamiento dinámico de desbloqueo de provincias
const provinciasProcesadas = computed(() => {
  return provincias.value.map(prov => {
    const idxEnSecuencia = secuenciaProvincias.indexOf(prov.id)
    let desbloqueada = false
    if (idxEnSecuencia === 0) {
      desbloqueada = true // San José siempre está desbloqueado al inicio
    } else if (idxEnSecuencia > 0) {
      const provinciaAnteriorId = secuenciaProvincias[idxEnSecuencia - 1]
      desbloqueada = misionesCompletadas.value.includes(provinciaAnteriorId)
    } else {
      desbloqueada = prov.desbloqueada
    }
    return {
      ...prov,
      desbloqueada
    }
  })
})

const proximoNivelXP = computed(() => {
  if (nivelHeroe.value === 1) return 100
  if (nivelHeroe.value === 2) return 250
  if (nivelHeroe.value === 3) return 450
  if (nivelHeroe.value === 4) return 700
  return 700 // Nivel Máximo
})

const porcentajeXPNivelActual = computed(() => {
  let xpBase = 0
  if (nivelHeroe.value === 2) xpBase = 100
  if (nivelHeroe.value === 3) xpBase = 250
  if (nivelHeroe.value === 4) xpBase = 450
  if (nivelHeroe.value === 5) return 100
  
  const xpRango = proximoNivelXP.value - xpBase
  const xpObtenida = experienciaHeroe.value - xpBase
  return Math.min(100, Math.max(0, Math.round((xpObtenida / xpRango) * 100)))
})

// --- Audio ---
const { reproducirMusica, reproducirEfecto } = useAudio()

// --- Estado local del mapa ---
const provincias            = ref([])
const estaCargando          = ref(false)
const errorCarga            = ref(null)
const provinciaSeleccionada = ref(null)
const idProvinciaActiva     = ref(null)

// Pestaña activa del progreso
const pestanaActiva = ref('perfil')

// Estado del modal de edición
const mostrarModalEdicion = ref(false)
const formularioEdicion = reactive({
  nombre:             '',
  edad:               '',
  universidad:        '',
  carrera:            '',
  deporte:            '',
  personalidad:       '',
  aliasHeroe:         '',
  aliasPersonalizado: ''
})
const erroresEdicion = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: ''
})

// Estado para coordinar la apertura de selectores en la edición de perfil
const selectorAbiertoEdicion = ref(null)

// --- Listado de pestañas ---
const pestañas = [
  { id: 'perfil',      icono: '👤', etiqueta: 'Perfil' },
  { id: 'inventario',  icono: '🎒', etiqueta: 'Mochila' },
  { id: 'coleccion',   icono: '🍹', etiqueta: 'Recuerdos' },
  { id: 'checkpoints', icono: '🚩', etiqueta: 'Hitos' },
  { id: 'logros',      icono: '🏆', etiqueta: 'Logros' }
]

// --- Datos para selectores en edición de perfil ---
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

const carrerasDisponiblesEdicion = computed(() => {
  if (!formularioEdicion.universidad) return []
  return RELACION_U_CARRERAS[formularioEdicion.universidad] || []
})

watch(() => formularioEdicion.universidad, (nuevaU) => {
  if (!nuevaU) {
    formularioEdicion.carrera = ''
    return
  }
  const listaValida = RELACION_U_CARRERAS[nuevaU] || []
  const existe = listaValida.some(c => c.value === formularioEdicion.carrera)
  if (!existe) {
    formularioEdicion.carrera = ''
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
  { value: 'responsable', emoji: '🎓', label: 'Responsable' },
  { value: 'aventurero',  emoji: '🗺️', label: 'Aventurero' },
  { value: 'equilibrado', emoji: '⚖️', label: 'Equilibrado' },
  { value: 'nocturno',    emoji: '🌙', label: 'Estudioso nocturno' }
]

// --- Computed: lista de estadísticas del héroe ---
const listaEstadisticasHeroe = computed(() => [
  { key: 'energia',         etiqueta: 'Energía',         valor: estadisticasHeroe.energia,         icono: '⚡', color: 'gold'   },
  { key: 'conocimiento',    etiqueta: 'Conocimiento',    valor: estadisticasHeroe.conocimiento,    icono: '📚', color: 'blue'   },
  { key: 'diversion',       etiqueta: 'Diversión',       valor: estadisticasHeroe.diversion,       icono: '🎉', color: 'purple' },
  { key: 'responsabilidad', etiqueta: 'Resp.',            valor: estadisticasHeroe.responsabilidad, icono: '🎓', color: 'green'  },
  { key: 'reputacionNocturna', etiqueta: 'Reputación',      valor: estadisticasHeroe.reputacionNocturna, icono: '🤝', color: 'cyan'   }
])

const formularioEdicionValido = computed(() => {
  const edadNum = Number(formularioEdicion.edad)
  const edadValida = !isNaN(edadNum) && edadNum >= 17 && edadNum <= 45
  
  const aliasValido = formularioEdicion.aliasHeroe !== '' && 
    (formularioEdicion.aliasHeroe !== 'Otro' || formularioEdicion.aliasPersonalizado.trim().length >= 3)

  return formularioEdicion.nombre.trim().length >= 2 &&
    edadValida &&
    formularioEdicion.universidad !== '' &&
    formularioEdicion.carrera !== '' &&
    formularioEdicion.personalidad !== '' &&
    aliasValido
})

// =========================================================
// Carga de misiones desde JSON
// =========================================================
async function cargarMisiones() {
  estaCargando.value = true
  errorCarga.value = null

  try {
    const response = await fetch('/misiones.json')
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    const data = await response.json()
    provincias.value = data.provincias
  } catch (err) {
    console.error('[MapaMisiones] Error cargando misiones:', err)
    provincias.value = obtenerProvinciasFallback()
  } finally {
    estaCargando.value = false
  }
}

function obtenerProvinciasFallback() {
  return [
    {
      id: 'san-jose', nombre: 'San José', emoji: '🏙️', region: 'Valle Central',
      dificultad: 1, descripcion: 'La capital costarricense.', color: '#00ff88',
      desbloqueada: true, tituloMision: 'La Noche Josefina',
      descripcionMision: 'El caos universitario llegó a San José.',
      lugarPrincipal: "Barrio Escalante", lugarAfter: "La Cali", tipoMision: "Ciudad / Nocturna",
      recompensaPrincipal: { nombre: "Pilsen", emoji: "🍺" },
      recompensaSecundaria: { nombre: "After Seguro", emoji: "🎉" },
      estadisticas: { energia: 70, conocimiento: 85, diversion: 75, responsabilidad: 80 }, preguntas: []
    },
    {
      id: 'heredia', nombre: 'Heredia', emoji: '🌺', region: 'Valle Central',
      dificultad: 2, descripcion: 'La ciudad de las flores.', color: '#b84fff',
      desbloqueada: false, tituloMision: 'Entre Flores y Libros',
      descripcionMision: 'Heredia te espera.',
      lugarPrincipal: "Campus Omar Dengo (UNA)", lugarAfter: "El Fortín Universitario", tipoMision: "Universitaria / Cultura",
      recompensaPrincipal: { nombre: "Playlist Universitaria", emoji: "🎶" },
      recompensaSecundaria: { nombre: "Energía Tropical", emoji: "🎉" },
      estadisticas: { energia: 65, conocimiento: 88, diversion: 70, responsabilidad: 82 }, preguntas: []
    }
  ]
}

// --- Seleccionar provincia ---
function alSeleccionarProvincia(provincia) {
  provinciaSeleccionada.value = provincia
  reproducirEfecto('click')
}

// --- Iniciar misión ---
function alIniciarMision(provincia) {
  if (!provincia.desbloqueada) return
  idProvinciaActiva.value = provincia.id
  reproducirEfecto('click')
  iniciarMision(provincia)
  emit('iniciar-mision', provincia)
}

// --- Pestañas de progreso ---
function cambiarPestana(id) {
  reproducirEfecto('click')
  pestanaActiva.value = id
}

function obtenerContadorPestana(id) {
  if (id === 'inventario') return inventarioHeroe.value.length
  if (id === 'coleccion') return coleccionAfter.value.length
  if (id === 'checkpoints') return checkpointsDesbloqueados.value.length
  if (id === 'logros') return logrosHeroe.value.length
  return 0
}

// --- Edición de Perfil ---
function abrirEditarPerfil() {
  reproducirEfecto('click')
  formularioEdicion.nombre = identidadHeroe.nombre
  formularioEdicion.edad = identidadHeroe.edad
  formularioEdicion.universidad = identidadHeroe.universidad
  formularioEdicion.carrera = identidadHeroe.carrera
  formularioEdicion.deporte = identidadHeroe.deporte
  formularioEdicion.personalidad = identidadHeroe.personalidad
  
  // Mapeamos el alias
  const aliasOpciones = ['Centinela Tico', 'Guardián Nocturno', 'Sombra Universitaria', 'Viajero de la Noche']
  if (aliasOpciones.includes(identidadHeroe.aliasHeroe)) {
    formularioEdicion.aliasHeroe = identidadHeroe.aliasHeroe
    formularioEdicion.aliasPersonalizado = ''
  } else {
    formularioEdicion.aliasHeroe = 'Otro'
    formularioEdicion.aliasPersonalizado = identidadHeroe.aliasHeroe
  }

  erroresEdicion.nombre = ''
  erroresEdicion.edad = ''
  erroresEdicion.aliasHeroe = ''
  selectorAbiertoEdicion.value = null
  mostrarModalEdicion.value = true
}

function cerrarEditarPerfil() {
  reproducirEfecto('click')
  selectorAbiertoEdicion.value = null
  mostrarModalEdicion.value = false
}

function guardarEdicion() {
  erroresEdicion.nombre = ''
  erroresEdicion.edad = ''
  erroresEdicion.aliasHeroe = ''

  let esValido = true

  if (formularioEdicion.nombre.trim().length < 2) {
    erroresEdicion.nombre = 'El nombre debe tener al menos 2 caracteres.'
    esValido = false
  }

  const edadNum = Number(formularioEdicion.edad)
  if (formularioEdicion.edad === '' || isNaN(edadNum)) {
    erroresEdicion.edad = 'La edad debe ser un número válido.'
    esValido = false
  } else if (edadNum < 17 || edadNum > 45) {
    erroresEdicion.edad = 'La edad debe estar en el rango de 17 a 45 años.'
    esValido = false
  }

  if (formularioEdicion.aliasHeroe === '') {
    erroresEdicion.aliasHeroe = 'Debes seleccionar un alias heroico.'
    esValido = false
  } else if (formularioEdicion.aliasHeroe === 'Otro' && formularioEdicion.aliasPersonalizado.trim().length < 3) {
    erroresEdicion.aliasHeroe = 'El alias personalizado debe tener al menos 3 caracteres.'
    esValido = false
  }

  if (!esValido) return

  reproducirEfecto('subirNivel')
  
  const aliasFinal = formularioEdicion.aliasHeroe === 'Otro' ? formularioEdicion.aliasPersonalizado.trim() : formularioEdicion.aliasHeroe

  actualizarIdentidad({
    nombre: formularioEdicion.nombre.trim(),
    edad: edadNum,
    universidad: formularioEdicion.universidad,
    carrera: formularioEdicion.carrera,
    deporte: formularioEdicion.deporte,
    personalidad: formularioEdicion.personalidad,
    aliasHeroe: aliasFinal
  })
  mostrarModalEdicion.value = false
}

onMounted(async () => {
  reproducirMusica('mapa')
  await cargarMisiones()
})
</script>

<style scoped>
.mapa-misiones {
  min-height: calc(100vh - 64px);
  padding: var(--space-8) var(--space-4);
  max-width: 1200px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* --- Header --- */
.encabezado-mapa {
  display: flex;
  align-items: center;
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

.controles-perfil-mapa {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
}

.btn-editar-perfil {
  border-color: var(--color-neon-purple);
  color: var(--color-text-primary);
}
.btn-editar-perfil:hover {
  background: rgba(184, 79, 255, 0.15);
  box-shadow: 0 0 10px var(--color-neon-purple-glow);
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

/* --- Contenido mapa grid --- */
.contenido-mapa-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

.cuadricula-provincias {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}

/* --- Detalle de provincia --- */
.detalle-provincia {
  background: var(--gradient-card);
  border: 1px solid var(--color-neon-purple);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tipo-mision-badge {
  align-self: flex-start;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px var(--space-3);
  border: 1px solid;
  border-radius: var(--radius-full);
}

.titulo-detalle {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin: 0;
}

.detalles-lugares {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.detalles-lugares p { margin: 0; }

.desc-detalle {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
  margin: 0;
}

.detalles-recompensas {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
}

.titulo-recompensas-mision {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin: 0 0 var(--space-2);
}

.recompensas-iconos-grid {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.recompensa-item-badge {
  font-size: var(--text-xs);
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  border-radius: var(--radius-full);
  padding: 4px var(--space-3);
  color: var(--color-neon-green);
}

/* --- Sección de Progreso (Bitácora) --- */
.seccion-progreso-heroe {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-top: var(--space-4);
  box-shadow: var(--shadow-card);
}

.titulo-seccion-progreso {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.pestañas-progreso {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 2px;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
  overflow-x: auto;
}

.btn-pestana {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-muted);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-pestana:hover {
  color: var(--color-text-primary);
  border-bottom-color: rgba(255,255,255,0.2);
}

.btn-pestana.activo {
  color: var(--color-neon-blue);
  border-bottom-color: var(--color-neon-blue);
}

.pestana-contador {
  font-size: 0.75rem;
  background: rgba(0, 200, 255, 0.15);
  color: var(--color-neon-blue);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: var(--radius-full);
  padding: 1px 6px;
  line-height: 1;
}

.contenido-pestana-wrapper {
  min-height: 100px;
}

.grid-elementos-progreso {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-3);
}

.tarjeta-elemento-progreso-simple {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: all var(--transition-fast);
}

.tarjeta-elemento-progreso-simple:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.04);
}

.tarjeta-after:hover {
  border-color: var(--color-neon-green);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.15);
}

.tarjeta-checkpoint:hover {
  border-color: var(--color-neon-blue);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.15);
}

.tarjeta-logro:hover {
  border-color: var(--color-neon-gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.15);
}

.elemento-progreso-icono {
  font-size: 1.5rem;
}

.elemento-progreso-nombre {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

.mensaje-vacio-progreso {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
  font-style: italic;
  padding: var(--space-6) 0;
  margin: 0;
}

/* --- Modal Edición Perfil --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(5, 8, 20, 0.85);
  backdrop-filter: blur(10px);
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-card-edicion {
  width: 100%;
  max-width: 500px;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.edicion-header h3 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-neon-purple);
  text-shadow: 0 0 10px var(--color-neon-purple-glow);
  margin: 0 0 var(--space-1);
}
.edicion-header p {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.formulario-edicion {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group-edicion {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: relative;
  z-index: 1;
}
.form-group-edicion.selector-activo {
  z-index: 1000 !important;
}
.form-group-edicion label {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.input-formulario-edicion {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: rgba(17, 24, 39, 0.75);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--text-base);
}

.cuadricula-personalidad-edicion {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.tarjeta-personalidad-edicion {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  transition: all var(--transition-fast);
}

.tarjeta-personalidad-edicion:hover {
  background: rgba(184, 79, 255, 0.06);
}

.tarjeta-personalidad-edicion.selected {
  border-color: var(--color-neon-purple);
  background: rgba(184, 79, 255, 0.15);
}

.acciones-edicion {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
}

/* --- Loading y Error --- */
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

.error-mapa {
  text-align: center;
  padding: var(--space-8);
  color: #ff6b6b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

/* --- Transiciones --- */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* --- Responsive --- */
@media (max-width: 992px) {
  .contenido-mapa-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .encabezado-mapa {
    flex-direction: column;
    align-items: flex-start;
  }
  .controles-perfil-mapa {
    width: 100%;
    align-items: flex-start;
  }
  .estadisticas-mapa {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .titulo-mapa {
    font-size: var(--text-2xl);
  }
  .avatar-heroe-mapa {
    font-size: 2rem;
  }
  .cuadricula-personalidad-edicion {
    grid-template-columns: 1fr;
  }
}

.perfil-nivel-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}

.badge-nivel-mapa {
  font-size: var(--text-xs);
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.25);
  color: var(--color-neon-gold);
  padding: 2px var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
}

.xp-bar-mapa {
  position: relative;
  width: 180px;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xp-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  box-shadow: 0 0 8px rgba(0, 200, 255, 0.4);
  transition: width 0.5s ease;
}

.xp-bar-texto {
  position: relative;
  z-index: 2;
  font-size: 0.65rem;
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* --- Perfil Dual Tab CSS --- */
.perfil-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  padding: var(--space-4);
  text-align: left;
}

.bloque-identidad {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: all var(--transition-base);
}

.bloque-identidad.civil {
  border-left: 3px solid var(--color-neon-blue);
  background: linear-gradient(145deg, rgba(0, 200, 255, 0.02), transparent);
}

.bloque-identidad.heroico {
  border-left: 3px solid var(--color-neon-purple);
  background: linear-gradient(145deg, rgba(184, 79, 255, 0.02), transparent);
}

.bloque-titulo {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  letter-spacing: 0.06em;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.bloque-identidad.civil .bloque-titulo { color: var(--color-neon-blue); }
.bloque-identidad.heroico .bloque-titulo { color: var(--color-neon-purple); }

.bloque-detalles {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.bloque-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
.bloque-item strong {
  color: var(--color-text-primary);
}

/* --- Progreso Sospecha --- */
.progreso-sospecha-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--space-3);
}

.progreso-sospecha-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.pista-sospecha-mapa {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.relleno-sospecha-mapa {
  height: 100%;
  background: var(--color-neon-blue);
  box-shadow: 0 0 8px var(--color-neon-blue-glow);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.relleno-sospecha-mapa.alerta-sospecha {
  background: #ff4646;
  box-shadow: 0 0 8px rgba(255, 70, 70, 0.6);
}

@media (max-width: 640px) {
  .perfil-dual-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}
</style>
