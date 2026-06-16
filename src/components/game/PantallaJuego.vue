<template>
  <!-- PantallaJuego: pantalla de juego activo (preguntas de la misión) -->
  <section class="pantalla-juego" aria-label="Pantalla de juego activo">
    <div class="contenedor-juego animate-fade-in-scale">

      <!-- ================= NARRATIVA INICIAL ================= -->
      <div v-if="subEstadoPantalla === 'narrativa_inicial'" class="tarjeta-narrativa card text-center animate-fade-in">
        <span class="icono-narrativa animate-float">🧭</span>
        <h2 class="titulo-narrativa">MISIÓN: {{ provinciaActiva?.tituloMision }}</h2>
        <div class="divisoria-neon"></div>
        <p class="texto-narrativa-principal">
          <strong>Objetivo primordial:</strong> Salvar la noche ayudando a los estudiantes a vivir un after divertido, cultural y responsable en {{ provinciaActiva?.nombre }}.
        </p>
        <p class="texto-narrativa-secundario">
          Tu misión comienza en <strong>{{ provinciaActiva?.lugarPrincipal }}</strong>. Debes guiar a los grupos universitarios para que disfruten de la historia y cultura, y culminar con éxito en <strong>{{ provinciaActiva?.lugarAfter }}</strong>.
        </p>
        <button class="btn btn-hero btn-lg btn-iniciar-mision" @click="comenzarMisionPrincipal()">
          ⚡ Iniciar Misión
        </button>
      </div>

      <!-- ================= CHECKPOINT 1 ================= -->
      <div v-else-if="subEstadoPantalla === 'checkpoint_1'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <span class="icono-narrativa animate-float">🎉</span>
        <h2 class="titulo-narrativa text-neon-green">CHECKPOINT DESBLOQUEADO</h2>
        <h3 class="subtitulo-checkpoint">🍻 BRINDIS TICO</h3>
        <div class="divisoria-neon green"></div>
        <p class="texto-narrativa-principal">
          ¡Excelente! Has demostrado que conoces el alma de San José.
        </p>
        <p class="texto-narrativa-secundario">
          Los estudiantes de Montes de Oca confían cada vez más en ti. Tu reputación aumenta y la noche avanza de forma segura.
        </p>
        
        <div class="recompensas-checkpoint-caja">
          <p class="rec-title">Recompensas Obtenidas:</p>
          <div class="rec-badges-flex">
            <span class="rec-badge-item">⭐ +20 XP</span>
            <span class="rec-badge-item">🤝 +10 Reputación</span>
            <span class="rec-badge-item">🎁 Recuerdo: Brindis Tico</span>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" @click="continuarDesdeCheckpoint1()">
          Continuar misión →
        </button>
      </div>

      <!-- ================= CHECKPOINT 2 ================= -->
      <div v-else-if="subEstadoPantalla === 'checkpoint_2'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <span class="icono-narrativa animate-float">🏆</span>
        <h2 class="titulo-narrativa text-neon-purple">CHECKPOINT DESBLOQUEADO</h2>
        <h3 class="subtitulo-checkpoint">🎉 AFTER SEGURO</h3>
        <div class="divisoria-neon purple"></div>
        <p class="texto-narrativa-principal">
          ¡Fabuloso! Tu reputación nocturna como héroe del after se esparce por toda la capital.
        </p>
        <p class="texto-narrativa-secundario">
          Los estudiantes se sienten completamente seguros bajo tu cuidado. Te aproximas al reto definitivo en la ciudad.
        </p>

        <div class="recompensas-checkpoint-caja">
          <p class="rec-title">Recompensas Obtenidas:</p>
          <div class="rec-badges-flex">
            <span class="rec-badge-item">⭐ +30 XP</span>
            <span class="rec-badge-item">🤝 +15 Reputación</span>
            <span class="rec-badge-item">🏆 Logro: After Seguro</span>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" @click="continuarDesdeCheckpoint2()">
          Aceptar Siguiente Reto →
        </button>
      </div>

      <!-- ================= DESAFÍO FINAL INTRO ================= -->
      <div v-else-if="subEstadoPantalla === 'desafio_final_intro'" class="tarjeta-narrativa card text-center desafio-final-card animate-fade-in">
        <span class="icono-narrativa icono-alerta animate-pulse">🔥</span>
        <h2 class="titulo-narrativa text-neon-red">¡DESAFÍO FINAL!</h2>
        <h3 class="subtitulo-desafio">{{ provinciaActiva?.nombre?.toUpperCase() }}</h3>
        <div class="divisoria-neon red"></div>
        <p class="texto-narrativa-principal">
          La noche en San José depende enteramente de tus acciones. Se reporta un conato de incendio en el Teatro Melico Salazar.
        </p>
        <p class="texto-narrativa-secundario">
          Responde correctamente bajo presión extrema para salvar la provincia, guiar a los bomberos y consolidarte como leyenda nacional.
        </p>

        <div class="detalles-desafio-caja">
          <span class="dificultad-desafio">DIFICULTAD: ★★★★★</span>
          <span class="tiempo-desafio" v-if="esInformatica">
            ⚡ BONO INFORMÁTICO: +5s extra de tiempo (25 segundos)
          </span>
        </div>

        <button class="btn btn-hero btn-lg btn-danger" @click="iniciarDesafioFinal()">
          🚨 Aceptar Desafío
        </button>
      </div>

      <!-- ================= NARRATIVA FINAL ================= -->
      <div v-else-if="subEstadoPantalla === 'narrativa_final'" class="tarjeta-narrativa card text-center victoria-card animate-fade-in">
        <span class="icono-narrativa animate-float">🍻</span>
        <h2 class="titulo-narrativa text-neon-green">MISIÓN COMPLETADA</h2>
        <h3 class="subtitulo-victoria">{{ provinciaActiva?.nombre }}</h3>
        <div class="divisoria-neon green"></div>
        <p class="texto-narrativa-principal">
          ¡Héroe! Lograste salvar la noche en la capital. Los estudiantes universitarios celebran en La Cali gracias a tu gran cuidado y guía responsable.
        </p>
        <p class="texto-narrativa-secundario">
          Todos disfrutan de un after divertido y enriquecedor. Tu reputación nocturna se ha consolidado en la capital.
        </p>

        <div class="recompensas-victoria-caja">
          <p class="rec-title">Objetos Desbloqueados:</p>
          <div class="rec-badges-flex" v-if="provinciaActiva">
            <span class="rec-badge-item" v-if="provinciaActiva.recompensaPrincipal">
              {{ provinciaActiva.recompensaPrincipal.emoji }} {{ provinciaActiva.recompensaPrincipal.nombre }}
            </span>
            <span class="rec-badge-item" v-if="provinciaActiva.recompensaSecundaria">
              {{ provinciaActiva.recompensaSecundaria.emoji }} {{ provinciaActiva.recompensaSecundaria.nombre }}
            </span>
            <span class="rec-badge-item next-prov">➡️ Siguiente Provincia: Heredia</span>
          </div>
        </div>

        <button class="btn btn-hero btn-lg" @click="finalizarMisionAventura()">
          📊 Ver Estadísticas y Guardar
        </button>
      </div>

      <!-- ================= FLUX DE JUEGO (PREGUNTA ACTIVA) ================= -->
      <div v-else-if="subEstadoPantalla === 'pregunta'" class="flujo-pregunta-activo animate-fade-in">
        <!-- Header de la misión -->
        <header class="encabezado-juego">
          <div class="insignia-mision">
            <span class="emoji-provincia-mision" aria-hidden="true">
              {{ provinciaActiva?.emoji }}
            </span>
            <div>
              <p class="etiqueta-mision">Misión activa</p>
              <h2 class="nombre-mision">{{ provinciaActiva?.tituloMision }}</h2>
            </div>
          </div>

          <div class="encabezado-derecha-juego">
            <!-- Temporizador visual -->
            <div class="temporizador-badge" :class="{ 'urgente': tiempoRestante <= 5 }">
              <span class="emoji-reloj">⏱️</span>
              <span class="segundos-reloj">{{ tiempoRestante }}s</span>
            </div>

            <!-- Indicador de progreso de preguntas -->
            <div class="progreso-preguntas">
              <span class="p-actual">{{ preguntaActual + 1 }}</span>
              <span class="p-separador">/</span>
              <span class="p-total">{{ totalPreguntas }}</span>
            </div>
          </div>
        </header>

        <!-- Barra de progreso de preguntas -->
        <div class="barra-progreso-juego" aria-hidden="true">
          <div
            class="relleno-progreso-juego"
            :style="{ width: porcentajeProgresoPregunta + '%' }"
          ></div>
        </div>

        <!-- Área de pregunta -->
        <div class="area-pregunta" v-if="preguntaActualDatos">
          <div class="tarjeta-pregunta card animate-fade-in">
            <!-- Barra de tiempo de la pregunta -->
            <div class="pista-tiempo-pregunta">
              <div 
                class="relleno-tiempo-pregunta" 
                :style="{ width: (tiempoRestante / tiempoMaximoPregunta * 100) + '%' }"
                :class="{ 'tiempo-alerta': tiempoRestante <= 5 }"
              ></div>
            </div>

            <p class="categoria-pregunta">
              📂 {{ preguntaActualDatos.categoria }}
            </p>
            <h3 class="texto-pregunta">
              {{ preguntaActualDatos.texto }}
            </h3>
          </div>

          <!-- Opciones de respuesta -->
          <div class="cuadricula-opciones">
            <button
              v-for="(opcion, idx) in preguntaActualDatos.opciones"
              :key="idx"
              class="boton-opcion"
              :class="{
                'opcion-correcta':   respuestaSeleccionada !== null && idx === preguntaActualDatos.correcta,
                'opcion-incorrecta': respuestaSeleccionada === idx && idx !== preguntaActualDatos.correcta,
                'opcion-revelada':   respuestaSeleccionada !== null && idx === preguntaActualDatos.correcta
              }"
              :disabled="respuestaSeleccionada !== null"
              @click="seleccionarRespuesta(idx)"
              :aria-label="`Opción ${idx + 1}: ${opcion}`"
            >
              <span class="letra-opcion">{{ letrasOpciones[idx] }}</span>
              <span class="texto-opcion">{{ opcion }}</span>
            </button>
          </div>
        </div>

        <!-- Panel de resultado de respuesta con Consecuencias Narrativas -->
        <transition name="fade">
          <div v-if="respuestaSeleccionada !== null" class="retroalimentacion-respuesta" :class="esCorrecta ? 'retroalimentacion-correcta' : 'retroalimentacion-incorrecta'">
            <span class="icono-retroalimentacion">
              {{ respuestaSeleccionada === -1 ? '⏱️' : (esCorrecta ? '✅' : '❌') }}
            </span>
            <div class="contenido-retroalimentacion">
              <p class="texto-retroalimentacion">
                <strong>
                  {{ respuestaSeleccionada === -1 ? '¡Tiempo agotado!' : (esCorrecta ? '¡Éxito Narrativo!' : 'Consecuencia Narrativa:') }}
                </strong>
              </p>
              
              <!-- Texto Narrativo -->
              <p class="narrativa-consecuencia">
                {{ respuestaSeleccionada === -1 ? 'Los estudiantes se desorientaron al expirar el tiempo de búsqueda y se perdieron en la capital.' : (esCorrecta ? (preguntaActualDatos?.consecuenciaCorrecta || '¡Lograste orientar y guiar al grupo con total éxito!') : (preguntaActualDatos?.consecuenciaIncorrecta || 'Los estudiantes se confundieron de dirección y terminaron lejos del after.')) }}
              </p>

              <!-- Explicación Educativa -->
              <div class="explicacion-educativa-seccion">
                <span class="etiqueta-explicacion">💡 Sabías que...</span>
                <p class="explicacion-retroalimentacion">
                  {{ preguntaActualDatos?.explicacion }}
                </p>
              </div>

              <!-- Atributos Afectados -->
              <div class="cambios-atributos-pregunta">
                <span class="badge-cambio-atributo" :class="esCorrecta ? 'sube' : 'baja'">
                  {{ esCorrecta ? '🤝 Reputación +5' : (respuestaSeleccionada === -1 ? '🤝 Reputación -5, ⚡ Energía -5' : catCarreraPenalidad) }}
                </span>
              </div>
            </div>
          </div>
        </transition>

        <!-- Controles de juego -->
        <div class="controles-juego">
          <button class="btn btn-outline" @click="alSalir">
            ← Volver al mapa
          </button>
          <button
            v-if="respuestaSeleccionada !== null"
            class="btn btn-primary"
            @click="alSiguientePregunta"
          >
            {{ preguntaActual + 1 >= totalPreguntas ? '🏆 Terminar Misión' : '→ Siguiente pregunta' }}
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { ref, computed, onMounted, onUnmounted } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'
import { useTemporizador } from '../../composables/useTemporizador.js'

