# REFERENCIAS.md — Ruta Tica: El Héroe del After
## IF7102 Multimedios · Proyecto Personal

Este archivo contiene el desglose y atribución de todas las fuentes bibliográficas, recursos multimedia, APIs web e inteligencia artificial utilizadas en el desarrollo del proyecto **Ruta Tica: El Héroe del After** en la Universidad de Costa Rica (UCR).

---

## 1. Framework y Documentación Oficial

*   **Vue 3 (Composition API):** Documentación oficial sobre la reactividad de Vue 3, incluyendo las funciones reactivas fundamentales y las directivas integradas de componentes.
    *   *Fuente:* [Vue 3 Guide (https://vuejs.org/guide/)](https://vuejs.org/guide/introduction.html)
*   **Vite:** Guía de configuración, servidor de desarrollo y optimizador de compilación.
    *   *Fuente:* [Vite Guide (https://vite.dev/guide/)](https://vite.dev/guide/)
*   **Despliegue Estático:** Configuración oficial para el despliegue automático de proyectos Vite en servidores Vercel.
    *   *Fuente:* [Vite Static Deploy (https://vite.dev/guide/static-deploy.html)](https://vite.dev/guide/static-deploy.html)

---

## 2. JavaScript y APIs Web

*   **Web Audio API (MDN):** Documentación sobre la carga y el control interactivo de audio (BGM/SFX) utilizando el constructor `Audio()` y elementos HTML5.
    *   *Fuente:* [MDN Web Docs - HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
*   **Fetch API (MDN):** Consumo asíncrono de ficheros locales (JSON) para la carga de datos del mapa y trivias.
    *   *Fuente:* [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
*   **Web Storage API (LocalStorage):** Persistencia de variables y estados del juego local de manera sincrónica.
    *   *Fuente:* [MDN Web Docs - Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
*   **CSS Custom Properties & Grid (MDN):** Variables nativas CSS para el esquema de diseño neón y grid responsivo.
    *   *Fuente:* [MDN Web Docs - CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 3. Recursos Multimedia

### Iconografía
*   **Emoji Nativos:** Utilizados en todo el HUD y barras de estado del juego (🦸, ⚡, 🎓, 📚, 🕵️, 🕒, 📰, 🏆) para lograr un diseño visual consistente, ligero y sin dependencias externas.
*   **Icons SVG:** Hoja de iconos vectoriales personalizados en el archivo `public/icons.svg`.

### Recursos Gráficos
*   **Mapa de Costa Rica (Principal):** Archivo `public/images/mapa-costa-rica.svg` y `src/assets/images/mapa-costa-rica.svg` (obtenido de Pareto Software, LLC en simplemaps.com). Modificado y redimensionado a viewBox `0 0 1000 1000` con mapeo de IDs a provincias para interactividad en Vue. Licencia: Simplemaps Free SVG Map.
*   **Mapa de Costa Rica (Respaldo):** Archivo `src/assets/images/mapa-costarica.svg` y `public/images/mapa-costa-rica-backup.svg` (obtenido de MapSVG en mapsvg.com) para verificar el contorno de la Laguna de Arenal.

### Audio y Efectos de Sonido
*   **Música de Fondo (BGM):** Pistas de audio loopables compuestas por el artista **CodeManu**, obtenidas de la colección de OpenGameArt *8-bit Music Pack*, bajo licencia Creative Commons Attribution 3.0 (CC-BY 3.0). Las pistas `bgm_mapa.mp3`, `bgm_menu.mp3`, `bgm_campus.mp3` y `bgm_transformacion.mp3` mantienen su peso completo de fidelidad (entre 4 MB y 6 MB) para conservar la atmósfera inmersiva.
*   **Efectos de Sonido (SFX):** Efectos de sonido ultralivianos (menores a 50 KB, salvo `sfx_logro.mp3`) de uso libre CC0 (Dominio Público) creados por **n4** en OpenGameArt.

| Archivo Real en Proyecto | Pista / Recurso Original | Autoría | Licencia | URL de la Fuente |
|-------------------|--------------------------|---------|----------|------------------|
| `bgm_menu.mp3` | `bgm_menu.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_campus.mp3` | `bgm_action_3.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_amanecer.mp3` | `bgm_action_5.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_transformacion.mp3` | `bgm_action_1.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_mapa.mp3` | `bgm_action_4.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_juego.mp3` | `bgm_action_2.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_desafio.mp3` | `bgm_action_1.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_victoria.mp3` | `bgm_menu.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `bgm_derrota.mp3` | `bgm_action_5.mp3` | CodeManu | CC-BY 3.0 | [OpenGameArt - 8-bit Music Pack](https://opengameart.org/content/8-bit-music-pack-loopable) |
| `sfx_acierto.mp3` | `success_0.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_error.mp3` | `bell1_0.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_checkpoint.mp3` | `coin1_0.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_logro.mp3` | `coin2_0.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_boton.mp3` | `button_0.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_vuelo.mp3` | `vuelo.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |
| `sfx_transicion.mp3` | `transicion.mp3` | n4 | CC0 | [OpenGameArt - Basic Sound Effects](https://opengameart.org/content/basic-sound-effects) |

---

## 4. Herramientas de Inteligencia Artificial Utilizadas

Se han utilizado herramientas de Inteligencia Artificial Generativa y Conversacional únicamente como apoyo y asistencia técnica bajo supervisión del estudiante. Las herramientas y sus áreas de apoyo en este proyecto académico se detallan a continuación:

*   **ChatGPT (OpenAI) y Claude (Anthropic):**
    *   *Apoyo en el diseño de interfaces:* Generación de ideas para el diseño neón-cyberpunk y paletas de colores HSL.
    *   *Apoyo en depuración:* Identificación de advertencias de carga asíncrona de recursos locales y errores sintácticos en CSS.
    *   *Apoyo en documentación:* Asistencia en la redacción inicial del banco de preguntas y en la estructura de los informes.
    *   *Mejora de experiencia de usuario (UX):* Propuestas para optimizar la fluidez de las pantallas táctiles.
*   **Antigravity (Google DeepMind):**
    *   *Apoyo en la refactorización:* Refactorización del "Centro del Héroe" a una pantalla dedicada e independiente para mejorar el rendimiento del scroll y solucionar problemas de recorte de contenido en móviles.
    *   *Apoyo en depuración:* Solución de bugs de persistencia local del estado del juego y optimización de renderizados dinámicos en el mapa SVG interactivo de Costa Rica.
    *   *Apoyo en documentación:* Estructuración técnica e integral de la arquitectura del proyecto en árbol.
*   **Recursos Gráficos Generados con IA:**
    *   `public/images/fondo-ruta-tica-inicio.png` (Fondo de Pantalla de Inicio): Imagen de una ciudad cyberpunk rodeada de vegetación tropical costarricense en neón. Generada para fines ilustrativos académicos.
    *   `public/images/fondo-paneloperaciones.png` (Fondo del Centro de Operaciones): Panel de visualización holográfica y mapa táctico futurista. Generado para fines ilustrativos académicos.
    *   `src/assets/images/cyberpunk_bg.png` (Textura Cyberpunk general): Fondo degradado oscuro con scanlines holográficos y circuitos de neón. Generado para fines ilustrativos académicos.
