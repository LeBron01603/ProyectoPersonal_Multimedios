<template>
  <!-- MapaCostaRica: mapa interactivo vectorial real de Costa Rica (SVG) -->
  <div class="mapa-costa-rica-container" @mousemove="onMouseMove">
    <svg 
      viewBox="280 40 600 800" 
      class="svg-mapa-cr"
      aria-label="Mapa interactivo de Costa Rica"
    >
      <!-- Definición de filtros de brillo neón -->
      <defs>
        <filter id="neon-glow-map" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- 1. CAPA: Formas Geográficas de las Provincias (SVG Real de Costa Rica) -->
      <g id="capa-provincias">
        <path 
          v-for="prov in PROVINCIAS_GEOMETRY"
          :key="prov.id"
          :d="prov.d"
          fill-rule="evenodd"
          class="provincia-path"
          :class="{ 
            'bloqueada': !estadoMap[prov.id]?.desbloqueada, 
            'disponible': estadoMap[prov.id]?.desbloqueada && !estadoMap[prov.id]?.completada,
            'completada': estadoMap[prov.id]?.completada, 
            'seleccionada': provinciaSeleccionada?.id === prov.id,
            'recomendada': estadoMap[prov.id]?.recomendada,
            'pulse-path-unlock': animacionUnlock.activa && animacionUnlock.fase === 2 && animacionUnlock.targetId === prov.id
          }"
          :style="{ 
            '--neon-color': COLORES[prov.id]?.hex || '#00ff88', 
            '--neon-color-rgb': COLORES[prov.id]?.rgb || '0, 255, 136' 
          }"
          @click="seleccionarNodo(estadoMap[prov.id], $event)"
          @mouseenter="onMouseEnterProvincia(prov.id)"
          @mouseleave="onMouseLeaveProvincia"
        />
      </g>

      <!-- 2. CAPA: Líneas de Conexión (Ruta del Héroe conectando los centros) -->
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
        <!-- Línea animada de desbloqueo temporal -->
        <line 
          v-if="animacionUnlock.activa"
          :x1="animacionUnlock.x1"
          :y1="animacionUnlock.y1"
          :x2="animacionUnlock.x2"
          :y2="animacionUnlock.y2"
          class="linea-conexion-unlock-anim"
        />
      </g>

      <!-- 3. CAPA: Pines y Marcadores Interactivos en el centro de cada Provincia -->
      <g 
        v-for="node in nodosProvincias" 
        :key="node.id"
        class="nodo-provincia"
        :class="{ 
          'bloqueada': !node.desbloqueada, 
          'completada': node.completada, 
          'seleccionada': node.seleccionada,
          'recomendada': node.recomendada,
          'pulse-unlock-neon': animacionUnlock.activa && animacionUnlock.fase === 2 && animacionUnlock.targetId === node.id
        }"
        :style="{
          'transform-origin': animacionUnlock.activa && animacionUnlock.fase === 2 && animacionUnlock.targetId === node.id ? `${node.x}px ${node.y}px` : 'none'
        }"
        @click="seleccionarNodo(node, $event)"
        @mouseenter="onMouseEnterProvincia(node.id)"
        @mouseleave="onMouseLeaveProvincia"
      >
        <!-- Círculo de Brillo Exterior -->
        <circle 
          :cx="node.x" 
          :cy="node.y" 
          :r="node.seleccionada ? 30 : 24" 
          class="brillo-nodo"
          :style="{ stroke: node.color, fill: node.color + '10' }"
        />

        <!-- Círculo Core -->
        <circle 
          :cx="node.x" 
          :cy="node.y" 
          :r="node.seleccionada ? 26 : 20" 
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
          {{ !node.desbloqueada ? '🔒' : (node.completada ? '✅' : node.emoji) }}
        </text>

        <!-- Etiqueta de Nombre de Provincia -->
        <g class="label-nodo-grupo">
          <!-- Fondo de la etiqueta -->
          <rect 
            :x="node.x - 55" 
            :y="node.y + 26" 
            width="110" 
            height="22" 
            rx="6" 
            class="fondo-label-nodo"
          />
          <!-- Texto de la etiqueta -->
          <text 
            :x="node.x" 
            :y="node.y + 40" 
            class="texto-label-nodo"
            text-anchor="middle"
          >
            {{ node.nombre }}{{ node.completada ? ' ✓' : '' }}
          </text>
        </g>

        <!-- Marcador de Provincia Recomendada (Siguiente Misión) -->
        <circle 
          v-if="node.recomendada" 
          :cx="node.x + 16" 
          :cy="node.y - 16" 
          r="7" 
          class="nodo-recomendado-ping"
        />
      </g>
    </svg>

    <!-- Tooltip Flotante de Información General (para hover y touch) -->
    <transition name="fade-fast">
      <div 
        v-if="tooltipActive" 
        class="map-tooltip"
        :style="{ 
          left: tooltipData.x + 'px', 
          top: tooltipData.y + 'px',
          borderColor: tooltipData.color,
          boxShadow: `0 0 15px ${tooltipData.color}50`
        }"
      >
        <div class="tooltip-header" :style="{ color: tooltipData.color }">
          {{ tooltipData.nombre }}
        </div>
        <div class="tooltip-status">
          {{ tooltipData.estado }}
        </div>
        <div class="tooltip-message" v-if="tooltipData.mensaje">
          {{ tooltipData.mensaje }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAudio } from '../../composables/useAudio.js'
import { useEstadoJuego } from '../../composables/useEstadoJuego.js'

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
const { reproducirEfecto } = useAudio()

// --- Coordenadas Geográficas Reales de los centros en la silueta 1000x1000 ---
const COORDENADAS = {
  'alajuela':   { x: 554.5, y: 139.5, color: '#ffd700' },
  'guanacaste': { x: 412.8, y: 157.5, color: '#ff8c00' },
  'limon':      { x: 765.7, y: 299,   color: '#ff007f' },
  'puntarenas': { x: 749.6, y: 401,   color: '#ff4646' },
  'heredia':    { x: 630.2, y: 171.1, color: '#b84fff' },
  'san-jose':   { x: 596,   y: 275.5, color: '#00ff88' },
  'cartago':    { x: 682,   y: 271.8, color: '#00c8ff' }
}

const COLORES = {
  'alajuela':   { hex: '#ffd700', rgb: '255, 215, 0' },
  'guanacaste': { hex: '#ff8c00', rgb: '255, 140, 0' },
  'limon':      { hex: '#ff007f', rgb: '255, 0, 127' },
  'puntarenas': { hex: '#ff4646', rgb: '255, 70, 70' },
  'heredia':    { hex: '#b84fff', rgb: '184, 79, 255' },
  'san-jose':   { hex: '#00ff88', rgb: '0, 255, 136' },
  'cartago':    { hex: '#00c8ff', rgb: '0, 200, 255' }
}

// Ruta ordenada oficial de Ruta Tica
const rutaOrdenada = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']