// --- Emits ---
const emit = defineEmits(['salir', 'completar'])

// --- Estado del juego ---
const { provinciaActiva, completarMision, navegarA, ganarExperiencia, identidadHeroe, estadisticasHeroe, PANTALLAS } = useEstadoJuego()

// --- Audio ---
const { reproducirEfecto } = useAudio()

// --- Temporizador ---
const { tiempoRestante, iniciar, pausar, reiniciar } = useTemporizador()

// --- Estado local de la pantalla de juego aventura ---
const subEstadoPantalla = ref('narrativa_inicial')
const preguntaActual       = ref(0)
const respuestaSeleccionada = ref(null)
const respuestasCorrectasCount = ref(0)
const puntaje              = ref(0)
const rachaRespuestas      = ref(0)
const tiempoMaximoPregunta = ref(20)

// --- Letras de opciones ---
const letrasOpciones = ['A', 'B', 'C', 'D']

// --- PREGUNTAS DINÁMICAS POR CARRERA PARA SAN JOSÉ (Pregunta 7) ---
const PREGUNTAS_ESPECIALIDAD = {
  Informatica: {
    id: "sj-007-carrera",
    texto: "La misión te lleva a las cercanías del TEC en San José. Te encuentras con un equipo intentando depurar un sistema crítico que controla los semáforos de la capital. ¿Cuál es el error de programación más famoso de la historia que provocaba que el año se interpretara como 1900?",
    opciones: ["Efecto 2000 (Y2K)", "Error de desbordamiento de búfer", "División por cero de Pentium", "Ataque del gusano Morris"],
    correcta: 0,
    explicacion: "El Y2K (Year 2000) fue un bug informático global en el que los sistemas que representaban el año con dos dígitos interpretaban '00' como 1900 en lugar de 2000.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Excelente! Identificaste el bug Y2K y reiniciaste el sistema a tiempo. Los semáforos volvieron a funcionar y los peatones cruzaron seguros.",
    consecuenciaIncorrecta: "Los semáforos colapsaron por unos minutos y tuviste que correr a activar el respaldo físico. Te desgastaste buscando el panel."
  },
  Software: {
    id: "sj-007-carrera",
    texto: "La misión te lleva a las cercanías del TEC en San José. Te encuentras con un equipo intentando depurar un sistema crítico que controla los semáforos de la capital. ¿Cuál es el error de programación más famoso de la historia que provocaba que el año se interpretara como 1900?",
    opciones: ["Efecto 2000 (Y2K)", "Error de desbordamiento de búfer", "División por cero de Pentium", "Ataque del gusano Morris"],
    correcta: 0,
    explicacion: "El Y2K (Year 2000) fue un bug informático global en el que los sistemas que representaban el año con dos dígitos interpretaban '00' como 1900 en lugar de 2000.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Excelente! Identificaste el bug Y2K y reiniciaste el sistema a tiempo. Los semáforos volvieron a funcionar y los peatones cruzaron seguros.",
    consecuenciaIncorrecta: "Los semáforos colapsaron por unos minutos y tuviste que correr a activar el respaldo físico. Te desgastaste buscando el panel."
  },
  Ciberseguridad: {
    id: "sj-007-carrera",
    texto: "La misión te lleva a las cercanías del TEC en San José. Te encuentras con un equipo intentando depurar un sistema crítico que controla los semáforos de la capital. ¿Cuál es el error de programación más famoso de la historia que provocaba que el año se interpretara como 1900?",
    opciones: ["Efecto 2000 (Y2K)", "Error de desbordamiento de búfer", "División por cero de Pentium", "Ataque del gusano Morris"],
    correcta: 0,
    explicacion: "El Y2K (Year 2000) fue un bug informático global en el que los sistemas que representaban el año con dos dígitos interpretaban '00' como 1900 en lugar de 2000.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Excelente! Identificaste el bug Y2K y reiniciaste el sistema a tiempo. Los semáforos volvieron a funcionar y los peatones cruzaron seguros.",
    consecuenciaIncorrecta: "Los semáforos colapsaron por unos minutos y tuviste que correr a activar el respaldo físico. Te desgastaste buscando el panel."
  },
  Datos: {
    id: "sj-007-carrera",
    texto: "La misión te lleva a las cercanías del TEC en San José. Te encuentras con un equipo intentando depurar un sistema crítico que controla los semáforos de la capital. ¿Cuál es el error de programación más famoso de la historia que provocaba que el año se interpretara como 1900?",
    opciones: ["Efecto 2000 (Y2K)", "Error de desbordamiento de búfer", "División por cero de Pentium", "Ataque del gusano Morris"],
    correcta: 0,
    explicacion: "El Y2K (Year 2000) fue un bug informático global en el que los sistemas que representaban el año con dos dígitos interpretaban '00' como 1900 en lugar de 2000.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Excelente! Identificaste el bug Y2K y reiniciaste el sistema a tiempo. Los semáforos volvieron a funcionar y los peatones cruzaron seguros.",
    consecuenciaIncorrecta: "Los semáforos colapsaron por unos minutos y tuviste que correr a activar el respaldo físico. Te desgastaste buscando el panel."
  },
  InformaticaEducativa: {
    id: "sj-007-carrera",
    texto: "La misión te lleva a las cercanías del TEC en San José. Te encuentras con un equipo intentando depurar un sistema crítico que controla los semáforos de la capital. ¿Cuál es el error de programación más famoso de la historia que provocaba que el año se interpretara como 1900?",
    opciones: ["Efecto 2000 (Y2K)", "Error de desbordamiento de búfer", "División por cero de Pentium", "Ataque del gusano Morris"],
    correcta: 0,
    explicacion: "El Y2K (Year 2000) fue un bug informático global en el que los sistemas que representaban el año con dos dígitos interpretaban '00' como 1900 en lugar de 2000.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Excelente! Identificaste el bug Y2K y reiniciaste el sistema a tiempo. Los semáforos volvieron a funcionar y los peatones cruzaron seguros.",
    consecuenciaIncorrecta: "Los semáforos colapsaron por unos minutos y tuviste que correr a activar el respaldo físico. Te desgastaste buscando el panel."
  },
  Turismo: {
    id: "sj-007-carrera",
    texto: "Pasas frente al histórico Gran Hotel Costa Rica en la Avenida Central. Un grupo de turistas te pregunta sobre la declaración oficial del lema costarricense conocido mundialmente por reflejar la paz, alegría y ecología del país. ¿Cuál es este famoso lema?",
    opciones: ["¡Vivan siempre el trabajo y la paz!", "Pura Vida", "Costa Rica: Sin ingredientes artificiales", "El país más feliz del mundo"],
    correcta: 1,
    explicacion: "'Pura Vida' es el saludo e identidad costarricense por excelencia, que refleja el optimismo, cordialidad y aprecio por la naturaleza.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Estupendo! Los turistas repitieron 'Pura Vida' con una sonrisa y celebraron la gran hospitalidad de la capital.",
    consecuenciaIncorrecta: "Los turistas se sintieron desorientados con tu respuesta y decidieron buscar otro guía, afectando tu reputación local."
  },
  Administracion: {
    id: "sj-007-carrera",
    texto: "Pasas frente al histórico Gran Hotel Costa Rica en la Avenida Central. Un grupo de turistas te pregunta sobre la declaración oficial del lema costarricense conocido mundialmente por reflejar la paz, alegría y ecología del país. ¿Cuál es este famoso lema?",
    opciones: ["¡Vivan siempre el trabajo y la paz!", "Pura Vida", "Costa Rica: Sin ingredientes artificiales", "El país más feliz del mundo"],
    correcta: 1,
    explicacion: "'Pura Vida' es el saludo e identidad costarricense por excelencia, que refleja el optimismo, cordialidad y aprecio por la naturaleza.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Estupendo! Los turistas repitieron 'Pura Vida' con una sonrisa y celebraron la gran hospitalidad de la capital.",
    consecuenciaIncorrecta: "Los turistas se sintieron desorientados con tu respuesta y decidieron buscar otro guía, afectando tu reputación local."
  },
  Derecho: {
    id: "sj-007-carrera",
    texto: "Caminas frente a la Corte Suprema de Justicia en el Barrio Judicial. Un grupo de estudiantes de primer ingreso debate sobre la abolición del ejército en Costa Rica en 1948 por parte de José Figueres. ¿En qué histórico edificio josefino se dio el mazo de abolición (hoy convertido en museo)?",
    opciones: ["Cuartel Bellavista (Museo Nacional)", "Castillo Azul", "Edificio Metálico", "Antigua Aduana"],
    correcta: 0,
    explicacion: "Don Pepe Figueres abolió el ejército el 1 de diciembre de 1948 en el Cuartel Bellavista, símbolo militar que hoy alberga el Museo Nacional de Costa Rica.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Correcto! Resolviste la discusión legal e histórica de los jóvenes de forma magistral, inspirándolos a respetar la paz nacional.",
    consecuenciaIncorrecta: "Los jóvenes siguieron discutiendo y se marcharon confundidos de lugar, perdiendo la confianza en tus conocimientos jurídicos."
  },
  EducacionFisica: {
    id: "sj-007-carrera",
    texto: "Patrullas los alrededores del Parque Metropolitano La Sabana. Te detienes a observar el Estadio Nacional y recuerdas una curiosidad sobre el viejo Estadio Nacional, inaugurado en 1924. ¿Qué histórico exfutbolista costarricense, apodado 'El Mago' y considerado uno de los mejores de Centroamérica, brilló en esa época?",
    opciones: ["Alejandro Morera Soto", "Errol Daniels", "Keylor Navas", "Paulo Wanchope"],
    correcta: 0,
    explicacion: "Alejandro Morera Soto brilló en la UCR, Liga Deportiva Alajuelense y el FC Barcelona en los años 1930, ganándose el apodo de 'El Mago'.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Genial! Relataste las hazañas del 'Mago' Morera. Los deportistas se sintieron inspirados a hacer ejercicio nocturno responsable.",
    consecuenciaIncorrecta: "El grupo consideró tus datos erróneos y prefirieron dispersarse, disminuyendo la energía y diversión del grupo."
  },
  Biologia: {
    id: "sj-007-carrera",
    texto: "Exploras los senderos del Parque Bolívar en San José. Ves un hermoso árbol nacional florecido y decides explicarle a unos jóvenes la particularidad del fruto del árbol de Guanacaste. ¿Qué forma característica tiene la semilla de este árbol?",
    opciones: ["Forma de oreja humana", "Forma de estrella de mar", "Forma de concha marina", "Forma de gota de agua"],
    correcta: 0,
    explicacion: "El fruto del árbol de Guanacaste es una vaina circular dura que tiene una curiosa similitud con una oreja humana.",
    categoria: "Especialidad",
    consecuenciaCorrecta: "¡Correcto! Sorprendiste a los jóvenes con este dato botánico curioso. Aprendieron a valorar la flora nacional.",
    consecuenciaIncorrecta: "Tu explicación fue confusa y los jóvenes se marcharon con ideas erróneas del árbol nacional."
  }
}

