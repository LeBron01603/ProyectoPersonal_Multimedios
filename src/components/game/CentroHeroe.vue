<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="mostrar" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="centro-heroe-titulo">
        <div class="modal-wrapper" @click.self="cerrar">
          <div class="modal-card-centro animate-fade-in-scale">
            
            <!-- Botón de cerrar modal -->
            <button class="btn-cerrar-modal" @click="cerrar" aria-label="Cerrar panel">×</button>

            <!-- Cabecera del Centro del Héroe -->
            <header class="centro-header">
              <h2 id="centro-heroe-titulo" class="texto-neon-purple">
                👤 Centro del Héroe
              </h2>
              <p class="subtitulo-centro">Bitácora oficial de tu identidad dual</p>
            </header>

            <!-- Navegación de Pestañas -->
            <nav class="tabs-centro" aria-label="Navegación del Centro del Héroe">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-btn"
                :class="{ activo: tabActiva === tab.id }"
                @click="tabActiva = tab.id; reproducirEfecto('boton')"
              >
                <span class="tab-icono">{{ tab.icono }}</span>
                <span class="tab-etiqueta">{{ tab.label }}</span>
              </button>
            </nav>

            <!-- Contenedor Principal de Contenido de Pestaña -->
            <div class="contenido-tab">

              <!-- ================= PESTAÑA: PERFIL ================= -->
              <div v-if="tabActiva === 'perfil'" class="seccion-perfil animate-fade-in">
                <!-- Modo Lectura -->
                <div v-if="!modoEdicion" class="perfil-info-grid">
                  <!-- Bloque Identidad Civil -->
                  <div class="tarjeta-info civil">
                    <h3>🎓 Identidad Civil</h3>
                    <div class="detalles-info">
                      <p><strong>Nombre:</strong> {{ identidadHeroe.nombre }}</p>
                      <p><strong>Edad:</strong> {{ identidadHeroe.edad }} años</p>
                      <p><strong>Universidad:</strong> {{ identidadHeroe.universidad }}</p>
                      <p><strong>Sede:</strong> {{ nombreSedeLegible(identidadHeroe.universidad, identidadHeroe.sedeUniversitaria) }}</p>
                      <p><strong>Carrera:</strong> {{ nombreCarreraLegible(identidadHeroe.carrera) }}</p>
                      <p><strong>Semestre:</strong> {{ identidadHeroe.semestre }}°</p>
                      <p><strong>Promedio Ponderado:</strong> {{ identidadHeroe.promedio }}</p>
                      <p><strong>Créditos Aprobados:</strong> {{ identidadHeroe.creditosAprobados }}</p>
                      <p><strong>Club Universitario:</strong> {{ identidadHeroe.clubUniversitario || 'Ninguno' }}</p>
                      <p><strong>Actividad física:</strong> {{ deporteLegible(identidadHeroe.deporte) }}</p>
                    </div>
                  </div>

                  <!-- Bloque Identidad Heroica -->
                  <div class="tarjeta-info heroica">
                    <h3>🦸 Identidad Heroica</h3>
                    <div class="detalles-info">
                      <p><strong>Alias:</strong> {{ identidadHeroe.aliasHeroe || 'Sin alias' }}</p>
                      <p><strong>Nivel:</strong> {{ nivelHeroe }}</p>
                      <p><strong>Experiencia:</strong> {{ experienciaHeroe }} XP</p>
                      <p><strong>Reputación Nocturna:</strong> {{ estadisticasHeroe.reputacionNocturna }}</p>
                      
                      <div class="titulo-heroico-contenedor" v-if="tituloFinal">
                        <p><strong>Título Heroico:</strong> <span class="titulo-nombre-val">{{ tituloFinal.emoji }} {{ tituloFinal.nombre }}</span></p>
                        <p class="titulo-desc">{{ tituloFinal.descripcion }}</p>
                      </div>

                      <div class="progreso-sospecha">
                        <div class="sospecha-meta">
                          <span><strong>Sospecha:</strong> {{ estadisticasHeroe.sospechaIdentidad }}%</span>
                          <span class="sospecha-rango-badge" :class="sospechaRangoInfo.clase">{{ sospechaRangoInfo.label }}</span>
                        </div>
                        <div class="barra-sospecha-centro">
                          <div
                            class="barra-sospecha-relleno"
                            :style="{ width: estadisticasHeroe.sospechaIdentidad + '%' }"
                            :class="sospechaRangoInfo.clase"
                          ></div>
                        </div>
                      </div>

                      <!-- Alerta de sospecha interactiva narrada -->
                      <div class="advertencia-sospecha-centro" :class="sospechaRangoInfo.clase">
                        <p>{{ mensajeSospechaHeroe }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Bloque Resumen de Último Patrullaje -->
                  <div class="tarjeta-info mision-reciente">
                    <h3>⚡ Último Patrullaje Registrado</h3>
                    <div class="detalles-info grid-mision-reciente">
                      <p><strong>Misión patrullada:</strong> {{ ultimaMisionNombre || 'Ninguna' }}</p>
                      <p><strong>Resultado obtenido:</strong> {{ ultimaMisionResultado || 'Sin registrar' }}</p>
                      <p><strong>Recompensa desbloqueada:</strong> {{ ultimaRecompensa || 'Ninguna' }}</p>
                    </div>
                  </div>

                  <button class="btn btn-outline btn-editar-perfil-centro" @click="activarModoEdicion">
                    ✏️ Modificar Identidad
                  </button>
                </div>

                <!-- Modo Edición -->
                <form v-else class="formulario-edicion-centro" @submit.prevent="guardarCambiosPerfil">
                  <div class="form-scroll">
                    <!-- Campo: Nombre -->
                    <div class="form-group-edicion">
                      <label for="edit-nombre-centro">Nombre de estudiante</label>
                      <input
                        id="edit-nombre-centro"
                        v-model="formularioEdicion.nombre"
                        type="text"
                        class="input-formulario-edicion"
                        maxlength="30"
                        required
                      />
                      <span v-if="erroresEdicion.nombre" class="error-edicion">{{ erroresEdicion.nombre }}</span>
                    </div>

                    <!-- Campo: Edad -->
                    <div class="form-group-edicion">
                      <label for="edit-edad-centro">Edad (17 - 45 años)</label>
                      <input
                        id="edit-edad-centro"
                        v-model="formularioEdicion.edad"
                        type="number"
                        class="input-formulario-edicion"
                        min="17"
                        max="45"
                        required
                      />
                      <span v-if="erroresEdicion.edad" class="error-edicion">{{ erroresEdicion.edad }}</span>
                    </div>

                    <!-- Campo: Alias -->
                    <div class="form-group-edicion">
                      <label for="edit-alias-centro">Alias Heroico</label>
                      <select id="edit-alias-centro" v-model="formularioEdicion.aliasHeroe" class="select-formulario-edicion">
                        <option value="Centinela Tico">🛡️ Centinela Tico</option>
                        <option value="Guardián Nocturno">⚔️ Guardián Nocturno</option>
                        <option value="Sombra Universitaria">👥 Sombra Universitaria</option>
                        <option value="Viajero de la Noche">🌙 Viajero de la Noche</option>
                        <option value="Otro">✨ Personalizar alias...</option>
                      </select>
                      
                      <input
                        v-if="formularioEdicion.aliasHeroe === 'Otro'"
                        id="edit-alias-pers-centro"
                        v-model="formularioEdicion.aliasPersonalizado"
                        type="text"
                        class="input-formulario-edicion"
                        placeholder="Ingresa tu alias personalizado..."
                        maxlength="20"
                        style="margin-top: 10px;"
                      />
                      <span v-if="erroresEdicion.aliasHeroe" class="error-edicion">{{ erroresEdicion.aliasHeroe }}</span>
                    </div>

                    <!-- Solo Lectura Informativo -->
                    <div class="informacion-bloqueada-centro">
                      <p>ℹ️ La Universidad y la Carrera afectan tus estadísticas iniciales y no pueden modificarse.</p>
                    </div>
                  </div>

                  <div class="acciones-edicion">
                    <button type="button" class="btn btn-outline" @click="cancelarEdicion">
                      Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="!formularioValido">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>

              <!-- ================= PESTAÑA: PROGRESO ================= -->
              <div v-if="tabActiva === 'progreso'" class="seccion-progreso animate-fade-in">
                <div class="seccion-progreso-scroll">
                  
                  <!-- Calendario Académico Básico -->
                  <div class="progreso-bloque">
                    <h4>📅 Calendario Académico</h4>
                    <div class="calendario-basico">
                      <p><strong>Progreso del Semestre:</strong> Semana {{ identidadHeroe.semanaAcademica || 1 }} de 16</p>
                      <div class="barra-calendario-semana">
                        <div
                          class="barra-calendario-relleno"
                          :style="{ width: ((identidadHeroe.semanaAcademica || 1) / 16 * 100) + '%' }"
                        ></div>
                      </div>
                      <p class="nota-calendario">Completa misiones para avanzar el ciclo académico y consolidar tus estudios.</p>
                    </div>
                  </div>

                  <!-- Ruta Geográfica de Provincias -->
                  <div class="progreso-provincias-ruta">
                    <h4>🗺️ Progreso Geográfico de Provincias</h4>
                    <div class="ruta-lista">
                      <div
                        v-for="(prov, idx) in listaSecuenciaProvincias"
                        :key="prov.id"
                        class="ruta-nodo"
                        :class="{
                          'completado': misionesCompletadas.includes(prov.id),
                          'activo-desbloqueado': esProvinciaActualDesbloqueada(prov.id)
                        }"
                      >
                        <span class="nodo-check">
                          {{ misionesCompletadas.includes(prov.id) ? '✓' : (esProvinciaActualDesbloqueada(prov.id) ? '🔓' : '🔒') }}
                        </span>
                        <div class="nodo-texto">
                          <span class="nodo-nombre">{{ prov.nombre }}</span>
                          <span class="nodo-estado">
                            {{ misionesCompletadas.includes(prov.id) ? 'Completada' : (esProvinciaActualDesbloqueada(prov.id) ? 'Desbloqueada (Siguiente)' : 'Bloqueada') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hitos (Checkpoints) -->
                  <div class="progreso-bloque">
                    <h4>🚩 Hitos de Aventura (Checkpoints)</h4>
                    <div v-if="checkpointsDesbloqueados.length > 0" class="hitos-grid">
                      <div v-for="(ch, i) in checkpointsDesbloqueados" :key="i" class="hito-card">
                        <span class="hito-emoji">{{ ch.emoji }}</span>
                        <span class="hito-nombre">{{ ch.nombre }}</span>
                      </div>
                    </div>
                    <p class="vacio-texto" v-else>No has desbloqueado hitos aún. ¡Completa misiones para encontrarlos!</p>
                  </div>

                  <!-- Logros -->
                  <div class="progreso-bloque">
                    <h4>🏆 Logros Obtenidos</h4>
                    <div v-if="logrosHeroe.length > 0" class="logros-grid">
                      <div v-for="(l, i) in logrosHeroe" :key="i" class="logro-card">
                        <span class="logro-emoji">{{ l.emoji }}</span>
                        <span class="logro-nombre">{{ l.nombre }}</span>
                      </div>
                    </div>
                    <p class="vacio-texto" v-else>Ningún logro desbloqueado todavía. ¡Conviértete en leyenda!</p>
                  </div>

                </div>
              </div>

              <!-- ================= PESTAÑA: MOCHILA ================= -->
              <div v-if="tabActiva === 'mochila'" class="seccion-mochila animate-fade-in">
                <div class="seccion-mochila-scroll">
                  
                  <!-- Mochila / Inventario -->
                  <div class="inventario-bloque">
                    <h4>🎒 Objetos en Mochila</h4>
                    <div v-if="inventarioHeroe.length > 0" class="mochila-grid">
                      <div v-for="(item, i) in inventarioHeroe" :key="i" class="item-mochila-card">
                        <span class="item-emoji">{{ item.emoji }}</span>
                        <span class="item-nombre">{{ item.nombre }}</span>
                      </div>
                    </div>
                    <p class="vacio-texto" v-else>Tu mochila está vacía. ¡Resuelve misiones para ganar objetos!</p>
                  </div>

                  <!-- Recuerdos / Colección After -->
                  <div class="inventario-bloque">
                    <h4>🍹 Recuerdos del After</h4>
                    <div v-if="coleccionAfter.length > 0" class="mochila-grid">
                      <div v-for="(rec, i) in coleccionAfter" :key="i" class="item-mochila-card after-recuerdo">
                        <span class="item-emoji">{{ rec.emoji }}</span>
                        <span class="item-nombre">{{ rec.nombre }}</span>
                      </div>
                    </div>
                    <p class="vacio-texto" v-else>No has guardado recuerdos de after parties. ¡Ayuda a los estudiantes de noche!</p>
                  </div>

                </div>
              </div>

              <!-- ================= PESTAÑA: OPCIONES ================= -->
              <div v-if="tabActiva === 'opciones'" class="seccion-opciones animate-fade-in">
                <div class="opciones-contenido">
                  <p class="opciones-intro">Manejo persistente del progreso de tu aventura:</p>

                  <div class="opciones-botones-vertical">
                    <!-- Guardar -->
                    <button class="btn btn-hero btn-lg btn-guardar-manual" @click="guardarManualmente">
                      💾 Guardar Progreso Actual
                    </button>

                    <!-- Cargar -->
                    <div class="cargar-seccion">
                      <button
                        class="btn btn-primary btn-lg"
                        :disabled="!existeSave"
                        @click="cargarManualmente"
                      >
                        📂 Cargar Partida
                      </button>
                      <p v-if="!existeSave" class="save-advertencia">⚠️ No hay partida guardada</p>
                    </div>

                    <!-- Borrar -->
                    <button class="btn btn-danger btn-lg" @click="abrirConfirmacionBorrar">
                      🗑️ Borrar Progreso (Reiniciar)
                    </button>
                  </div>

                  <!-- Feedback de Guardado Manual -->
                  <transition name="fade">
                    <div v-if="mensajeFeedback" class="feedback-notif" :class="feedbackExitoso ? 'exito' : 'error'">
                      {{ mensajeFeedback }}
                    </div>
                  </transition>
                </div>
              </div>

              <!-- ================= PESTAÑA: AUDIO ================= -->
              <div v-if="tabActiva === 'audio'" class="seccion-audio animate-fade-in">
                <div class="audio-config-card">
                  <p class="audio-intro">Personaliza el ambiente sonoro de tu patrullaje y vida universitaria:</p>

                  <div class="control-grupo-audio">
                    <!-- Configuración Música -->
                    <div class="control-columna-audio">
                      <div class="control-fila">
                        <div class="control-info">
                          <span class="control-icono">🎵</span>
                          <div class="control-texto">
                            <label class="control-label">Música de fondo</label>
                            <span class="control-subtexto">Banda sonora (Nivel: {{ Math.round(volumenMusica * 100) }}%)</span>
                          </div>
                        </div>
                        <label class="switch-neon">
                          <input type="checkbox" :checked="musicaHabilitada" @change="alCambiarMusica">
                          <span class="slider-neon"></span>
                        </label>
                      </div>
                      <div class="slider-contenedor-neon" :class="{ 'deshabilitado-opaco': !musicaHabilitada }">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          :value="volumenMusica"
                          @input="alCambiarVolumenMusica"
                          class="rango-neon"
                          aria-label="Volumen de música"
                          :disabled="!musicaHabilitada"
                        >
                        <div class="barra-progreso-rango" :style="{ width: (volumenMusica * 100) + '%' }"></div>
                      </div>
                    </div>

                    <!-- Configuración Efectos -->
                    <div class="control-columna-audio">
                      <div class="control-fila">
                        <div class="control-info">
                          <span class="control-icono">⚡</span>
                          <div class="control-texto">
                            <label class="control-label">Efectos de sonido</label>
                            <span class="control-subtexto">SFX y botones (Nivel: {{ Math.round(volumenEfectos * 100) }}%)</span>
                          </div>
                        </div>
                        <label class="switch-neon">
                          <input type="checkbox" :checked="efectosHabilitados" @change="alCambiarEfectos">
                          <span class="slider-neon"></span>
                        </label>
                      </div>
                      <div class="slider-contenedor-neon" :class="{ 'deshabilitado-opaco': !efectosHabilitados }">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          :value="volumenEfectos"
                          @input="alCambiarVolumenEfectos"
                          @change="reproducirEfecto('boton')"
                          class="rango-neon"
                          aria-label="Volumen de efectos"
                          :disabled="!efectosHabilitados"
                        >
                        <div class="barra-progreso-rango" :style="{ width: (volumenEfectos * 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- Modal de confirmación para borrar progreso -->
  <ModalConfirmacion
    :mostrar="mostrarConfirmarBorrar"
    titulo="¿Borrar progreso?"
    mensaje="¿Seguro que deseas eliminar permanentemente tu partida guardada? Esta acción limpiará localStorage, restablecerá tu héroe civil/heroico y te enviará a la pantalla de inicio."
    textoConfirmar="Eliminar partida"
    textoCancelar="Cancelar"
    @confirmar="confirmarBorrarProgreso"
    @cancelar="cerrarConfirmacionBorrar"
  />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useEstadoJuego, PANTALLAS } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'
import ModalConfirmacion from './ModalConfirmacion.vue'
import { RELACION_U_SEDES } from '../../data/carrerasUniversitarias.js'

// --- Props ---
const props = defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
})