// Geometría real obtenida de Simplemaps (Optimizado para 1000x1000)
const PROVINCIAS_GEOMETRY = [
  { id: 'alajuela', d: 'M607.7 113.2l0 0.7-0.4 34.3-0.3 25.8-0.3 18.4-0.2 22-1.9 24.3 0 0.4-2.9 3.1-0.8 1.2-0.1 0.5 0 0.5 0 0.8 0.3 1.4-2.3 2.6-4.4 1.4-10.6 3-2.8 0.4-0.8-0.3-1.9-0.2-0.8-0.2-0.6-0.2-3.1-0.5-3.1-0.9-3.8 0.8-7 0.5-4.9 2.2-1.3 0.8-0.1 0.2-0.2 0.4-1.9 1.8-2.7 1.4-1 0.8-0.5 0.6 0.1 0.4-0.1 0.5-2.9 3.7-0.3 0.6-0.2 1.2-0.3 0.3-1.1 0-3.4-4.6-1.5-1.1-1.8-0.4-2.1-0.1-2.6-0.7-3.3-1.3-1.1-0.8-0.5-0.6 0.2-0.8 0-1 0.1-0.4 0.2-0.4 0.3-0.2 1.1-0.5 2.9-4.6 1.2-1.2 1.8-0.5 7.8-5.1 2.4-1 0.8-0.4 0.5-0.5 0.2-0.4 0.1-1.1-2-3.3-1.1-0.6-0.4 0.2-1.3 0.9-1.2 0.4-0.5 0-0.3-0.1-0.2-0.3-0.2-0.5-0.1-0.3-1-1.6-2.6-3.1-1.3-2.1-2.5-3.2-1-1.4-1.7-3.7-0.7-2.5 0.6-4.1-0.1-0.6-0.2-0.9-0.8-1.6-0.2-0.6 0-0.6 1-3.6 0.4-1.2 1.7-3.1 0.2-0.8-0.1-0.6-0.2-0.2-1-0.8-0.6-0.9-0.9-2.5-2.8-1.8-1.2-0.2-0.4 0.2-0.4 0.1-1 0.6-2.2 0.7-3 0.5-1.3 0.1-0.9-0.1-1-0.7-0.3-0.2-1-1.2-3.5-5.7 2.5-4.8 0.3-1.6-0.4-0.7-0.2-0.3-0.5-1.1-0.6-3 2.4-8.8-3.4-6.9-1.2-1.9-9-7-2.9-1.4-8.6-2.3-2.2-0.9-1.7-1.9-4.2-3.7-0.5-0.6-0.9-1.4-0.5-1.1-0.7-4.3-1.8-3.3-2.3-3.6-0.9-1-1-0.7-2.2-0.9-1.7-0.5-8.4-2-2.5-0.8-1-0.8-1.1-1.1-4.7-3.2-1.2-0.6-1-0.4-1-0.1-1 0.1-2 0.2-3.4 0.9-4.1 0.3-4.8-0.1-3.8-7.8-1.4-2.1-0.7-0.5-0.4-0.2-0.4-0.2-0.4-0.1-3.5-0.5-1-0.3-3.8-2.3-1.8-1.3-7.2-8.4-0.2-0.3-0.3-0.6-0.1-0.5 0.1-0.3 0.6-0.7 5.4-0.4 1.4-0.7 0.5-0.7 0.3-0.7 12.4-8.5 7.5-8.5 0.6-0.5 0.4-0.1 0.6-0.1 1-0.3 1.2-0.3 0.3-0.3 22.7 8.4 25.5 9.5 3.6 0.4 3.7-1.4 16.3-10.8 11.7-7.7 5-1.2 2.8 1.2 6 4.4 2.7 0.4 3.4-0.2 3.7 1.2 7.8 3.4 0.9 0.3 0.8 0.3 0.8 0.4 0.6 0.5 3.6 4.5 1.4 1.1 1.4 0.9 1.7 0.6 1.7 0.2 1.5-0.6 8.5-5.6 1.3-0.8 1.5 0.8 0.4 1.2 0 1.6 0.3 2 0.7 1.1 2.1 2.7 0.4 1.1 1.7 1.6 7.3 2.8 1.7 1.2 1.4 1.5 3 1.6 2.8 2.3 0.5 3.8-2.1 1.2-0.7 0.4-0.7 1.3 0.3 0.9 0.6 0.7 0.4 0.5 3.5 2.8 0.8 1.1 1.8-1.3 2.4 0.1 1.1 0.1z' },
  { id: 'guanacaste', d: 'M437.4 70.7l-0.3 0.3-1.2 0.3-1 0.3-0.6 0.1-0.4 0.1-0.6 0.5-7.5 8.5-12.4 8.5-0.3 0.7-0.5 0.7-1.4 0.7-5.4 0.4-0.6 0.7-0.1 0.3 0.1 0.5 0.3 0.6 0.2 0.3 7.2 8.4 1.8 1.3 3.8 2.3 1 0.3 3.5 0.5 0.4 0.1 0.4 0.2 0.4 0.2 0.7 0.5 1.4 2.1 3.8 7.8 4.8 0.1 4.1-0.3 3.4-0.9 2-0.2 1-0.1 1 0.1 1 0.4 1.2 0.6 4.7 3.2 1.1 1.1 1 0.8 2.5 0.8 8.4 2 1.7 0.5 2.2 0.9 1 0.7 0.9 1 2.3 3.6 1.8 3.3 0.7 4.3 0.5 1.1 0.9 1.4 0.5 0.6 4.2 3.7 1.7 1.9 2.2 0.9 8.6 2.3 2.9 1.4 9 7 1.2 1.9 3.4 6.9-2.4 8.8 0.6 3 0.5 1.1 0.2 0.3 0.4 0.7-0.3 1.6-2.5 4.8-2.5-2-0.7-0.3-0.9-0.3-0.8-0.1-1.2 0.1-0.7 0.1-0.5 0.2-0.9 0.7-1.4 1.4-0.6 0.5-1.4 0.8-0.9 0.6-0.7 0.7-0.5 0.7-0.3 0.5-0.1 0.5 0 0.5 0.1 0.4 0.2 0.3 0.2 0.4 1.2 1 0.2 0.3 0.1 0.5 0.1 0.4-0.1 0.4-0.7 2.1-0.4 3.1-0.1 0.5-1 2-0.1 0.6 0 0.4 0.1 0.4 0.1 0.4 0.2 0.3 0.5 0.6 0.3 0.4 0.1 0.6-0.1 1.2-0.3 0.5-0.3 0.5-3 1.3-0.7 0.4-2.9 2.6-0.7 0.9-0.4 0.7-0.2 1 0 0.5 0.2 0.9 0.6 1.7 0.1 0.6-0.3 0.3-0.4 0-0.4-0.1-0.4-0.1-1.5-0.8-1.2-1-0.6-0.6-1.9-2.4-1.2-1-0.3-0.3-1.4-0.8-0.8-0.3-0.5-0.1-0.5 0-0.6 0.1-0.8 0.3-0.3 0-0.4 0-0.4-0.1-0.4-0.1-0.3-0.3-0.6-0.4-0.3-0.2-0.5-0.1-0.4 0-0.9 0.2-1 0.1-0.5 0-0.5-0.1-1.3-0.1-3.1 1-0.7-0.5-0.6-0.3-2.1-1.9-2.9 1-10.6 0.1-2.9-0.7-2.5-1.8-3.9-4.1 0-1 0.9-3-2.8-3.3-6.8-4.8 1 3.3 4.6 3.3 1 3.9 0.4 7.5 1 4.3 1.8 3-2 1.3 0.3 2.3 1.8 2.1 4.9 1.7 1.7 1.8 2 4 1 0 1.3-0.5 0.6 0.4 0.2 1.1-1.4 0.1-1.4-0.1-1.3-0.4-1.2-0.6 0 1 3 2.7-1.6 5.2-1 1.3-3.4 0.8-0.8 0.4-4.1 2.3-0.7 0.2-0.4-0.1-0.3-0.3-0.2-0.3-0.3-0.2-1.1 0.1-1.6 0.5-3.9 1.9-1.4 1.3-0.7 1.3 0.3 0.9 0.5 0.7 0.6 0.5 0.7 0.4 0.6 0.1 1.5-0.2 0.5 0 0.5 0 1.4 0.3 0.4 0.1 0.7 0.4 0.4 0.2 0.4 0.1 1.5 0 0.9 0.2 1.1 0.6 1.2 0.4 0.3 0.2 0.3 0.2 0.7 1 0.9 0.8 0.4 0.7 0.2 0.3 0.2 0.4 0.3 0.7 0.2 1 0.2 0.9 0.2 0.3 0.3 0.2 0.4 0.2 2.3 0.5 0.3 0.3 0.1 0.4-0.5 1-0.6 1.7-1.6 6.1 0 1 0.2 0.7 0.4 0.5 0.1 0.3-0.1 0.3-0.9 0.8-0.4 0.4-0.3 0.7-0.4 1.4-0.4 0.7-0.4 0.4-0.4 0.3-0.4 0.4-1 2.1-0.4 0.2-0.4 0.1-0.9 0.4-0.4 0.5-0.8-2-0.7-0.8-1.5-0.9-3.9-1.6-0.3-1.3 0-1.5-0.1-1.1-3.8-4.1-5.2-3-17-6.1-1.5 0.3-2.3 1.6-1 0.4-1.5-0.4-2.1-1.5-1.8-0.4-1-0.1-0.3-0.2-0.2-0.5-0.6-0.7-1.1-0.6-0.9 0.3-0.7 0.5-0.1 0.3-8.9-2.9-4.3-0.6-1-0.7-0.8-0.7-1.2-0.7-1.8 0.1-1.2 0.7-1 0.1-1.4-1.9 1.1-2.9-1.7-4.1-16.1-19.9-1-1.8-1.3-4.3-1.9-3-6.2-15.2-0.5-4.5-0.7-2.8-0.9-2 2.2-2.1 0.9-1.6-0.4-1.3-3.3-4.3-2.2-1.3 1.2-1.5 2.8-2.2 1.8-2.7 1.3-2.7 2.7 1.1 1.5-1.7 1.1-2.5 3.4-2.6-1.3-2.8-2.4-3-1.7-1.7 1-0.7 0.4-0.3 0.8-0.1 0-1.1-2.2 0 0-1.1 1.8-0.4 1.2-1.1 1.3-3 1.1 0 2.2 1.8 3.1-1.3 3.2-1.8 2.4 0.3 1 0-0.2-2.1 0.5-1 0.9-0.6 0.8-0.7 1.5-2.5 0.5 0.1 2 0.2 4.7-5-0.3-1.3-0.8-1-2.1-1.5-6.5 6.6-0.1-0.5 0-0.5-0.2-0.3-0.7 0.1 0-1 1.8-2 1.1-0.8 1.4-0.5-1.1-1.1-0.1 0.2-0.3 0.3-0.3 0.3-0.5 0.3 0.4-1.3 0.1-0.5 1.8-0.5 0-1-1.1 0 0-1.2 2.6-2.1 0.6-5.4-0.9-10.6-2.4-2.8-5.2-2.4-5.3-0.8-2.3 1.6-1 0-4.3-3.6-1.3-1.4 0.7 0.3 1-0.5 0.4-0.9-0.9-1.1-1.2-0.3-3 0.3-1.3 0-4.7-1.7-3.6-2.2-4.1-1.8-5.9-0.8 0-1.2 3.5-0.9 6.7-3 3.8-0.5-0.6-0.9-0.5-0.7-0.7-0.3-1.5-0.3 0-1 7.9-0.5 1.9 0.5 0.9 1.2-0.2 1.4-0.4 1.2 0.3 0.5 0.6 0.3 2.1 1.9 1 0 1.1-1.2 0-1-1.8-1.8 1.8-1.1 3.3-0.5 3.2 0.1 1.1 0.6 1.4 1.4 1.3 0.2 1-0.3 0.4-1-0.1-1.1-0.8-0.8 0-1.2 2.3-0.9 0.7-1.8-0.5-2.1-1.3-1.8-1.2-0.9-2.6-1.1-1.2-0.8-1.3-1.4 0-0.4 0.8-0.1 1.1-0.8 2.4-2.3 1.4 0.8 1.6 1.5 3.2 0 1.9-1.8-0.4-2.3-1.7-2.3-2-1.4-1.3-0.6 3.8-6.2 2.9-6.3 4.4-6 5.3-2.2 4.5 2.3 4.5 4 5.1 2.9 16 6 21.3 7.9 5.6 2.1z' },
  { id: 'limon', d: 'M669.9 115.6l10.4-2.5 5.5-2.8 0.5-4.4-1.4-5.7-0.1-3.6-1.6-0.8 0.5-2.1-0.3-1-0.4-0.1-1.2-2.9-1.2-0.3 1.5-0.2 0.8 0.4 0.5-0.1 0.9 0.5 0 0.3-0.4 0.3 0 0.5 0.6-0.1 0.8-0.7 0.2-0.7 0.7 0.2 2.6 1.3 3.2 3.7 4 7.5 2.9 7.9-0.4 5.1-2.3-2.9-4.2-10.3 2.7 12.9-0.3 5.1-4.5 4 2.4-0.5 1.6-1.1 1.6-1.4 2-1.3-0.7 0.8-0.2 1 0.3 1.1 0.6 1.4 0.6-1.9 0.7-3.7 0.9-2 7.6 21.2 9.6 22.8 11.3 19 30.2 39.6 2.4 1.8 10 12.4 6.2 6.1 3.8-2.1 1.4 1 4.2 0.7 0.9 1.2 0.1 3 0.5 2.5 1.1 2.2 2.1 2.2 7.3 10.9 2.4 1.7 9.1 12.3 6.9 6.5 4-1.2 0.9 2.5 0.9 6.5 1.4 2.9 2.5 1.9 10.6 3.7 3.7 0.4 3.7-0.1 3.5 0.2 3.1 1.7 3.9 6 2.7 1.6 0.1 0.1 1.7 6-0.5 0-0.7 0.1-2.4-1.3-2.4-0.4-0.6 0.7-0.7 1.1-0.7 5.9 0 0.3-1 2-2.1 0.3-2.9-0.5-2.8-0.8-1.6-0.8-1.5-1.7-0.1-0.1-2-3.8-0.1-0.1-1.6-1.8-0.1 0-0.7 0.4-0.4 0.2-1.6-0.6-6.5-5.6-0.7-0.3-1.1-0.4-3.9-1.6-1.4-0.5-2.1-0.9-2.9 0.4-2.9 2.5-1.8 2.5-0.3 1.5 0.6 1 0.8 1.5 0.5 0.9 0.8 3.3 0.3 1.1 0.7 0.9 1 0.3 0.4 0.3 0.3 0.2-0.2 1.3-0.5 0.2-1.9 1.1-8.4 1.2-3 1-0.8 1.4-0.5 0.9-0.4 3 0.2 13.3 0.2 19.2 0.4 26.2-0.1-0.1-1.5-1.3-0.5-0.3-2.6-0.8-2.6-2.7-0.8-1.2-1-2.7-0.9-1.4-0.6-0.4-1-0.4-5.4-1.5-0.5-0.3-0.5-0.4-0.4-0.9-0.3-0.5-1.7-8.6-0.5-1.6-0.4-0.7-0.2-0.3-0.3-0.3-0.4-0.2-5.6-3.3-0.6-0.4-1.2-1.1-6.1-8-0.7-0.2-1.1-0.1-3.4 0.2-2.1 0.4-0.6 0-0.8-0.1-1.1-0.4-2.5-1.2-1.5-1-0.8-0.4-2.9-1-0.8-0.4-0.3-0.2-0.4-0.2-2.9-2.5-0.7-0.5-0.8-0.4-0.5 0-0.7 0.1-1.1 0.6-0.6 0.4-0.4 0.4-1.9 2.6-0.2 0.3-0.7 0.2-3 0.3-0.8 0.2-0.6 0.3-0.6 0.6-0.3 0.2-0.3 0.2-0.4 0.1-0.3-0.2-0.4-1.2-0.1-0.6-0.2-0.4-0.5-0.5-0.5-0.3-4.2-1.2-1.9-1.4-0.6-0.5-1.3-1.9-5.2-14.4-0.6-1.7-1-2.2-0.4-0.4-0.5-0.6-0.3-0.4-0.9-2.2-0.3-1.9-0.4-1.6 0.6-4.9 2.2-4.5 9.1-11 3.5-9 1.3-2 4.8-5.8 6.7-8.4 1-2.8-0.4-2.9-1.8-5.7-0.2-3.5 0.5-2.8 1.2-2.7 2-2.8 0.4-0.6-3.2-0.7-16.7-0.4-22.8-0.2-4.1-1.5-15.5-7.2-9.5-4.5-6.9-3.3-19.8-9 2.1-7.2 1.1-1.4 1.4-1.4 7.4-8 0.5-0.8 2-4.1 0.4-1.2 0.2-0.8-0.1-0.5 0.1-1.9 0.5-2.3 0.2-1.2-0.1-0.8-0.1-0.3-0.5-0.6-0.4-0.7-0.3-0.8-0.5-1.7-2.1-4-0.2-0.6-0.4-2.3 0.1-1 0.1-0.7 0.6-1.1 0.4-0.7 1.3-2.4 0.3-0.4 0.4-0.2 0.4 0 0.4-0.1 0.4-0.2 0.3-0.3 0.6-0.6 1.4-2.2 0.9-3.4 0-0.8 0-0.4-0.7-1.6-0.1-0.5 0-0.5 0.1-1.3 0.1-0.6-0.1-0.4-0.2-0.4-0.2-0.3-0.5-0.6-0.2-0.4-0.2-0.3 0-1 0.9-6.9-0.1-1.5 0.2-4.9 0.2-1.4 0.3-1 0.2-0.3 0.6-0.5 1.4-0.9 1.5-0.8 0.6-0.4 1.6-1.8 2.7-1.7 1.6-0.5 0.9-0.2 4.6-0.4 1.7-0.5 0.6 0 0.6 0.1 0.7 0.2 0.1-0.1 0-0.3-0.3-0.5-0.4-0.5-0.6-0.5-1.3-0.8-0.7-0.5-0.5-0.6-0.5-0.6-0.1-0.6-0.1-0.7 0.5-3.3 0-0.5-0.1-0.6-0.5-0.7-0.6-0.7-0.7-0.8-0.4-0.3-0.4-0.2-0.5-0.2-1.8-0.5-0.5-0.4z' },
  { id: 'puntarenas', d: 'M508.5 189.2l3.5 5.7 1 1.2 0.3 0.2 1 0.7 0.9 0.1 1.3-0.1 3-0.5 2.2-0.7 1-0.6 0.4-0.1 0.4-0.2 1.2 0.2 2.8 1.8 0.9 2.5 0.6 0.9 1 0.8 0.2 0.2 0.1 0.6-0.2 0.8-1.7 3.1-0.4 1.2-1 3.6 0 0.6 0.2 0.6 0.8 1.6 0.2 0.9 0.1 0.6-0.6 4.1 0.7 2.5 1.7 3.7 1 1.4 2.5 3.2 1.3 2.1 2.6 3.1 1 1.6 0.1 0.3 0.2 0.5 0.2 0.3 0.3 0.1 0.5 0 1.2-0.4 1.3-0.9 0.4-0.2 1.1 0.6 2 3.3-0.1 1.1-0.2 0.4-0.5 0.5-0.8 0.4-2.4 1-7.8 5.1-1.8 0.5-1.2 1.2-2.9 4.6-1.1 0.5-0.3 0.2-0.2 0.4-0.1 0.4 0 1-0.2 0.8 0.5 0.6 1.1 0.8 3.3 1.3 2.6 0.7 2.1 0.1 1.8 0.4 1.5 1.1 3.4 4.6-1.4 1.2 1.5 0.6 1.1 0.7 0.7 0.5 0.5 0.5 0.3 0.3 0.9 1.3 0.8 1.5 0.1 0.6 0.1 0.9-0.2 1.3-0.3 0.6-0.3 0.4-0.3 0.3-0.4 0.1-0.4 0.1-0.5 0.1-3-0.2-1 0.1-0.4 0.2-0.4 0.2-0.3 0.2-0.2 0.4-0.1 0.3-0.1 0.5 0.1 0.4 1.2 4 0.4 2-0.1 3.1 0 0.5 0.4 0.9 3.5 6.2 0.1 0.3 1.1 5.4 0.4 1.2 0.7 1.5 1 1.3 1.1 1 0.5 0.4 1.6 0.2 4.9-0.8 1.1 0.4 0.4 0.1 0.6 0 2.5-0.7 0.5 0 0.5 0.1 0.3 0.2 0.4 0.2 0.7 0.8 0.3 0.3 0.4 0.2 0.4 0.1 0.4 0.1 0.5-0.1 0.4-0.2 0.5-0.4 0.9-1.9 0.3-0.4 0.4-0.4 1.8-1.4 0.5-0.6 0.4-0.4 0.1-0.4 0.1-1-0.5-3.2 0-0.4 0.4-0.2 0.9-0.2 1.8 0 4.2-0.8 6.7-0.3 2.3 0.2 0.9 0.7 0.6 0.5 1.1 1.3 0.2 0.3 1.7 0.3 5.6-0.2 2.1 0.9 2.3 0.2 7.1-0.6 1.4 0.1 0.4 0.2 0.5 0.4 0.4 0.7 0.4 1.3 0 0.7 0 0.6-0.3 1.4-0.1 1 0 0.5 0.3 0.6 0.5 0.6 1.2 1.1 1.3 0.5 0.7 0.1 1.4-0.2 2.1-0.1 1.4 0.2 0.8 0.3 0.4 0.3 0.4 0.6 0.3 0.8 0.3 2 0 1-0.1 0.7-0.4 0.7-0.4 0.8 0.6 1 3.5 1.6 2.5 4.9 3.6 3.6 10.4 6.9 2.4 0.8 0.2-0.4 0.3-0.3 0.3-0.2 0.3-0.3 0.4-0.1 0.4-0.2 0.4 0 0.5 0 0.4 0.1 0.5 0.3 0.6 0.6 1.1 2 0.2 0.7 0.7 3 0.2 0.4 5.1 5.2 1 1.4 0.6 1-0.2 1.6 0 1 0.2 1.8 1.1 3.2 0.7 1.5 0.4 0.7 0.6 0.6 1.1 1 7.9 3.6 1.1 0.3 0.5-0.1 0.4-0.1 0.3-0.2 0.2-0.3 1.4-2 0.3-0.2 0.4-0.2 0.4-0.2 0.5-0.1 0.5 0 0.4 0 0.4 0 0.5 0.1 1.5 0.8 2.2 2.1 3.6 4.4 0.5 1 0.1 0.4 0.1 0.4 1.2 4.2 0.1 0.3 0.5 0.6 1 1.3 14.4 9.3 0.3 0.2 1.7-0.1 1.4-0.2 0.4-0.1 0.5 0.1 0.4 0.2 0.7 0.5 0.7 0.8 0.3 0.3 0.7 0.4 0.4 0.1 0.4 0.1 0.5 0 0.3-0.2 0.3-0.2 0.3-0.2 1.7-2.4 0.6-0.6 0.5-0.3 0.3-0.2 0.4-0.2 0.3-0.3 0.2-0.6 0.1-0.8-0.5-3.7 0.1-0.6 0.3-0.9 1.2-2.2 0.3-1-0.1-1.9-0.2-0.9-0.2-0.6-0.2-0.3-0.1-0.5-0.2-0.3-0.3-0.2-0.4 0-0.4 0-0.4 0-0.4-0.1-0.3-0.2-0.2-0.3-0.3-0.3-0.4-0.1-1.4-0.3-0.3-0.2-0.2-0.3 0-0.5 1.5-8 0.1-0.4 0.6-0.8 4.3-4.9 0.3-0.6 0.4-0.9 1.1-3.9 0.5-0.9 0.4-0.6 3.4-3.6 4.2 1.2 0.5 0.3 0.5 0.5 0.2 0.4 0.1 0.6 0.4 1.2 0.3 0.2 0.4-0.1 0.3-0.2 0.3-0.2 0.6-0.6 0.6-0.3 0.8-0.2 3-0.3 0.7-0.2 0.2-0.3 1.9-2.6 0.4-0.4 0.6-0.4 1.1-0.6 0.7-0.1 0.5 0 0.8 0.4 0.7 0.5 2.9 2.5 0.4 0.2 0.3 0.2 0.8 0.4 2.9 1 0.8 0.4 1.5 1 2.5 1.2 1.1 0.4 0.8 0.1 0.6 0 2.1-0.4 3.4-0.2 1.1 0.1 0.7 0.2 6.1 8 1.2 1.1 0.6 0.4 5.6 3.3 0.4 0.2 0.3 0.3 0.2 0.3 0.4 0.7 0.5 1.6 1.7 8.6 0.3 0.5 0.4 0.9 0.5 0.4 0.5 0.3 5.4 1.5 1 0.4 0.6 0.4 0.9 1.4 1 2.7 0.8 1.2 2.6 2.7 2.6 0.8 0.5 0.3 1.5 1.3 0.1 0.1 0 1.7 4.7-2 1.5 0 1.1 0.9 0.5 1.2 0.5 1.2 0.7 1 0.9 0.6 3.6 1.5 7.2 5.4 7.2 2.5 2.1 1.4 4.1 6.9 0.5 1.3 0.1 0.2-0.1 0.2-0.6 0.9-1.6 2.7-4.7 2.8-16.3 6.7-1.8 1.4-0.5 0.7-1.1 1.3 0.8 0.7 1.3 0.8-0.1 2.2-0.1 0.2-1.3 1.5-1.3 0.8-2 1.2-1.4 0.9-0.2 0.2-1.1 1.2-0.2 2.4 0.8 2.3 1.4 2.1 4.9 5.5 2.7 3.8 1.9 4.1 1.3 4.8 0.7 8.3 0.1 1.8 0.1 1.1-0.5 5.6-1.4 4.7-2.7 3.2-0.8 1.1-4.1 2-4.5 1.4-4.5 2.3-0.5 0.5-0.6 0.5-0.6 0.7-2.9 2.7-2.4 2.3-1 0.6-0.9 0.5-5.3 3-1 0.8-0.4 0.3-0.2 2 1.5 1.6 4.4 2.6 0.8 0.9 1.5 2.2 0.9 0.7 1 0.1 1.9-0.8 1.5 0.2 2.7 1.5 1.1 1.6 0.7 5.1 5.2 11.4 2.7 6 0.1 0.2 0.4 0.7-0.8 7.1-0.4 1.3-0.6 2.3-2.2-1.7 0.3-2.4 1.2-2.7 0.7-2.4-0.5-2-10.7-18.5-3.8-4-19.6-14.3-5.4-5.3 4.6-5.7 0.9-0.5 0.9-1.6 1.7-2.1 1.1-2.5-1-2.5-5.2-6.5-0.8-1.8-0.1-2.4 1.1-0.8 2-0.6 2.4-1.6-1.8-0.5-4.6 0.2-2.3-0.8-1.2-1.4-3.1-6.2 0.5-0.8 0.3-0.6 0.3-0.9 1.1 0 1.5 2.6 0.4 1.3 0.2 2.1 0.7 0.4 4.7-1.9 0-1.2-2.1-0.9-2.3-1.7-2-2-1.1-1.9-1.1 0-1.2 1.9-2.9 0.1-3.3-0.3-2.4 0.5-1.2-2.2-1.8-2.2-2.2-1.2-2.3 1.2-5-3-1.4-2.4 1-3.3-1.1-0.1-1.1 0.1 0.7-2.6-2.3-1.3-3.3-0.7-2.6-0.9-1 1.9-0.8-0.1-1.1-0.8-1.5 0-0.8 0.9-0.2 1.1-0.6 1-2.2 0.4-5.2-0.8-2.1 0.8-0.8 3.2 1.2-1 0.9 0 5.6 8.3 0.7 2.6 3.3 5.1 1.2 1.5 2.1 1.1 5.9 1.8 2.4 0.3 2.1 1.3 2.1 2.5 2 1.7 1.9-1.2 0.1 4-0.3 1.6-0.9 1.1 0 1.1 2.3 3.2 1 5.6-0.4 5.8-1.8 4-3.5 0.1-5.8-1.8-5.4-2.7-2.6-2.1 1 0 0.7 0.5 0.6 0.3 2.1 0.2-3-1.3-1.3-0.8-1.3-1.2 0 2.3-9.1-4-3.2-0.5-9.7 1.2-2.7 0-2.2-1.1-2.2-2.2-3.8-5-13.7-12.8-0.9-1.5-0.7-0.1-3.2-1.4-1-0.6-0.5-4.9 4.8-7.5 1.1-1.3 2.5-1.4 1.7-0.7 0.8 0.5 0.5 0.9 1.1-1.1 3.8-5.9 1.1-1.1-2-2.5 2.4-2.9 4.3-2.3 3.9-1 0-1-3.4-0.4-1.8 0.1-1.1 1-1.9 2-1.8 0.8-0.6-1.5 0.7-2.7 2.2-2.7 3.9-1.9 1.8-1.2 0.8-1.8-1-1.7-2-1.1-1.9-1.5-0.4-2.8 3.1 1.6 1.4 0.5 2 0-1-1.2-1.2-0.9-2.2-1.2-1-0.8-0.5-0.7-0.9-0.5-1.8-0.1 1.9-1.2-0.3-0.8-1.1-0.7-0.5-0.5 0.7-1.8 0.8-1.3 1.1-1.1 1.6-1.4-4.2-11-0.8-1.4-2.6-2.8-1.1 1-3.5-4.6-3.2-5.4-4.2-4.2-6.3-1.1 0.4-4.2-3.5-3.5-4.8-2.4-3.5-1-12.4-11.9-12.2-5.7-1.9-1.5-15.2-6-1 0-1 0.8-0.9 0-0.7-0.7-0.6-1.3-2.2 1-1.3-1.1-1.5-1.5-2.7-0.5 1.7-2.9-2.2-4.2-4.1-3.6-4-1.4 0 1.1 1.4 0.3 0.9 0.4 2.1 1.5-4.1-0.7-6.5-3.9-4.1-0.9-4-0.3-21.1-5.9-4.1-0.3-1.9 0.3-2 0.7-2.1 0.4-2.1-0.3-1.9-1.6-0.6-1.9-0.7-1.5-2.2-0.5 0.4 0.6 0.2 0.5 0.4 1.2-2.6-2.1-5.9-3.8-1.1-2.4-0.6-2.2-1.4-1.1-1.7-0.7-1.7-1-0.6-1.6 0.3-1.7-0.5-1.1-2.4 0.1 0.6-1.8-0.2-1.8-0.4-1.6 0-1.5 0.9-1.8 2.7-2.7 1.1-2.7 1.1-1.3 1.1-1.8 0.5-2.3-0.5-1.9-1.3-1.7-2.4-2.4-6.4-9.6-1.8-1.4-2.6-1.1 0.4-2.4 2.2-3.7-3.9-3.2-0.7-1.6 0.8-2.3-4.5-1.4-14 1.4 0-1.2 2-0.8 2.4-0.2 5.5 0 0-1.1-5-0.2-4.5-0.8-4.1-1.4-3.7-2.1-4.8-3.9-0.7-0.9-1-0.2-2-1.4-1.5-1.5 0.8-0.7-2.6-1.4-6.5-6.1-3.5-1.7-1.6-1.5-1-0.4-0.8 0.4-0.7 0.6-0.9 0.1-1.3-1.1 0.9-1.7 0.3-1.1 3.1-1 1.3 0.1 0.5 0.1 0.5 0 1-0.1 0.9-0.2 0.4 0 0.5 0.1 0.3 0.2 0.6 0.4 0.3 0.3 0.4 0.1 0.4 0.1 0.4 0 0.3 0 0.8-0.3 0.6-0.1 0.5 0 0.5 0.1 0.8 0.3 1.4 0.8 0.3 0.3 1.2 1 1.9 2.4 0.6 0.6 1.2 1 1.5 0.8 0.4 0.1 0.4 0.1 0.4 0 0.3-0.3-0.1-0.6-0.6-1.7-0.2-0.9 0-0.5 0.2-1 0.4-0.7 0.7-0.9 2.9-2.6 0.7-0.4 3-1.3 0.3-0.5 0.3-0.5 0.1-1.2-0.1-0.6-0.3-0.4-0.5-0.6-0.2-0.3-0.1-0.4-0.1-0.4 0-0.4 0.1-0.6 1-2 0.1-0.5 0.4-3.1 0.7-2.1 0.1-0.4-0.1-0.4-0.1-0.5-0.2-0.3-1.2-1-0.2-0.4-0.2-0.3-0.1-0.4 0-0.5 0.1-0.5 0.3-0.5 0.5-0.7 0.7-0.7 0.9-0.6 1.4-0.8 0.6-0.5 1.4-1.4 0.9-0.7 0.5-0.2 0.7-0.1 1.2-0.1 0.8 0.1 0.9 0.3 0.7 0.3 2.5 2z m-69.9 94.7l0.4-0.5 0.9-0.4 0.4-0.1 0.4-0.2 1-2.1 0.4-0.4 0.4-0.3 0.4-0.4 0.4-0.7 0.4-1.4 0.3-0.7 0.4-0.4 0.9-0.8 0.1-0.3-0.1-0.3-0.4-0.5-0.2-0.7 0-1 1.6-6.1 0.6-1.7 0.5-1-0.1-0.4-0.3-0.3-2.3-0.5-0.4-0.2-0.3-0.2-0.2-0.3-0.2-0.9-0.2-1-0.3-0.7-0.2-0.4-0.2-0.3-0.4-0.7-0.9-0.8-0.7-1-0.3-0.2-0.3-0.2-1.2-0.4-1.1-0.6-0.9-0.2-1.5 0-0.4-0.1-0.4-0.2-0.7-0.4-0.4-0.1-1.4-0.3-0.5 0-0.5 0-1.5 0.2-0.6-0.1-0.7-0.4-0.6-0.5-0.5-0.7-0.3-0.9 0.7-1.3 1.4-1.3 3.9-1.9 1.6-0.5 1.1-0.1 0.3 0.2 0.2 0.3 0.3 0.3 0.4 0.1 0.7-0.2 4.1-2.3 0.8-0.4 3.4-0.8 1-1.3 1.6-5.2 3.6 3.2 9.5 3.9 1.3 0.7 1.1-0.4 2.5 1 6.1 3.5 2.8 0.9 3 0.1 2.9-1.2 1.8 1.5 4 2.5 1.8 1.5 0 1-3.1 0.8 0.1 2.3 1.9 2.7 2.1 2-1.3 0.4-1.2 0.9-1.9 2 2.3 1 2.8 0.3 5.7-0.1 0 1-2.3 1.5-2.8 1.2-2.4 1.6-1.1 2.8-0.6 0.7-3.7 2.1-0.7 1.2-0.8 2.9-0.6 1.3-5-2.5-2.6-0.2-1.2 2.1 0.7 1.3 2.5 3.1-0.4 0.7-5.1 2.5-0.9 0.2-0.6 0.8-3.7 1.9-0.8 1.3-3.4 11-1.5 2.8-1.9 2.5-1.1 0-4.4-9.1-13.2-17.9 0-0.1z m15.4-59.9l1.6 0.3 0.9 0.8 1.2 0.3 1.7 0 0 1-1.9 0.7-2.4 0.6-2.7 0.2-2.7-0.3-2.7-1.2-1.5-1.4-2.2-4.1 3-1 1.3-0.1 5.1 0.9 4.6 1.4 0 1.1-5.4 0 1.5 0.8 0.6 0z m-310.6 730.4l-2.9 0.1 2-3.5 1.9-1.5 2.2-1.3 2.2-0.4 0 1.6-0.1 2-2.1 2.3-3.2 0.7z m505.6-507.7l2-1 2.3-0.1-0.2 1.9-1.2 0.5-2-0.4-0.9-0.9z' },
  { id: 'heredia', d: 'M601.1 246.6l-0.3-1.4 0-0.8 0-0.5 0.1-0.5 0.8-1.2 2.9-3.1 0-0.4 1.9-24.3 0.2-22 0.3-18.4 0.3-25.8 0.4-34.3 0-0.7 1.4 0.2 1.9-0.3 3 2.9 1.8 0.7 1.8-1.4 1.1 0 1.9 1.9 3.9-2.5 2.7 0.6 1.9-1.9 2.1-0.3 1.7 1.2 0.8 2.7 9.5 7.6 1 0.5 1.5 0.2 1.6-0.3 2.2-1.6 1-0.3 4.3 0.9 0.6-0.4 3.2-3.8 10.5-4 0.8-0.2 0.5 0.4 1.8 0.5 0.5 0.2 0.4 0.2 0.4 0.3 0.7 0.8 0.6 0.7 0.5 0.7 0.1 0.6 0 0.5-0.5 3.3 0.1 0.7 0.1 0.6 0.5 0.6 0.5 0.6 0.7 0.5 1.3 0.8 0.6 0.5 0.4 0.5 0.3 0.5 0 0.3-0.1 0.1-0.7-0.2-0.6-0.1-0.6 0-1.7 0.5-4.6 0.4-0.9 0.2-1.6 0.5-2.7 1.7-1.6 1.8-0.6 0.4-1.5 0.8-1.4 0.9-0.6 0.5-0.2 0.3-0.3 1-0.2 1.4-0.2 4.9 0.1 1.5-0.9 6.9 0 1 0.2 0.3 0.2 0.4 0.5 0.6 0.2 0.3 0.2 0.4 0.1 0.4-0.1 0.6-0.1 1.3 0 0.5 0.1 0.5 0.7 1.6 0 0.4 0 0.8-0.9 3.4-1.4 2.2-0.6 0.6-0.3 0.3-0.4 0.2-0.4 0.1-0.4 0-0.4 0.2-0.3 0.4-1.3 2.4-0.4 0.7-0.6 1.1-0.1 0.7-0.1 1 0.4 2.3 0.2 0.6 2.1 4 0.5 1.7 0.3 0.8 0.4 0.7 0.5 0.6 0.1 0.3 0.1 0.8-0.2 1.2-0.5 2.3-0.1 1.9 0.1 0.5-0.2 0.8-0.4 1.2-2 4.1-0.5 0.8-7.4 8-5.8 0.6-3.1 4-1 1-0.7 0.2-3.5 0.3-3.1 0.6-6.9 0.6-0.8 0.3 0.1 0.8 0.6 1.3 3.6 5.4 2.1 2.2 0.4 1.3 0.2 3.9 1.3 1.4 0.8 0.6 0.5 0.6 0.2 1.2-1 3.2-2 5.3-3 1.8-4.2 1.4-1.6 0.3-4.1-0.4-0.7 0.1-5.8 2.6-1.8-0.8-3.1-1.5-2.8 0.4z' },
  { id: 'san-jose', d: 'M542.5 267.9l1.1 0 0.3-0.3 0.2-1.2 0.3-0.6 2.9-3.7 0.1-0.5-0.1-0.4 0.5-0.6 1-0.8 2.7-1.4 1.9-1.8 0.2-0.4 0.1-0.2 1.3-0.8 4.9-2.2 7-0.5 3.8-0.8 3.1 0.9 3.1 0.5 0.6 0.2 0.8 0.2 1.9 0.2 0.8 0.3 2.8-0.4 10.6-3 4.4-1.4 2.3-2.6 2.8-0.4 3.1 1.5 1.8 0.8 5.8-2.6 0.7-0.1 4.1 0.4 1.6-0.3 4.2-1.4 3-1.8 2-5.3 1-3.2-0.2-1.2-0.5-0.6-0.8-0.6-1.3-1.4-0.2-3.9-0.4-1.3-2.1-2.2-3.6-5.4-0.6-1.3-0.1-0.8 0.8-0.3 6.9-0.6 3.1-0.6 3.5-0.3 0.7-0.2 1-1 3.1-4 5.8-0.6-1.4 1.4-1.1 1.4-2.1 7.2 2.2 7.7 0.4 0.6 0.6 0.7 1.3 1.3 1.4 0.9 0.7 0.4 0.3 0.2 3.2 3.6 0.6 0.9 0.4 1.4 0.3 4.2 0.7 3.5-0.3 1.3-0.5 0.7-0.6 0.5-0.9 0.3-1.9 0.2-2 2.2-0.5 0.2-0.6 0.1-0.5-0.1-0.3-0.2-1.5-0.3-4.1 0.1-0.2 0.1-7.2 2.6-4.2 6.9-0.3 1.3 0.3 0.2 0.6 0.3 3.1 1.4-4.5 7.4-1.2 1.3-1.9 1.3-2.8 2.6-1.1 1.7-0.5 1-0.1 0.7 0 0.5 0.1 0.5 0.2 0.4 0.2 0.3 0.4 0.2 0.4 0 0.5-0.1 1.9-0.7 1.3-0.4 0.4 0 1 0.1 0.9 0.2 5.8-1.3 1.3 0.2 0.4 1.5 0.3 0.8 0.3 0.8 1 2 3.1 1 0.8 0.7 0.1 0.4 0.1 0.3 1.4 2.4 3.5 4.6 0.8 0.7 0.5 0.1 1.9 0.7 3.2 1.6 0.8 0.2 0.4-0.1 0.4-0.2 0.4-0.2 0.7-0.1 1.2 0.1 0.7 0.2 0.4 0.3 0.3 0.3 1.2 2 1.1 2.3 0.1 0.4 0.3 0.7 0.6 1.3 0.8 1.3 0.6 0.6 0.4 0.4 0.5 0.1 3.4 0.7 0.8 0 3-0.3 1.8 2.4 0.4 0.4 0.8 0.5 2.4 0.8 0.7 0.4 0.4 0.4 0.2 0.4 0.5 1.7 0.3 2.1 0.3 0.3 0.3 0 2.2-1.1 0.8-0.3 0.4-0.1 1.9 0.2 0.5 0 0.5-0.1 0.4-0.1 0.4-0.1 0.4-0.2 0.3-0.2 0.3-0.3 0.2-0.3 0.8-1.4 0.6-0.7 1.9-0.6 4 4.2 1.4 1.2 1.5 0.7 0.4 0.2 16.7 10.1 5.2 14.4 1.3 1.9 0.6 0.5 1.9 1.4-3.4 3.6-0.4 0.6-0.5 0.9-1.1 3.9-0.4 0.9-0.3 0.6-4.3 4.9-0.6 0.8-0.1 0.4-1.5 8 0 0.5 0.2 0.3 0.3 0.2 1.4 0.3 0.4 0.1 0.3 0.3 0.2 0.3 0.3 0.2 0.4 0.1 0.4 0 0.4 0 0.4 0 0.3 0.2 0.2 0.3 0.1 0.5 0.2 0.3 0.2 0.6 0.2 0.9 0.1 1.9-0.3 1-1.2 2.2-0.3 0.9-0.1 0.6 0.5 3.7-0.1 0.8-0.2 0.6-0.3 0.3-0.4 0.2-0.3 0.2-0.5 0.3-0.6 0.6-1.7 2.4-0.3 0.2-0.3 0.2-0.3 0.2-0.5 0-0.4-0.1-0.4-0.1-0.7-0.4-0.3-0.3-0.7-0.8-0.7-0.5-0.4-0.2-0.5-0.1-0.4 0.1-1.4 0.2-1.7 0.1-0.3-0.2-14.4-9.3-1-1.3-0.5-0.6-0.1-0.3-1.2-4.2-0.1-0.4-0.1-0.4-0.5-1-3.6-4.4-2.2-2.1-1.5-0.8-0.5-0.1-0.4 0-0.4 0-0.5 0-0.5 0.1-0.4 0.2-0.4 0.2-0.3 0.2-1.4 2-0.2 0.3-0.3 0.2-0.4 0.1-0.5 0.1-1.1-0.3-7.9-3.6-1.1-1-0.6-0.6-0.4-0.7-0.7-1.5-1.1-3.2-0.2-1.8 0-1 0.2-1.6-0.6-1-1-1.4-5.1-5.2-0.2-0.4-0.7-3-0.2-0.7-1.1-2-0.6-0.6-0.5-0.3-0.4-0.1-0.5 0-0.4 0-0.4 0.2-0.4 0.1-0.3 0.3-0.3 0.2-0.3 0.3-0.2 0.4-2.4-0.8-10.4-6.9-3.6-3.6-2.5-4.9-3.5-1.6-0.6-1 0.4-0.8 0.4-0.7 0.1-0.7 0-1-0.3-2-0.3-0.8-0.4-0.6-0.4-0.3-0.8-0.3-1.4-0.2-2.1 0.1-1.4 0.2-0.7-0.1-1.3-0.5-1.2-1.1-0.5-0.6-0.3-0.6 0-0.5 0.1-1 0.3-1.4 0-0.6 0-0.7-0.4-1.3-0.4-0.7-0.5-0.4-0.4-0.2-1.4-0.1-7.1 0.6-2.3-0.2-2.1-0.9-5.6 0.2-1.7-0.3-0.2-0.3-1.1-1.3-0.6-0.5-0.9-0.7-2.3-0.2-6.7 0.3-4.2 0.8-1.8 0-0.9 0.2-0.4 0.2 0 0.4 0.5 3.2-0.1 1-0.1 0.4-0.4 0.4-0.5 0.6-1.8 1.4-0.4 0.4-0.3 0.4-0.9 1.9-0.5 0.4-0.4 0.2-0.5 0.1-0.4-0.1-0.4-0.1-0.4-0.2-0.3-0.3-0.7-0.8-0.4-0.2-0.3-0.2-0.5-0.1-0.5 0-2.5 0.7-0.6 0-0.4-0.1-1.1-0.4-4.9 0.8-1.6-0.2-0.5-0.4-1.1-1-1-1.3-0.7-1.5-0.4-1.2-1.1-5.4-0.1-0.3-3.5-6.2-0.4-0.9 0-0.5 0.1-3.1-0.4-2-1.2-4-0.1-0.4 0.1-0.5 0.1-0.3 0.2-0.4 0.3-0.2 0.4-0.2 0.4-0.2 1-0.1 3 0.2 0.5-0.1 0.4-0.1 0.4-0.1 0.3-0.3 0.3-0.4 0.3-0.6 0.2-1.3-0.1-0.9-0.1-0.6-0.8-1.5-0.9-1.3-0.3-0.3-0.5-0.5-0.7-0.5-1.1-0.7-1.5-0.6 1.4-1.2z' },
  { id: 'cartago', d: 'M641.7 217.9l19.8 9 6.9 3.3 9.5 4.5 15.5 7.2 4.1 1.5 22.8 0.2 16.7 0.4 3.2 0.7-0.4 0.6-2 2.8-1.2 2.7-0.5 2.8 0.2 3.5 1.8 5.7 0.4 2.9-1 2.8-6.7 8.4-4.8 5.8-1.3 2-3.5 9-9.1 11-2.2 4.5-0.6 4.9 0.4 1.6 0.3 1.9 0.9 2.2 0.3 0.4 0.5 0.6 0.4 0.4 1 2.2 0.6 1.7-16.7-10.1-0.4-0.2-1.5-0.7-1.4-1.2-4-4.2-1.9 0.6-0.6 0.7-0.8 1.4-0.2 0.3-0.3 0.3-0.3 0.2-0.4 0.2-0.4 0.1-0.4 0.1-0.5 0.1-0.5 0-1.9-0.2-0.4 0.1-0.8 0.3-2.2 1.1-0.3 0-0.3-0.3-0.3-2.1-0.5-1.7-0.2-0.4-0.4-0.4-0.7-0.4-2.4-0.8-0.8-0.5-0.4-0.4-1.8-2.4-3 0.3-0.8 0-3.4-0.7-0.5-0.1-0.4-0.4-0.6-0.6-0.8-1.3-0.6-1.3-0.3-0.7-0.1-0.4-1.1-2.3-1.2-2-0.3-0.3-0.4-0.3-0.7-0.2-1.2-0.1-0.7 0.1-0.4 0.2-0.4 0.2-0.4 0.1-0.8-0.2-3.2-1.6-1.9-0.7-0.5-0.1-0.8-0.7-3.5-4.6-1.4-2.4-0.1-0.3-0.1-0.4-0.8-0.7-3.1-1-1-2-0.3-0.8-0.3-0.8-0.4-1.5-1.3-0.2-5.8 1.3-0.9-0.2-1-0.1-0.4 0-1.3 0.4-1.9 0.7-0.5 0.1-0.4 0-0.4-0.2-0.2-0.3-0.2-0.4-0.1-0.5 0-0.5 0.1-0.7 0.5-1 1.1-1.7 2.8-2.6 1.9-1.3 1.2-1.3 4.5-7.4-3.1-1.4-0.6-0.3-0.3-0.2 0.3-1.3 4.2-6.9 7.2-2.6 0.2-0.1 4.1-0.1 1.5 0.3 0.3 0.2 0.5 0.1 0.6-0.1 0.5-0.2 2-2.2 1.9-0.2 0.9-0.3 0.6-0.5 0.5-0.7 0.3-1.3-0.7-3.5-0.3-4.2-0.4-1.4-0.6-0.9-3.2-3.6-0.3-0.2-0.7-0.4-1.4-0.9-1.3-1.3-0.6-0.7-0.4-0.6-2.2-7.7z' }
]