function obtenerPreguntaEspecialidad(carrera) {
  return PREGUNTAS_ESPECIALIDAD[carrera] || PREGUNTAS_ESPECIALIDAD['Turismo']
}

// --- Computed: pregunta actual y totales ---
const totalPreguntas = computed(() => provinciaActiva.value?.preguntas?.length || 0)

const preguntaActualDatos = computed(() => {
  const preguntasList = provinciaActiva.value?.preguntas || []
  const preg = preguntasList[preguntaActual.value]
  // Inyección dinámica de la pregunta 7 en San José
  if (preg && preg.id === 'sj-007') {
    return obtenerPreguntaEspecialidad(identidadHeroe.carrera)
  }
  return preg || null
})

// --- Computed: porcentaje de progreso de preguntas ---
const porcentajeProgresoPregunta = computed(() => {
  if (totalPreguntas.value === 0) return 0
  return (preguntaActual.value / totalPreguntas.value) * 100
})

// --- Computed: si la respuesta seleccionada es correcta ---
const esCorrecta = computed(() => 
  respuestaSeleccionada.value !== null && 
  preguntaActualDatos.value && 
  respuestaSeleccionada.value === preguntaActualDatos.value.correcta
)

// --- Computed: ¿es Informático con bonificación activa? ---
const esInformatica = computed(() => 
  ['Informatica', 'Software', 'Ciberseguridad', 'Datos', 'InformaticaEducativa'].includes(identidadHeroe.carrera)
)