// --- Emits ---
const emit = defineEmits(['cerrar'])

// --- Composables ---
const {
  identidadHeroe,
  estadisticasHeroe,
  nivelHeroe,
  experienciaHeroe,
  misionesCompletadas,
  checkpointsDesbloqueados,
  coleccionAfter,
  inventarioHeroe,
  logrosHeroe,
  actualizarIdentidad,
  guardarProgreso,
  cargarProgreso,
  borrarProgreso,
  hayProgresoGuardado,
  tituloFinal,
  ultimaMisionNombre,
  ultimaMisionResultado,
  ultimaRecompensa
} = useEstadoJuego()

const sospechaRangoInfo = computed(() => {
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return { label: 'Identidad segura 🟢', clase: 'segura' }
  if (s <= 50) return { label: 'Rumores 🟡', clase: 'rumores' }
  if (s <= 75) return { label: 'Sospecha alta 🟠', clase: 'alta' }
  return { label: 'Investigación activa 🔴', clase: 'investigacion' }
})

const mensajeSospechaHeroe = computed(() => {
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return 'Tu doble identidad está a salvo. Eres un estudiante ejemplar ante los ojos de todos. 🟢'
  if (s <= 50) return 'Se escuchan susurros. Algunos compañeros comentan que te ven salir tarde del campus. 🟡'
  if (s <= 75) return 'El director de carrera te citó por ausencias misteriosas. La facultad sospecha de tus escapadas nocturnas. 🟠'
  return '¡Alerta roja! Profesores y administradores buscan confirmar quién es la sombra del campus. 🔴'
})

