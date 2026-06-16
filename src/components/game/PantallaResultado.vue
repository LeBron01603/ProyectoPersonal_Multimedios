<template>
  <!-- PantallaResultado: pantalla de resultados al finalizar una misión -->
  <section class="pantalla-resultado" aria-label="Pantalla de resultados">
    <div class="contenedor-resultado animate-fade-in-scale">

      <!-- Ícono de resultado -->
      <div class="emblema-resultado animate-float" aria-hidden="true">
        <span class="emoji-resultado">{{ emojiResultado }}</span>
        <div class="anillo-resultado"></div>
      </div>

      <!-- Título de resultado -->
      <header class="encabezado-resultado">
        <p class="etiqueta-mision-resultado">{{ provinciaActiva?.nombre }} — Misión completada</p>
        <h2 class="titulo-resultado" :class="claseTituloResultado">{{ tituloResultado }}</h2>
        <p class="subtitulo-resultado">{{ subtituloResultado }}</p>
      </header>

      <!-- Panel de XP y Nivel -->
      <div class="perfil-nivel-resultado animate-fade-in delay-100">
        <div class="badge-nivel-resultado">⭐ Nivel {{ nivelHeroe }}</div>
        <div class="xp-ganada-resultado">+{{ xpGanada }} XP Obtenidos</div>
      </div>

      <!-- Recompensas obtenidas -->
      <div class="recompensas-mision-resultado animate-fade-in delay-200" v-if="provinciaActiva">
        <h3 class="titulo-seccion-resultado">Recompensas Desbloqueadas:</h3>
        <div class="recompensas-resultado-grid">
          <div class="recompensa-resultado-card principal" v-if="provinciaActiva.recompensaPrincipal">
            <span class="recompensa-res-emoji">{{ provinciaActiva.recompensaPrincipal.emoji }}</span>
            <div class="recompensa-res-info">
              <span class="recompensa-res-tipo">Coleccionable / Mochila</span>
              <span class="recompensa-res-nombre">{{ provinciaActiva.recompensaPrincipal.nombre }}</span>
            </div>
          </div>
          <div class="recompensa-resultado-card secundaria" v-if="provinciaActiva.recompensaSecundaria">
            <span class="recompensa-res-emoji">{{ provinciaActiva.recompensaSecundaria.emoji }}</span>
            <div class="recompensa-res-info">
              <span class="recompensa-res-tipo">Hito de Aventura</span>
              <span class="recompensa-res-nombre">{{ provinciaActiva.recompensaSecundaria.nombre }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Impacto Académico y Heroico -->
      <div class="impactos-grid animate-fade-in delay-300">
        <!-- Bloque Académico -->
        <div class="bloque-resultado-impacto academico">
          <h3 class="titulo-seccion-resultado">🎓 Impacto Académico (Día)</h3>
          <div class="lista-cambios">
            <div
              v-for="stat in impactoAcademico"
              :key="stat.key"
              class="cambio-estadistica"
              :class="stat.delta > 0 ? 'cambio-estadistica--sube' : (stat.delta < 0 ? 'cambio-estadistica--baja' : 'cambio-estadistica--neutro')"
            >
              <span class="icono-cambio-estadistica">{{ stat.icon }}</span>
              <span class="nombre-cambio-estadistica">{{ stat.etiqueta }}</span>
              <span class="delta-cambio-estadistica">
                {{ stat.delta > 0 ? '+' : '' }}{{ stat.delta }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bloque Heroico -->
        <div class="bloque-resultado-impacto heroico">
          <h3 class="titulo-seccion-resultado">🦸 Impacto Heroico (Noche)</h3>
          <div class="lista-cambios">
            <div
              v-for="stat in impactoHeroico"
              :key="stat.key"
              class="cambio-estadistica"
              :class="stat.delta > 0 ? 'cambio-estadistica--sube' : (stat.delta < 0 ? 'cambio-estadistica--baja' : 'cambio-estadistica--neutro')"
            >
              <span class="icono-cambio-estadistica">{{ stat.icon }}</span>
              <span class="nombre-cambio-estadistica">{{ stat.etiqueta }}</span>
              <span class="delta-cambio-estadistica">
                {{ stat.delta > 0 ? '+' : '' }}{{ stat.delta }}
              </span>
            </div>
            <!-- Cambio de Energía -->
            <div
              class="cambio-estadistica"
              :class="deltaEnergia > 0 ? 'cambio-estadistica--sube' : (deltaEnergia < 0 ? 'cambio-estadistica--baja' : 'cambio-estadistica--neutro')"
            >
              <span class="icono-cambio-estadistica">⚡</span>
              <span class="nombre-cambio-estadistica">Energía</span>
              <span class="delta-cambio-estadistica">
                {{ deltaEnergia > 0 ? '+' : '' }}{{ deltaEnergia }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Identidad Secreta -->
      <div class="seccion-sospecha-resultado animate-fade-in delay-350">
        <h3 class="titulo-seccion-resultado">🔍 Estado de Identidad Secreta</h3>
        <div class="progreso-sospecha-res">
          <div class="barra-sospecha-res-pista">
            <div 
              class="barra-sospecha-res-relleno" 
              :style="{ width: estadisticasHeroe.sospechaIdentidad + '%' }"
              :class="{ 'urgente': estadisticasHeroe.sospechaIdentidad > 50 }"
            ></div>
          </div>
          <span class="porcentaje-sospecha-res">
            Sospecha: <strong>{{ estadisticasHeroe.sospechaIdentidad }}%</strong>
          </span>
        </div>
        <p class="mensaje-sospecha-res">
          {{ mensajeSospecha }}
        </p>
      </div>

      <!-- Sección de Título Final (Estructura preparada) -->
      <div class="seccion-titulo-final-resultado animate-fade-in delay-400">
        <h3 class="titulo-seccion-resultado">Título Final Proyectado:</h3>
        <div class="tarjeta-titulo-final">
          <span class="emoji-titulo-final">{{ tituloFinal?.emoji }}</span>
          <div class="info-titulo-final">
            <span class="nombre-titulo-final">{{ tituloFinal?.nombre }}</span>
            <span class="desc-titulo-final">{{ tituloFinal?.descripcion }}</span>
          </div>
        </div>
        <p class="progreso-titulo-texto" v-if="misionesCompletadas.length < 7">
          🔒 Completa las {{ 7 - misionesCompletadas.length }} provincias restantes para reclamar tu título definitivo.
        </p>
        <p class="progreso-titulo-texto final-completado" v-else>
          🎉 ¡Felicidades! Has salvado el after en todas las provincias de Costa Rica.
        </p>
      </div>

      <!-- Mensaje motivacional -->
      <blockquote class="cita-resultado animate-fade-in delay-500">
        <p>{{ fraseMotivacional }}</p>
        <footer>— El héroe universitario tico 🇨🇷</footer>
      </blockquote>

      <!-- Botones de acción -->
      <div class="acciones-resultado animate-fade-in delay-500">
        <button class="btn btn-hero btn-lg" @click="alVolverAlCampus">
          🏫 Volver al campus
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 Composition API ---
import { computed, onMounted } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Emits ---
const emit = defineEmits(['volver-al-campus'])

// --- Estado del juego ---
const { 
  provinciaActiva, 
  navegarA, 
  nivelHeroe, 
  experienciaHeroe, 
  ultimoPuntajeMision, 
  tituloFinal, 
  misionesCompletadas, 
  PANTALLAS,
  estadisticasHeroe,
  estadisticasPreMision
} = useEstadoJuego()

// --- Audio ---
const { reproducirMusica } = useAudio()

// --- Computed: emoji y título según puntaje de misión ---
const emojiResultado = computed(() => {
  if (ultimoPuntajeMision.value >= 80) return '🏆'
  if (ultimoPuntajeMision.value >= 50) return '⭐'
  return '💪'
})

const tituloResultado = computed(() => {
  if (ultimoPuntajeMision.value >= 80) return '¡La Noche ha sido Salvada!'
  if (ultimoPuntajeMision.value >= 50) return '¡After Seguro Garantizado!'
  return 'Continúa patrullando, héroe'
})

const claseTituloResultado = computed(() => {
  if (ultimoPuntajeMision.value >= 80) return 'texto-neon'
  if (ultimoPuntajeMision.value >= 50) return 'texto-neon-blue'
  return 'texto-neon-purple'
})

const subtituloResultado = computed(() =>
  `Provincia ${provinciaActiva.value?.nombre || ''} resguardada con éxito. Los estudiantes están a salvo.`
)

// --- Experiencia ganada ---
const xpGanada = computed(() => {
  // +50 por completar misión +10 por respuesta correcta (aproximado por puntaje)
  return 50 + Math.round(ultimoPuntajeMision.value * 0.5)
})

// --- Cambios reales en estadísticas (Deltas exactos del transcurso de la misión) ---
const impactoAcademico = computed(() => [
  { key: 'conocimiento',    etiqueta: 'Conocimiento',    icon: '📚', delta: estadisticasHeroe.conocimiento - estadisticasPreMision.conocimiento },
  { key: 'responsabilidad', etiqueta: 'Responsabilidad', icon: '🎓', delta: estadisticasHeroe.responsabilidad - estadisticasPreMision.responsabilidad }
])

const impactoHeroico = computed(() => [
  { key: 'reputacionNocturna', etiqueta: 'Reputación',    icon: '🤝', delta: estadisticasHeroe.reputacionNocturna - estadisticasPreMision.reputacionNocturna },
  { key: 'xp',                 etiqueta: 'Experiencia',   icon: '⭐', delta: xpGanada.value }
])

const deltaEnergia = computed(() => estadisticasHeroe.energia - estadisticasPreMision.energia)

const mensajeSospecha = computed(() => {
  const sospecha = estadisticasHeroe.sospechaIdentidad
  if (sospecha < 30) {
    return 'Tu identidad sigue protegida de manera óptima. Eres invisible en el campus.'
  } else if (sospecha <= 60) {
    return 'Algunas personas en la universidad empiezan a hacer preguntas sobre tus ausencias. Ten cuidado.'
  } else {
    return '¡Alerta de sospecha! Hay rumores fuertes en la facultad sobre tus andanzas. Debes actuar con cautela.'
  }
})

// --- Frases motivacionales ---
const frases = [
  'El conocimiento es el verdadero superpoder universitario.',
  'Explorar Costa Rica es explorar quién eres.',
  'La diversión y la responsabilidad no son opuestos, son aliados.',
  'Cada provincia tiene una lección para el héroe que sabe escuchar.',
  'De día estudias, de noche salvas. Eso te hace único.'
]

const fraseMotivacional = computed(() =>
  frases[Math.floor(Math.random() * frases.length)]
)

// --- Navegación ---
function alVolverAlCampus() {
  navegarA(PANTALLAS.NUEVO_DIA)
  emit('volver-al-campus')
}

onMounted(() => {
  reproducirMusica('victoria')
})
</script>

<style scoped>
.pantalla-resultado {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}

.contenedor-resultado {
  width: 100%;
  max-width: 600px;
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-green);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  text-align: center;
}

/* --- Emblema --- */
.emblema-resultado {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-resultado { font-size: 3.5rem; position: relative; z-index: 1; }

.anillo-resultado {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--color-neon-green);
  box-shadow: 0 0 20px var(--color-neon-green-glow),
              inset 0 0 20px var(--color-neon-green-glow);
  animation: pulse-neon 2s ease-in-out infinite;
}

/* --- Header --- */
.etiqueta-mision-resultado {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-2);
}

.titulo-resultado {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-2);
}

