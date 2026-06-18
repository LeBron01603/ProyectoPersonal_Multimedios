<template>
  <!-- ModalConfirmacion: Modal interactivo para reemplazar confirm() -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="mostrar" class="modal-overlay" role="dialog" aria-modal="true" :aria-labelledby="`titulo-${idUnico}`">
        <div class="modal-wrapper" @click.self="emit('cancelar')">
          <div class="modal-card animate-fade-in-scale">
            
            <!-- Icono decorativo de alerta -->
            <div class="modal-icon" aria-hidden="true">⚠️</div>

            <!-- Cabecera del modal -->
            <div class="modal-header">
              <h3 :id="`titulo-${idUnico}`" class="modal-title">{{ titulo }}</h3>
            </div>

            <!-- Cuerpo del modal -->
            <div class="modal-body">
              <p class="modal-message">{{ mensaje }}</p>
            </div>

            <!-- Botones de accion -->
            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-outline"
                @click="emit('cancelar')"
              >
                {{ textoCancelar }}
              </button>
              <button
                type="button"
                class="btn btn-danger btn-neon-glow"
                @click="emit('confirmar')"
              >
                {{ textoConfirmar }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

// --- Props ---
defineProps({
  mostrar: {
    type: Boolean,
    required: true
  },
  titulo: {
    type: String,
    default: '¿Estás seguro?'
  },
  mensaje: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  },
  textoConfirmar: {
    type: String,
    default: 'Confirmar'
  },
  textoCancelar: {
    type: String,
    default: 'Cancelar'
  }
})

// --- Emits ---
const emit = defineEmits(['confirmar', 'cancelar'])

const idUnico = ref(Math.random().toString(36).substring(2, 9))
</script>

<style scoped>
/* --- Overlay de pantalla completa --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(5, 8, 20, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

/* --- Tarjeta del modal --- */
.modal-card {
  width: 100%;
  max-width: 440px;
  background: var(--gradient-card);
  border: 1px solid rgba(255, 70, 70, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  box-shadow: var(--shadow-card), 0 0 25px rgba(255, 70, 70, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

/* --- Icono --- */
.modal-icon {
  font-size: 2.8rem;
  animation: pulse-neon 2.5s infinite;
}

/* --- Cabecera --- */
.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
  margin: 0;
}

/* --- Mensaje --- */
.modal-message {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

/* --- Acciones --- */
.modal-actions {
  display: flex;
  gap: var(--space-3);
  width: 100%;
  justify-content: center;
  margin-top: var(--space-2);
}

.modal-actions .btn {
  flex: 1;
  max-width: 150px;
  justify-content: center;
}

.btn-danger {
  background: rgba(26, 10, 10, 0.8) !important;
  border: 1px solid #ff4646 !important;
  color: #ff4646 !important;
  box-shadow: 0 0 10px rgba(255, 70, 70, 0.1) !important;
  backdrop-filter: blur(8px);
}

.btn-danger:hover {
  background: rgba(255, 70, 70, 0.15) !important;
  color: #ffffff !important;
  box-shadow: 0 0 15px rgba(255, 70, 70, 0.35) !important;
  transform: translateY(-1.5px) !important;
}

/* --- Animación Modal-Fade --- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card {
  animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .modal-card {
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform: scale(0.92);
  opacity: 0;
}
</style>
