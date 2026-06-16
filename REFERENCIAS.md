# REFERENCIAS.md — Ruta Tica: El Héroe del After
## IF7102 Multimedios · Proyecto Personal

> Este archivo documenta todas las fuentes, recursos y apoyos utilizados durante el desarrollo del proyecto. Se actualiza en cada fase.

---

## 1. Documentación oficial de Vue 3

- **Vue 3 Documentation** — https://vuejs.org/guide/introduction.html
  - Composition API
  - Reactivity Fundamentals (`ref`, `reactive`, `computed`)
  - Component Communication (props, emits)
  - Lifecycle Hooks (`onMounted`, `onUnmounted`)
  - Built-in Directives (`v-if`, `v-for`, `v-model`)
  - Transitions y Animations

- **Vue 3 Composables** — https://vuejs.org/guide/reusability/composables.html

---

## 2. Documentación de Vite

- **Vite Documentation** — https://vite.dev/guide/
  - Asset Handling
  - Static Asset Serving
  - Environment Variables
  - Deployment (Vercel)

- **@vitejs/plugin-vue** — https://github.com/vitejs/vite-plugin-vue

---

## 3. MDN Web Docs

- **CSS Custom Properties** — https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **CSS Animations (@keyframes)** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations
- **CSS Grid Layout** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- **Fetch API** — https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Web Audio API** — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **ARIA Roles** — https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
- **HTMLMediaElement (Audio)** — https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

---

## 4. Recursos multimedia usados

### Mapas (Vectores SVG)

| Recurso | Creador / Fuente | Licencia | URL | Modificaciones / Notas |
|---------|------------------|----------|-----|-------------------------|
| `mapa-costa-rica.svg` (Principal) | Pareto Software, LLC (Simplemaps.com) | Licencia: Simplemaps Free SVG Map License
URL: https://simplemaps.com/resources/svg-license | Redimensionado a viewBox `0 0 1000 1000` y mapeo de IDs a provincias para interacción Vue. |
| `mapa-costarica.svg` (Respaldo) | MapSVG (mapsvg.com) | Licencia: Según términos de uso de MapSVG
URL: https://mapsvg.com| http://mapsvg.com | Incluye el contorno de la Laguna de Arenal. |

### Audio / Música (BGM)

Todas las pistas de música de fondo son de uso libre y seguro para la web. Se ha optimizado la tasa de bits (bitrate) para mantener archivos menores a 1MB y acelerar la carga web.

| Recurso (Destino) | Nombre Original | Artista | Licencia | Fuente / URL |
|-------------------|-----------------|---------|----------|--------------|
| `bgm_menu.mp3` | `bgm_menu.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_campus.mp3` | `bgm_action_3.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_amanecer.mp3` | `bgm_action_5.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_transformacion.mp3` | `bgm_action_1.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_mapa.mp3` | `bgm_action_4.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_juego.mp3` | `bgm_action_2.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_desafio.mp3` | `bgm_action_1.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_victoria.mp3` | `bgm_menu.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_derrota.mp3` | `bgm_action_5.mp3` | CodeManu | CC-BY 3.0 (Atribución) | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |

**Atribución completa requerida (CC-BY 3.0):**
Música de fondo por CodeManu (https://www.codemanu.com/) obtenida desde OpenGameArt (https://opengameart.org/content/8-bit-music-pack-loopable). Licencia de uso: Creative Commons Attribution 3.0 Unported.

### Efectos de Sonido (SFX)

Efectos de sonido ultralivianos (menores a 100KB) para reproducción con baja latencia.

| Recurso (Destino) | Nombre Original | Artista | Licencia | Fuente / URL |
|-------------------|-----------------|---------|----------|--------------|
| `sfx_acierto.mp3` | `success_0.mp3` | n4 | CC0 (Dominio Público) | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_error.mp3` | `bell1_0.mp3` | n4 | CC0 (Dominio Público) | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_checkpoint.mp3` | `coin1_0.mp3` | n4 | CC0 (Dominio Público) | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_logro.mp3` | `coin2_0.mp3` | n4 | CC0 (Dominio Público) | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_boton.mp3` | `button_0.mp3` | n4 | CC0 (Dominio Público) | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |

### Fuentes tipográficas

| Fuente | Uso | URL |
|--------|-----|-----|
| Exo 2 | Títulos y display | https://fonts.google.com/specimen/Exo+2 |
| Inter | Texto de cuerpo | https://fonts.google.com/specimen/Inter |
| Orbitron | Títulos alternativos | https://fonts.google.com/specimen/Orbitron |

---

## 5. Uso de IA como apoyo

> _Documentar cada instancia de uso de IA según lineamientos del curso._

| Herramienta | Uso | Fecha | Descripción |
|------------|-----|-------|-------------|
|Herramientas de IA utilizadas:
- Antigravity (Google DeepMind)
- ChatGPT (OpenAI)

Uso:
- Apoyo en diseño de arquitectura.
- Revisión de flujo de juego.
- Generación de documentación.
- Propuestas de mejoras UX/UI.
- Asistencia en depuración y planificación. | Generación de estructura base del proyecto | 2026-06 | Creación inicial de componentes, composables, estilos y documentación de la Fase 1 del proyecto bajo la dirección y revisión del estudiante. |

**Nota:** El uso de IA fue supervisado y revisado en todo momento. El estudiante comprende y puede explicar todo el código generado.

---

## 6. Recursos sobre Costa Rica

> _Fuentes utilizadas para las preguntas educativas, datos geográficos y culturales._

### Geografía e Historia

- **MIDEPLAN — Datos geográficos de Costa Rica** — https://www.mideplan.go.cr
- **Wikipedia — Provincias de Costa Rica** — https://es.wikipedia.org/wiki/Costa_Rica
- **ICT — Instituto Costarricense de Turismo** — https://www.ict.go.cr

### Universidades

- **UCR — Universidad de Costa Rica** — https://www.ucr.ac.cr
- **TEC — Instituto Tecnológico de Costa Rica** — https://www.tec.ac.cr
- **UNA — Universidad Nacional** — https://www.una.ac.cr
- **UNED — Universidad Estatal a Distancia** — https://www.uned.ac.cr
- **CENFOTEC** — https://ucenfotec.ac.cr

### Cultura y Turismo

- **Parques Nacionales de Costa Rica (SINAC)** — https://www.sinac.go.cr
- **MUSEOS DE COSTA RICA** — https://museos.go.cr
- **Buen Viaje Costa Rica** — https://www.visitcostarica.com

---

## 7. Otras referencias técnicas

- **CSS Glassmorphism** — https://css.glass/
- **Color palettes (HSL)** — https://coolors.co
- **Neon glow effects CSS** — MDN Web Docs (text-shadow, box-shadow)
- **Vue 3 + Vite + Vercel deployment** — https://vitejs.dev/guide/static-deploy.html#vercel
