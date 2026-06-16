<template>
  <!-- SelectorPersonalizado: Reemplazo del select nativo del navegador -->
  <div
    class="selector-personalizado"
    :class="{ 'esta-abierto': estaAbierto }"
    ref="contenedorRef"
    @keydown="alPresionarTeclado"
  >
    <!-- Trigger: El botón principal que abre el listado -->
    <div
      class="selector-trigger"
      :class="{ 'activo': estaAbierto, 'tiene-error': tieneError }"
      role="combobox"
      :aria-expanded="estaAbierto"
      aria-haspopup="listbox"
      :aria-controls="`listbox-${idUnico}`"
      :aria-activedescendant="indiceResaltado !== -1 ? `opcion-${idUnico}-${indiceResaltado}` : undefined"
      tabindex="0"
      @click="alternarDesplegable"
      @focus="alEnfocar"
      @blur="alDesenfocar"
    >
      <span class="texto-seleccionado" :class="{ 'es-placeholder': !modelValue }">
        {{ etiquetaSeleccionada || placeholder }}
      </span>
      <span class="flecha-indicadora" aria-hidden="true">▼</span>
    </div>

    <!-- Opciones: El listado flotante (Popover) con fondo sólido opaco -->
    <transition name="slide-fade">
      <ul
        v-if="estaAbierto"
        :id="`listbox-${idUnico}`"
        class="selector-opciones"
        role="listbox"
        :aria-label="placeholder"
      >
        <li
          v-for="(opcion, index) in opciones"
          :key="opcion.value"
          :id="`opcion-${idUnico}-${index}`"
          class="selector-opcion"
          :class="{
            'esta-resaltada': index === indiceResaltado,
            'esta-seleccionada': opcion.value === modelValue
          }"
          role="option"
          :aria-selected="opcion.value === modelValue"
          @click.stop="seleccionarOpcion(opcion)"
          @mouseenter="indiceResaltado = index"
        >
          {{ opcion.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '../../composables/useAudio.js'

const { reproducirEfecto } = useAudio()

// --- Props ---
const props = defineProps({
  /** Array de objetos { value, label } */
  opciones: {
    type: Array,
    required: true
  },
  /** Valor del v-model */
  modelValue: {
    type: String,
    default: ''
  },
  /** Texto cuando no hay selección */
  placeholder: {
    type: String,
    default: 'Selecciona una opción...'
  },
  /** Si tiene error de validación */
  tieneError: {
    type: Boolean,
    default: false
  },
  /** Estado de apertura controlado desde el padre */
  estaAbierto: {
    type: Boolean,
    default: false
  }
})

// --- Emits ---
const emit = defineEmits(['update:modelValue', 'cambio', 'abrir', 'cerrar'])

// --- Estado local ---
const indiceResaltado = ref(-1)
const contenedorRef = ref(null)

// ID único para accesibilidad
const idUnico = ref(Math.random().toString(36).substring(2, 9))

// --- Computed ---
const etiquetaSeleccionada = computed(() => {
  const encontrada = props.opciones.find(o => o.value === props.modelValue)
  return encontrada ? encontrada.label : ''
})

// --- Acciones ---
function alternarDesplegable() {
  if (props.estaAbierto) {
    emit('cerrar')
  } else {
    emit('abrir')
    const index = props.opciones.findIndex(o => o.value === props.modelValue)
    indiceResaltado.value = index !== -1 ? index : 0
  }
}

function alEnfocar() {
  // Opcional: enfocar visualmente
}

function alDesenfocar() {
  // Esperar un instante para permitir clicks en las opciones
  setTimeout(() => {
    if (contenedorRef.value && !contenedorRef.value.contains(document.activeElement)) {
      emit('cerrar')
    }
  }, 150)
}

function seleccionarOpcion(opcion) {
  emit('update:modelValue', opcion.value)
  emit('cambio', opcion.value)
  emit('cerrar')
  reproducirEfecto('boton')
}

// --- Manejo del teclado (A11y) ---
function alPresionarTeclado(e) {
  if (!props.estaAbierto) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      alternarDesplegable()
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      indiceResaltado.value = (indiceResaltado.value + 1) % props.opciones.length
      break
    case 'ArrowUp':
      e.preventDefault()
      indiceResaltado.value = (indiceResaltado.value - 1 + props.opciones.length) % props.opciones.length
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (indiceResaltado.value >= 0 && indiceResaltado.value < props.opciones.length) {
        seleccionarOpcion(props.opciones[indiceResaltado.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      emit('cerrar')
      break
    case 'Tab':
      emit('cerrar')
      break
  }
}

// --- Limpieza de clicks externos ---
function alHacerClicFuera(e) {
  if (contenedorRef.value && !contenedorRef.value.contains(e.target)) {
    if (props.estaAbierto) {
      emit('cerrar')
    }
  }
}

onMounted(() => {
  document.addEventListener('click', alHacerClicFuera)
})

onUnmounted(() => {
  document.removeEventListener('click', alHacerClicFuera)
})
</script>

<style scoped>
.selector-personalizado {
  position: relative;
  width: 100%;
  font-family: inherit;
  z-index: 5; /* Z-index base bajo para los cerrados */
}

/* Eleva el selector abierto para superponerse encima de labels y otros selectores */
.selector-personalizado.esta-abierto {
  z-index: 100;
}

/* --- Trigger / Botón principal --- */
.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-base);
  backdrop-filter: blur(8px);
}

.selector-trigger:hover,
.selector-trigger:focus-within {
  border-color: var(--color-neon-blue);
  box-shadow: 0 0 0 3px var(--color-neon-blue-glow);
  background: rgba(17, 24, 39, 0.95);
}

.selector-trigger.activo {
  border-color: var(--color-neon-purple);
  box-shadow: 0 0 0 3px var(--color-neon-purple-glow);
}

.selector-trigger.tiene-error {
  border-color: #ff4646 !important;
  box-shadow: 0 0 0 3px rgba(255, 70, 70, 0.2) !important;
}

.texto-seleccionado {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: var(--space-2);
  color: #ffffff;
  font-weight: var(--font-semibold);
}

.texto-seleccionado.es-placeholder {
  color: var(--color-text-secondary);
  font-weight: var(--font-normal);
}

.flecha-indicadora {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.selector-trigger.activo .flecha-indicadora {
  transform: rotate(180deg);
}

/* --- Popover / Opciones (Completamente sólido para legibilidad perfecta) --- */
.selector-opciones {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  z-index: 999;
  background: #0d0f1a; /* Fondo ultra oscuro sólido, sin transparencias que confundan la lectura */
  border: 1.5px solid var(--color-neon-purple);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card), 0 0 15px rgba(184, 79, 255, 0.25);
  list-style: none;
  margin: 0;
  padding: var(--space-1);
}

/* Scrollbar personalizado para el menú */
.selector-opciones::-webkit-scrollbar {
  width: 6px;
}
.selector-opciones::-webkit-scrollbar-track {
  background: transparent;
}
.selector-opciones::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
}
.selector-opciones::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.selector-opcion {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: #c9d1d9; /* Gris claro de alto contraste */
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

/* Opción activa / hover: fondo morado neón brillante */
.selector-opcion.esta-resaltada {
  background: var(--color-neon-purple);
  color: #ffffff !important;
  font-weight: var(--font-semibold);
}

/* Opción seleccionada: verde neón */
.selector-opcion.esta-seleccionada {
  background: rgba(0, 255, 136, 0.15);
  color: var(--color-neon-green);
  font-weight: var(--font-bold);
  border-left: 3px solid var(--color-neon-green);
  padding-left: calc(var(--space-4) - 3px);
}

/* --- Transición --- */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
