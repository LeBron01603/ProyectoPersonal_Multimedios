<template>
  <section class="pantalla-juego" aria-label="Crisis de Identidad">
    <div class="efectos-fondo" aria-hidden="true">
      <div class="estrellas">
        <div class="estrellas-centelleo"></div>
      </div>
      <div class="nebula-juego cian"></div>
      <div class="nebula-juego purpura"></div>
    </div>

    <div class="contenedor-juego animate-fade-in-scale">
      <!-- Intro de Crisis -->
      <div v-if="fase === 'intro'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <span class="icono-narrativa animate-pulse">⚠️</span>
        <h2 class="titulo-narrativa text-neon-red">Identidad comprometida</h2>
        <div class="divisoria-neon red"></div>
        <p class="texto-narrativa-principal">
          ¡Emergencia académica y heroica! Tu doble vida ha comenzado a cruzar los límites del secreto.
        </p>
        <p class="texto-narrativa-secundario">
          Debes superar este cuestionario de control y discreción universitaria de inmediato para desviar la atención y proteger tu alias.
        </p>
        <button class="btn btn-hero btn-lg btn-danger" @click="iniciarReto">
          ⚡ Iniciar Reto
        </button>
      </div>

      <!-- Quiz de Crisis -->
      <div v-else-if="fase === 'quiz'" class="flujo-pregunta-activo animate-fade-in">
        <header class="encabezado-juego">
          <div class="insignia-mision">
            <span class="emoji-provincia-mision" aria-hidden="true">⚠️</span>
            <div>
              <p class="etiqueta-mision" style="color: #ff4646 !important; font-weight: bold;">
                CRISIS ACTIVA
              </p>
              <h2 class="nombre-mision">
                Cuestionario de Discreción
              </h2>
            </div>
          </div>
          <div class="encabezado-derecha-juego">
            <div class="temporizador-badge" :class="{ 'urgente': tiempoRestante <= 5 }">
              <span class="emoji-reloj">⏱️</span>
              <span class="segundos-reloj">{{ tiempoRestante }}s</span>
            </div>
            <div class="progreso-preguntas">
              <span class="p-actual">{{ indexPregunta + 1 }}</span>
              <span class="p-separador">/</span>
              <span class="p-total">3</span>
            </div>
          </div>
        </header>

        <div class="cuerpo-trivia">
          <div class="columna-principal-trivia">
            <div class="area-pregunta">
              <div class="tarjeta-pregunta card animate-fade-in">
                <p class="categoria-pregunta">📂 CONTROL DE RIESGOS</p>
                <h3 class="texto-pregunta">{{ preguntaActual.texto }}</h3>
              </div>

              <div class="cuadricula-opciones">
                <button
                  v-for="(opcion, idx) in preguntaActual.opciones"
                  :key="idx"
                  class="boton-opcion"
                  :class="{
                    'opcion-correcta': respondido && idx === preguntaActual.correcta,
                    'opcion-incorrecta': respondido && respuestaSeleccionada === idx && idx !== preguntaActual.correcta
                  }"
                  :disabled="respondido"
                  @click="seleccionarRespuesta(idx)"
                >
                  <span class="letra-opcion">{{ ['A', 'B', 'C', 'D'][idx] }}</span>
                  <span class="texto-opcion">{{ opcion }}</span>
                </button>
              </div>
            </div>

            <div class="controles-juego" style="justify-content: flex-end;">
              <button
                v-if="respondido"
                class="btn btn-primary"
                @click="siguientePregunta"
              >
                {{ indexPregunta + 1 >= 3 ? 'Terminar Evaluación' : 'Siguiente' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultado de Crisis -->
      <div v-else-if="fase === 'resultado_exito'" class="tarjeta-narrativa card text-center victoria-card animate-fade-in">
        <span class="icono-narrativa animate-float">🟢</span>
        <h2 class="titulo-narrativa text-neon-green">Identidad protegida</h2>
        <div class="divisoria-neon green"></div>
        <p class="texto-narrativa-principal">
          ¡Excelente control de daños! Has logrado disipar los rumores y crear una coartada perfecta.
        </p>
        <p class="texto-narrativa-secundario">
          Tus compañeros del campus han dejado de hacer preguntas incómodas por ahora.
        </p>
        <button class="btn btn-hero btn-lg" @click="concluirReto(true)">
          Volver a Operaciones
        </button>
      </div>

      <div v-else-if="fase === 'resultado_fallo'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <span class="icono-narrativa animate-pulse">🔴</span>
        <h2 class="titulo-narrativa text-neon-red">Reto de Crisis fallido</h2>
        <div class="divisoria-neon red"></div>
        <p class="texto-narrativa-principal">
          No lograste responder adecuadamente. Las sospechas sobre tu alias siguen creciendo en los pasillos de la universidad.
        </p>
        <p class="texto-narrativa-secundario" style="color: #ff6b6b; font-weight: bold;">
          Has sumado +1 marca de exposición. Si acumulas 3 marcas, tu identidad será completamente revelada.
        </p>
        <button class="btn btn-hero btn-lg btn-danger" @click="concluirReto(false)">
          Volver a Operaciones
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useTemporizador } from '../../composables/useTemporizador.js'

const { estadisticasHeroe, marcasExposicion, enCrisis, navegarA, PANTALLAS, guardarProgreso } = useEstadoJuego()
const { tiempoRestante, iniciar, pausar, reiniciar } = useTemporizador()

const fase = ref('intro')
const indexPregunta = ref(0)
const correctasCount = ref(0)
const respondido = ref(false)
const respuestaSeleccionada = ref(null)

const preguntas = [
  {
    texto: "Un compañero te pregunta por qué siempre sales corriendo del campus a las 6:00 PM los viernes. ¿Qué respondes para mantener tu discreción?",
    opciones: [
      "Le dices que tienes un entrenamiento o tutoría especial fuera del campus.",
      "Le confiesas que patrullas las calles de Costa Rica como superhéroe.",
      "Te pones de pie nervioso, no dices nada y sales corriendo de inmediato.",
      "Inventas una mentira absurda sobre extraterrestres."
    ],
    correcta: 0
  },
  {
    texto: "Tienes un examen parcial el sábado a las 8:00 AM, pero hay un disturbio reportado a la medianoche en Cartago. ¿Qué acción prioriza tu responsabilidad civil y académica?",
    opciones: [
      "Patrullas rápidamente, controlas la situación y regresas temprano a dormir para el examen.",
      "Te quedas toda la noche despierto patrullando y vas al examen sin dormir.",
      "Faltas al examen por completo para patrullar toda la noche.",
      "Ignoras la llamada y te vas de fiesta con tus compañeros."
    ],
    correcta: 0
  },
  {
    texto: "Ves que alguien está publicando fotos tuyas en redes sociales sugiriendo que eres la sombra misteriosa del campus. ¿Cómo manejas esta crisis de discreción?",
    opciones: [
      "Publicas fotos tuyas en un lugar público a esa misma hora para desmentir el rumor.",
      "Comentas en la publicación admitiendo que eres el héroe.",
      "Amenazas a la persona para que borre la foto de inmediato.",
      "Ignoras el asunto y dejas que la sospecha siga subiendo."
    ],
    correcta: 0
  }
]

const preguntaActual = computed(() => preguntas[indexPregunta.value])

function iniciarReto() {
  fase.value = 'quiz'
  indexPregunta.value = 0
  correctasCount.value = 0
  cargarPregunta()
}

function cargarPregunta() {
  respondido.value = false
  respuestaSeleccionada.value = null
  reiniciar(false, alAgotarTiempo)
  tiempoRestante.value = 15
  iniciar(alAgotarTiempo)
}

function alAgotarTiempo() {
  if (respondido.value) return
  respondido.value = true
  respuestaSeleccionada.value = -1
}

function seleccionarRespuesta(idx) {
  if (respondido.value) return
  pausar()
  respondido.value = true
  respuestaSeleccionada.value = idx
  if (idx === preguntaActual.value.correcta) {
    correctasCount.value++
  }
}

function siguientePregunta() {
  if (indexPregunta.value + 1 >= 3) {
    pausar()
    evaluarResultado()
  } else {
    indexPregunta.value++
    cargarPregunta()
  }
}

function evaluarResultado() {
  if (correctasCount.value >= 2) {
    fase.value = 'resultado_exito'
  } else {
    fase.value = 'resultado_fallo'
  }
}

function concluirReto(exito) {
  enCrisis.value = false
  if (exito) {
    estadisticasHeroe.sospechaIdentidad = 50
    guardarProgreso()
    navegarA(PANTALLAS.MAPA)
  } else {
    marcasExposicion.value++
    if (marcasExposicion.value >= 3) {
      navegarA(PANTALLAS.GAMEOVER)
    } else {
      estadisticasHeroe.sospechaIdentidad = 80
      guardarProgreso()
      navegarA(PANTALLAS.MAPA)
    }
  }
}

onUnmounted(() => {
  pausar()
})
</script>
