<template>
  <!-- PantallaTransformacion: transición animada de estudiante civil a héroe nocturno -->
  <section class="pantalla-transformacion" aria-label="Pantalla de transformación">
    <div class="contenedor-transformacion card text-center animate-fade-in-scale">

      <!-- FASE 1: ANOCHECER CIVIL -->
      <div v-if="fase === 1" class="fase-anochecer animate-fade-in">
        <div class="reloj-noche animate-float">
          <span class="emoji-luna">🌙</span>
          <div class="info-tiempo-noche">
            <span class="dia-noche">{{ diaDeSemana }}</span>
            <span class="hora-noche">10:00 PM</span>
          </div>
        </div>

        <div class="divisoria-neon blue"></div>

        <p class="texto-transicion-civil">
          Tu jornada universitaria terminó.
        </p>
        <p class="texto-transicion-heroico">
          Ahora es momento de proteger a quienes siguen explorando la noche.
        </p>

        <button class="btn btn-hero btn-lg" @click="siguienteFase">
          Continuar →
        </button>
      </div>

      <!-- FASE 2: TRANSFORMACIÓN HEROICA -->
      <div v-else-if="fase === 2" class="fase-heroica animate-fade-in">
        
        <!-- Efectos de rayos/neones en CSS -->
        <div class="rayos-animacion" aria-hidden="true">
          <span class="rayo-item animate-pulse">⚡</span>
        </div>

        <h2 class="titulo-transformacion text-neon-purple animate-scale-up">
          ⚡ TRANSFORMACIÓN ⚡
        </h2>

        <div class="perfil-heroe-revelado">
          <div class="emblema-heroe-revelado animate-float">🦸‍♂️</div>
          <h3 class="alias-revelado">{{ identidadHeroe.aliasHeroe || 'Héroe del After' }}</h3>
          
          <div class="stats-revelacion-grid">
            <div class="stat-revelada">
              <span class="stat-rev-val">⭐ Nivel {{ nivelHeroe }}</span>
              <span class="stat-rev-etiq">Rango Heroico</span>
            </div>
            <div class="stat-revelada">
              <span class="stat-rev-val">🤝 {{ estadisticasHeroe.reputacionNocturna }}</span>
              <span class="stat-rev-etiq">Reputación</span>
            </div>
            <div class="stat-revelada">
              <span class="stat-rev-val" :class="{ 'sospecha-alta': estadisticasHeroe.sospechaIdentidad > 50 }">
                🔍 {{ estadisticasHeroe.sospechaIdentidad }}%
              </span>
              <span class="stat-rev-etiq">Sospecha</span>
            </div>
          </div>

          <!-- Alerta de sospecha interactiva narrada -->
          <div class="advertencia-sospecha-transformacion" :class="claseSospecha(estadisticasHeroe.sospechaIdentidad)">
            <p>{{ mensajeSospechaTransformacion }}</p>
          </div>
        </div>

        <p class="texto-llamado-noche">
          Costa Rica necesita ayuda. ¿Dónde realizarás tu patrullaje esta noche?
        </p>

        <button class="btn btn-hero btn-lg btn-danger btn-iniciar-noche animate-pulse" @click="iniciarMisionNocturna">
          Activar patrullaje ⚡
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
// --- Importaciones de Vue 3 ---
import { ref, computed, onMounted } from 'vue'

// --- Composables ---
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'

// --- Estado global del juego ---
const { navegarA, identidadHeroe, estadisticasHeroe, nivelHeroe, misionesCompletadas, esModoNocturno, PANTALLAS } = useEstadoJuego()
const { reproducirEfecto, reproducirMusica } = useAudio()

// --- Emits ---
const emit = defineEmits(['continuar'])

// --- Estado local ---
const fase = ref(1)

// --- Computar día de la semana según el número de misiones completadas ---
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const diaDeSemana = computed(() => {
  const count = misionesCompletadas.value.length
  return dias[count % 7]
})

const mensajeSospechaTransformacion = computed(() => {
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return 'Tu doble identidad está a salvo. Eres un estudiante ejemplar ante los ojos de todos. 🟢'
  if (s <= 50) return 'Se escuchan susurros. Algunos compañeros comentan que te ven salir tarde del campus. 🟡'
  if (s <= 75) return 'El director de carrera te citó por ausencias misteriosas. La facultad sospecha de tus escapadas nocturnas. 🟠'
  return '¡Alerta roja! Profesores y administradores buscan confirmar quién es la sombra del campus. 🔴'
})

function claseSospecha(val) {
  if (val <= 25) return 'segura'
  if (val <= 50) return 'rumores'
  if (val <= 75) return 'alta'
  return 'investigacion'
}

onMounted(() => {
  reproducirMusica('transformacion')
})