.subtitulo-resultado {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0;
}

/* --- XP y Nivel --- */
.perfil-nivel-resultado {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-5);
}

.badge-nivel-resultado {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-neon-gold);
}

.xp-ganada-resultado {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-neon-green);
}

/* --- Recompensas --- */
.recompensas-mision-resultado {
  width: 100%;
}

.titulo-seccion-resultado {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-3);
  text-align: center;
  font-weight: var(--font-bold);
}

.recompensas-resultado-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.recompensa-resultado-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  text-align: left;
}

.recompensa-resultado-card.principal {
  border-color: rgba(0, 255, 136, 0.25);
  background: rgba(0, 255, 136, 0.02);
}

.recompensa-resultado-card.secundaria {
  border-color: rgba(184, 79, 255, 0.25);
  background: rgba(184, 79, 255, 0.02);
}

.recompensa-res-emoji {
  font-size: 2rem;
}

.recompensa-res-info {
  display: flex;
  flex-direction: column;
}

.recompensa-res-tipo {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.recompensa-res-nombre {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

/* --- Stats --- */
/* --- Impactos Grid --- */
.impactos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  width: 100%;
}

.bloque-resultado-impacto {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-align: left;
}

.bloque-resultado-impacto.academico {
  border-left: 3px solid var(--color-neon-blue);
  background: linear-gradient(145deg, rgba(0, 200, 255, 0.02), transparent);
}

.bloque-resultado-impacto.heroico {
  border-left: 3px solid var(--color-neon-purple);
  background: linear-gradient(145deg, rgba(184, 79, 255, 0.02), transparent);
}

.lista-cambios {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cambio-estadistica {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.cambio-estadistica--sube {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.cambio-estadistica--baja {
  background: rgba(255, 70, 70, 0.08);
  border: 1px solid rgba(255, 70, 70, 0.2);
}

.cambio-estadistica--neutro {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  opacity: 0.85;
}

/* --- Seccion Sospecha --- */
.seccion-sospecha-resultado {
  width: 100%;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
}

.progreso-sospecha-res {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.barra-sospecha-res-pista {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.barra-sospecha-res-relleno {
  height: 100%;
  background: var(--color-neon-blue);
  box-shadow: 0 0 8px var(--color-neon-blue-glow);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.barra-sospecha-res-relleno.urgente {
  background: #ff4646;
  box-shadow: 0 0 8px rgba(255, 70, 70, 0.6);
}

.porcentaje-sospecha-res {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.porcentaje-sospecha-res strong {
  color: var(--color-text-primary);
}

.mensaje-sospecha-res {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
  margin: 0;
  font-style: italic;
}

.icono-cambio-estadistica { font-size: 1rem; }
.nombre-cambio-estadistica { flex: 1; color: var(--color-text-secondary); }

.delta-cambio-estadistica {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
}

.cambio-estadistica--sube .delta-cambio-estadistica { color: var(--color-neon-green); }
.cambio-estadistica--baja .delta-cambio-estadistica { color: #ff6b6b; }
.cambio-estadistica--neutro .delta-cambio-estadistica { color: var(--color-text-muted); }

/* --- Título Final --- */
.seccion-titulo-final-resultado {
  width: 100%;
  background: rgba(255, 215, 0, 0.02);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
}

.tarjeta-titulo-final {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: rgba(255, 255, 255, 0.02);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-align: left;
  border: 1px solid var(--color-border);
}

.emoji-titulo-final {
  font-size: 2.2rem;
}

.info-titulo-final {
  display: flex;
  flex-direction: column;
}

.nombre-titulo-final {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  color: var(--color-neon-gold);
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
}

.desc-titulo-final {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.progreso-titulo-texto {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: var(--space-3) 0 0;
  font-style: italic;
}

.progreso-titulo-texto.final-completado {
  color: var(--color-neon-green);
  font-weight: var(--font-bold);
}

/* --- Quote --- */
.cita-resultado {
  border-left: 3px solid var(--color-neon-blue);
  padding-left: var(--space-4);
  text-align: left;
  width: 100%;
}

.cita-resultado p {
  font-style: italic;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
  font-size: var(--text-base);
}

.cita-resultado footer {
  font-size: var(--text-xs);
  color: var(--color-neon-blue);
  text-align: right;
}

/* --- Acciones --- */
.acciones-resultado {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

/* --- Responsive --- */
@media (max-width: 480px) {
  .contenedor-resultado {
    padding: var(--space-6) var(--space-4);
  }
  .recompensas-resultado-grid,
  .impactos-grid {
    grid-template-columns: 1fr;
  }
  .acciones-resultado {
    flex-direction: column;
  }
  .acciones-resultado .btn {
    width: 100%;
  }
}
</style>