function nombreSedeLegible(uni, value) {
  if (!uni || !value) return '—'
  const list = RELACION_U_SEDES[uni] || []
  const found = list.find(s => s.value === value)
  return found ? found.label : value
}

const {
  musicaHabilitada,
  efectosHabilitados,
  volumenMusica,
  volumenEfectos,
  establecerMusicaHabilitada,
  establecerEfectosHabilitados,
  establecerVolumenMusica,
  establecerVolumenEfectos,
  reproducirEfecto
} = useAudio()

// --- Estado local ---
const tabActiva = ref('perfil')
const modoEdicion = ref(false)
const existeSave = ref(false)
const mensajeFeedback = ref('')
const feedbackExitoso = ref(true)
const mostrarConfirmarBorrar = ref(false)

function alCambiarMusica(e) {
  establecerMusicaHabilitada(e.target.checked)
  if (e.target.checked) reproducirEfecto('boton')
}

function alCambiarEfectos(e) {
  establecerEfectosHabilitados(e.target.checked)
  if (e.target.checked) reproducirEfecto('boton')
}

// @input → actualiza el volumen en tiempo real (el watcher en useAudio lo aplica)
function alCambiarVolumenMusica(e) {
  const val = parseFloat(e.target.value)
  establecerVolumenMusica(val)
}