// --- Computed: penalización descriptiva de carrera para la UI ---
const catCarreraPenalidad = computed(() => {
  if (respuestaSeleccionada.value === null || respuestaSeleccionada.value === -1) return ''
  if (esCorrecta.value) return '🤝 Reputación +5'

  const cat = preguntaActualDatos.value?.categoria
  if (cat === 'Universidad' || cat === 'Responsabilidad') {
    const perdida = identidadHeroe.carrera === 'Derecho' ? 2 : 5
    return `🤝 Reputación -5, 🎓 Responsabilidad -${perdida}`
  } else {
    return '🤝 Reputación -5, ⚡ Energía -5'
  }
})

// --- Iniciar la pregunta activa y su temporizador ---
function iniciarPregunta() {
  respuestaSeleccionada.value = null
  
  // BONO: +5s para informáticos en preguntas difíciles (dificultad provincia >= 3 o Desafío Final)
  let maxTiempo = 20
  const esDificil = (provinciaActiva.value?.dificultad >= 3) || (preguntaActual.value === totalPreguntas.value - 1)
  if (esInformatica.value && esDificil) {
    maxTiempo = 25
  }
  tiempoMaximoPregunta.value = maxTiempo

  reiniciar(false, alAgotarTiempo)
  tiempoRestante.value = maxTiempo
  iniciar(alAgotarTiempo)
}