// Mapeo dinámico para el estado del mapa geográfico
const estadoMap = computed(() => {
  const map = {}
  props.provincias.forEach(prov => {
    const completada = props.misionesCompletadas.includes(prov.id)
    
    // Identificar recomendada
    const idxEnRuta = rutaOrdenada.indexOf(prov.id)
    let recomendada = false
    if (prov.desbloqueada && !completada) {
      const anterioresCompletadas = rutaOrdenada.slice(0, idxEnRuta).every(id => props.misionesCompletadas.includes(id))
      if (anterioresCompletadas) recomendada = true
    }

    map[prov.id] = {
      ...prov,
      color: COLORES[prov.id]?.hex || '#00ff88',
      completada,
      recomendada
    }
  })
  return map
})

// Mapeo dinámico de pines e información de nodos
const nodosProvincias = computed(() => {
  return props.provincias.map(prov => {
    const coords = COORDENADAS[prov.id] || { x: 300, y: 200, color: '#00ff88' }
    const completada = props.misionesCompletadas.includes(prov.id)
    
    const idxEnRuta = rutaOrdenada.indexOf(prov.id)
    let recomendada = false
    if (prov.desbloqueada && !completada) {
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

// Conexiones de rutas geométricas dinámicas
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
        activo: p1Completada && !p2Completada
      })
    }
  }
  return enlaces
})