// @input → persiste en tiempo real para efectos
function alCambiarVolumenEfectos(e) {
  const val = parseFloat(e.target.value)
  establecerVolumenEfectos(val)
}

const tabs = [
  { id: 'perfil', icono: '👤', label: 'Perfil' },
  { id: 'progreso', icono: '🚩', label: 'Progreso' },
  { id: 'mochila', icono: '🎒', label: 'Mochila' },
  { id: 'audio', icono: '🔊', label: 'Audio' },
  { id: 'opciones', icono: '⚙️', label: 'Guardado' }
]

const secuenciaProvincias = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']
const listaSecuenciaProvincias = [
  { id: 'san-jose', nombre: 'San José' },
  { id: 'heredia', nombre: 'Heredia' },
  { id: 'cartago', nombre: 'Cartago' },
  { id: 'alajuela', nombre: 'Alajuela' },
  { id: 'guanacaste', nombre: 'Guanacaste' },
  { id: 'puntarenas', nombre: 'Puntarenas' },
  { id: 'limon', nombre: 'Limón' }
]

// Formulario de edición
const formularioEdicion = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: '',
  aliasPersonalizado: ''
})

const erroresEdicion = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: ''
})

// --- Watchers para detectar existencia de save ---
watch(() => props.mostrar, (val) => {
  if (val) {
    tabActiva.value = 'perfil'
    modoEdicion.value = false
    comprobarExisteSave()
  }
})

