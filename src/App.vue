<template>
  <!--
    App.vue — Componente raíz de Ruta Tica: El Héroe del After
    Orquesta la navegación entre pantallas del juego.
    Usa Composition API con ref y computed.
  -->
  <div id="game-wrapper">

    <!-- Header persistente -->
    <EncabezadoApp @reiniciar="alReiniciar" />

    <!-- Área principal de contenido -->
    <!-- transition: animación entre cambios de pantalla -->
    <main class="game-main">
      <transition name="screen-transition" :duration="350">
        <PantallaInicio
          v-if="pantallaActual === PANTALLAS.INICIO"
          key="inicio"
          @iniciar="navegarA(PANTALLAS.IDENTIDAD)"
        />
        <CreadorIdentidad
          v-else-if="pantallaActual === PANTALLAS.IDENTIDAD"
          key="identidad"
          @confirmar="alConfirmarIdentidad"
          @volver="navegarA(PANTALLAS.INICIO)"
        />
        <MapaMisiones
          v-else-if="pantallaActual === PANTALLAS.MAPA"
          key="mapa"
          @iniciar-mision="navegarA(PANTALLAS.VUELO)"
        />
        <PantallaVuelo
          v-else-if="pantallaActual === PANTALLAS.VUELO"
          key="vuelo"
          @completar="navegarA(PANTALLAS.JUEGO)"
        />
        <PantallaVidaUniversitaria
          v-else-if="pantallaActual === PANTALLAS.ACTIVIDADES"
          key="actividades"
          @completar="navegarA(PANTALLAS.TRANSICION_NOCHE)"
          @salir="navegarA(PANTALLAS.MAPA)"
        />
        <PantallaTransicionNoche
          v-else-if="pantallaActual === PANTALLAS.TRANSICION_NOCHE"
          key="transicion_noche"
          @continuar="navegarA(PANTALLAS.TRANSFORMACION)"
        />
        <PantallaTransformacion
          v-else-if="pantallaActual === PANTALLAS.TRANSFORMACION"
          key="transformacion"
          @continuar="navegarA(PANTALLAS.MAPA)"
        />
        <PantallaJuego
          v-else-if="pantallaActual === PANTALLAS.JUEGO"
          key="juego"
          @salir="navegarA(PANTALLAS.MAPA)"
          @completar="navegarA(PANTALLAS.RESULTADO)"
        />
        <PantallaResultado
          v-else-if="pantallaActual === PANTALLAS.RESULTADO"
          key="resultado"
          @volver-al-campus="navegarA(PANTALLAS.NUEVO_DIA)"
        />
        <PantallaNuevoDia
          v-else-if="pantallaActual === PANTALLAS.NUEVO_DIA"
          key="nuevo_dia"
          @comenzar="navegarA(PANTALLAS.ACTIVIDADES)"
        />
        <PantallaCrisis
          v-else-if="pantallaActual === PANTALLAS.CRISIS"
          key="crisis"
        />
        <PantallaGameOver
          v-else-if="pantallaActual === PANTALLAS.GAMEOVER"
          key="gameover"
        />
        <PantallaInicio
          v-else
          key="inicio-fallback"
          @iniciar="navegarA(PANTALLAS.IDENTIDAD)"
        />
      </transition>
    </main>

    <!-- Footer persistente -->
    <PiePaginaApp v-if="pantallaActual !== PANTALLAS.INICIO" />

  </div>
</template>

<script setup>
// =========================================================
// App.vue — Script de configuración (Composition API)
// =========================================================

// --- Importaciones de Vue 3 ---
import { onMounted } from 'vue'

// --- Componentes de layout ---
import EncabezadoApp from './components/layout/EncabezadoApp.vue'
import PiePaginaApp from './components/layout/PiePaginaApp.vue'

// --- Componentes de juego ---
import PantallaInicio            from './components/game/PantallaInicio.vue'
import CreadorIdentidad          from './components/game/CreadorIdentidad.vue'
import MapaMisiones              from './components/game/MapaMisiones.vue'
import PantallaVidaUniversitaria from './components/game/PantallaVidaUniversitaria.vue'
import PantallaTransicionNoche   from './components/game/PantallaTransicionNoche.vue'
import PantallaTransformacion    from './components/game/PantallaTransformacion.vue'
import PantallaVuelo             from './components/game/PantallaVuelo.vue'
import PantallaJuego             from './components/game/PantallaJuego.vue'
import PantallaResultado         from './components/game/PantallaResultado.vue'
import PantallaNuevoDia          from './components/game/PantallaNuevoDia.vue'
import PantallaCrisis            from './components/game/PantallaCrisis.vue'
import PantallaGameOver          from './components/game/PantallaGameOver.vue'

// --- Composables ---
import { useEstadoJuego, PANTALLAS } from './composables/useEstadoJuego.js'

// --- Estado global del juego ---
const {
  pantallaActual,
  navegarA,
  confirmarIdentidad,
  reiniciarJuego
} = useEstadoJuego()

// --- Manejo de confirmación de identidad ---
function alConfirmarIdentidad(identidad) {
  confirmarIdentidad(identidad)
}

// --- Reset completo del juego ---
function alReiniciar() {
  reiniciarJuego()
}

// --- Ciclo de vida: onMounted ---
onMounted(() => {
  console.info('[RutaTica] Aplicación iniciada correctamente.')
})
</script>

<style>
/* Estilos globales del wrapper del juego */
#game-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* --- Transición entre pantallas --- */
.screen-transition-enter-active,
.screen-transition-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}
.screen-transition-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.screen-transition-leave-active {
  position: absolute;
  inset: 0;
}
.screen-transition-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