const tooltipActive = ref(false)
const tooltipData = ref({ nombre: '', estado: '', mensaje: '', color: '#fff', x: 0, y: 0 })
let tooltipTimeout = null

const { provinciaRecienDesbloqueada, guardarProgreso } = useEstadoJuego()

const animandoUnlock = ref(false)
const animacionUnlock = ref({
  activa: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  targetId: '',
  fase: 0
})

onMounted(() => {
  if (provinciaRecienDesbloqueada.value) {
    const newId = provinciaRecienDesbloqueada.value
    const idxNew = rutaOrdenada.indexOf(newId)
    if (idxNew > 0) {
      const prevId = rutaOrdenada[idxNew - 1]
      const c1 = COORDENADAS[prevId]
      const c2 = COORDENADAS[newId]
      
      if (c1 && c2) {
        animandoUnlock.value = true
        animacionUnlock.value = {
          activa: true,
          x1: c1.x,
          y1: c1.y,
          x2: c2.x,
          y2: c2.y,
          targetId: newId,
          fase: 1
        }
        
        // Fase 1: Dibujar la línea de conexión (1.2 segundos)
        setTimeout(() => {
          animacionUnlock.value.fase = 2
          reproducirEfecto('checkpoint')
          
          // Fase 2: Pulso neón (0.8 segundos)
          setTimeout(() => {
            animandoUnlock.value = false
            animacionUnlock.value.activa = false
            provinciaRecienDesbloqueada.value = null
            guardarProgreso()
          }, 800)
        }, 1200)
      } else {
        provinciaRecienDesbloqueada.value = null
        guardarProgreso()
      }
    } else {
      provinciaRecienDesbloqueada.value = null
      guardarProgreso()
    }
  }
})