function comprobarExisteSave() {
  existeSave.value = hayProgresoGuardado()
}

// --- Métodos de visualización de perfil ---
function nombreCarreraLegible(carrera) {
  const mapeo = {
    Informatica: 'Informática Empresarial',
    Software: 'Ingeniería de Software',
    Ciberseguridad: 'Ciberseguridad',
    Datos: 'Ciencia de Datos',
    InformaticaEducativa: 'Informática Educativa',
    Turismo: 'Turismo',
    Administracion: 'Administración de Empresas',
    Derecho: 'Derecho',
    EducacionFisica: 'Educación Física',
    Biologia: 'Biología',
    Artes: 'Artes Plásticas',
    Educacion: 'Ciencias de la Educación',
    Otra: 'Otra Carrera'
  }
  return mapeo[carrera] || carrera
}

function deporteLegible(deporte) {
  const mapeo = {
    Futbol: '⚽ Fútbol',
    Natacion: '🏊 Natación',
    Ciclismo: '🚴 Ciclismo',
    Gimnasio: '💪 Gimnasio',
    Voleibol: '🏐 Voleibol',
    Boxeo: '🥊 Boxeo / Kickboxing',
    Basketball: '🏀 Baloncesto / Basketball',
    Correr: '🏃 Running',
    Surf: '🏄 Surf',
    Escalada: '🧗 Escalada',
    Ninguna: '😌 Solo estudio'
  }
  return mapeo[deporte] || deporte || 'Ninguno'
}