// --- Comenzar Misión Principal ---
function comenzarMisionPrincipal() {
  subEstadoPantalla.value = 'pregunta'
  respuestasCorrectasCount.value = 0
  iniciarPregunta()
}

// --- Manejador para cuando el tiempo se agota ---
function alAgotarTiempo() {
  if (respuestaSeleccionada.value !== null) return
  respuestaSeleccionada.value = -1 // Expiró el tiempo
  rachaRespuestas.value = 0
  
  // Penalizaciones por tiempo agotado
  estadisticasHeroe.reputacionNocturna = Math.max(0, estadisticasHeroe.reputacionNocturna - 5)
  estadisticasHeroe.energia = Math.max(0, estadisticasHeroe.energia - 5)
  estadisticasHeroe.sospechaIdentidad = Math.min(100, estadisticasHeroe.sospechaIdentidad + 5)

  reproducirEfecto('incorrecto')
}

// --- Seleccionar una respuesta ---
function seleccionarRespuesta(idx) {
  if (respuestaSeleccionada.value !== null) return
  pausar() // Pausar temporizador
  respuestaSeleccionada.value = idx
  
  if (preguntaActualDatos.value && idx === preguntaActualDatos.value.correcta) {
    reproducirEfecto('correcto')
    rachaRespuestas.value++
    respuestasCorrectasCount.value++
    
    // Puntos proporcionales
    puntaje.value += Math.round(100 / totalPreguntas.value)
    
    // Recompensa de reputación base
    estadisticasHeroe.reputacionNocturna = Math.min(100, estadisticasHeroe.reputacionNocturna + 5)
    estadisticasHeroe.sospechaIdentidad = Math.max(0, estadisticasHeroe.sospechaIdentidad - 1)
    
    // Lógica de XP base y bonos
    let xpGanar = 10
    const cat = preguntaActualDatos.value.categoria

    // BONO: Turismo (+20% XP en Geografía y Cultura)
    if (identidadHeroe.carrera === 'Turismo' && ['Geografía', 'Cultura'].includes(cat)) {
      xpGanar = 12
    }
    // BONO: Biología (+5 XP en Ambiente)
    else if (identidadHeroe.carrera === 'Biologia' && cat === 'Ambiente') {
      xpGanar = 15
    }
    // BONO: Administración (+3 XP por rachas consecutivas >= 2)
    else if (identidadHeroe.carrera === 'Administracion' && rachaRespuestas.value >= 2) {
      xpGanar += 3
    }
    
    ganarExperiencia(xpGanar)
  } else {
    reproducirEfecto('incorrecto')
    rachaRespuestas.value = 0
    
    // Penalizaciones dinámicas por fallar
    estadisticasHeroe.reputacionNocturna = Math.max(0, estadisticasHeroe.reputacionNocturna - 5)
    estadisticasHeroe.sospechaIdentidad = Math.min(100, estadisticasHeroe.sospechaIdentidad + 5)
    
    const cat = preguntaActualDatos.value?.categoria
    if (cat === 'Universidad' || cat === 'Responsabilidad') {
      let perdida = 5
      if (identidadHeroe.carrera === 'Derecho') {
        perdida = 2
      }
      estadisticasHeroe.responsabilidad = Math.max(0, estadisticasHeroe.responsabilidad - perdida)
    } else {
      estadisticasHeroe.energia = Math.max(0, estadisticasHeroe.energia - 5)
    }
  }
}

