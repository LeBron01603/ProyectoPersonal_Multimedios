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
      <transition name="screen-transition">

        <!-- Pantalla: Inicio -->
        <PantallaInicio
          v-if="pantallaActual === PANTALLAS.INICIO"
          key="inicio"
          @iniciar="navegarA(PANTALLAS.IDENTIDAD)"
        />

        <!-- Pantalla: Creador de identidad -->
        <CreadorIdentidad
          v-else-if="pantallaActual === PANTALLAS.IDENTIDAD"
          key="identidad"
          @confirmar="alConfirmarIdentidad"
          @volver="navegarA(PANTALLAS.INICIO)"
        />

        <!-- Pantalla: Mapa de misiones -->
        <MapaMisiones
          v-else-if="pantallaActual === PANTALLAS.MAPA"
          key="mapa"
          @iniciar-mision="navegarA(PANTALLAS.ACTIVIDADES)"
        />

        <!-- Pantalla: Vida Universitaria -->
        <PantallaVidaUniversitaria
          v-else-if="pantallaActual === PANTALLAS.ACTIVIDADES"
          key="actividades"
          @completar="navegarA(PANTALLAS.TRANSFORMACION)"
          @salir="navegarA(PANTALLAS.MAPA)"
        />

        <!-- Pantalla: Transformación -->
        <PantallaTransformacion
          v-else-if="pantallaActual === PANTALLAS.TRANSFORMACION"
          key="transformacion"
          @continuar="navegarA(PANTALLAS.JUEGO)"
        />

        <!-- Pantalla: Juego activo -->
        <PantallaJuego
          v-else-if="pantallaActual === PANTALLAS.JUEGO"
          key="juego"
          @salir="navegarA(PANTALLAS.MAPA)"
          @completar="navegarA(PANTALLAS.RESULTADO)"
        />

        <!-- Pantalla: Resultados -->
        <PantallaResultado
          v-else-if="pantallaActual === PANTALLAS.RESULTADO"
          key="resultado"
          @volver-al-mapa="navegarA(PANTALLAS.MAPA)"
          @continuar="navegarA(PANTALLAS.MAPA)"
        />

      </transition>
    </main>

    <!-- Footer persistente -->
    <PiePaginaApp />

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
import PantallaTransformacion    from './components/game/PantallaTransformacion.vue'
import PantallaJuego             from './components/game/PantallaJuego.vue'
import PantallaResultado         from './components/game/PantallaResultado.vue'

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
}

/* --- Transición entre pantallas --- */
.screen-transition-enter-active {
  animation: fadeInScale 0.35s ease both;
}
.screen-transition-leave-active {
  transition: opacity 0.2s ease;
}
.screen-transition-leave-to {
  opacity: 0;
}
</style>