// --- Lógica de progresión ---
function esProvinciaActualDesbloqueada(id) {
  const idx = secuenciaProvincias.indexOf(id)
  if (idx === 0) return !misionesCompletadas.value.includes(id)
  const prevCompletada = misionesCompletadas.value.includes(secuenciaProvincias[idx - 1])
  const actCompletada = misionesCompletadas.value.includes(id)
  return prevCompletada && !actCompletada
}

// --- Lógica de Edición ---
function activarModoEdicion() {
  reproducirEfecto('click')
  formularioEdicion.nombre = identidadHeroe.nombre
  formularioEdicion.edad = identidadHeroe.edad
  
  const aliasesPredefinidos = ['Centinela Tico', 'Guardián Nocturno', 'Sombra Universitaria', 'Viajero de la Noche']
  if (aliasesPredefinidos.includes(identidadHeroe.aliasHeroe)) {
    formularioEdicion.aliasHeroe = identidadHeroe.aliasHeroe
    formularioEdicion.aliasPersonalizado = ''
  } else {
    formularioEdicion.aliasHeroe = 'Otro'
    formularioEdicion.aliasPersonalizado = identidadHeroe.aliasHeroe
  }
  
  erroresEdicion.nombre = ''
  erroresEdicion.edad = ''
  erroresEdicion.aliasHeroe = ''
  modoEdicion.value = true
}

function cancelarEdicion() {
  reproducirEfecto('click')
  modoEdicion.value = false
}

// Computed: validación del formulario
const formularioValido = computed(() => {
  const nombre = formularioEdicion.nombre.trim()
  const edad = Number(formularioEdicion.edad)
  
  // Nombre
  if (nombre.length < 2) return false
  // Edad
  if (isNaN(edad) || edad < 17 || edad > 45) return false
  // Alias
  if (formularioEdicion.aliasHeroe === 'Otro') {
    if (formularioEdicion.aliasPersonalizado.trim().length < 3) return false
  } else if (!formularioEdicion.aliasHeroe) {
    return false
  }
  
  return true
})

function guardarCambiosPerfil() {
  if (!formularioValido.value) return
  
  const aliasFinal = formularioEdicion.aliasHeroe === 'Otro'
    ? formularioEdicion.aliasPersonalizado.trim()
    : formularioEdicion.aliasHeroe

  actualizarIdentidad({
    nombre: formularioEdicion.nombre.trim(),
    edad: Number(formularioEdicion.edad),
    aliasHeroe: aliasFinal
  })
  
  reproducirEfecto('subirNivel')
  mostrarNotifExito('Perfil actualizado y guardado correctamente.')
  modoEdicion.value = false
}

// --- Notificaciones del dashboard ---
function mostrarNotifExito(msg) {
  mensajeFeedback.value = msg
  feedbackExitoso.value = true
  setTimeout(() => {
    if (mensajeFeedback.value === msg) mensajeFeedback.value = ''
  }, 4000)
}

function mostrarNotifError(msg) {
  mensajeFeedback.value = msg
  feedbackExitoso.value = false
  setTimeout(() => {
    if (mensajeFeedback.value === msg) mensajeFeedback.value = ''
  }, 4000)
}

// --- Métodos de guardado manual ---
function guardarManualmente() {
  reproducirEfecto('click')
  guardarProgreso()
  mostrarNotifExito('💾 Partida guardada con éxito.')
  comprobarExisteSave()
}

function cargarManualmente() {
  reproducirEfecto('click')
  const cargado = cargarProgreso()
  if (cargado) {
    mostrarNotifExito('📂 Progreso cargado satisfactoriamente.')
    emit('cerrar')
  } else {
    mostrarNotifError('❌ No se pudo cargar el progreso.')
  }
}

// --- Borrar Progreso ---
function abrirConfirmacionBorrar() {
  reproducirEfecto('click')
  mostrarConfirmarBorrar.value = true
}

function cerrarConfirmacionBorrar() {
  reproducirEfecto('click')
  mostrarConfirmarBorrar.value = false
}

function confirmarBorrarProgreso() {
  reproducirEfecto('subirNivel')
  borrarProgreso()
  mostrarConfirmarBorrar.value = false
  comprobarExisteSave()
  emit('cerrar')
}

function cerrar() {
  reproducirEfecto('click')
  emit('cerrar')
}
</script>

<style scoped>
/* --- Modal overlay & layout --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(4, 6, 15, 0.85);
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

.modal-card-centro {
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  color: var(--color-text-primary);
  overflow: hidden;
}

.btn-cerrar-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  transition: color var(--transition-fast);
}

.btn-cerrar-modal:hover {
  color: var(--color-neon-purple);
}

/* --- Cabecera --- */
.centro-header {
  text-align: center;
  margin-bottom: var(--space-1);
}

.centro-header h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  margin: 0;
}