// --- Siguiente pregunta o transiciones a Checkpoints ---
function alSiguientePregunta() {
  const esSanJose = provinciaActiva.value?.id === 'san-jose'
  
  // San José: Checkpoint 1 tras la pregunta 4 (index 3)
  if (esSanJose && preguntaActual.value === 3 && subEstadoPantalla.value === 'pregunta') {
    subEstadoPantalla.value = 'checkpoint_1'
    ganarExperiencia(20) // +20 XP por Checkpoint
    estadisticasHeroe.reputacionNocturna = Math.min(100, estadisticasHeroe.reputacionNocturna + 10) // +10 reputación
    reproducirEfecto('desbloquear')
  } 
  // San José: Checkpoint 2 tras la pregunta 7 (index 6)
  else if (esSanJose && preguntaActual.value === 6 && subEstadoPantalla.value === 'pregunta') {
    subEstadoPantalla.value = 'checkpoint_2'
    ganarExperiencia(30) // +30 XP por Checkpoint
    estadisticasHeroe.reputacionNocturna = Math.min(100, estadisticasHeroe.reputacionNocturna + 15) // +15 reputación
    reproducirEfecto('desbloquear')
  } 
  // Finalizar preguntas y pasar a Outro Narrativo
  else if (preguntaActual.value + 1 >= totalPreguntas.value) {
    subEstadoPantalla.value = 'narrativa_final'
    reproducirEfecto('desbloquear')
  } 
  // Flujo normal de incremento
  else {
    preguntaActual.value++
    // Desafío Final: Advertencia antes de la pregunta 8 (index 7) en San José
    if (esSanJose && preguntaActual.value === 7) {
      subEstadoPantalla.value = 'desafio_final_intro'
    } else {
      iniciarPregunta()
    }
  }
}