function getProvinciaInfo(id) {
  const p = props.provincias.find(prov => prov.id === id)
  if (!p) return null
  
  const completada = props.misionesCompletadas.includes(id)
  const estadoMapItem = estadoMap.value[id]
  const recomendada = estadoMapItem?.recomendada
  
  let estado = 'Bloqueada 🔒'
  if (completada) estado = 'Completada ✅'
  else if (recomendada) estado = 'Recomendada ⚡'
  else if (p.desbloqueada) estado = 'Disponible 🔓'
  
  let mensaje = ''
  if (!p.desbloqueada) {
    const idx = rutaOrdenada.indexOf(id)
    if (idx > 0) {
      const prevId = rutaOrdenada[idx - 1]
      const prevProv = props.provincias.find(prov => prov.id === prevId)
      const prevNombre = prevProv ? prevProv.nombre : prevId
      mensaje = `Completa ${prevNombre} para desbloquear.`
    } else {
      mensaje = 'Provincia bloqueada.'
    }
  } else {
    mensaje = completada ? 'Misión superada.' : 'Misión lista para patrullar.'
  }
  
  return {
    nombre: p.nombre,
    estado,
    mensaje,
    color: COLORES[id]?.hex || '#00ff88'
  }
}

function onMouseMove(e) {
  const container = e.currentTarget.getBoundingClientRect()
  tooltipData.value.x = e.clientX - container.left + 15
  tooltipData.value.y = e.clientY - container.top + 15
}

