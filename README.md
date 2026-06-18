# Ruta Tica: El Héroe del After 🦸🇨🇷

## Informática Empresarial
### Universidad de Costa Rica
**Curso:** IF7102 Multimedios  
**Estudiante:** Emiliano Martínez  
**Proyecto Personal - Opción 5: Juego Educativo de Un Nivel**

---

## 🔗 Demo en Línea
El proyecto se encuentra desplegado y listo para ser probado en el siguiente enlace de Vercel:
👉 **[Demo en Vercel (https://ruta-tica-heroe-after.vercel.app/)](https://ruta-tica-el-heroe-del-after.vercel.app/)** 

---

## 📝 Descripción General

**Ruta Tica: El Héroe del After** es un videojuego educativo serio-cómico con estética neón-cyberpunk tropical costarricense. Narra la historia de un estudiante universitario común durante el día y el **Héroe del After** por la noche.

*   **De día:** El personaje asiste a clases en su campus de la Universidad de Costa Rica (UCR), estudia, gestiona sus responsabilidades cotidianas y protege su identidad de los rumores universitarios.
*   **De noche:** Activa su alias de héroe y vuela por las 7 provincias de Costa Rica para resolver misiones educativas basadas en geografía, ecología, cultura e historia patria.

El juego está diseñado para incentivar el aprendizaje interactivo y satura de forma humorística el balance entre la diversión estudiantil nocturna y la responsabilidad académica, sin promover de ninguna manera el consumo irresponsable de sustancias.

---

## 🎯 Objetivos del Proyecto

1.  **Educación Cultural:** Fomentar el conocimiento geográfico, histórico, cultural y ecológico sobre Costa Rica a través de un banco oficial de trivias dinámicas.
2.  **Toma de Decisiones y Balance:** Enseñar al usuario a balancear recursos limitados (Energía, Conocimiento, Diversión y Responsabilidad) en un entorno gamificado.
3.  **Interactividad Multimedia:** Ofrecer una experiencia de usuario rica en animaciones fluidas, scanlines holográficos, efectos neón y audio interactivo.
4.  **Compromiso de Rendimiento:** Demostrar el uso avanzado de Vue 3 (Composition API) para construir un software web de alto rendimiento, modular y totalmente responsive.

---

## ⚙️ Tecnologías Utilizadas

*   **Framework:** Vue 3 (Composition API, Reactividad mediante `ref` y `reactive`).
*   **Bundler:** Vite 8.0.
*   **Lenguajes:** JavaScript ES Modules, HTML5 Semántico, CSS moderno.
*   **APIs Web:** Web Audio API (música y efectos dinámicos), Fetch API (carga dinámica de misiones) y LocalStorage (persistencia).
*   **Estilos y Diseño:** CSS nativo puro sin dependencias (Tailwind/Bootstrap) para garantizar flexibilidad, animaciones neón por keyframes y diseño responsivo.

---

## 🎮 Mecánicas del Juego

1.  **Creación de Identidad:** El juego inicia configurando los atributos del héroe (nombre, alias, carrera, sede de la UCR, personalidad).
2.  **Ciclo de Actividades Diurnas:** El jugador debe elegir 2 actividades diurnas en el campus de la UCR. Cada actividad impacta en sus recursos. Se incluye un panel inteligente de recomendaciones académicas y una bitácora de noticias del campus.
3.  **Sospecha y Exposición:** Actuar de forma sospechosa o descuidar las clases aumenta el porcentaje de sospecha. Ciertas decisiones detonan un **Evento de Sospecha**. Si el jugador acumula **3 marcas de exposición**, su identidad secreta se revela en el campus, provocando un *Game Over* narrativo.
4.  **Vuelo y Patrullaje Nocturno:** Al atardecer, el jugador activa su alias y vuela hacia el mapa de Costa Rica.
5.  **Mapa de Costa Rica:** Un mapa vectorial SVG interactivo permite explorar las 7 provincias. Cada provincia cuenta con su propia misión y nivel de dificultad.
6.  **Trivia de las Provincias:** Cada misión se compone de preguntas sobre Costa Rica. Responder correctamente otorga XP, nivel y reputación nocturna; los errores reducen la energía y aumentan las sospechas.
7.  **Centro del Héroe:** Accesible para revisar el progreso, guardar partida, silenciar la música y ver logros o recuerdos desbloqueados.

---

## 💾 Persistencia y Almacenamiento

El juego utiliza el almacenamiento local de **LocalStorage** en el navegador para dos funciones clave:
*   **Progreso de la Aventura:** Guarda el estado exacto de la identidad del héroe, sus estadísticas, las misiones completadas, sus checkpoints y la mochila. Si el jugador sale del juego, al volver podrá hacer clic en **Continuar Aventura** para retomar su progreso exacto.
*   **Salón de la Fama (Ranking Local):** Almacena las mejores puntuaciones obtenidas por los jugadores en este dispositivo de forma permanente, ordenadas de mayor a menor puntaje. Reiniciar la aventura borra el progreso del héroe pero **conserva los récords del ranking local** para incentivar la rejugabilidad.

---

## 📱 Responsive Design

La interfaz del juego ha sido optimizada minuciosamente para ser adaptable a cualquier dispositivo móvil, tableta o pantalla de escritorio.
*   Uso de Grid Layout y Flexbox para reubicar los paneles laterales y centrales según el ancho de pantalla.
*   Imágenes y textos fluidos con `clamp()`.
*   HUD táctico que se colapsa de forma interactiva en pantallas móviles para mejorar el espacio de lectura de las misiones y preguntas de la trivia.

---

## 📋 Cumplimiento de Requisitos

| Requisito Enunciado | Estado | Implementación en Ruta Tica |
|---|---|---|
| Framework Moderno | **Completado** | Desarrollado completamente en **Vue 3** con Composition API. |
| Componentes Reutilizables | **Completado** | +15 componentes separados, con modularidad, props y emits limpios. |
| Diseño Responsivo | **Completado** | Totalmente adaptado a móviles, tablets y pantallas panorámicas. |
| Elementos Multimedia | **Completado** | BGM independientes por pantalla, SFX interactivos y gráficos adaptados. |
| Persistencia | **Completado** | Guardado de progreso y ranking independiente en **LocalStorage**. |
| Datos en JSON | **Completado** | Banco de preguntas cargado de forma asíncrona mediante `public/misiones.json`. |
| Estilo de Código | **Completado** | Código CSS nativo propio, sin frameworks externos y variables globales neón. |

---

## 🎨 Galería de Capturas

A continuación se muestran capturas de pantalla reales que ilustran el flujo y la interfaz neón-cyberpunk del proyecto final:

### 1. Pantalla de Inicio
Fondo de la ciudad de San José en un futuro cyberpunk. Permite comenzar una nueva aventura o continuar una anterior cargando los datos desde LocalStorage.
![Pantalla de Inicio](/public/capturas/01-inicio.png)

### 2. Centro de Operaciones
Panel de control táctico nocturno que muestra el estado de las provincias completadas, estadísticas de atributos y misiones en Costa Rica.
![Centro de Operaciones](/public/capturas/02-centro-operaciones.png)

### 3. Misión Activa en el Mapa
Mapa interactivo de Costa Rica con selección de provincia y detalles de la misión a realizar.
![Misión Activa](/public/capturas/03-mision-activa.png)

### 4. Desafío de Trivia
Pantalla donde se realizan las preguntas educativas sobre geografía, cultura, ambiente e historia nacional.
![Desafío de Trivia](/public/capturas/04-trivia.png)

### 5. Checkpoint Narrativo
Indicador táctico al responder de manera perfecta una serie de preguntas de la misión actual.
![Checkpoint](/public/capturas/05-checkpoint.png)

### 6. Resultados de Patrullaje
Resumen final al completar el patrullaje de una provincia con la experiencia (XP) ganada y la actualización de estadísticas.
![Resultados](/public/capturas/06-resultado.png)

### 7. Centro del Héroe
Pantalla completa independiente donde se visualiza el perfil del estudiante, inventario de la mochila, hitos, logros y el Salón de la Fama.
![Centro del Héroe](/public/capturas/07-centro-heroe.png)

### 8. Adaptación Responsive (HUD Móvil)
Demostración de la interfaz HUD colapsada y adaptada a dispositivos móviles con menús interactivos simplificados.
![Responsive](/public/capturas/08-responsive.png)

### 9. Evento de Sospecha
Alerta holográfica en el campus con decisiones que afectan directamente la revelación de la identidad secreta.
![Evento de Sospecha](/public/capturas/09-sospecha.png)

---

## 📂 Estructura del Proyecto

La organización del código fuente en el repositorio sigue un estándar profesional y estructurado:

```
dist/                       ← Compilación lista para despliegue
public/
  audio/                    ← Efectos (SFX) y Música (BGM) loopable
  capturas/                 ← Capturas de pantalla utilizadas en el README.md
  images/                   ← Fondos premium de bienvenida y controles
  misiones.json             ← Banco oficial de 56 preguntas educativas
src/
  assets/
    images/                 ← Archivos vectoriales y mapa de Costa Rica
  components/
    game/                   ← Vistas y componentes interactivos del juego
      CentroHeroeView.vue          - Perfil, Mochila, Logros y Salón de la Fama
      CreadorIdentidad.vue         - Formulario y personalización de avatar
      IndicadorEstadistica.vue     - Barras de atributos del HUD
      MapaCostaRica.vue            - Mapa SVG interactivo de provincias
      MapaMisiones.vue             - HUD nocturno y detalles de provincia
      ModalConfirmacion.vue        - Diálogos modales neonizados
      PantallaCrisis.vue           - Pregunta de examen por sospecha extrema
      PantallaGameOver.vue         - Fin de partida narrativo
      PantallaInicio.vue           - Pantalla de bienvenida principal
      PantallaJuego.vue            - Trivia y toma de decisiones nocturnas
      PantallaNuevoDia.vue         - Transición de amanecer y rendimiento
      PantallaResultado.vue        - Resumen de provincia y subida de nivel
      PantallaTransformacion.vue   - Transición cinemática a héroe
      PantallaTransicionNoche.vue  - Transición de atardecer
      PantallaVidaUniversitaria.vue - Actividades diurnas y alerta de campus
      SelectorPersonalizado.vue    - Inputs estéticos del creador
      TarjetaProvincia.vue         - Fichas de provincia en mapa
    layout/                 ← Componentes fijos del marco
      EncabezadoApp.vue
      PiePaginaApp.vue
  composables/              ← Componedores de lógica e interacción
    useAudio.js
    useEstadoJuego.js
  data/                     ← Ficheros JS con datos estáticos auxiliares
    carrerasUniversitarias.js
    eventosSospecha.js
    noticiasCampus.js
  styles/                   ← Estilos globales organizados
    animations.css
    base.css
    variables.css
  App.vue                   ← Enrutador reactivo por estados y raíz
  main.js                   ← Inicializador de la aplicación Vue
```

---

## 🛠️ Instalación y Ejecución Local

Para ejecutar este proyecto en tu entorno local, clona este repositorio y sigue los pasos a continuación:

### Requisitos Previos
Tener instalado [Node.js](https://nodejs.org/) y el gestor de dependencias [pnpm](https://pnpm.io/).

```bash
# 1. Instalar las dependencias del proyecto
pnpm install

# 2. Iniciar el servidor local de desarrollo
pnpm dev

# 3. Compilar la aplicación para producción
pnpm run build

# 4. Previsualizar localmente la compilación de producción
pnpm run preview
```

---

## 👨‍💻 Créditos del Autor

*   **Nombre:** Emiliano Martínez
*   **Curso:** IF7102 Multimedios
*   **Sede:** Universidad de Costa Rica
*   **Fecha de entrega:** Junio, 2026