.subtitulo-centro {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* --- Tabs --- */
.tabs-centro {
  display: flex;
  gap: var(--space-2);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 2px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: none;
  border: none;
  padding: var(--space-3) var(--space-1);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-base);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  outline: none;
}

.tab-btn:hover {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.02);
}

.tab-btn.activo {
  color: var(--color-neon-purple);
  border-color: var(--color-neon-purple);
  text-shadow: 0 0 5px var(--color-neon-purple-glow);
}

/* --- Contenido --- */
.contenido-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  overflow: hidden;
}

/* --- Pestaña: Perfil --- */
.seccion-perfil {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.perfil-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.tarjeta-info {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  text-align: left;
}

.tarjeta-info h3 {
  margin: 0 0 var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tarjeta-info.civil h3 {
  color: var(--color-neon-blue);
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
  padding-bottom: var(--space-2);
}

.tarjeta-info.heroica h3 {
  color: var(--color-neon-purple);
  border-bottom: 1px solid rgba(184, 79, 255, 0.15);
  padding-bottom: var(--space-2);
}

.detalles-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.detalles-info p {
  margin: 0;
  line-height: 1.4;
}

.tarjeta-info.mision-reciente {
  grid-column: span 2;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.02);
  box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.03);
}

.tarjeta-info.mision-reciente h3 {
  color: var(--color-neon-gold) !important;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: var(--space-2);
}

.grid-mision-reciente {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-2);
}

.progreso-sospecha {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--space-2);
}

.barra-sospecha-centro {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.barra-sospecha-relleno {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.barra-sospecha-relleno.segura { background: var(--color-neon-green); }
.barra-sospecha-relleno.rumores { background: var(--color-neon-gold); }
.barra-sospecha-relleno.alta { background: #ff8c00; }
.barra-sospecha-relleno.investigacion { background: #ff4646; }

.sospecha-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.sospecha-rango-badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}
.sospecha-rango-badge.segura { background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); color: var(--color-neon-green); }
.sospecha-rango-badge.rumores { background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); color: var(--color-neon-gold); }
.sospecha-rango-badge.alta { background: rgba(255, 140, 0, 0.1); border: 1px solid rgba(255, 140, 0, 0.3); color: #ff8c00; }
.sospecha-rango-badge.investigacion { background: rgba(255, 70, 70, 0.1); border: 1px solid rgba(255, 70, 70, 0.3); color: #ff4646; }

/* Título heroico */
.titulo-heroico-contenedor {
  margin-top: var(--space-3);
  padding: var(--space-3);
  background: rgba(255, 215, 0, 0.02);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: var(--radius-md);
}
.titulo-nombre-val {
  color: var(--color-neon-gold);
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
}
.titulo-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.3;
  margin: 4px 0 0;
  font-style: italic;
}

/* Calendario Académico */
.calendario-basico {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: var(--text-sm);
}
.barra-calendario-semana {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-block: var(--space-3);
}
.barra-calendario-relleno {
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  border-radius: var(--radius-full);
}
.nota-calendario {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin: 0;
}

.btn-editar-perfil-centro {
  grid-column: span 2;
  margin-inline: auto;
}

/* --- Formulario de Edición --- */
.formulario-edicion-centro {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: left;
  flex: 1;
  overflow: hidden;
}

.form-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-12);
}

