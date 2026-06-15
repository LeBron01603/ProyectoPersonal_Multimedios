# Ruta Tica: El Héroe del After 🦸🇨🇷

## Información del proyecto

| Campo | Detalle |
|---|---|
| **Curso** | IF7102 Multimedios |
| **Institución** | Universidad CENFOTEC |
| **Opción elegida** | Opción 5: Juego Educativo de Un Nivel |
| **Framework** | Vue 3 (Composition API) |
| **Bundler** | Vite |
| **Gestor de paquetes** | pnpm |
| **Año** | 2026 |

---

## Descripción del concepto

**Ruta Tica: El Héroe del After** es un minijuego educativo serio-cómico con temática de superhéroe universitario en Costa Rica.

- 🌞 **De día:** el personaje estudia, entrena y cumple sus responsabilidades.
- 🌙 **De noche:** activa su identidad secreta y recorre las 7 provincias de Costa Rica.

El jugador crea su identidad de héroe (nombre, universidad, carrera, actividad física y personalidad), luego selecciona provincias del mapa para completar misiones respondiendo preguntas educativas sobre:

- 🗺️ Turismo y geografía
- 🏛️ Historia y cultura
- 🌿 Ambiente y biodiversidad
- ⚽ Deporte universitario
- 🎓 Vida universitaria costarricense

El juego promueve el **equilibrio entre diversión, conocimiento y responsabilidad**, sin glorificar el consumo irresponsable de alcohol.

---

## Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Previsualizar build de producción
pnpm preview
```

---

## Despliegue

Este proyecto será desplegado en **[Vercel](https://vercel.com)**.

Vercel detecta automáticamente proyectos Vite. Solo se requiere:
1. Conectar el repositorio de GitHub a Vercel.
2. El comando de build es: `pnpm build`
3. El directorio de salida es: `dist`

---

## Estructura del proyecto

```
src/
  assets/
    images/          ← Imágenes del juego (fase 2+)
    audio/           ← Archivos de audio (fase 2+)
  components/
    layout/
      AppHeader.vue  ← Encabezado del juego
      AppFooter.vue  ← Pie de página
    game/
      StartScreen.vue     ← Pantalla inicial
      IdentityCreator.vue ← Formulario de identidad del héroe
      MissionMap.vue      ← Mapa de provincias/misiones
      ProvinceCard.vue    ← Tarjeta reutilizable de provincia
      GameScreen.vue      ← Pantalla de preguntas (placeholder)
      ResultScreen.vue    ← Pantalla de resultados
      StatBadge.vue       ← Componente de estadísticas
  composables/
    useGameState.js  ← Estado global del juego (ref, reactive, computed)
    useAudio.js      ← Manejo de audio BGM/SFX
  data/
    missions.json    ← Datos de provincias y preguntas
  styles/
    variables.css    ← Tokens de diseño (colores, tipografía, espaciado)
    animations.css   ← Keyframes y clases de animación
    base.css         ← Reset global e importaciones
  App.vue            ← Componente raíz y orquestador de pantallas
  main.js            ← Punto de entrada de la aplicación
```

---

## Requisitos del enunciado — Seguimiento

### Fase 1 (actual) ✅

- [x] Framework Vue 3 con Composition API (`ref`, `reactive`, `computed`, `onMounted`)
- [x] Estructura limpia de carpetas
- [x] Mínimo 4 componentes reutilizables (7 creados: AppHeader, AppFooter, StartScreen, IdentityCreator, MissionMap, ProvinceCard, StatBadge, GameScreen, ResultScreen)
- [x] Props y emits documentados en cada componente
- [x] Datos cargados desde `missions.json` con `fetch()` preparado
- [x] Estructura preparada para multimedia (imágenes y audio)
- [x] Diseño responsive desde el inicio
- [x] CSS propio (sin Bootstrap ni Tailwind)
- [x] Compatible con pnpm
- [x] Paleta neón tropical nocturno universitario
- [x] 7 provincias de Costa Rica con datos de misiones
- [x] Pantalla inicial con título y botón de inicio
- [x] Creador de identidad con 5 campos
- [x] Mapa de misiones con tarjetas de provincias
- [x] Manejo responsable del concepto "after"

### Fase 2 (próxima)

- [ ] Lógica completa de preguntas desde `missions.json`
- [ ] Sistema de puntuación y feedback inmediato
- [ ] Sonidos y música de fondo reales
- [ ] Imágenes de provincias
- [ ] Animaciones de transición avanzadas
- [ ] Progresión de desbloqueo de provincias

### Fase 3 (futura)

- [ ] Guardado de progreso con `localStorage`
- [ ] Ranking local
- [ ] Más preguntas por categoría
- [ ] Mapa visual interactivo de Costa Rica
- [ ] Modo oscuro/claro
- [ ] Accesibilidad WCAG 2.1 AA completa

---

## Tecnologías y conceptos de Vue 3 utilizados

| Concepto | Uso en el proyecto |
|---|---|
| `ref()` | Estado de pantalla activa, datos de provincias, respuestas |
| `reactive()` | Objeto de identidad del héroe, estadísticas |
| `computed()` | Validaciones, porcentajes, listas derivadas |
| `onMounted()` | Carga de datos, inicio de audio |
| `defineProps()` | Datos de provincia en ProvinceCard, StatBadge |
| `defineEmits()` | Comunicación hijo→padre en todos los componentes |
| `v-if / v-else-if` | Navegación entre pantallas |
| `v-for` | Lista de provincias, opciones de personalidad |
| `v-model` | Formulario de identidad |
| `transition` | Animaciones entre pantallas |
| Composables | `useGameState`, `useAudio` — lógica reutilizable |