function onMouseEnterProvincia(id) {
  const info = getProvinciaInfo(id)
  if (info) {
    tooltipData.value.nombre = info.nombre
    tooltipData.value.estado = info.estado
    tooltipData.value.mensaje = info.mensaje
    tooltipData.value.color = info.color
    tooltipActive.value = true
  }
}

function onMouseLeaveProvincia() {
  tooltipActive.value = false
}

function seleccionarNodo(node, event) {
  if (animandoUnlock.value) return
  if (!node) return
  
  // Siempre emitimos la selección para poder ver detalles del nodo
  emit('seleccionar', node)
  
  // Disparar sonido
  reproducirEfecto('boton')
  
  // Soporte de Tooltip para móvil/tap
  const info = getProvinciaInfo(node.id)
  if (info) {
    tooltipData.value.nombre = info.nombre
    tooltipData.value.estado = info.estado
    tooltipData.value.mensaje = info.mensaje
    tooltipData.value.color = info.color
    
    let clientX = null
    let clientY = null

    if (event) {
      if (event.clientX !== undefined && event.clientX !== null) {
        clientX = event.clientX
        clientY = event.clientY
      } else if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX
        clientY = event.changedTouches[0].clientY
      }
    }

    const svg = event?.currentTarget?.ownerSVGElement || event?.currentTarget
    const container = svg?.parentElement || svg

    if (clientX !== null && clientY !== null && container) {
      const containerRect = container.getBoundingClientRect()
      let posX = clientX - containerRect.left + 15
      let posY = clientY - containerRect.top + 15

      // Limitar coordenadas para evitar desborde lateral y vertical en pantallas pequeñas
      if (posX + 180 > containerRect.width) {
        posX = clientX - containerRect.left - 190
      }
      if (posY + 100 > containerRect.height) {
        posY = clientY - containerRect.top - 110
      }

      tooltipData.value.x = Math.max(10, posX)
      tooltipData.value.y = Math.max(10, posY)
    } else {
      tooltipData.value.x = node.x - 50
      tooltipData.value.y = node.y - 120
    }
    
    tooltipActive.value = true
    
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      tooltipTimeout = setTimeout(() => {
        tooltipActive.value = false
      }, 3500)
    }
  }
}
</script>