function siguienteFase() {
  reproducirEfecto('desbloquear')
  fase.value = 2
}

function iniciarMisionNocturna() {
  reproducirEfecto('subirNivel')
  esModoNocturno.value = true
  navegarA(PANTALLAS.MAPA)
  emit('continuar')
}
</script>

<style scoped>
.pantalla-transformacion {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: radial-gradient(circle at center, #100826 0%, #05050d 100%);
}

.contenedor-transformacion {
  width: 100%;
  max-width: 600px;
  background: rgba(10, 6, 22, 0.75);
  border: 1px solid rgba(184, 79, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-card), var(--shadow-neon-purple);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-height: 420px;
  justify-content: center;
}

/* --- Fase 1: Anochecer --- */
.fase-anochecer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.reloj-noche {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(0, 200, 255, 0.05);
  border: 1px solid rgba(0, 200, 255, 0.2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-xl);
}

.emoji-luna { font-size: 2.2rem; }

.info-tiempo-noche {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.2;
}

.dia-noche {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hora-noche {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-neon-blue);
  text-shadow: 0 0 10px var(--color-neon-blue-glow);
  animation: pulseNeonTime 1.5s ease-in-out infinite alternate;
}

@keyframes pulseNeonTime {
  0% {
    color: var(--color-neon-blue);
    text-shadow: 0 0 8px var(--color-neon-blue-glow);
  }
  100% {
    color: #ffffff;
    text-shadow: 0 0 20px var(--color-neon-blue-glow), 0 0 10px #00c8ff;
  }
}

.divisoria-neon {
  width: 80px;
  height: 3px;
  background: var(--color-neon-blue);
  box-shadow: 0 0 8px var(--color-neon-blue);
  border-radius: var(--radius-full);
}

.texto-transicion-civil {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

.texto-transicion-heroico {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* --- Fase 2: Transformación --- */
.fase-heroica {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.titulo-transformacion {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  letter-spacing: 0.06em;
  margin: 0;
}

.perfil-heroe-revelado {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.emblema-heroe-revelado {
  font-size: 4rem;
  line-height: 1;
  width: 90px;
  height: 90px;
  background: rgba(184, 79, 255, 0.08);
  border: 2px solid var(--color-neon-purple);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--color-neon-purple-glow),
              inset 0 0 10px var(--color-neon-purple-glow);
  animation: pulseEnergyHalo 2s ease-in-out infinite alternate;
}

@keyframes pulseEnergyHalo {
  0% {
    box-shadow: 0 0 15px var(--color-neon-purple-glow), inset 0 0 8px var(--color-neon-purple-glow);
    border-color: rgba(184, 79, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 35px var(--color-neon-purple-glow), inset 0 0 18px var(--color-neon-purple-glow);
    border-color: #ffffff;
  }
}

.alias-revelado {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-neon-purple);
  text-shadow: 0 0 10px var(--color-neon-purple-glow);
  margin: 0;
  letter-spacing: 0.02em;
}

.stats-revelacion-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--space-3);
  margin-top: var(--space-2);
}

.stat-revelada {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-rev-val {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.stat-rev-val.sospecha-alta {
  color: #ff6b6b;
  text-shadow: 0 0 8px rgba(255, 70, 70, 0.4);
}

.stat-rev-etiq {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.texto-llamado-noche {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.btn-iniciar-noche {
  box-shadow: 0 0 20px rgba(255, 70, 70, 0.25);
}

.btn-iniciar-noche:hover {
  box-shadow: 0 0 25px rgba(255, 70, 70, 0.45);
}

.advertencia-sospecha-transformacion {
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  line-height: 1.4;
  border: 1px solid transparent;
  width: 100%;
}
.advertencia-sospecha-transformacion p {
  margin: 0;
}
.advertencia-sospecha-transformacion.segura {
  background: rgba(0, 255, 136, 0.05);
  border-color: rgba(0, 255, 136, 0.2);
  color: var(--color-neon-green);
}
.advertencia-sospecha-transformacion.rumores {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
  color: var(--color-neon-gold);
}
.advertencia-sospecha-transformacion.alta {
  background: rgba(255, 140, 0, 0.05);
  border-color: rgba(255, 140, 0, 0.2);
  color: #ff8c00;
}
.advertencia-sospecha-transformacion.investigacion {
  background: rgba(255, 70, 70, 0.05);
  border-color: rgba(255, 70, 70, 0.2);
  color: #ff4646;
}

/* Animations */
.animate-scale-up {
  animation: scaleUp 0.5s ease both;
}

@keyframes scaleUp {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 480px) {
  .contenedor-transformacion {
    padding: var(--space-6) var(--space-4);
  }
  .stats-revelacion-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
