<template>
  <!-- PantallaJuego: pantalla de juego activo (preguntas de la misión) -->
  <section class="pantalla-juego" aria-label="Pantalla de juego activo">    <!-- Fondo inmersivo nocturno de patrullaje con paralaje y luces urbanas -->
    <div class="efectos-fondo" aria-hidden="true">
      <div class="estrellas">
        <div class="estrellas-centelleo"></div>
      </div>
      <div class="nebula-juego cian"></div>
      <div class="nebula-juego purpura"></div>
      
      <!-- Niebla neón tenue y partículas suaves flotantes (Fase 3 Tarea 12) -->
      <div class="niebla-neon"></div>
      <div class="brillos-flotantes">
        <div class="brillo b1"></div>
        <div class="brillo b2"></div>
        <div class="brillo b3"></div>
        <div class="brillo b4"></div>
      </div>

      <!-- Luces urbanas flotando (bokeh / neones lejanos) -->
      <div class="luces-ciudad">
        <div class="luz-urbana lu1"></div>
        <div class="luz-urbana lu2"></div>
        <div class="luz-urbana lu3"></div>
        <div class="luz-urbana lu4"></div>
        <div class="luz-urbana lu5"></div>
      </div>

      <!-- Siluetas de edificios y postes de luz (Capas de Profundidad) -->
      <div class="capas-ciudad">
        <!-- Capa lejana (Edificios 1) -->
        <svg class="capa-ciudad-svg lejana" viewBox="0 0 800 300" preserveAspectRatio="none">
          <path d="M0,300 L0,180 L40,180 L40,160 L100,160 L100,190 L160,190 L160,150 L220,150 L220,200 L290,200 L290,170 L350,170 L350,130 L430,130 L430,200 L510,200 L510,180 L570,180 L570,160 L650,160 L650,210 L700,210 L700,175 L800,175 L800,300 Z" fill="rgba(184, 79, 255, 0.015)" />
        </svg>
        
        <!-- Capa media (Edificios 2) -->
        <svg class="capa-ciudad-svg media" viewBox="0 0 800 300" preserveAspectRatio="none">
          <path d="M0,300 L0,220 L60,220 L60,200 L120,200 L120,230 L180,230 L180,190 L240,190 L240,240 L310,240 L310,205 L370,205 L370,160 L450,160 L450,230 L520,230 L520,210 L590,210 L590,230 L670,230 L670,185 L720,185 L720,230 L800,230 L800,300 Z" fill="rgba(0, 200, 255, 0.02)" />
        </svg>

        <!-- Capa cercana (Silueta del campus / postes) -->
        <svg class="capa-ciudad-svg cercana" viewBox="0 0 800 300" preserveAspectRatio="none">
          <path d="M0,300 L0,250 L80,250 L80,242 L90,242 L90,250 L180,250 L180,230 L220,230 L220,250 L340,250 L340,220 L400,220 L400,250 L560,250 L560,235 L620,235 L620,250 L700,250 L700,245 L740,245 L740,250 L800,250 L800,300 Z" fill="rgba(0, 255, 136, 0.025)" />
          <!-- Postes de luz simplificados en SVG -->
          <line x1="120" y1="250" x2="120" y2="190" stroke="rgba(255, 215, 0, 0.2)" stroke-width="2" />
          <circle cx="120" cy="190" r="4" fill="rgba(255, 215, 0, 0.6)" filter="drop-shadow(0 0 6px #ffd700)" />
          <line x1="480" y1="250" x2="480" y2="195" stroke="rgba(255, 215, 0, 0.2)" stroke-width="2" />
          <circle cx="480" cy="195" r="4" fill="rgba(255, 215, 0, 0.6)" filter="drop-shadow(0 0 6px #ffd700)" />
        </svg>
      </div>
    </div>

    <div class="contenedor-juego animate-fade-in-scale" :class="{ 'con-ancho-extendido': respuestaSeleccionada !== null && subEstadoPantalla === 'pregunta' }">
      
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
        <button class="btn btn-hero btn-lg btn-iniciar-mision" @click="comenzarMisionPrincipal()" aria-label="Iniciar Misión Principal de la provincia">
          ⚡ Iniciar Misión
        </button>
      </div>

      <!-- ================= CHECKPOINT 1 ================= -->
      <div v-else-if="subEstadoPantalla === 'checkpoint_1'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <!-- Confeti/Destellos neón de logro -->
        <div class="particulas-logro-contenedor" aria-hidden="true">
          <div 
            v-for="n in 30" 
            :key="n" 
            class="particula-logro" 
            :style="generarEstilosParticulaLogro(n)"
          ></div>
        </div>

        <span class="icono-narrativa animate-float">🎉</span>
        <h2 class="titulo-narrativa" :class="checkpointRendimiento?.clase">
          {{ checkpointRendimiento?.titulo }}
        </h2>
        <h3 class="subtitulo-checkpoint">
          {{ provinciaActiva?.recompensaSecundaria?.emoji || '🍻' }} {{ provinciaActiva?.recompensaSecundaria?.nombre?.toUpperCase() || 'AVANCE NARRATIVO' }}
        </h3>
        <div class="divisoria-neon green"></div>
        <p class="texto-narrativa-principal" v-html="checkpointRendimiento?.principal"></p>
        <p class="texto-narrativa-secundario" v-html="checkpointRendimiento?.secundario"></p>
        
        <div class="recompensas-checkpoint-caja">
          <p class="rec-title">Recompensas Obtenidas:</p>
          <div class="rec-badges-flex">
            <span class="rec-badge-item">⭐ +20 XP</span>
            <span class="rec-badge-item">🤝 +10 Reputación</span>
            <span class="rec-badge-item" v-if="provinciaActiva?.recompensaSecundaria">
              🎁 Recuerdo: {{ provinciaActiva.recompensaSecundaria.nombre }}
            </span>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" @click="continuarDesdeCheckpoint1()" aria-label="Continuar misión desde checkpoint 1">
          Continuar misión →
        </button>
      </div>

      <!-- ================= CHECKPOINT 2 ================= -->
      <div v-else-if="subEstadoPantalla === 'checkpoint_2'" class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in">
        <!-- Confeti/Destellos neón de logro -->
        <div class="particulas-logro-contenedor" aria-hidden="true">
          <div 
            v-for="n in 30" 
            :key="n" 
            class="particula-logro" 
            :style="generarEstilosParticulaLogro(n)"
          ></div>
        </div>

        <span class="icono-narrativa animate-float">🏆</span>
        <h2 class="titulo-narrativa text-neon-purple">CHECKPOINT DESBLOQUEADO</h2>
        <h3 class="subtitulo-checkpoint">🎉 AFTER SEGURO</h3>
        <div class="divisoria-neon purple"></div>
        <p class="texto-narrativa-principal">
          ¡Fabuloso! Tu reputación nocturna como héroe del after se esparce por todo {{ provinciaActiva?.nombre }}.
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

        <button class="btn btn-primary btn-lg" @click="continuarDesdeCheckpoint2()" aria-label="Aceptar Siguiente Reto y continuar">
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
          La noche en {{ provinciaActiva?.nombre }} depende enteramente de tus acciones. Se reporta un conato de incendio en el Teatro Melico Salazar.
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

        <button class="btn btn-hero btn-lg btn-danger" @click="iniciarDesafioFinal()" aria-label="Aceptar Desafío Final en la provincia">
          🚨 Aceptar Desafío
        </button>
      </div>

      <!-- ================= NARRATIVA FINAL ================= -->
      <div v-else-if="subEstadoPantalla === 'narrativa_final'" class="tarjeta-narrativa card text-center victoria-card animate-fade-in">
        <!-- Confeti/Destellos neón de logro -->
        <div class="particulas-logro-contenedor" aria-hidden="true">
          <div 
            v-for="n in 30" 
            :key="n" 
            class="particula-logro" 
            :style="generarEstilosParticulaLogro(n)"
          ></div>
        </div>

        <span class="icono-narrativa animate-float">🍻</span>
        <h2 class="titulo-narrativa text-neon-green">MISIÓN COMPLETADA</h2>
        <h3 class="subtitulo-victoria">{{ provinciaActiva?.nombre }}</h3>
        <div class="divisoria-neon green"></div>
        <p class="texto-narrativa-principal">
          ¡Héroe! Lograste salvar la noche en {{ provinciaActiva?.nombre }}. Los estudiantes universitarios celebran en {{ provinciaActiva?.lugarAfter }} gracias a tu gran cuidado y guía responsable.
        </p>
        <p class="texto-narrativa-secundario">
          Todos disfrutan de un after divertido y enriquecedor. Tu reputación nocturna se ha consolidado en {{ provinciaActiva?.nombre }}.
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
            <span class="rec-badge-item next-prov" v-if="siguienteProvinciaNombre !== 'Fin de la Aventura'">➡️ Siguiente Provincia: {{ siguienteProvinciaNombre }}</span>
            <span class="rec-badge-item next-prov" v-else>🎉 ¡Aventura Completada!</span>
          </div>
        </div>

        <button class="btn btn-hero btn-lg" @click="finalizarMisionAventura()" aria-label="Finalizar misión, ver estadísticas y guardar progreso">
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
              <p class="etiqueta-mision" :class="{ 'alerta-segundo-intento-etiqueta': esSegundoIntento }">
                {{ esSegundoIntento ? '⚠️ SEGUNDO INTENTO' : 'Misión activa' }}
              </p>
              <h2 class="nombre-mision" :class="{ 'alerta-segundo-intento-nombre': esSegundoIntento }">
                {{ provinciaActiva?.tituloMision }}
              </h2>
              <span v-if="esSegundoIntento" class="aviso-tension animate-pulse">
                🚨 Última oportunidad nocturna. Queda poco tiempo.
              </span>
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

        <!-- Cuerpo de Trivia (Dos Columnas en Escritorio con Feedback) -->
        <div class="cuerpo-trivia" :class="{ 'con-retroalimentacion': respuestaSeleccionada !== null }">
          
          <!-- Columna Principal: Pregunta y Opciones -->
          <div class="columna-principal-trivia">
            <!-- Área de pregunta -->
            <div class="area-pregunta" v-if="preguntaActualDatos">
              <div 
                class="tarjeta-pregunta card animate-fade-in"
                :class="{
                  'pregunta-glow-verde': respuestaSeleccionada !== null && esCorrecta,
                  'pregunta-shake-rojo': respuestaSeleccionada !== null && !esCorrecta
                }"
              >
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
                  <span class="letra-opcion">
                    <template v-if="respuestaSeleccionada !== null">
                      <span v-if="idx === preguntaActualDatos.correcta" class="simbolo-feedback correcto">✓</span>
                      <span v-else-if="respuestaSeleccionada === idx" class="simbolo-feedback incorrecto">✗</span>
                      <span v-else>{{ letrasOpciones[idx] }}</span>
                    </template>
                    <template v-else>
                      {{ letrasOpciones[idx] }}
                    </template>
                  </span>
                  <span class="texto-opcion">{{ opcion }}</span>
                </button>
              </div>
            </div>

            <!-- Controles de juego -->
            <div class="controles-juego">
              <button class="btn btn-outline" @click="alSalir" aria-label="Volver al mapa de Costa Rica">
                ← Volver al mapa
              </button>
              <button
                v-if="respuestaSeleccionada !== null"
                class="btn btn-primary"
                @click="alSiguientePregunta"
                :aria-label="preguntaActual + 1 >= totalPreguntas ? 'Terminar Misión y ver resultados' : 'Ir a la siguiente pregunta'"
              >
                {{ preguntaActual + 1 >= totalPreguntas ? '🏆 Terminar Misión' : '→ Siguiente pregunta' }}
              </button>
            </div>
          </div>

          <!-- Columna Lateral: Resultado y Explicación -->
          <div class="columna-lateral-trivia" v-if="respuestaSeleccionada !== null">
            <!-- Panel de resultado de respuesta con Consecuencias Narrativas -->
            <transition name="fade">
              <div 
                class="retroalimentacion-respuesta" 
                :class="esCorrecta ? 'retroalimentacion-correcta' : 'retroalimentacion-incorrecta'"
                role="alert"
                aria-live="assertive"
              >
                <span class="icono-retroalimentacion" aria-hidden="true">
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
                    {{ respuestaSeleccionada === -1 ? 'Los estudiantes se desorientaron al expirar el tiempo de búsqueda y se perdieron en ' + (provinciaActiva?.nombre || 'la provincia') + '.' : (esCorrecta ? (preguntaActualDatos?.consecuenciaCorrecta || '¡Lograste orientar y guiar al grupo con total éxito!') : (preguntaActualDatos?.consecuenciaIncorrecta || 'Los estudiantes se confundieron de dirección y terminaron lejos del after.')) }}
                  </p>

                  <!-- Atributos Afectados -->
                  <div class="cambios-atributos-pregunta">
                    <span class="badge-cambio-atributo" :class="esCorrecta ? 'sube' : 'baja'">
                      {{ esCorrecta ? '🤝 Reputación +5' : (respuestaSeleccionada === -1 ? '🤝 Reputación -5, ⚡ Energía -5' : catCarreraPenalidad) }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Tarjeta de Explicación Educativa -->
            <transition name="slide-up">
              <div class="tarjeta-explicacion-educativa card">
                <div class="cabecera-explicacion">
                  <span class="icono-explicacion">🎓</span>
                  <h4 class="titulo-explicacion">Centro de Conocimiento</h4>
                </div>
                <p class="explicacion-texto">
                  {{ preguntaActualDatos?.explicacion }}
                </p>
              </div>
            </transition>
          </div>

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
const { provinciaActiva, completarMision, navegarA, ganarExperiencia, identidadHeroe, estadisticasHeroe, PANTALLAS, esSegundoIntento, avanceMision, guardarProgreso } = useEstadoJuego()

// --- Audio ---
const { reproducirEfecto, reproducirMusica } = useAudio()

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

// --- Computed: mensajes dinámicos de rendimiento en Checkpoint 1 ---
const checkpointRendimiento = computed(() => {
  const correctas = respuestasCorrectasCount.value
  
  if (correctas === 4) {
    return {
      titulo: "🏆 ¡RENDIMIENTO PERFECTO!",
      principal: `¡Espectacular! Has demostrado un conocimiento absoluto del alma de ${provinciaActiva.value?.nombre || 'la provincia'}.`,
      secundario: `Los estudiantes de ${provinciaActiva.value?.lugarPrincipal || 'la zona'} están maravillados con tu guía. ¡La noche avanza bajo el cuidado de una verdadera leyenda!`,
      clase: "text-neon-green"
    }
  } else if (correctas >= 2) {
    return {
      titulo: "✨ BUEN CAMINO",
      principal: `¡Excelente esfuerzo! Estás guiando al grupo y demostrando conocer bastante bien ${provinciaActiva.value?.nombre || 'la provincia'}.`,
      secundario: `Los estudiantes de ${provinciaActiva.value?.lugarPrincipal || 'la zona'} agradecen tu ayuda. Con un poco más de precisión, la noche será un éxito rotundo.`,
      clase: "text-neon-blue"
    }
  } else {
    return {
      titulo: "⚠️ ALERTA DE NOCHE DIFÍCIL",
      principal: `La noche en ${provinciaActiva.value?.nombre || 'la provincia'} se está complicando. Has tenido algunas dudas en el camino.`,
      secundario: `Los estudiantes de ${provinciaActiva.value?.lugarPrincipal || 'la zona'} se sienten algo desorientados. ¡Es hora de concentrarse y recuperar el control para salvar el after!`,
      clase: "text-neon-red"
    }
  }
})

// --- Iniciar la pregunta activa y su temporizador ---
function iniciarPregunta() {
  respuestaSeleccionada.value = null
  
  if (preguntaActual.value === totalPreguntas.value - 1) {
    reproducirMusica('desafio')
  }
  
  // BONO: +5s para informáticos en preguntas difíciles (dificultad provincia >= 3 o Desafío Final)
  let maxTiempo = 20
  const esDificil = (provinciaActiva.value?.dificultad >= 3) || (preguntaActual.value === totalPreguntas.value - 1)
  if (esInformatica.value && esDificil) {
    maxTiempo = 25
  }
  
  // SEGUNDO INTENTO: reducir tiempo límite en 5 segundos
  if (esSegundoIntento.value) {
    maxTiempo = Math.max(5, maxTiempo - 5)
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
  reproducirEfecto('boton')
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
  
  // Checkpoint 1 tras la pregunta 4 (index 3) en cualquier provincia
  if (preguntaActual.value === 3 && subEstadoPantalla.value === 'pregunta') {
    subEstadoPantalla.value = 'checkpoint_1'
    ganarExperiencia(20) // +20 XP por Checkpoint
    estadisticasHeroe.reputacionNocturna = Math.min(100, estadisticasHeroe.reputacionNocturna + 10) // +10 reputación
    reproducirEfecto('desbloquear')
    
    // Guardar avance parcial al superar el checkpoint de la pregunta 4
    avanceMision.value = {
      idProvincia: provinciaActiva.value?.id,
      preguntaActual: 4, // continua en la pregunta 5 (index 4)
      respuestasCorrectasCount: respuestasCorrectasCount.value,
      yaPasoCheckpoint: true,
      esSegundoIntento: esSegundoIntento.value
    }
    guardarProgreso()
  } 
  // San José: Checkpoint 2 tras la pregunta 7 (index 6)
  else if (esSanJose && preguntaActual.value === 6 && subEstadoPantalla.value === 'pregunta') {
    subEstadoPantalla.value = 'checkpoint_2'
    ganarExperiencia(30) // +30 XP por Checkpoint
    estadisticasHeroe.reputacionNocturna = Math.min(100, estadisticasHeroe.reputacionNocturna + 15) // +15 reputación
    reproducirEfecto('desbloquear')
  } 
  // Finalizar preguntas y pasar a Outro Narrativo o directamente a resultados
  else if (preguntaActual.value + 1 >= totalPreguntas.value) {
    if (respuestasCorrectasCount.value >= 5) {
      subEstadoPantalla.value = 'narrativa_final'
      reproducirEfecto('desbloquear')
    } else {
      finalizarMisionAventura()
    }
  } 
  // Flujo normal de incremento
  else {
    preguntaActual.value++
    // Desafío Final: Advertencia antes de la pregunta 8 (index 7) en San José
    if (esSanJose && preguntaActual.value === 7) {
      subEstadoPantalla.value = 'desafio_final_intro'
      reproducirMusica('desafio')
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

// --- Confeti y destellos de neón en Checkpoints ---
function generarEstilosParticulaLogro(n) {
  const colores = ['#00c8ff', '#00ff88', '#ff007f', '#ffb700', '#b026ff']
  const color = colores[n % colores.length]
  const size = Math.random() * 8 + 4 // 4px a 12px
  const delay = Math.random() * 0.8 // 0s a 0.8s
  const duration = Math.random() * 1.5 + 1.2 // 1.2s a 2.7s
  
  // Ángulo y distancia aleatoria para explosión
  const angulo = Math.random() * 360
  const distancia = Math.random() * 140 + 40 // 40px a 180px
  const x = Math.cos(angulo * Math.PI / 180) * distancia
  const y = Math.sin(angulo * Math.PI / 180) * distancia
  
  return {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: n % 2 === 0 ? '50%' : '20%',
    boxShadow: `0 0 8px ${color}`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: 'translate(0, 0)',
    '--tx': `${x}px`,
    '--ty': `${y}px`,
    left: '50%',
    top: '40%'
  }
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
  reproducirMusica('juego')
  window.addEventListener('keydown', alPresionarTecla)
  
  if (esSegundoIntento.value) {
    subEstadoPantalla.value = 'pregunta'
    preguntaActual.value = 0
    respuestasCorrectasCount.value = 0
    
    // Limpiar el avance parcial al iniciar un segundo intento
    avanceMision.value = null
    guardarProgreso()
    
    iniciarPregunta()
  } else {
    // Si hay un avance parcial guardado para esta misma provincia
    if (avanceMision.value && avanceMision.value.idProvincia === provinciaActiva.value?.id) {
      subEstadoPantalla.value = 'pregunta'
      preguntaActual.value = avanceMision.value.preguntaActual // 4 (pregunta 5)
      respuestasCorrectasCount.value = avanceMision.value.respuestasCorrectasCount
      esSegundoIntento.value = avanceMision.value.esSegundoIntento
      iniciarPregunta()
    } else {
      subEstadoPantalla.value = 'narrativa_inicial'
      preguntaActual.value = 0
      respuestasCorrectasCount.value = 0
    }
  }
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
  padding: var(--space-6) var(--space-4) var(--space-12);
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, #090e1c 0%, #030408 100%);
}

.contenedor-juego {
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: max-width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 2;
}

.contenedor-juego.con-ancho-extendido {
  max-width: 1180px;
}

.flujo-pregunta-activo {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}

/* --- Estilos de Aventura Narrativa y Checkpoints --- */
.tarjeta-narrativa {
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 760px;
  margin-inline: auto;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: rgba(10, 6, 22, 0.65);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-card), 0 0 30px rgba(0, 200, 255, 0.15);
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
  line-height: 1.65;
  margin: 0;
}

.texto-narrativa-secundario {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.55;
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
  color: var(--color-text-secondary);
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
  gap: var(--space-3);
  flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(14, 20, 44, 0.8) 0%, rgba(8, 10, 24, 0.95) 100%);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-xl);
  border: 1.5px solid rgba(0, 220, 255, 0.25);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(0, 220, 255, 0.1),
    inset 0 0 15px rgba(0, 220, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: all var(--transition-base);
}

.insignia-mision {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.emoji-provincia-mision {
  font-size: 2.2rem;
}

.etiqueta-mision {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.etiqueta-mision.alerta-segundo-intento-etiqueta {
  color: #ff4646 !important;
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(255, 70, 70, 0.3);
}

.nombre-mision {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-neon-green);
  margin: 0;
}

.nombre-mision.alerta-segundo-intento-nombre {
  color: #ff6b6b !important;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.4);
}

.aviso-tension {
  font-size: 0.75rem;
  color: #ff4646;
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(255, 70, 70, 0.4);
  display: block;
  margin-top: 2px;
}

.encabezado-derecha-juego {
  display: flex;
  align-items: center;
  gap: var(--space-3);
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
.p-separador, .p-total { color: var(--color-text-secondary); font-size: var(--text-lg); }

/* --- Barra de progreso --- */
.barra-progreso-juego {
  height: 6px;
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
  gap: var(--space-3);
}

.tarjeta-pregunta {
  position: relative;
  overflow: hidden;
  padding: var(--space-6) var(--space-6) !important;
  padding-top: var(--space-6) !important;
  background: rgba(10, 14, 28, 0.65) !important;
  border-color: rgba(0, 200, 255, 0.28) !important;
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-card), 0 0 25px rgba(0, 200, 255, 0.15) !important;
  border-radius: var(--radius-xl) !important;
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
}

.tarjeta-pregunta.pregunta-glow-verde {
  border-color: var(--color-neon-green) !important;
  box-shadow: var(--shadow-card), 0 0 35px rgba(0, 255, 136, 0.3) !important;
}

.tarjeta-pregunta.pregunta-shake-rojo {
  border-color: #ff4646 !important;
  box-shadow: var(--shadow-card), 0 0 35px rgba(255, 70, 70, 0.3) !important;
  animation: shake-rapido 0.35s ease both;
}

@keyframes shake-rapido {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
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
  letter-spacing: 0.1em;
  margin: 0 0 var(--space-1);
}

.texto-pregunta {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  line-height: 1.45;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
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
  padding: var(--space-4) var(--space-5);
  background: rgba(10, 15, 30, 0.55);
  border: 1.5px solid rgba(0, 200, 255, 0.25);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-base);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

.boton-opcion:not(:disabled):hover,
.boton-opcion:not(:disabled):focus-visible {
  border-color: var(--color-neon-blue);
  background: rgba(0, 200, 255, 0.12);
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
  outline: none !important;
}

.boton-opcion:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none !important;
}

.boton-opcion.opcion-correcta:disabled,
.boton-opcion.opcion-incorrecta:disabled,
.boton-opcion.opcion-revelada:disabled {
  opacity: 1 !important;
}

.letra-opcion {
  font-family: var(--font-display);
  font-weight: var(--font-extrabold);
  color: var(--color-neon-blue);
  font-size: var(--text-base);
  min-width: 24px;
}

.opcion-correcta {
  border-color: var(--color-neon-green) !important;
  background: rgba(0, 255, 136, 0.15) !important;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.35) !important;
}

.opcion-incorrecta {
  border-color: #ff4646 !important;
  background: rgba(255, 70, 70, 0.15) !important;
  box-shadow: 0 0 20px rgba(255, 70, 70, 0.35) !important;
}

.opcion-revelada {
  border-color: var(--color-neon-green) !important;
  background: rgba(0, 255, 136, 0.08) !important;
}

.simbolo-feedback {
  font-size: 1.25rem;
  font-weight: var(--font-extrabold);
  display: inline-block;
  line-height: 1;
}

.simbolo-feedback.correcto {
  color: var(--color-neon-green);
  text-shadow: 0 0 8px var(--color-neon-green);
}

.simbolo-feedback.incorrecto {
  color: #ff4646;
  text-shadow: 0 0 8px #ff4646;
}

/* --- Feedback --- */
.retroalimentacion-respuesta {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-xl);
  border: 1.5px solid;
  backdrop-filter: blur(14px);
}

.retroalimentacion-correcta {
  background: rgba(0, 255, 136, 0.08);
  border-color: var(--color-neon-green);
  box-shadow: 0 0 25px rgba(0, 255, 136, 0.28), inset 0 0 15px rgba(0, 255, 136, 0.05);
}

.retroalimentacion-incorrecta {
  background: rgba(255, 70, 70, 0.08);
  border-color: #ff4646;
  box-shadow: 0 0 25px rgba(255, 70, 70, 0.28), inset 0 0 15px rgba(255, 70, 70, 0.05);
}

.icono-retroalimentacion { font-size: 1.8rem; flex-shrink: 0; }

.contenido-retroalimentacion {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
}

.texto-retroalimentacion {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin: 0;
}

.narrativa-consecuencia {
  font-size: var(--text-sm);
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0 0 var(--space-1);
}

/* --- Tarjeta de Explicación Educativa --- */
.tarjeta-explicacion-educativa {
  background: rgba(0, 200, 255, 0.04) !important;
  border: 1px solid rgba(0, 200, 255, 0.35) !important;
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.15), inset 0 0 10px rgba(0, 200, 255, 0.05) !important;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-5);
  margin-top: 0;
  text-align: left;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(14px);
}