<style scoped>
.mapa-costa-rica-container {
  width: 100%;
  background: rgba(8, 10, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: var(--space-2);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
}

.svg-mapa-cr {
  width: 100%;
  max-width: 600px;
  height: auto;
  aspect-ratio: 3 / 4;
}

/* --- Capas Geográficas --- */
.provincia-path {
  fill: rgba(10, 12, 28, 0.7);
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 1.5;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  pointer-events: all;
}

.provincia-path.disponible {
  fill: rgba(var(--neon-color-rgb), 0.03);
  stroke: rgba(var(--neon-color-rgb), 0.4);
  stroke-width: 2.2;
  cursor: pointer;
  animation: dynamic-glow 3s infinite alternate;
}

.provincia-path.completada {
  fill: rgba(0, 255, 136, 0.06);
  stroke: rgba(0, 255, 136, 0.5);
  stroke-width: 2.2;
  cursor: pointer;
}

/* Hover y Selección */
.provincia-path.disponible:hover,
.provincia-path.completada:hover {
  fill: rgba(var(--neon-color-rgb), 0.12);
  stroke: var(--neon-color);
  stroke-width: 3.5;
  filter: drop-shadow(0 0 10px var(--neon-color));
}

.provincia-path.seleccionada {
  fill: rgba(var(--neon-color-rgb), 0.18) !important;
  stroke: var(--neon-color) !important;
  stroke-width: 4.5 !important;
  filter: drop-shadow(0 0 14px var(--neon-color)) !important;
  z-index: 10;
}

/* --- Conexiones vectoriales --- */
.linea-conexion-neon {
  stroke: rgba(255, 255, 255, 0.03);
  stroke-width: 2.5;
  transition: all 0.5s ease;
  pointer-events: none;
}

.linea-conexion-neon.desbloqueada {
  stroke: rgba(0, 200, 255, 0.18);
  stroke-width: 3.5;
}

.linea-conexion-neon.completada {
  stroke: rgba(0, 255, 136, 0.4);
  stroke-width: 3.5;
}

.linea-conexion-neon.pulsa {
  stroke: #ff9d00;
  stroke-width: 3.5;
  stroke-dasharray: 8 4;
  animation: stroke-slide 1.5s linear infinite;
}

@keyframes stroke-slide {
  to {
    stroke-dashoffset: -12;
  }
}

/* --- Pines e Indicadores en el Centro --- */
.nodo-provincia {
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
}

.nodo-provincia.bloqueada {
  cursor: pointer;
  opacity: 0.65;
}

.circulo-nodo-core {
  fill: #060913;
  stroke-width: 2.5;
  transition: all 0.3s ease;
}

.brillo-nodo {
  stroke-width: 1;
  stroke-dasharray: 4 2;
  fill: transparent;
  transition: all 0.3s ease;
}

/* Interacciones con los pines */
.nodo-provincia:not(.bloqueada):hover .circulo-nodo-core {
  r: 26;
  stroke-width: 3.5;
  filter: drop-shadow(0 0 8px currentColor);
}

.nodo-provincia:not(.bloqueada):hover .brillo-nodo {
  r: 32;
  stroke-width: 1.5;
  animation: rotate-clockwise 4s linear infinite;
}

.nodo-provincia.seleccionada .circulo-nodo-core {
  r: 28;
  stroke-width: 3.5;
}

.nodo-provincia.seleccionada .brillo-nodo {
  r: 34;
  stroke-width: 2;
  stroke-dasharray: 6 3;
  animation: rotate-clockwise 6s linear infinite;
}

.emoji-nodo {
  font-size: 1.1rem;
  user-select: none;
}

.nodo-provincia.seleccionada .emoji-nodo {
  font-size: 1.25rem;
}

/* --- Etiquetas de Provincias --- */
.label-nodo-grupo {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nodo-provincia:not(.bloqueada):hover .label-nodo-grupo,
.nodo-provincia.seleccionada .label-nodo-grupo {
  opacity: 1;
}

.fondo-label-nodo {
  fill: #0c0f1a;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.nodo-provincia.seleccionada .fondo-label-nodo {
  stroke: currentColor;
}

.texto-label-nodo {
  font-family: var(--font-display);
  font-size: 0.7rem;
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
  stroke: #060913;
  stroke-width: 1.5;
  animation: pulse-ping 1.6s infinite ease-in-out;
  transform-origin: center;
}

@keyframes pulse-ping {
  0% {
    r: 6px;
    opacity: 0.55;
  }
  50% {
    r: 10px;
    opacity: 1;
    fill: #ffb700;
  }
  100% {
    r: 6px;
    opacity: 0.55;
  }
}

@keyframes rotate-clockwise {
  to { transform: rotate(360deg); }
}

/* --- Responsividad --- */
@media (max-width: 640px) {
  .texto-label-nodo {
    font-size: 0.6rem;
  }
  .fondo-label-nodo {
    width: 90px;
    x: -45px;
  }
}

/* --- Tooltip Flotante --- */
.map-tooltip {
  position: absolute;
  background: rgba(10, 14, 26, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  pointer-events: none;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-display);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  max-width: 220px;
  text-align: left;
}

.tooltip-header {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.15);
}

.tooltip-status {
  font-size: 0.75rem;
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

.tooltip-message {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  line-height: 1.3;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 4px;
  margin-top: 2px;
}

/* Transiciones Rápidas del Tooltip */
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

/* --- Animación de Desbloqueo de Provincia --- */
.linea-conexion-unlock-anim {
  stroke: var(--color-neon-gold);
  stroke-width: 4.5;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line-unlock 1.2s forwards cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

@keyframes draw-line-unlock {
  to {
    stroke-dashoffset: 0;
  }
}

.pulse-unlock-neon {
  animation: pulse-node-glow 0.8s ease-in-out infinite alternate;
}

@keyframes pulse-node-glow {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 4px var(--neon-color));
  }
  100% {
    transform: scale(1.25);
    filter: drop-shadow(0 0 20px var(--neon-color));
  }
}

.pulse-path-unlock {
  animation: pulse-path-glow 0.8s ease-in-out infinite alternate;
}

@keyframes pulse-path-glow {
  0% {
    fill: rgba(var(--neon-color-rgb), 0.05);
    stroke: rgba(var(--neon-color-rgb), 0.4);
    stroke-width: 2.2;
  }
  100% {
    fill: rgba(var(--neon-color-rgb), 0.25);
    stroke: var(--neon-color);
    stroke-width: 4.5;
    filter: drop-shadow(0 0 15px var(--neon-color));
  }
}
</style>
