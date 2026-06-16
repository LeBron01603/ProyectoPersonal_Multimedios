<template>
  <!-- MapaCostaRica: mapa interactivo vectorial de Costa Rica (SVG) -->
  <div class="mapa-costa-rica-container">
    <svg 
      viewBox="0 0 600 450" 
      class="svg-mapa-cr"
      aria-label="Mapa interactivo de Costa Rica"
    >
      <!-- Definición de filtros de brillo neón -->
      <defs>
        <filter id="neon-glow-green" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Líneas de Conexión (Ruta del Héroe) -->
      <g class="rutas-conexiones" stroke-linecap="round">
        <line 
          v-for="(link, i) in enlacesRuta" 
          :key="i"
          :x1="link.x1" 
          :y1="link.y1" 
          :x2="link.x2" 
          :y2="link.y2" 
          class="linea-conexion-neon"
          :class="{ 
            'desbloqueada': link.desbloqueado, 
            'completada': link.completado,
            'pulsa': link.activo 
          }"
        />
      </g>

      <!-- Provincia Geográfica Nodes -->
      <g 
        v-for="node in nodosProvincias" 
        :key="node.id"
        class="nodo-provincia"
        :class="{ 
          'bloqueada': !node.desbloqueada, 
          'completada': node.completada, 
          'seleccionada': node.seleccionada,
          'recomendada': node.recomendada
        }"
        @click="seleccionarNodo(node)"
      >
        <!-- Círculo de Brillo Exterior -->
        <circle 
          :cx="node.x" 
          :cy="node.y" 
          :r="node.seleccionada ? 28 : 22" 
          class="brillo-nodo"
          :style="{ stroke: node.color, fill: node.color + '10' }"
        />

        <!-- Círculo Core -->
        <circle 
          :cx="node.x" 
          :cy="node.y" 
          :r="node.seleccionada ? 24 : 18" 
          class="circulo-nodo-core"
          :style="{ stroke: node.color }"
        />

        <!-- Icono / Candado de Estado -->
        <text 
          :x="node.x" 
          :y="node.y + 6" 
          class="emoji-nodo"
          text-anchor="middle"
        >
          {{ !node.desbloqueada ? '🔒' : node.emoji }}
        </text>

        <!-- Etiqueta de Nombre de Provincia -->
        <g class="label-nodo-grupo">
          <!-- Fondo de la etiqueta -->
          <rect 
            :x="node.x - 45" 
            :y="node.y + 24" 
            width="90" 
            height="18" 
            rx="4" 
            class="fondo-label-nodo"
          />
          <!-- Texto de la etiqueta -->
          <text 
            :x="node.x" 
            :y="node.y + 36" 
            class="texto-label-nodo"
            text-anchor="middle"
          >
            {{ node.nombre }}
          </text>
        </g>

        <!-- Marcador de Provincia Recomendada (Siguiente Misión) -->
        <circle 
          v-if="node.recomendada" 
          :cx="node.x + 14" 
          :cy="node.y - 14" 
          r="6" 
          class="nodo-recomendado-ping"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  provincias: {
    type: Array,
    required: true
  },
  misionesCompletadas: {
    type: Array,
    required: true
  },
  provinciaSeleccionada: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['seleccionar'])

// --- Coordenadas Geográficas de las Provincias en el SVG (600x450) ---
const COORDENADAS = {
  'san-jose':  { x: 300, y: 220, color: '#00ff88' },
  'heredia':   { x: 340, y: 150, color: '#b84fff' },
  'cartago':   { x: 390, y: 240, color: '#00c8ff' },
  'alajuela':  { x: 250, y: 140, color: '#ffd700' },
  'guanacaste': { x: 120, y: 120, color: '#ff8c00' },
  'puntarenas': { x: 210, y: 280, color: '#ff4646' },
  'limon':     { x: 480, y: 200, color: '#ff007f' }
}

// Ruta ordenada
const rutaOrdenada = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']

// --- Mapeo de Provincias a Nodos ---
const nodosProvincias = computed(() => {
  return props.provincias.map(prov => {
    const coords = COORDENADAS[prov.id] || { x: 300, y: 200, color: '#00ff88' }
    const completada = props.misionesCompletadas.includes(prov.id)
    
    // Identificar si es la provincia recomendada (primera desbloqueada que no esté completada)
    const idxEnRuta = rutaOrdenada.indexOf(prov.id)
    let recomendada = false
    if (prov.desbloqueada && !completada) {
      // Es recomendada si todas las anteriores en la ruta están completadas
      const anterioresCompletadas = rutaOrdenada.slice(0, idxEnRuta).every(id => props.misionesCompletadas.includes(id))
      if (anterioresCompletadas) recomendada = true
    }

    return {
      ...prov,
      x: coords.x,
      y: coords.y,
      color: coords.color,
      completada,
      recomendada,
      seleccionada: props.provinciaSeleccionada?.id === prov.id
    }
  })
})