// --- Continuar desde Checkpoints ---
function continuarDesdeCheckpoint1() {
  subEstadoPantalla.value = 'pregunta'
  preguntaActual.value++
  iniciarPregunta()
}

function continuarDesdeCheckpoint2() {
  subEstadoPantalla.value = 'desafio_final_intro'
}

function iniciarDesafioFinal() {
  subEstadoPantalla.value = 'pregunta'
  preguntaActual.value++
  iniciarPregunta()
}

function finalizarMisionAventura() {
  completarMision(
    provinciaActiva.value?.id,
    Math.min(100, puntaje.value),
    respuestasCorrectasCount.value,
    totalPreguntas.value
  )
  emit('completar', {
    idProvincia: provinciaActiva.value?.id,
    puntaje: Math.min(100, puntaje.value),
    correctas: respuestasCorrectasCount.value,
    total: totalPreguntas.value
  })
}

// --- Salir al mapa ---
function alSalir() {
  pausar()
  navegarA(PANTALLAS.MAPA)
  emit('salir')
}

// --- Teclado (1-4, A-D, Enter) ---
function alPresionarTecla(e) {
  // Manejo de pantallas intermedias de aventura con Enter
  if (subEstadoPantalla.value === 'narrativa_inicial') {
    if (e.key === 'Enter') comenzarMisionPrincipal()
    return
  }
  if (subEstadoPantalla.value === 'checkpoint_1') {
    if (e.key === 'Enter') continuarDesdeCheckpoint1()
    return
  }
  if (subEstadoPantalla.value === 'checkpoint_2') {
    if (e.key === 'Enter') continuarDesdeCheckpoint2()
    return
  }
  if (subEstadoPantalla.value === 'desafio_final_intro') {
    if (e.key === 'Enter') iniciarDesafioFinal()
    return
  }
  if (subEstadoPantalla.value === 'narrativa_final') {
    if (e.key === 'Enter') finalizarMisionAventura()
    return
  }

  // Teclado durante la pregunta activa
  if (respuestaSeleccionada.value === null) {
    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key) - 1
      if (preguntaActualDatos.value && idx < preguntaActualDatos.value.opciones.length) {
        seleccionarRespuesta(idx)
      }
    }
    const keyLower = e.key.toLowerCase()
    if (['a', 'b', 'c', 'd'].includes(keyLower)) {
      const idx = keyLower.charCodeAt(0) - 97
      if (preguntaActualDatos.value && idx < preguntaActualDatos.value.opciones.length) {
        seleccionarRespuesta(idx)
      }
    }
  } else {
    if (e.key === 'Enter') {
      alSiguientePregunta()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', alPresionarTecla)
})

onUnmounted(() => {
  pausar()
  window.removeEventListener('keydown', alPresionarTecla)
})
</script>

