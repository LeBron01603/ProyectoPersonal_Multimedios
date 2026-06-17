<template>
  <section class="pantalla-juego" aria-label="Game Over - Identidad Revelada">
    <div class="efectos-fondo" aria-hidden="true">
      <div class="estrellas">
        <div class="estrellas-centelleo"></div>
      </div>
      <div class="nebula-juego purpura" style="background: radial-gradient(circle, #ff0055 0%, transparent 70%);"></div>
    </div>

    <div class="contenedor-juego animate-fade-in-scale">
      <div class="tarjeta-narrativa card text-center checkpoint-card animate-fade-in" style="border-color: #ff4646 !important; box-shadow: 0 0 30px rgba(255, 70, 70, 0.4) !important;">
        <span class="icono-narrativa animate-pulse" style="filter: drop-shadow(0 0 15px #ff4646);">🚨</span>
        <h2 class="titulo-narrativa text-neon-red" style="font-size: var(--text-3xl);">Identidad Revelada</h2>
        <div class="divisoria-neon red"></div>
        
        <p class="texto-narrativa-principal" style="color: #ff6b6b; font-weight: bold; font-size: var(--text-lg);">
          Tu secreto ha sido expuesto ante toda Costa Rica.
        </p>
        
        <p class="texto-narrativa-secundario">
          Los rumores en la facultad se confirmaron. Tus compañeros de la <strong>{{ identidadHeroe.universidad }}</strong> compartieron las pruebas en redes sociales y la prensa nacional ha publicado tu alias. Tu doble vida como protector nocturno ha llegado a su fin.
        </p>

        <div class="recompensas-checkpoint-caja" style="background: rgba(255, 70, 70, 0.05); border-color: rgba(255, 70, 70, 0.25);">
          <p class="rec-title" style="color: #ff6b6b;">Estado Final:</p>
          <div class="rec-badges-flex">
            <span class="rec-badge-item" style="border-color: #ff4646; color: #ff6b6b;">EXPOSICIÓN: 100%</span>
            <span class="rec-badge-item" style="border-color: #ff4646; color: #ff6b6b;">MARCAS EXPOSICIÓN: 2/2</span>
            <span class="rec-badge-item" style="border-color: #ffd700; color: #ffd700;">Nivel Alcanzado: {{ nivelHeroe }}</span>
          </div>
        </div>

        <button class="btn btn-hero btn-lg btn-danger animate-pulse" @click="confirmarReiniciar">
          🔄 Reiniciar aventura
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'

const { identidadHeroe, nivelHeroe, reiniciarProgreso } = useEstadoJuego()

function confirmarReiniciar() {
  const verificado = window.confirm("¿Seguro que deseas reiniciar tu aventura? Esto borrará tu progreso guardado y restablecerá tu héroe.")
  if (verificado) {
    reiniciarProgreso()
  }
}
</script>
