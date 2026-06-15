// =========================================================
// useTemporizador.js — Composable para controlar el temporizador de preguntas
// =========================================================

import { ref, computed, onUnmounted } from 'vue'

export function useTemporizador() {
  const TIEMPO_MAX = 20
  const tiempoRestante = ref(TIEMPO_MAX)
  const idIntervalo = ref(null)

  const estaActivo = computed(() => idIntervalo.value !== null)
  const estaAgotado = computed(() => tiempoRestante.value <= 0)

  function iniciar(callbackAlAgotar = null) {
    if (idIntervalo.value) return // Evitar múltiples intervalos

    idIntervalo.value = setInterval(() => {
      if (tiempoRestante.value > 0) {
        tiempoRestante.value--
      } else {
        pausar()
        if (callbackAlAgotar) {
          callbackAlAgotar()
        }
      }
    }, 1000)
  }

  function pausar() {
    if (idIntervalo.value) {
      clearInterval(idIntervalo.value)
      idIntervalo.value = null
    }
  }

  function reiniciar(autostart = false, callbackAlAgotar = null) {
    pausar()
    tiempoRestante.value = TIEMPO_MAX
    if (autostart) {
      iniciar(callbackAlAgotar)
    }
  }

  // Limpieza al desmontar para evitar fugas de memoria
  onUnmounted(() => {
    pausar()
  })

  return {
    tiempoRestante,
    estaActivo,
    estaAgotado,
    iniciar,
    pausar,
    reiniciar
  }
}