<style scoped>
.pantalla-juego {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.contenedor-juego {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* --- Estilos de Aventura Narrativa y Checkpoints --- */
.tarjeta-narrativa {
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 640px;
  margin-inline: auto;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
}

.icono-narrativa {
  font-size: 4rem;
  line-height: 1;
}

.icono-alerta {
  filter: drop-shadow(0 0 15px #ff4646);
}

.titulo-narrativa {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.subtitulo-checkpoint {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.subtitulo-desafio {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: #ff6b6b;
  margin: 0;
}

.subtitulo-victoria {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-neon-green);
  margin: 0;
}

.divisoria-neon {
  width: 80px;
  height: 3px;
  background: var(--color-neon-blue);
  box-shadow: 0 0 8px var(--color-neon-blue);
  border-radius: var(--radius-full);
}

.divisoria-neon.green {
  background: var(--color-neon-green);
  box-shadow: 0 0 8px var(--color-neon-green);
}

.divisoria-neon.purple {
  background: var(--color-neon-purple);
  box-shadow: 0 0 8px var(--color-neon-purple);
}

.divisoria-neon.red {
  background: #ff4646;
  box-shadow: 0 0 8px #ff4646;
}

.texto-narrativa-principal {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

.texto-narrativa-secundario {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.recompensas-checkpoint-caja,
.recompensas-victoria-caja,
.detalles-desafio-caja {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}

.rec-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin: 0;
}

.rec-badges-flex {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
}

.rec-badge-item {
  font-size: var(--text-xs);
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.2);
  color: var(--color-neon-green);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
}

.rec-badge-item.next-prov {
  background: rgba(0, 200, 255, 0.08);
  border-color: rgba(0, 200, 255, 0.2);
  color: var(--color-neon-blue);
}

.dificultad-desafio {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: #ff6b6b;
  font-size: var(--text-sm);
}

.tiempo-desafio {
  font-size: var(--text-xs);
  color: var(--color-neon-gold);
  font-weight: var(--font-bold);
}

/* --- Header --- */
.encabezado-juego {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.insignia-mision {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.emoji-provincia-mision {
  font-size: 2.5rem;
}

.etiqueta-mision {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.nombre-mision {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-neon-green);
  margin: 0;
}

.encabezado-derecha-juego {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.temporizador-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  transition: all 0.3s ease;
}

.temporizador-badge.urgente {
  background: rgba(255, 70, 70, 0.1);
  border-color: #ff4646;
  color: #ff6b6b;
  animation: pulse-neon 1s infinite;
}

.progreso-preguntas {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.p-actual { color: var(--color-neon-green); }
.p-separador, .p-total { color: var(--color-text-muted); font-size: var(--text-lg); }

/* --- Barra de progreso --- */
.barra-progreso-juego {
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.relleno-progreso-juego {
  height: 100%;
  background: var(--gradient-btn);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

/* --- Área de pregunta --- */
.area-pregunta {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tarjeta-pregunta {
  position: relative;
  overflow: hidden;
  padding-top: var(--space-6);
}

.pista-tiempo-pregunta {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.relleno-tiempo-pregunta {
  height: 100%;
  background: var(--color-neon-blue);
  transition: width 1s linear, background-color 0.3s ease;
}

.relleno-tiempo-pregunta.tiempo-alerta {
  background: #ff4646;
}

.categoria-pregunta {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-2);
}

.texto-pregunta {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  line-height: 1.4;
  margin: 0;
}

/* --- Opciones --- */
.cuadricula-opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.boton-opcion {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(255,255,255,0.04);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
}

.boton-opcion:not(:disabled):hover {
  border-color: var(--color-neon-blue);
  background: rgba(0,200,255,0.08);
  transform: translateX(3px);
}

.boton-opcion:disabled { cursor: default; }

.letra-opcion {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  font-size: var(--text-base);
  min-width: 20px;
}

.opcion-correcta {
  border-color: var(--color-neon-green) !important;
  background: rgba(0,255,136,0.12) !important;
}

.opcion-incorrecta {
  border-color: #ff4646 !important;
  background: rgba(255,70,70,0.10) !important;
}

.opcion-revelada {
  border-color: var(--color-neon-green) !important;
  background: rgba(0,255,136,0.08) !important;
}

/* --- Feedback --- */
.retroalimentacion-respuesta {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid;
}

.retroalimentacion-correcta {
  background: rgba(0,255,136,0.10);
  border-color: var(--color-neon-green);
}

.retroalimentacion-incorrecta {
  background: rgba(255,70,70,0.10);
  border-color: #ff4646;
}

.icono-retroalimentacion { font-size: 1.4rem; flex-shrink: 0; }

.contenido-retroalimentacion {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  text-align: left;
}

.texto-retroalimentacion {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  margin: 0;
}

.narrativa-consecuencia {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0 0 var(--space-2);
}

.explicacion-educativa-seccion {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--space-2);
  margin-top: var(--space-1);
}

.etiqueta-explicacion {
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  text-transform: uppercase;
}

.explicacion-retroalimentacion {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
  margin: 0 0 var(--space-2);
}

.cambios-atributos-pregunta {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.badge-cambio-atributo {
  font-size: 0.7rem;
  font-weight: var(--font-bold);
  padding: 1px 8px;
  border-radius: var(--radius-full);
}

.badge-cambio-atributo.sube {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.2);
  color: var(--color-neon-green);
}

.badge-cambio-atributo.baja {
  background: rgba(255, 70, 70, 0.08);
  border: 1px solid rgba(255, 70, 70, 0.2);
  color: #ff6b6b;
}

/* --- Controles --- */
.controles-juego {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

/* --- Transición --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* --- Responsive --- */
@media (max-width: 640px) {
  .cuadricula-opciones {
    grid-template-columns: 1fr;
  }
  .controles-juego {
    flex-direction: column-reverse;
  }
  .controles-juego .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