.form-group-edicion {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group-edicion label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.input-formulario-edicion,
.select-formulario-edicion {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  padding: var(--space-3);
  font-size: var(--text-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input-formulario-edicion:focus,
.select-formulario-edicion:focus {
  border-color: var(--color-neon-purple);
}

.error-edicion {
  color: #ff4646;
  font-size: 0.75rem;
}

.informacion-bloqueada-centro {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.acciones-edicion {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  position: sticky;
  bottom: 0;
  background: #0d091a;
  z-index: 10;
  margin-top: auto;
}

/* --- Pestaña: Progreso --- */
.seccion-progreso-scroll,
.seccion-mochila-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  text-align: left;
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.progreso-provincias-ruta h4,
.progreso-bloque h4,
.inventario-bloque h4 {
  margin: 0 0 var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-neon-blue);
  border-bottom: 1px solid rgba(0, 200, 255, 0.1);
  padding-bottom: 6px;
}

.ruta-lista {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

.ruta-nodo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  opacity: 0.5;
  transition: opacity var(--transition-base);
}

.ruta-nodo.completado {
  opacity: 1;
}

.ruta-nodo.activo-desbloqueado {
  opacity: 1;
}

.nodo-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.completado .nodo-check {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  box-shadow: 0 0 5px var(--color-neon-green-glow);
}

.activo-desbloqueado .nodo-check {
  background: rgba(255, 215, 0, 0.15);
  border-color: var(--color-neon-gold);
  color: var(--color-neon-gold);
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

.nodo-texto {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.nodo-nombre {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.nodo-estado {
  font-size: 0.65rem;
  color: var(--color-text-secondary);
}

.hitos-grid,
.logros-grid,
.mochila-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--space-2);
}

.hito-card,
.logro-card,
.item-mochila-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.hito-card { border-left: 2px solid var(--color-neon-blue); }
.logro-card { border-left: 2px solid var(--color-neon-gold); }
.item-mochila-card { border-left: 2px solid var(--color-neon-purple); }

.item-mochila-card.after-recuerdo {
  border-left-color: var(--color-neon-green);
}

.vacio-texto {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0;
}

/* --- Pestaña: Opciones --- */
.opciones-contenido {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  text-align: center;
  max-width: 360px;
  margin-inline: auto;
  padding-block: var(--space-4);
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.opciones-intro {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.opciones-botones-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cargar-seccion {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.save-advertencia {
  color: #ff4646;
  font-size: 0.75rem;
  margin: 0;
  font-weight: var(--font-semibold);
}

.btn-guardar-manual {
  background: linear-gradient(135deg, var(--color-neon-blue), #005a9c);
  border-color: rgba(0, 200, 255, 0.4);
}

.btn-guardar-manual:hover {
  background: linear-gradient(135deg, #33ccff, #0088cc);
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.4);
  transform: translateY(-2px);
}

.feedback-notif {
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  margin-top: var(--space-2);
  animation: fadeIn 0.3s ease;
}

.feedback-notif.exito {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: var(--color-neon-green);
}

.feedback-notif.error {
  background: rgba(255, 70, 70, 0.08);
  border: 1px solid rgba(255, 70, 70, 0.3);
  color: #ff4646;
}

/* --- Pestaña: Audio --- */
.seccion-audio {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.audio-config-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.audio-intro {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2) 0;
  line-height: 1.4;
  text-align: left;
}

.control-grupo-audio {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.control-fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.control-columna {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
}

.control-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-align: left;
}

.control-icono {
  font-size: 1.5rem;
  line-height: 1;
}

.control-texto {
  display: flex;
  flex-direction: column;
}

.control-label {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.control-subtexto {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* Switches Neón */
.switch-neon {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}

.switch-neon input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-neon {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: .4s;
  border-radius: 34px;
}

.slider-neon:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: var(--color-text-secondary);
  transition: .4s;
  border-radius: 50%;
}

.switch-neon input:checked + .slider-neon {
  border-color: var(--color-neon-purple);
  box-shadow: 0 0 8px var(--color-neon-purple);
}

.switch-neon input:checked + .slider-neon:before {
  transform: translateX(24px);
  background-color: var(--color-neon-purple);
  box-shadow: 0 0 6px var(--color-neon-purple);
}

/* Sliders de Volumen Neón */
.slider-contenedor-neon {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.deshabilitado-opaco {
  opacity: 0.35;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.rango-neon {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.rango-neon::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-neon-blue);
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 8px var(--color-neon-blue);
  transition: transform 0.1s ease;
}

.rango-neon::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.rango-neon::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-neon-blue);
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 8px var(--color-neon-blue);
  transition: transform 0.1s ease;
}

.rango-neon::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.barra-progreso-rango {
  position: absolute;
  left: 0;
  height: 8px;
  background: var(--color-neon-blue);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  z-index: 1;
  pointer-events: none;
  box-shadow: 0 0 6px var(--color-neon-blue);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .modal-card-centro {
    padding: var(--space-6) var(--space-4);
    height: 95vh;
    max-height: 95vh;
  }
  .perfil-info-grid {
    grid-template-columns: 1fr;
  }
  .btn-editar-perfil-centro {
    grid-column: span 1;
  }
  .tab-etiqueta {
    display: none;
  }
  .tab-btn {
    padding-block: var(--space-2);
  }
}

.advertencia-sospecha-centro {
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  line-height: 1.4;
  border: 1px solid transparent;
  width: 100%;
}
.advertencia-sospecha-centro p {
  margin: 0;
}
.advertencia-sospecha-centro.segura {
  background: rgba(0, 255, 136, 0.05);
  border-color: rgba(0, 255, 136, 0.2);
  color: var(--color-neon-green);
}
.advertencia-sospecha-centro.rumores {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
  color: var(--color-neon-gold);
}
.advertencia-sospecha-centro.alta {
  background: rgba(255, 140, 0, 0.05);
  border-color: rgba(255, 140, 0, 0.2);
  color: #ff8c00;
}
.advertencia-sospecha-centro.investigacion {
  background: rgba(255, 70, 70, 0.05);
  border-color: rgba(255, 70, 70, 0.2);
  color: #ff4646;
}
</style>