// --- Enlaces/Conexiones entre provincias en la ruta ---
const enlacesRuta = computed(() => {
  const enlaces = []
  for (let i = 0; i < rutaOrdenada.length - 1; i++) {
    const p1Id = rutaOrdenada[i]
    const p2Id = rutaOrdenada[i + 1]
    
    const p1 = props.provincias.find(p => p.id === p1Id)
    const p2 = props.provincias.find(p => p.id === p2Id)
    
    const c1 = COORDENADAS[p1Id]
    const c2 = COORDENADAS[p2Id]

    if (p1 && p2 && c1 && c2) {
      const p1Completada = props.misionesCompletadas.includes(p1Id)
      const p2Completada = props.misionesCompletadas.includes(p2Id)
      
      enlaces.push({
        x1: c1.x,
        y1: c1.y,
        x2: c2.x,
        y2: c2.y,
        desbloqueado: p2.desbloqueada,
        completado: p1Completada && p2Completada,
        activo: p1Completada && !p2Completada // La línea pulsa hacia la provincia activa
      })
    }
  }
  return enlaces
})

function seleccionarNodo(node) {
  if (!node.desbloqueada) return
  emit('seleccionar', node)
}
</script>

<style scoped>
.mapa-costa-rica-container {
  width: 100%;
  background: rgba(10, 15, 30, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-mapa-cr {
  width: 100%;
  max-width: 580px;
  height: auto;
}

/* --- Conexiones vectoriales --- */
.linea-conexion-neon {
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 3;
  transition: all 0.5s ease;
}

.linea-conexion-neon.desbloqueada {
  stroke: rgba(0, 200, 255, 0.25);
  stroke-width: 4;
}

.linea-conexion-neon.completada {
  stroke: var(--color-neon-green);
  box-shadow: 0 0 10px var(--color-neon-green-glow);
  stroke-width: 4;
}

.linea-conexion-neon.pulsa {
  stroke: #ff9d00;
  stroke-width: 4;
  stroke-dasharray: 8 4;
  animation: stroke-slide 1.5s linear infinite;
}

@keyframes stroke-slide {
  to {
    stroke-dashoffset: -12;
  }
}

/* --- Nodos --- */
.nodo-provincia {
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
}

.nodo-provincia.bloqueada {
  cursor: not-allowed;
  opacity: 0.5;
}

.circulo-nodo-core {
  fill: #060913;
  stroke-width: 3;
  transition: all 0.3s ease;
}

.brillo-nodo {
  stroke-width: 1;
  stroke-dasharray: 4 2;
  fill: transparent;
  transition: all 0.3s ease;
}

/* Hover en nodos activos */
.nodo-provincia:not(.bloqueada):hover .circulo-nodo-core {
  r: 22;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px currentColor);
}

.nodo-provincia:not(.bloqueada):hover .brillo-nodo {
  r: 28;
  stroke-width: 2;
  animation: rotate-clockwise 4s linear infinite;
}

.nodo-provincia.seleccionada .circulo-nodo-core {
  r: 24;
  stroke-width: 4;
}

.nodo-provincia.seleccionada .brillo-nodo {
  r: 30;
  stroke-width: 2;
  stroke-dasharray: 6 3;
  animation: rotate-clockwise 6s linear infinite;
}

.emoji-nodo {
  font-size: 1.15rem;
  user-select: none;
}

.nodo-provincia.seleccionada .emoji-nodo {
  font-size: 1.35rem;
}

/* --- Labels de Provincias --- */
.label-nodo-grupo {
  opacity: 0.85;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nodo-provincia:hover .label-nodo-grupo,
.nodo-provincia.seleccionada .label-nodo-grupo {
  opacity: 1;
}

.fondo-label-nodo {
  fill: #0c0f1a;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

.nodo-provincia.seleccionada .fondo-label-nodo {
  stroke: currentColor;
}

.texto-label-nodo {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: var(--font-bold);
  fill: var(--color-text-secondary);
  user-select: none;
}

.nodo-provincia.seleccionada .texto-label-nodo {
  fill: var(--color-text-primary);
}

/* --- Pings recomendados --- */
.nodo-recomendado-ping {
  fill: #ff9d00;
  stroke: #0a0e1a;
  stroke-width: 1.5;
  animation: pulse-ping 2s infinite;
}

@keyframes pulse-ping {
  0% { transform: scale(0.9); opacity: 0.9; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.9; }
}

@keyframes rotate-clockwise {
  to { transform: rotate(360deg); }
}
</style>