.tarjeta-explicacion-educativa::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--color-neon-blue);
}

.cabecera-explicacion {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.icono-explicacion {
  font-size: 1.25rem;
}

.titulo-explicacion {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.explicacion-texto {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.cambios-atributos-pregunta {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.badge-cambio-atributo {
  font-size: 0.72rem;
  font-weight: var(--font-bold);
  padding: 2px 10px;
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
  margin-top: 0;
}

/* --- Cuerpo de Trivia (Dos Columnas en Escritorio) --- */
.cuerpo-trivia {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  width: 100%;
}

.columna-principal-trivia {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.columna-lateral-trivia {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

@media (min-width: 800px) {
  .cuerpo-trivia.con-retroalimentacion {
    grid-template-columns: 1.15fr 0.85fr;
    align-items: start;
    gap: var(--space-5);
  }
}

/* --- Transiciones --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* --- Efectos de fondo y Parallax --- */
.efectos-fondo {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  user-select: none;
}

.estrellas {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 150px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 280px 180px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 420px 110px, #ffffff, rgba(0,0,0,0));
  background-size: 350px 350px;
  background-repeat: repeat;
  opacity: 0.25;
}

.estrellas-centelleo {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1px 1px at 80px 140px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 220px 290px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 340px 50px, #ffffff, rgba(0,0,0,0));
  background-size: 300px 300px;
  background-repeat: repeat;
  animation: centelleo-lento 6s ease-in-out infinite alternate;
}

@keyframes centelleo-lento {
  0% { opacity: 0.2; }
  100% { opacity: 0.8; }
}

.nebula-juego {
  position: absolute;
  width: 50vw;
  height: 50vh;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
  mix-blend-mode: screen;
}

.nebula-juego.cian {
  background: radial-gradient(circle, var(--color-neon-blue) 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation: float-nebula-j1 25s ease-in-out infinite alternate;
}

.nebula-juego.purpura {
  background: radial-gradient(circle, var(--color-neon-purple) 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
  animation: float-nebula-j2 30s ease-in-out infinite alternate;
}

@keyframes float-nebula-j1 {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.2) translate(4vw, 4vh); }
}

@keyframes float-nebula-j2 {
  0% { transform: scale(1.1) translate(0, 0); }
  100% { transform: scale(0.95) translate(-4vw, -4vh); }
}

/* Luces urbanas */
.luces-ciudad {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.luz-urbana {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  filter: blur(35px);
  opacity: 0.15;
}

.lu1 { left: 10%; bottom: 25%; width: 50px; height: 50px; background: #00c8ff; animation: pulse-luz-bokeh 6s ease-in-out infinite alternate; }
.lu2 { left: 30%; bottom: 35%; width: 40px; height: 40px; background: #b84fff; animation: pulse-luz-bokeh 8s ease-in-out infinite alternate 1s; }
.lu3 { left: 50%; bottom: 20%; width: 60px; height: 60px; background: #00ff88; animation: pulse-luz-bokeh 7s ease-in-out infinite alternate 0.5s; }
.lu4 { left: 70%; bottom: 30%; width: 45px; height: 45px; background: #ffd700; animation: pulse-luz-bokeh 9s ease-in-out infinite alternate 1.5s; }
.lu5 { left: 85%; bottom: 22%; width: 55px; height: 55px; background: #ff0055; animation: pulse-luz-bokeh 5s ease-in-out infinite alternate 2s; }

@keyframes pulse-luz-bokeh {
  0% { transform: translateY(0) scale(0.9); opacity: 0.1; }
  100% { transform: translateY(-15px) scale(1.1); opacity: 0.2; }
}

/* Capas de profundidad */
.capas-ciudad {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.capa-ciudad-svg {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 220px;
}

.capa-ciudad-svg.lejana {
  height: 260px;
  opacity: 0.6;
  animation: float-parallax-lejana 40s ease-in-out infinite alternate;
}

.capa-ciudad-svg.media {
  height: 210px;
  opacity: 0.8;
  animation: float-parallax-media 32s ease-in-out infinite alternate;
}

.capa-ciudad-svg.cercana {
  height: 160px;
  opacity: 0.95;
  animation: float-parallax-cercana 25s ease-in-out infinite alternate;
}

@keyframes float-parallax-lejana {
  0% { transform: translateX(0); }
  100% { transform: translateX(-3%); }
}

@keyframes float-parallax-media {
  0% { transform: translateX(0); }
  100% { transform: translateX(-1.5%); }
}

@keyframes float-parallax-cercana {
  0% { transform: translateX(0); }
  100% { transform: translateX(-0.5%); }
}

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
  .capa-ciudad-svg {
    height: 140px !important;
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .estrellas-centelleo,
  .nebula-juego.cian,
  .nebula-juego.purpura,
  .luz-urbana,
  .capa-ciudad-svg.lejana,
  .capa-ciudad-svg.media,
  .capa-ciudad-svg.cercana,
  .tarjeta-pregunta.pregunta-shake-rojo {
    animation: none !important;
  }
  .boton-opcion {
    transition: none !important;
  }
}

/* --- Niebla neón y brillos flotantes (Fase 3 Tarea 12) --- */
.niebla-neon {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at bottom, rgba(184, 79, 255, 0.05) 0%, rgba(0, 200, 255, 0.03) 50%, transparent 100%);
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none;
}

.brillos-flotantes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.brillo {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-neon-blue);
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.25;
  box-shadow: 0 0 10px var(--color-neon-blue-glow);
}

.brillo.b1 { top: 25%; left: 20%; background: var(--color-neon-blue); animation: float-glow-particle 12s infinite ease-in-out; }
.brillo.b2 { top: 60%; left: 80%; background: var(--color-neon-purple); animation: float-glow-particle 15s infinite ease-in-out -3s; }
.brillo.b3 { top: 80%; left: 15%; background: var(--color-neon-green); animation: float-glow-particle 10s infinite ease-in-out -6s; }
.brillo.b4 { top: 30%; left: 75%; background: var(--color-neon-gold); animation: float-glow-particle 14s infinite ease-in-out -9s; }

@keyframes float-glow-particle {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
  50% { transform: translateY(-40px) scale(1.4); opacity: 0.45; }
}

/* --- Checkpoint Evento Especial Premium --- */
.checkpoint-card {
  background: radial-gradient(circle at top, rgba(255, 215, 0, 0.15) 0%, rgba(10, 6, 22, 0.95) 100%) !important;
  border: 1.5px solid rgba(255, 215, 0, 0.45) !important;
  box-shadow: 
    0 0 35px rgba(255, 215, 0, 0.25), 
    inset 0 0 20px rgba(255, 215, 0, 0.08) !important;
  position: relative;
  overflow: hidden;
}

.checkpoint-card .icono-narrativa {
  font-size: 4.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border: 2px solid rgba(255, 215, 0, 0.35);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  margin-bottom: var(--space-2);
}

.checkpoint-card .titulo-narrativa {
  color: var(--color-neon-gold) !important;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

/* --- Mejoras de Pregunta Protagonista --- */
.tarjeta-pregunta {
  border: 2px solid rgba(184, 79, 255, 0.35) !important;
  box-shadow: 
    0 0 30px rgba(184, 79, 255, 0.15), 
    inset 0 0 15px rgba(184, 79, 255, 0.06) !important;
}

.texto-pregunta {
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em;
}

/* --- Mejoras de Opciones con animaciones --- */
.boton-opcion:not(:disabled):hover,
.boton-opcion:not(:disabled):focus-visible {
  border-color: var(--color-neon-blue) !important;
  background: linear-gradient(90deg, rgba(0, 200, 255, 0.15) 0%, rgba(0, 200, 255, 0.03) 100%) !important;
  transform: translateX(6px) translateY(-2px) !important;
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.45) !important;
  outline: none !important;
}

/* Opciones: Correcta (Destello y Pop) */
.boton-opcion.opcion-correcta {
  animation: correct-success-anim 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both !important;
}

@keyframes correct-success-anim {
  0% { transform: scale(1); filter: brightness(1); }
  30% { transform: scale(1.04); filter: brightness(1.6); box-shadow: 0 0 30px rgba(0, 255, 136, 0.7); }
  100% { transform: scale(1); filter: brightness(1); box-shadow: 0 0 20px rgba(0, 255, 136, 0.35); }
}

/* Opciones: Incorrecta (Vibración y Glow Rojo) */
.boton-opcion.opcion-incorrecta {
  animation: incorrect-shake-anim 0.4s ease-in-out both !important;
}

@keyframes incorrect-shake-anim {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

/* --- Centro de Conocimiento --- */
.tarjeta-explicacion-educativa {
  background: linear-gradient(135deg, rgba(14, 20, 36, 0.85) 0%, rgba(8, 10, 24, 0.95) 100%) !important;
  border: 1.5px solid rgba(255, 215, 0, 0.45) !important;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.2), inset 0 0 12px rgba(255, 215, 0, 0.05) !important;
}

.tarjeta-explicacion-educativa::before {
  background: linear-gradient(180deg, var(--color-neon-blue), var(--color-neon-gold)) !important;
}
</style>
