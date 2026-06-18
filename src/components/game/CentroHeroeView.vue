<template>
  <section class="pantalla-centro-heroe" aria-label="Centro del Héroe">
    <!-- Fondo Vivo Operaciones -->
    <div class="fondo-vivo-operaciones" aria-hidden="true">
      <div class="nebulosa nebulosa-cian"></div>
      <div class="nebulosa nebulosa-purpura"></div>
      <div class="futuristic-grid"></div>
      <div class="particulas-lentas">
        <span class="p-lenta pl1"></span>
        <span class="p-lenta pl2"></span>
        <span class="p-lenta pl3"></span>
        <span class="p-lenta pl4"></span>
        <span class="p-lenta pl5"></span>
        <span class="p-lenta pl6"></span>
      </div>
    </div>

    <div class="centro-heroe-container animate-fade-in-scale">
      <!-- Cabecera Heroica (Fase 2.0) -->
      <header class="cabecera-heroica-completa">
        <div class="cabecera-inner-hud">
          <div class="avatar-completo-wrapper">
            <div class="avatar-halo"></div>
            <div class="avatar-box">
              <span class="avatar-icon">{{ tituloFinal?.emoji || '🦸‍♂️' }}</span>
            </div>
          </div>
          
          <div class="hud-info-general">
            <h1 class="hud-alias text-neon-purple">[{{ identidadHeroe.aliasHeroe || 'VIAJERO DE LA NOCHE' }}]</h1>
            <p class="hud-leyenda" v-if="tituloFinal">{{ tituloFinal.emoji }} {{ tituloFinal.nombre }}</p>
            <p class="hud-rango">🛡️ Protector Universitario</p>
          </div>

          <!-- HUD Status Columns -->
          <div class="hud-stats-grid">
            <div class="hud-stat-col">
              <span class="hud-stat-lbl">Nivel</span>
              <span class="hud-stat-val text-neon-blue">{{ nivelHeroe }}</span>
            </div>
            <div class="hud-stat-col">
              <span class="hud-stat-lbl">Experiencia</span>
              <span class="hud-stat-val text-neon-gold">{{ experienciaHeroe }} XP</span>
            </div>
            <div class="hud-stat-col">
              <span class="hud-stat-lbl">Reputación</span>
              <span class="hud-stat-val text-neon-purple">{{ estadisticasHeroe.reputacionNocturna }}%</span>
            </div>
            <div class="hud-stat-col">
              <span class="hud-stat-lbl">Sospecha</span>
              <span class="hud-stat-val" :class="sospechaRangoInfo.clase">{{ estadisticasHeroe.sospechaIdentidad }}%</span>
            </div>
          </div>

          <!-- Botón Volver (Origen dinámico) -->
          <div class="volver-operaciones-wrapper">
            <button class="btn btn-hero" @click="volverAlOrigen">
              ⬅ {{ origenCentroHeroe === 'inicio' ? 'Volver al Inicio' : 'Volver al Centro de Operaciones' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Sección Narrativa: Estado del Héroe -->
      <div class="estado-heroe-narrativa">
        <div class="narrativa-header">
          <span class="radar-ping"></span>
          <span class="narrativa-tag">ESTADO DEL HÉROE</span>
        </div>
        <p class="narrativa-texto">{{ mensajeNarrativoEstado }}</p>
      </div>

      <!-- Navegación de Pestañas -->
      <nav class="tabs-centro" role="tablist" aria-label="Navegación del Centro del Héroe">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          role="tab"
          :aria-selected="tabActiva === tab.id ? 'true' : 'false'"
          :aria-controls="'panel-' + tab.id"
          :class="{ activo: tabActiva === tab.id }"
          @click="tabActiva = tab.id; reproducirEfecto('boton')"
        >
          <span class="tab-icono" aria-hidden="true">{{ tab.icono }}</span>
          <span class="tab-etiqueta">{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Contenedor Principal de Contenido de Pestaña -->
      <div class="contenido-tab">

        <!-- ================= PESTAÑA: PERFIL ================= -->
        <div v-if="tabActiva === 'perfil'" id="panel-perfil" role="tabpanel" aria-label="Perfil del Héroe" class="seccion-perfil animate-fade-in">
          <!-- Modo Lectura -->
          <div v-if="!modoEdicion" class="perfil-info-grid">
            
            <!-- Tarjeta izquierda: IDENTIDAD CIVIL -->
            <div class="tarjeta-info-premium credencial-civil glass-panel-neon cian">
              <div class="credencial-header">
                <span class="credencial-chip">🪪 IDENTIDAD CIVIL</span>
                <span class="insignia-ucr">🏛️ {{ identidadHeroe.universidad }}</span>
              </div>
              <div class="credencial-body-modern">
                <div class="avatar-civil-container">
                  <div class="avatar-scanner"></div>
                  <span class="avatar-civil-icon">🎓</span>
                </div>
                <div class="civil-identity-details">
                  <h3 class="civil-name">{{ identidadHeroe.nombre }}</h3>
                  <p class="civil-age">{{ identidadHeroe.edad }} años | Estudiante</p>
                  <div class="hologram-grid-overlay"></div>
                </div>
              </div>
              
              <div class="civil-badges-container">
                <div class="badge-item-hero cian">
                  <span class="badge-label">CARRERA</span>
                  <span class="badge-value">{{ nombreCarreraLegible(identidadHeroe.carrera) }}</span>
                </div>
                <div class="badge-item-hero cian" v-if="identidadHeroe.clubUniversitario">
                  <span class="badge-label">CLUB</span>
                  <span class="badge-value">{{ identidadHeroe.clubUniversitario }}</span>
                </div>
                <div class="badge-item-hero cian">
                  <span class="badge-label">DEPORTE</span>
                  <span class="badge-value">{{ deporteLegible(identidadHeroe.deporte) }}</span>
                </div>
              </div>
            </div>

            <!-- Tarjeta derecha: IDENTIDAD HEROICA -->
            <div class="tarjeta-info-premium licencia-heroica glass-panel-neon purpura">
              <div class="licencia-header">
                <span class="licencia-title-badge">🦸 IDENTIDAD HEROICA</span>
                <span class="licencia-serial">RT-0{{ nivelHeroe }}-{{ experienciaHeroe }}</span>
              </div>
              
              <div class="hero-identity-body">
                <!-- Medalla Visual del Héroe -->
                <div class="medalla-visual-heroe">
                  <span class="medalla-emoji">🎖️</span>
                  <div class="medalla-glow"></div>
                </div>
                
                <div class="hero-identity-text">
                  <h3 class="hero-alias-destacado text-neon-purple">
                    {{ identidadHeroe.aliasHeroe || 'Héroe del After' }}
                  </h3>
                  <p class="hero-titulo-destacado" v-if="tituloFinal">
                    {{ tituloFinal.emoji }} {{ tituloFinal.nombre }}
                  </p>
                </div>
              </div>

              <!-- Panel de Rango -->
              <div class="panel-de-rango-neon">
                <span class="rango-badge-text">🛡️ {{ tituloFinal?.nombre || 'Protector Universitario' }}</span>
              </div>

              <div class="hero-licencia-details">
                <div class="detail-row"><span class="lbl">Nivel:</span> <span class="val text-neon-purple">Nvl {{ nivelHeroe }}</span></div>
                <div class="detail-row"><span class="lbl">Experiencia:</span> <span class="val text-neon-gold">{{ experienciaHeroe }} XP</span></div>
                <div class="detail-row"><span class="lbl">Reputación:</span> <span class="val text-neon-blue">{{ estadisticasHeroe.reputacionNocturna }}%</span></div>
                
                <!-- Track de Sospecha Secreta -->
                <div class="progreso-sospecha-licencia">
                  <div class="sospecha-meta-licencia">
                    <span class="lbl">SOSPECHA:</span>
                    <span class="sospecha-rango-badge-mini" :class="sospechaRangoInfo.clase">{{ sospechaRangoInfo.label }}</span>
                  </div>
                  <div class="barra-sospecha-licencia">
                    <div
                      class="barra-sospecha-relleno-licencia"
                      :style="{ width: estadisticasHeroe.sospechaIdentidad + '%' }"
                      :class="sospechaRangoInfo.clase"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Módulo de Estadísticas -->
            <div class="estadisticas-dashboard-seccion">
              <h3>📊 Módulo de Estadísticas</h3>
              <div class="estadisticas-dashboard-grid">
                <!-- Energía -->
                <div class="stat-dashboard-card energy-card" tabindex="0">
                  <div class="stat-header">
                    <span class="stat-icon">⚡</span>
                    <span class="stat-name">Energía</span>
                    <span class="stat-value">{{ estadisticasHeroe.energia }}%</span>
                  </div>
                  <div class="stat-bar-container">
                    <div class="stat-bar-fill" :style="{ width: estadisticasHeroe.energia + '%' }"></div>
                  </div>
                </div>

                <!-- Conocimiento -->
                <div class="stat-dashboard-card knowledge-card" tabindex="0">
                  <div class="stat-header">
                    <span class="stat-icon">🧠</span>
                    <span class="stat-name">Conocimiento</span>
                    <span class="stat-value">{{ estadisticasHeroe.conocimiento }}%</span>
                  </div>
                  <div class="stat-bar-container">
                    <div class="stat-bar-fill" :style="{ width: estadisticasHeroe.conocimiento + '%' }"></div>
                  </div>
                </div>

                <!-- Diversión -->
                <div class="stat-dashboard-card fun-card" tabindex="0">
                  <div class="stat-header">
                    <span class="stat-icon">🎉</span>
                    <span class="stat-name">Diversión</span>
                    <span class="stat-value">{{ estadisticasHeroe.diversion }}%</span>
                  </div>
                  <div class="stat-bar-container">
                    <div class="stat-bar-fill" :style="{ width: estadisticasHeroe.diversion + '%' }"></div>
                  </div>
                </div>

                <!-- Responsabilidad -->
                <div class="stat-dashboard-card responsibility-card" tabindex="0">
                  <div class="stat-header">
                    <span class="stat-icon">📚</span>
                    <span class="stat-name">Responsabilidad</span>
                    <span class="stat-value">{{ estadisticasHeroe.responsabilidad }}%</span>
                  </div>
                  <div class="stat-bar-container">
                    <div class="stat-bar-fill" :style="{ width: estadisticasHeroe.responsabilidad + '%' }"></div>
                  </div>
                </div>

                <!-- Reputación -->
                <div class="stat-dashboard-card reputation-card" tabindex="0">
                  <div class="stat-header">
                    <span class="stat-icon">🏆</span>
                    <span class="stat-name">Reputación</span>
                    <span class="stat-value">{{ estadisticasHeroe.reputacionNocturna }}%</span>
                  </div>
                  <div class="stat-bar-container">
                    <div class="stat-bar-fill" :style="{ width: estadisticasHeroe.reputacionNocturna + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bloque Resumen de Último Patrullaje -->
            <div class="tarjeta-info mision-reciente">
              <h3>⚡ Último Patrullaje Registrado</h3>
              <div class="detalles-info grid-mision-reciente">
                <p><strong>Misión patrullada:</strong> {{ ultimaMisionNombre || 'Ninguna' }}</p>
                <p><strong>Resultado obtenido:</strong> {{ ultimaMisionResultado || 'Sin registrar' }}</p>
                <p><strong>Recompensa desbloqueada:</strong> {{ ultimaRecompensa || 'Ninguna' }}</p>
              </div>
            </div>

            <button class="btn btn-hero-secondary btn-editar-perfil-centro" @click="activarModoEdicion" aria-label="Editar identidad de héroe">
              ✏️ Modificar Identidad
            </button>
          </div>

          <!-- Modo Edición -->
          <form v-else class="formulario-edicion-centro" @submit.prevent="guardarCambiosPerfil">
            <div class="form-scroll">
              <div class="form-group-edicion">
                <label for="edit-nombre-centro">Nombre de estudiante</label>
                <input
                  id="edit-nombre-centro"
                  v-model="formularioEdicion.nombre"
                  type="text"
                  class="input-formulario-edicion"
                  maxlength="30"
                  required
                />
                <span v-if="erroresEdicion.nombre" class="error-edicion">{{ erroresEdicion.nombre }}</span>
              </div>

              <div class="form-group-edicion">
                <label for="edit-edad-centro">Edad (17 - 45 años)</label>
                <input
                  id="edit-edad-centro"
                  v-model="formularioEdicion.edad"
                  type="number"
                  class="input-formulario-edicion"
                  min="17"
                  max="45"
                  required
                />
                <span v-if="erroresEdicion.edad" class="error-edicion">{{ erroresEdicion.edad }}</span>
              </div>

              <div class="form-group-edicion">
                <label for="edit-alias-centro">Alias Heroico</label>
                <select id="edit-alias-centro" v-model="formularioEdicion.aliasHeroe" class="select-formulario-edicion">
                  <option value="Centinela Tico">🛡️ Centinela Tico</option>
                  <option value="Guardián Nocturno">⚔️ Guardián Nocturno</option>
                  <option value="Sombra Universitaria">👥 Sombra Universitaria</option>
                  <option value="Viajero de la Noche">🌙 Viajero de la Noche</option>
                  <option value="Otro">✨ Personalizar alias...</option>
                </select>
                
                <input
                  v-if="formularioEdicion.aliasHeroe === 'Otro'"
                  id="edit-alias-pers-centro"
                  v-model="formularioEdicion.aliasPersonalizado"
                  type="text"
                  class="input-formulario-edicion"
                  placeholder="Ingresa tu alias personalizado..."
                  maxlength="20"
                  style="margin-top: 10px;"
                />
                <span v-if="erroresEdicion.aliasHeroe" class="error-edicion">{{ erroresEdicion.aliasHeroe }}</span>
              </div>

              <div class="informacion-bloqueada-centro">
                <p>ℹ️ La Universidad y la Carrera afectan tus estadísticas iniciales y no pueden modificarse.</p>
              </div>
            </div>

            <div class="acciones-edicion">
              <button type="button" class="btn btn-outline" @click="cancelarEdicion" aria-label="Cancelar edición de perfil">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!formularioValido" aria-label="Guardar cambios del perfil">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        <!-- ================= PESTAÑA: MOCHILA ================= -->
        <div v-if="tabActiva === 'mochila'" id="panel-mochila" role="tabpanel" aria-label="Mochila e Inventario" class="seccion-mochila animate-fade-in">
          <div class="seccion-mochila-scroll">
            <div class="inventario-bloque">
              <h4>🎒 Objetos en Mochila</h4>
              <div v-if="inventarioHeroe.length > 0" class="mochila-grid">
                <div v-for="(item, i) in inventarioHeroe" :key="i" class="item-mochila-card">
                  <span class="item-emoji">{{ item.emoji }}</span>
                  <span class="item-nombre">{{ item.nombre }}</span>
                </div>
              </div>
              <p class="vacio-texto" v-else>Tu mochila está vacía. ¡Resuelve misiones para ganar objetos!</p>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: RECUERDOS ================= -->
        <div v-if="tabActiva === 'recuerdos'" id="panel-recuerdos" role="tabpanel" aria-label="Recuerdos del After" class="seccion-mochila animate-fade-in">
          <div class="seccion-mochila-scroll">
            <div class="inventario-bloque">
              <h4>🍹 Recuerdos del After</h4>
              <div v-if="coleccionAfter.length > 0" class="mochila-grid">
                <div v-for="(rec, i) in coleccionAfter" :key="i" class="item-mochila-card after-recuerdo">
                  <span class="item-emoji">{{ rec.emoji }}</span>
                  <span class="item-nombre">{{ rec.nombre }}</span>
                </div>
              </div>
              <p class="vacio-texto" v-else>No has guardado recuerdos de after parties. ¡Ayuda a los estudiantes de noche!</p>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: HITOS ================= -->
        <div v-if="tabActiva === 'hitos'" id="panel-hitos" role="tabpanel" aria-label="Hitos de Aventura" class="seccion-progreso animate-fade-in">
          <div class="seccion-progreso-scroll">
            <div class="progreso-bloque">
              <h4>📅 Calendario Académico</h4>
              <div class="calendario-basico">
                <p><strong>Progreso del Semestre:</strong> Semana {{ identidadHeroe.semanaAcademica || 1 }} de 16</p>
                <div class="barra-calendario-semana">
                  <div
                    class="barra-calendario-relleno"
                    :style="{ width: ((identidadHeroe.semanaAcademica || 1) / 16 * 100) + '%' }"
                  ></div>
                </div>
                <p class="nota-calendario">Completa misiones para avanzar el ciclo académico y consolidar tus estudios.</p>
              </div>
            </div>

            <div class="progreso-provincias-ruta">
              <h4>🗺️ Progreso Geográfico de Provincias</h4>
              <div class="ruta-lista">
                <div
                  v-for="(prov, idx) in listaSecuenciaProvincias"
                  :key="prov.id"
                  class="ruta-nodo"
                  :class="{
                    'completado': misionesCompletadas.includes(prov.id),
                    'activo-desbloqueado': esProvinciaActualDesbloqueada(prov.id)
                  }"
                >
                  <span class="nodo-check">
                    {{ misionesCompletadas.includes(prov.id) ? '✓' : (esProvinciaActualDesbloqueada(prov.id) ? '🔓' : '🔒') }}
                  </span>
                  <div class="nodo-texto">
                    <span class="nodo-nombre">{{ prov.nombre }}</span>
                    <span class="nodo-estado">
                      {{ misionesCompletadas.includes(prov.id) ? 'Completada' : (esProvinciaActualDesbloqueada(prov.id) ? 'Desbloqueada (Siguiente)' : 'Bloqueada') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="progreso-bloque">
              <h4>🚩 Hitos de Aventura (Checkpoints)</h4>
              <div v-if="checkpointsDesbloqueados.length > 0" class="hitos-grid">
                <div v-for="(ch, i) in checkpointsDesbloqueados" :key="i" class="hito-card">
                  <span class="hito-emoji">{{ ch.emoji }}</span>
                  <span class="hito-nombre">{{ ch.nombre }}</span>
                </div>
              </div>
              <p class="vacio-texto" v-else>No has desbloqueado hitos aún. ¡Completa misiones para encontrarlos!</p>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: LOGROS ================= -->
        <div v-if="tabActiva === 'logros'" id="panel-logros" role="tabpanel" aria-label="Logros Obtenidos" class="seccion-progreso animate-fade-in">
          <div class="seccion-progreso-scroll">
            <div class="progreso-bloque">
              <h4>🏆 Logros Obtenidos</h4>
              <div v-if="logrosHeroe.length > 0" class="logros-grid">
                <div v-for="(l, i) in logrosHeroe" :key="i" class="logro-card">
                  <span class="logro-emoji">{{ l.emoji }}</span>
                  <span class="logro-nombre">{{ l.nombre }}</span>
                </div>
              </div>
              <p class="vacio-texto" v-else>Ningún logro desbloqueado todavía. ¡Conviértete en leyenda!</p>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: RANKING ================= -->
        <div v-if="tabActiva === 'ranking'" id="panel-ranking" role="tabpanel" aria-label="Salón de la Fama" class="seccion-ranking animate-fade-in">
          <div class="seccion-ranking-scroll">
            <h4>🏆 Salón de la Fama (Ranking Local)</h4>
            <p class="ranking-intro">Los mejores patrullajes registrados en este dispositivo:</p>

            <div v-if="rankingLocal.length > 0" class="tabla-ranking-contenedor">
              <table class="tabla-ranking">
                <thead>
                  <tr>
                    <th scope="col" class="col-puesto">Puesto</th>
                    <th scope="col" class="col-heroe">Héroe</th>
                    <th scope="col" class="col-provincia">Provincia</th>
                    <th scope="col" class="col-resultado">Resultado</th>
                    <th scope="col" class="col-fecha">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entrada, index) in rankingLocal" :key="index" :class="'puesto-' + (index + 1)">
                    <td class="col-puesto">
                      <span class="medalla" v-if="index === 0">🥇</span>
                      <span class="medalla" v-else-if="index === 1">🥈</span>
                      <span class="medalla" v-else-if="index === 2">🥉</span>
                      <span class="puesto-numero" v-else>#{{ index + 1 }}</span>
                    </td>
                    <td class="col-heroe"><strong>{{ entrada.alias }}</strong></td>
                    <td class="col-provincia">{{ entrada.provincia }}</td>
                    <td class="col-resultado">
                      <span class="score-badge">{{ entrada.resultado }}</span>
                      <span class="score-percent">({{ entrada.puntaje }} pts)</span>
                    </td>
                    <td class="col-fecha">{{ entrada.fecha }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="ranking-vacio">
              <p class="vacio-texto">✨ ¡El Salón de la Fama está esperando a su primer héroe! ✨</p>
              <p class="vacio-subtexto">Completa patrullajes en las provincias para registrar tus mejores puntuaciones aquí.</p>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: AUDIO ================= -->
        <div v-if="tabActiva === 'audio'" id="panel-audio" role="tabpanel" aria-label="Ajustes de Sonido" class="seccion-audio animate-fade-in">
          <div class="audio-config-card">
            <p class="audio-intro">Personaliza el ambiente sonoro de tu patrullaje y vida universitaria:</p>

            <div class="control-grupo-audio">
              <div class="control-columna-audio">
                <div class="control-fila">
                  <div class="control-info">
                    <span class="control-icono">🎵</span>
                    <div class="control-texto">
                      <label class="control-label">Música de fondo</label>
                      <span class="control-subtexto">Banda sonora (Nivel: {{ Math.round(volumenMusica * 100) }}%)</span>
                    </div>
                  </div>
                  <label class="switch-neon">
                    <input type="checkbox" :checked="musicaHabilitada" @change="alCambiarMusica">
                    <span class="slider-neon"></span>
                  </label>
                </div>
                <div class="slider-contenedor-neon" :class="{ 'deshabilitado-opaco': !musicaHabilitada }">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    :value="volumenMusica"
                    @input="alCambiarVolumenMusica"
                    class="rango-neon"
                    aria-label="Volumen de música"
                    :disabled="!musicaHabilitada"
                  >
                  <div class="barra-progreso-rango" :style="{ width: (volumenMusica * 100) + '%' }"></div>
                </div>
              </div>

              <div class="control-columna-audio">
                <div class="control-fila">
                  <div class="control-info">
                    <span class="control-icono">⚡</span>
                    <div class="control-texto">
                      <label class="control-label">Efectos de sonido</label>
                      <span class="control-subtexto">SFX y botones (Nivel: {{ Math.round(volumenEfectos * 100) }}%)</span>
                    </div>
                  </div>
                  <label class="switch-neon">
                    <input type="checkbox" :checked="efectosHabilitados" @change="alCambiarEfectos">
                    <span class="slider-neon"></span>
                  </label>
                </div>
                <div class="slider-contenedor-neon" :class="{ 'deshabilitado-opaco': !efectosHabilitados }">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    :value="volumenEfectos"
                    @input="alCambiarVolumenEfectos"
                    @change="reproducirEfecto('boton')"
                    class="rango-neon"
                    aria-label="Volumen de efectos"
                    :disabled="!efectosHabilitados"
                  >
                  <div class="barra-progreso-rango" :style="{ width: (volumenEfectos * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= PESTAÑA: OPCIONES/GUARDADO ================= -->
        <div v-if="tabActiva === 'opciones'" id="panel-opciones" role="tabpanel" aria-label="Ajustes de Guardado" class="seccion-opciones animate-fade-in">
          <div class="opciones-contenido">
            <p class="opciones-intro">Manejo persistente del progreso de tu aventura:</p>

            <div class="opciones-botones-vertical">
              <button class="btn btn-hero btn-guardar-manual" @click="guardarManualmente" aria-label="Guardar progreso actual manualmente">
                💾 Guardar Progreso Actual
              </button>

              <div class="cargar-seccion">
                <button
                  class="btn btn-primary"
                  :disabled="!existeSave"
                  @click="cargarManualmente"
                  aria-label="Cargar partida guardada manualmente"
                >
                  📂 Cargar Partida
                </button>
                <p v-if="!existeSave" class="save-advertencia">⚠️ No hay partida guardada</p>
              </div>

              <button class="btn btn-danger" @click="abrirConfirmacionBorrar" aria-label="Borrar progreso de forma definitiva">
                🗑️ Borrar Progreso (Reiniciar)
              </button>

              <button class="btn btn-danger" @click="alReiniciarAventura" aria-label="Reiniciar toda la aventura">
                🔄 Reiniciar aventura
              </button>
            </div>

            <transition name="fade">
              <div v-if="mensajeFeedback" class="feedback-notif" :class="feedbackExitoso ? 'exito' : 'error'">
                {{ mensajeFeedback }}
              </div>
            </transition>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal de confirmación para borrar progreso -->
    <ModalConfirmacion
      :mostrar="mostrarConfirmarBorrar"
      titulo="¿Borrar progreso?"
      mensaje="¿Seguro que deseas eliminar permanentemente tu partida guardada? Esta acción limpiará localStorage, restablecerá tu héroe civil/heroico y te enviará a la pantalla de inicio."
      textoConfirmar="Eliminar partida"
      textoCancelar="Cancelar"
      @confirmar="confirmarBorrarProgreso"
      @cancelar="cerrarConfirmacionBorrar"
    />
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useEstadoJuego, PANTALLAS } from '../../composables/useEstadoJuego.js'
import { useAudio } from '../../composables/useAudio.js'
import ModalConfirmacion from './ModalConfirmacion.vue'
import { RELACION_U_SEDES } from '../../data/carrerasUniversitarias.js'

// --- Composables ---
const {
  identidadHeroe,
  estadisticasHeroe,
  nivelHeroe,
  experienciaHeroe,
  misionesCompletadas,
  checkpointsDesbloqueados,
  coleccionAfter,
  inventarioHeroe,
  logrosHeroe,
  actualizarIdentidad,
  guardarProgreso,
  cargarProgreso,
  borrarProgreso,
  reiniciarProgreso,
  hayProgresoGuardado,
  rankingLocal,
  cargarRankingLocal,
  tituloFinal,
  ultimaMisionNombre,
  ultimaMisionResultado,
  ultimaRecompensa,
  marcasExposicion,
  enCrisis,
  exposicionRevelada,
  navegarA,
  origenCentroHeroe
} = useEstadoJuego()

function volverAlOrigen() {
  reproducirEfecto('boton')
  if (origenCentroHeroe.value === 'inicio') {
    navegarA(PANTALLAS.INICIO)
  } else {
    navegarA(PANTALLAS.MAPA)
  }
}

const {
  musicaHabilitada,
  efectosHabilitados,
  volumenMusica,
  volumenEfectos,
  establecerMusicaHabilitada,
  establecerEfectosHabilitados,
  establecerVolumenMusica,
  establecerVolumenEfectos,
  reproducirEfecto
} = useAudio()

// --- Estado local ---
const tabActiva = ref('perfil')
const modoEdicion = ref(false)
const existeSave = ref(false)
const mensajeFeedback = ref('')
const feedbackExitoso = ref(true)
const mostrarConfirmarBorrar = ref(false)

onMounted(() => {
  existeSave.value = hayProgresoGuardado()
  cargarRankingLocal()
})

const estadoSuspicionNombre = computed(() => {
  if (exposicionRevelada.value || marcasExposicion.value >= 2) return 'Identidad Revelada'
  if (enCrisis.value || estadisticasHeroe.sospechaIdentidad >= 100) return 'Crisis'
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return 'Normal'
  if (s <= 50) return 'Rumores'
  return 'Alerta'
})

const mensajeNarrativoEstado = computed(() => {
  const sospecha = estadisticasHeroe.sospechaIdentidad
  const energia = estadisticasHeroe.energia
  if (sospecha >= 65) {
    return "Tu identidad comienza a llamar la atención."
  }
  if (energia <= 35) {
    return "Necesitas administrar mejor tu energía."
  }
  if (energia >= 75) {
    return "Listo para otra noche de patrullaje."
  }
  return "Monitoreando la actividad universitaria. Todo estable."
})

const sospechaRangoInfo = computed(() => {
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return { label: 'Identidad segura 🟢', clase: 'segura' }
  if (s <= 50) return { label: 'Rumores 🟡', clase: 'rumores' }
  if (s <= 75) return { label: 'Sospecha alta 🟠', clase: 'alta' }
  return { label: 'Investigación activa 🔴', clase: 'investigacion' }
})

const mensajeSospechaHeroe = computed(() => {
  const s = estadisticasHeroe.sospechaIdentidad
  if (s <= 25) return 'Tu doble identidad está a salvo. Eres un estudiante ejemplar ante los ojos de todos. 🟢'
  if (s <= 50) return 'Se escuchan susurros. Algunos compañeros comentan que te ven salir tarde del campus. 🟡'
  if (s <= 75) return 'El director de carrera te citó por ausencias misteriosas. La facultad sospecha de tus escapadas nocturnas. 🟠'
  return '¡Alerta roja! Profesores y administradores buscan confirmar quién es la sombra del campus. 🔴'
})

function nombreSedeLegible(uni, value) {
  if (!uni || !value) return '—'
  const list = RELACION_U_SEDES[uni] || []
  const found = list.find(s => s.value === value)
  return found ? found.label : value
}

function alCambiarMusica(e) {
  establecerMusicaHabilitada(e.target.checked)
  if (e.target.checked) reproducirEfecto('boton')
}

function alCambiarEfectos(e) {
  establecerEfectosHabilitados(e.target.checked)
  if (e.target.checked) reproducirEfecto('boton')
}

function alCambiarVolumenMusica(e) {
  const val = parseFloat(e.target.value)
  establecerVolumenMusica(val)
}

function alCambiarVolumenEfectos(e) {
  const val = parseFloat(e.target.value)
  establecerVolumenEfectos(val)
}

const tabs = [
  { id: 'perfil', icono: '👤', label: 'Perfil' },
  { id: 'mochila', icono: '🎒', label: 'Mochila' },
  { id: 'recuerdos', icono: '🍹', label: 'Recuerdos' },
  { id: 'hitos', icono: '🚩', label: 'Hitos' },
  { id: 'logros', icono: '🏆', label: 'Logros' },
  { id: 'ranking', icono: '📊', label: 'Ranking' },
  { id: 'audio', icono: '🔊', label: 'Audio' },
  { id: 'opciones', icono: '⚙️', label: 'Guardado' }
]

const secuenciaProvincias = ['san-jose', 'heredia', 'cartago', 'alajuela', 'guanacaste', 'puntarenas', 'limon']
const listaSecuenciaProvincias = [
  { id: 'san-jose', nombre: 'San José' },
  { id: 'heredia', nombre: 'Heredia' },
  { id: 'cartago', nombre: 'Cartago' },
  { id: 'alajuela', nombre: 'Alajuela' },
  { id: 'guanacaste', nombre: 'Guanacaste' },
  { id: 'puntarenas', nombre: 'Puntarenas' },
  { id: 'limon', nombre: 'Limón' }
]

// Formulario de edición
const formularioEdicion = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: '',
  aliasPersonalizado: ''
})

const erroresEdicion = reactive({
  nombre: '',
  edad: '',
  aliasHeroe: ''
})

function esProvinciaActualDesbloqueada(id) {
  const idx = secuenciaProvincias.indexOf(id)
  if (idx === 0) return !misionesCompletadas.value.includes(id)
  const prevCompletada = misionesCompletadas.value.includes(secuenciaProvincias[idx - 1])
  const actCompletada = misionesCompletadas.value.includes(id)
  return prevCompletada && !actCompletada
}

function activarModoEdicion() {
  reproducirEfecto('click')
  formularioEdicion.nombre = identidadHeroe.nombre
  formularioEdicion.edad = identidadHeroe.edad
  
  const aliasesPredefinidos = ['Centinela Tico', 'Guardián Nocturno', 'Sombra Universitaria', 'Viajero de la Noche']
  if (aliasesPredefinidos.includes(identidadHeroe.aliasHeroe)) {
    formularioEdicion.aliasHeroe = identidadHeroe.aliasHeroe
    formularioEdicion.aliasPersonalizado = ''
  } else {
    formularioEdicion.aliasHeroe = 'Otro'
    formularioEdicion.aliasPersonalizado = identidadHeroe.aliasHeroe
  }
  
  erroresEdicion.nombre = ''
  erroresEdicion.edad = ''
  erroresEdicion.aliasHeroe = ''
  modoEdicion.value = true
}

function cancelarEdicion() {
  reproducirEfecto('click')
  modoEdicion.value = false
}

const formularioValido = computed(() => {
  const nombre = formularioEdicion.nombre.trim()
  const edad = Number(formularioEdicion.edad)
  
  if (nombre.length < 2) return false
  if (isNaN(edad) || edad < 17 || edad > 45) return false
  if (formularioEdicion.aliasHeroe === 'Otro') {
    if (formularioEdicion.aliasPersonalizado.trim().length < 3) return false
  } else if (!formularioEdicion.aliasHeroe) {
    return false
  }
  
  return true
})

function guardarCambiosPerfil() {
  if (!formularioValido.value) return
  
  const aliasFinal = formularioEdicion.aliasHeroe === 'Otro'
    ? formularioEdicion.aliasPersonalizado.trim()
    : formularioEdicion.aliasHeroe

  actualizarIdentidad({
    nombre: formularioEdicion.nombre.trim(),
    edad: Number(formularioEdicion.edad),
    aliasHeroe: aliasFinal
  })
  
  reproducirEfecto('subirNivel')
  mostrarNotifExito('Perfil actualizado y guardado correctamente.')
  modoEdicion.value = false
}

function mostrarNotifExito(msg) {
  mensajeFeedback.value = msg
  feedbackExitoso.value = true
  setTimeout(() => {
    if (mensajeFeedback.value === msg) mensajeFeedback.value = ''
  }, 4000)
}

function mostrarNotifError(msg) {
  mensajeFeedback.value = msg
  feedbackExitoso.value = false
  setTimeout(() => {
    if (mensajeFeedback.value === msg) mensajeFeedback.value = ''
  }, 4000)
}

function guardarManualmente() {
  reproducirEfecto('click')
  guardarProgreso()
  mostrarNotifExito('✓ Partida guardada correctamente')
  existeSave.value = hayProgresoGuardado()
}

function cargarManualmente() {
  reproducirEfecto('click')
  const cargado = cargarProgreso()
  if (cargado) {
    mostrarNotifExito('📂 Progreso cargado satisfactoriamente.')
    navegarA(PANTALLAS.MAPA)
  } else {
    mostrarNotifError('❌ No se pudo cargar el progreso.')
  }
}

function abrirConfirmacionBorrar() {
  reproducirEfecto('click')
  mostrarConfirmarBorrar.value = true
}

function cerrarConfirmacionBorrar() {
  reproducirEfecto('click')
  mostrarConfirmarBorrar.value = false
}

function confirmarBorrarProgreso() {
  reproducirEfecto('subirNivel')
  borrarProgreso()
  mostrarConfirmarBorrar.value = false
  existeSave.value = hayProgresoGuardado()
  navegarA(PANTALLAS.INICIO)
}

function alReiniciarAventura() {
  const confirmado = window.confirm('¿Seguro que deseas reiniciar tu aventura? Esto borrará permanentemente tu partida guardada, restablecerá tu héroe y te enviará a la pantalla de inicio.')
  if (confirmado) {
    reproducirEfecto('subirNivel')
    reiniciarProgreso()
    existeSave.value = hayProgresoGuardado()
    navegarA(PANTALLAS.INICIO)
  }
}

function nombreCarreraLegible(carrera) {
  const mapeo = {
    Informatica: 'Informática Empresarial',
    Software: 'Ingeniería de Software',
    Ciberseguridad: 'Ciberseguridad',
    Datos: 'Ciencia de Datos',
    InformaticaEducativa: 'Informática Educativa',
    Turismo: 'Turismo',
    Administracion: 'Administración de Empresas',
    Derecho: 'Derecho',
    EducacionFisica: 'Educación Física',
    Biologia: 'Biología',
    Artes: 'Artes Plásticas',
    Educacion: 'Ciencias de la Educación',
    Otra: 'Otra Carrera'
  }
  return mapeo[carrera] || carrera
}

function deporteLegible(deporte) {
  const mapeo = {
    Futbol: '⚽ Fútbol',
    Natacion: '🏊 Natación',
    Ciclismo: '🚴 Ciclismo',
    Gimnasio: '💪 Gimnasio',
    Voleibol: '🏐 Voleibol',
    Boxeo: '🥊 Boxeo / Kickboxing',
    Basketball: '🏀 Baloncesto / Basketball',
    Correr: '🏃 Running',
    Surf: '🏄 Surf',
    Escalada: '🧗 Escalada',
    Ninguna: '😌 Solo estudio'
  }
  return mapeo[deporte] || deporte || 'Ninguno'
}
</script>

<style scoped>
/* --- Pantalla Completa Layout --- */
.pantalla-centro-heroe {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  padding: var(--space-8) var(--space-4);
  box-sizing: border-box;
  z-index: 1;
}

.centro-heroe-container {
  width: 100%;
  max-width: 1000px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  color: var(--color-text-primary);
  position: relative;
  z-index: 2;
}

/* --- Cabecera Heroica (Fase 2.0) --- */
.cabecera-heroica-completa {
  background: linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(13, 20, 35, 0.9) 100%);
  border: 1.5px solid rgba(0, 212, 255, 0.45);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 212, 255, 0.15);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  padding: var(--space-6);
}

.cabecera-inner-hud {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-6);
  align-items: center;
}

@media (max-width: 900px) {
  .cabecera-inner-hud {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
    gap: var(--space-4);
  }
}

.avatar-completo-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-halo {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--color-neon-blue), var(--color-neon-purple), var(--color-neon-blue));
  animation: rotate-halo 4s infinite linear;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

@keyframes rotate-halo {
  100% { transform: rotate(360deg); }
}

.avatar-box {
  position: absolute;
  inset: 2px;
  background: #06040a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.15);
  z-index: 1;
}

.avatar-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 8px rgba(184, 79, 255, 0.6));
}

.hud-info-general {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

@media (max-width: 900px) {
  .hud-info-general {
    text-align: center;
  }
}

.hud-alias {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 1.6rem;
  margin: 0;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(184, 79, 255, 0.8);
}

.hud-leyenda {
  font-size: 0.9rem;
  color: var(--color-neon-gold);
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
}

.hud-rango {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hud-stats-grid {
  display: flex;
  gap: var(--space-4);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
}

@media (max-width: 900px) {
  .hud-stats-grid {
    width: 100%;
    justify-content: space-around;
  }
}

@media (max-width: 480px) {
  .hud-stats-grid {
    flex-wrap: wrap;
    gap: var(--space-2);
  }
}

.hud-stat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 65px;
}

.hud-stat-lbl {
  font-size: 0.6rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.hud-stat-val {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
}

.volver-operaciones-wrapper {
  grid-column: span 3;
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-2);
}

@media (max-width: 900px) {
  .volver-operaciones-wrapper {
    grid-column: span 1;
    justify-content: center;
    width: 100%;
  }
}

/* --- Sección Narrativa --- */
.estado-heroe-narrativa {
  background: rgba(4, 6, 15, 0.6);
  border-left: 3px solid var(--color-neon-blue);
  border-top: 1px solid rgba(0, 200, 255, 0.1);
  border-bottom: 1px solid rgba(0, 200, 255, 0.1);
  border-right: 1px solid rgba(0, 200, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  text-align: left;
}

.narrativa-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: 4px;
}

.radar-ping {
  width: 6px;
  height: 6px;
  background: var(--color-neon-blue);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 8px var(--color-neon-blue);
}

.radar-ping::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid var(--color-neon-blue);
  animation: ping 1.5s infinite ease-out;
}

@keyframes ping {
  100% { transform: scale(2.5); opacity: 0; }
}

.narrativa-tag {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--color-neon-blue);
  font-weight: bold;
  letter-spacing: 0.1em;
}

.narrativa-texto {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  line-height: 1.4;
  font-style: italic;
}

/* --- Tabs --- */
.tabs-centro {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  border-bottom: 2px solid rgba(0, 212, 255, 0.15);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-2);
}

.tab-btn {
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(10, 15, 30, 0.6) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  border-bottom: 2px solid transparent !important;
  padding: var(--space-3) var(--space-2);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md) var(--radius-md) 0 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  clip-path: none !important; /* Desactivar corte HUD de base para las pestañas */
}

.tab-btn:hover {
  color: #00d4ff !important;
  background: rgba(0, 212, 255, 0.1) !important;
  border-color: #00d4ff !important;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.35), inset 0 0 8px rgba(0, 212, 255, 0.15);
  transform: translateY(-3px);
}

.tab-btn.activo {
  color: #ffffff !important;
  background: linear-gradient(to bottom, rgba(157, 78, 221, 0.2), rgba(30, 94, 255, 0.1)) !important;
  border: 1.5px solid rgba(0, 212, 255, 0.6) !important;
  border-bottom: 3px solid #00d4ff !important;
  box-shadow: 0 -4px 20px rgba(0, 212, 255, 0.45), 0 0 10px rgba(157, 78, 221, 0.3), inset 0 0 12px rgba(0, 212, 255, 0.2) !important;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
}

.tab-icono {
  font-size: 1.8rem !important;
  margin-bottom: 2px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.tab-btn:hover .tab-icono {
  transform: scale(1.2) translateY(-2px);
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
}

.tab-btn.activo .tab-icono {
  transform: scale(1.15);
  filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.8));
}

/* --- Contenido de Pestaña (Scroll Natural) --- */
.contenido-tab {
  width: 100%;
}

/* --- Pestaña: Perfil --- */
.seccion-perfil {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.perfil-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .perfil-info-grid {
    grid-template-columns: 1fr;
  }
}

.tarjeta-info {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  text-align: left;
}

.tarjeta-info h3 {
  margin: 0 0 var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tarjeta-info-premium {
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: left;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow: hidden;
  transition: all var(--transition-base);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
}

.tarjeta-info-premium:hover {
  transform: translateY(-3px);
}

/* Glassmorphism y Bordes Neón */
.glass-panel-neon {
  background: rgba(4, 6, 15, 0.45);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.glass-panel-neon.cian {
  border: 1.5px solid rgba(0, 200, 255, 0.25);
  box-shadow: inset 0 0 15px rgba(0, 200, 255, 0.05), 0 0 15px rgba(0, 200, 255, 0.1);
}

.glass-panel-neon.cian:hover {
  border-color: rgba(0, 200, 255, 0.6);
  box-shadow: inset 0 0 20px rgba(0, 200, 255, 0.1), 0 0 25px rgba(0, 200, 255, 0.25);
}

.glass-panel-neon.purpura {
  border: 1.5px solid rgba(184, 79, 255, 0.25);
  box-shadow: inset 0 0 15px rgba(184, 79, 255, 0.05), 0 0 15px rgba(184, 79, 255, 0.1);
}

.glass-panel-neon.purpura:hover {
  border-color: rgba(184, 79, 255, 0.6);
  box-shadow: inset 0 0 20px rgba(184, 79, 255, 0.1), 0 0 25px rgba(184, 79, 255, 0.25);
}

/* Credencial Civil */
.credencial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-1);
}

.credencial-chip {
  font-size: 1.2rem;
  color: var(--color-neon-blue);
  filter: drop-shadow(0 0 5px var(--color-neon-blue));
}

.credencial-u-logo {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  color: #fff;
  text-transform: uppercase;
}

.credencial-body-modern {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  background: rgba(0, 212, 255, 0.03);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  position: relative;
  overflow: hidden;
}

.avatar-civil-container {
  width: 90px;
  height: 90px;
  background: rgba(10, 15, 30, 0.8);
  border: 2px solid #00d4ff;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  flex-shrink: 0;
}

.avatar-scanner {
  position: absolute;
  width: 100%;
  height: 3px;
  background: #00d4ff;
  box-shadow: 0 0 10px #00d4ff;
  top: 0;
  animation: scan-animation-civil 2.5s infinite linear;
}

@keyframes scan-animation-civil {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.avatar-civil-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.5));
}

.civil-identity-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.civil-name {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 1.25rem;
  color: #ffffff;
  margin: 0 0 2px 0;
  font-weight: 800;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.civil-age {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.hologram-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px);
  background-size: 8px 8px;
  pointer-events: none;
}

.civil-badges-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.badge-item-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 15, 30, 0.75);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: 0.75rem;
}

.badge-item-hero.cian {
  border-left: 3px solid #00d4ff;
}

.badge-item-hero .badge-label {
  color: var(--color-text-secondary);
  font-weight: bold;
  letter-spacing: 0.05em;
}

.badge-item-hero .badge-value {
  color: #ffffff;
  font-weight: 800;
  text-shadow: 0 0 5px rgba(0, 212, 255, 0.4);
}

/* Licencia de Héroe (Tarjeta Derecha) */
.licencia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(184, 79, 255, 0.15);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-1);
}

.licencia-title-badge {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-neon-purple);
  text-shadow: 0 0 5px var(--color-neon-purple-glow);
}

.licencia-serial {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  font-family: monospace;
}

.hero-identity-body {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: rgba(157, 78, 221, 0.03);
  border: 1px solid rgba(157, 78, 221, 0.15);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}

.medalla-visual-heroe {
  width: 60px;
  height: 60px;
  background: rgba(10, 15, 30, 0.85);
  border: 2px solid #ffd700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  flex-shrink: 0;
}

.medalla-emoji {
  font-size: 2.2rem;
  z-index: 2;
}

.medalla-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid #ffd700;
  opacity: 0.6;
  animation: pulse-ring-medalla 2s infinite ease-in-out;
}

@keyframes pulse-ring-medalla {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
}

.hero-identity-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.hero-alias-destacado {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-size: 1.35rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 0 10px rgba(157, 78, 221, 0.8);
}

.hero-titulo-destacado {
  font-size: 0.85rem;
  color: var(--color-neon-gold);
  font-weight: bold;
  margin: 2px 0 0 0;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
}

.panel-de-rango-neon {
  background: linear-gradient(90deg, rgba(30, 94, 255, 0.25), rgba(157, 78, 221, 0.25));
  border: 1.5px solid #9d4edd;
  border-radius: var(--radius-md);
  padding: var(--space-2);
  text-align: center;
  box-shadow: 0 0 12px rgba(157, 78, 221, 0.3), inset 0 0 8px rgba(157, 78, 221, 0.15);
}

.rango-badge-text {
  font-family: 'Orbitron', var(--font-display), sans-serif;
  font-weight: var(--font-bold);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffffff;
  text-shadow: 0 0 6px rgba(157, 78, 221, 0.6);
}

.hero-licencia-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin: 0;
}

.detail-row .lbl {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.detail-row .val {
  color: var(--color-text-primary);
  font-weight: 700;
  text-align: right;
}

/* Track de Sospecha Secreta (Licencia) */
.progreso-sospecha-licencia {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.sospecha-meta-licencia {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sospecha-meta-licencia .lbl {
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--color-text-secondary);
}

.sospecha-rango-badge-mini {
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: uppercase;
}
.sospecha-rango-badge-mini.segura { color: var(--color-neon-green); }
.sospecha-rango-badge-mini.rumores { color: var(--color-neon-gold); }
.sospecha-rango-badge-mini.alta { color: #ff8c00; }
.sospecha-rango-badge-mini.investigacion { color: #ff4646; }

.barra-sospecha-licencia {
  height: 5px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-block: 2px;
}

.barra-sospecha-relleno-licencia {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}
.barra-sospecha-relleno-licencia.segura { background: var(--color-neon-green); box-shadow: 0 0 5px var(--color-neon-green-glow); }
.barra-sospecha-relleno-licencia.rumores { background: var(--color-neon-gold); box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
.barra-sospecha-relleno-licencia.alta { background: #ff8c00; box-shadow: 0 0 5px rgba(255, 140, 0, 0.5); }
.barra-sospecha-relleno-licencia.investigacion { background: #ff4646; box-shadow: 0 0 5px rgba(255, 70, 70, 0.5); }

/* --- Módulo de Estadísticas --- */
.estadisticas-dashboard-seccion {
  grid-column: span 2;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin-top: var(--space-2);
}

@media (max-width: 768px) {
  .estadisticas-dashboard-seccion {
    grid-column: span 1;
  }
}

.estadisticas-dashboard-seccion h3 {
  margin: 0 0 var(--space-3) 0;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: var(--space-2);
}

.estadisticas-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
}

.stat-dashboard-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: all var(--transition-base);
  outline: none;
}

.stat-dashboard-card:hover,
.stat-dashboard-card:focus-visible {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  font-weight: bold;
}

.stat-icon {
  font-size: 1rem;
}

.stat-name {
  color: var(--color-text-secondary);
  flex-grow: 1;
  text-align: left;
}

.stat-value {
  font-family: var(--font-display);
  font-weight: 800;
}

.stat-bar-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.1, 0.8, 0.2, 1);
}

/* Custom glows y bar colors */
.energy-card:hover,
.energy-card:focus-visible {
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.15);
  border-color: rgba(255, 170, 0, 0.3);
}
.energy-card .stat-bar-fill {
  background: linear-gradient(90deg, #ff7700, #ffaa00);
  box-shadow: 0 0 8px rgba(255, 170, 0, 0.6);
}
.energy-card .stat-value {
  color: #ffaa00;
}

.knowledge-card:hover,
.knowledge-card:focus-visible {
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.15);
  border-color: rgba(0, 200, 255, 0.3);
}
.knowledge-card .stat-bar-fill {
  background: linear-gradient(90deg, #0088ff, #00c8ff);
  box-shadow: 0 0 8px rgba(0, 200, 255, 0.6);
}
.knowledge-card .stat-value {
  color: #00c8ff;
}

.fun-card:hover,
.fun-card:focus-visible {
  box-shadow: 0 0 10px rgba(240, 0, 255, 0.15);
  border-color: rgba(240, 0, 255, 0.3);
}
.fun-card .stat-bar-fill {
  background: linear-gradient(90deg, #b833ff, #f000ff);
  box-shadow: 0 0 8px rgba(240, 0, 255, 0.6);
}
.fun-card .stat-value {
  color: #f000ff;
}

.responsibility-card:hover,
.responsibility-card:focus-visible {
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.15);
  border-color: rgba(0, 255, 136, 0.3);
}
.responsibility-card .stat-bar-fill {
  background: linear-gradient(90deg, #00cc66, #00ff88);
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
}
.responsibility-card .stat-value {
  color: #00ff88;
}

.reputation-card:hover,
.reputation-card:focus-visible {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.3);
}
.reputation-card .stat-bar-fill {
  background: linear-gradient(90deg, #cc9900, #ffd700);
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}
.reputation-card .stat-value {
  color: #ffd700;
}

.tarjeta-info.mision-reciente {
  grid-column: span 2;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.02);
  box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.03);
}

@media (max-width: 768px) {
  .tarjeta-info.mision-reciente {
    grid-column: span 1;
  }
}

.tarjeta-info.mision-reciente h3 {
  color: var(--color-neon-gold) !important;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding-bottom: var(--space-2);
}

.grid-mision-reciente {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-2);
}

.btn-editar-perfil-centro {
  margin-inline: auto;
  min-width: 200px;
}

/* --- Formulario de Edición --- */
.formulario-edicion-centro {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: left;
}

.form-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group-edicion {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group-edicion label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.input-formulario-edicion,
.select-formulario-edicion {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  padding: var(--space-3);
  font-size: var(--text-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input-formulario-edicion:focus,
.select-formulario-edicion:focus {
  border-color: var(--color-neon-purple);
}

.error-edicion {
  color: #ff4646;
  font-size: 0.75rem;
}

.informacion-bloqueada-centro {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.acciones-edicion {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  margin-top: var(--space-2);
}

/* --- Pestaña: Progreso / Mochila --- */
.seccion-progreso-scroll,
.seccion-mochila-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  text-align: left;
}

.progreso-provincias-ruta h4,
.progreso-bloque h4,
.inventario-bloque h4 {
  margin: 0 0 var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-neon-blue);
  border-bottom: 1px solid rgba(0, 200, 255, 0.1);
  padding-bottom: 6px;
}

.ruta-lista {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

.ruta-nodo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  opacity: 0.5;
  transition: opacity var(--transition-base);
}

.ruta-nodo.completado {
  opacity: 1;
}

.ruta-nodo.activo-desbloqueado {
  opacity: 1;
}

.nodo-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.completado .nodo-check {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  box-shadow: 0 0 5px var(--color-neon-green-glow);
}

.activo-desbloqueado .nodo-check {
  background: rgba(255, 215, 0, 0.15);
  border-color: var(--color-neon-gold);
  color: var(--color-neon-gold);
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

.nodo-texto {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.nodo-nombre {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.nodo-estado {
  font-size: 0.65rem;
  color: var(--color-text-secondary);
}

.hitos-grid,
.logros-grid,
.mochila-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-3);
}

.hito-card,
.logro-card,
.item-mochila-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-size: var(--text-xs);
  transition: all 0.2s ease;
}

.hito-card:hover,
.logro-card:hover,
.item-mochila-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

.hito-card { border-left: 3px solid var(--color-neon-blue); }
.logro-card { border-left: 3px solid var(--color-neon-gold); }
.item-mochila-card { border-left: 3px solid var(--color-neon-purple); }
.item-mochila-card.after-recuerdo { border-left-color: var(--color-neon-green); }

.vacio-texto {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0;
}

.calendario-basico {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: var(--text-sm);
}

.barra-calendario-semana {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-block: var(--space-3);
}

.barra-calendario-relleno {
  height: 100%;
  background: linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple));
  border-radius: var(--radius-full);
}

.nota-calendario {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* --- Pestaña: Opciones --- */
.opciones-contenido {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  text-align: center;
  max-width: 420px;
  margin-inline: auto;
  padding-block: var(--space-4);
}

.opciones-intro {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.opciones-botones-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cargar-seccion {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.save-advertencia {
  color: #ff4646;
  font-size: 0.75rem;
  margin: 0;
  font-weight: var(--font-semibold);
}

.btn-guardar-manual {
  background: linear-gradient(135deg, #7b2cbf 0%, #ff007f 100%) !important;
  border-color: #ff007f !important;
}

.feedback-notif {
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  margin-top: var(--space-2);
  animation: fadeIn 0.3s ease;
}

.feedback-notif.exito {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: var(--color-neon-green);
}

.feedback-notif.error {
  background: rgba(255, 70, 70, 0.08);
  border: 1px solid rgba(255, 70, 70, 0.3);
  color: #ff4646;
}

/* --- Pestaña: Audio --- */
.seccion-audio {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.audio-config-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.audio-intro {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  text-align: left;
}

.control-grupo-audio {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .control-grupo-audio {
    grid-template-columns: 1fr;
  }
}

.control-fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.control-columna-audio {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.control-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-align: left;
}

.control-icono {
  font-size: 1.5rem;
  line-height: 1;
}

.control-texto {
  display: flex;
  flex-direction: column;
}

.control-label {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.control-subtexto {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.switch-neon {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}

.switch-neon input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-neon {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: .4s;
  border-radius: 34px;
}

.slider-neon:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: var(--color-text-secondary);
  transition: .4s;
  border-radius: 50%;
}

.switch-neon input:checked + .slider-neon {
  border-color: var(--color-neon-purple);
  box-shadow: 0 0 8px var(--color-neon-purple);
}

.switch-neon input:checked + .slider-neon:before {
  transform: translateX(24px);
  background-color: var(--color-neon-purple);
  box-shadow: 0 0 6px var(--color-neon-purple);
}

.slider-contenedor-neon {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.deshabilitado-opaco {
  opacity: 0.35;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.rango-neon {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.rango-neon::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-neon-blue);
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 8px var(--color-neon-blue);
  transition: transform 0.1s ease;
}

.rango-neon::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.rango-neon::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-neon-blue);
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 8px var(--color-neon-blue);
  transition: transform 0.1s ease;
}

.rango-neon::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.barra-progreso-rango {
  position: absolute;
  left: 0;
  height: 8px;
  background: var(--color-neon-blue);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  z-index: 1;
  pointer-events: none;
  box-shadow: 0 0 6px var(--color-neon-blue);
}

/* --- Pestaña: Ranking --- */
.seccion-ranking {
  display: flex;
  flex-direction: column;
}

.seccion-ranking-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: left;
}

.ranking-intro {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.tabla-ranking-contenedor {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.tabla-ranking {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: var(--text-sm);
}

.tabla-ranking th,
.tabla-ranking td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.tabla-ranking th {
  font-family: var(--font-display);
  color: var(--color-neon-blue);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0.2);
}

.tabla-ranking tr:hover {
  background: rgba(255, 255, 255, 0.01);
}

.tabla-ranking tr.puesto-1 {
  background: rgba(255, 215, 0, 0.03);
}

.tabla-ranking tr.puesto-1 td.col-heroe {
  color: var(--color-neon-gold);
}

.col-puesto {
  font-weight: bold;
  text-align: center;
  width: 60px;
}

.score-badge {
  background: rgba(184, 79, 255, 0.15);
  border: 1px solid rgba(184, 79, 255, 0.3);
  color: #d896ff;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: bold;
  margin-right: 6px;
}

.score-percent {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.col-fecha {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.ranking-vacio {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: rgba(255, 255, 255, 0.01);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}

.ranking-vacio .vacio-subtexto {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-2);
}

/* --- Fondo Vivo Operaciones --- */
.fondo-vivo-operaciones {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.nebulosa {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  mix-blend-mode: screen;
  animation: pulse-glow 15s infinite alternate ease-in-out;
}

.nebulosa-cian {
  top: -10%;
  left: 20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--color-neon-blue-glow) 0%, transparent 70%);
}

.nebulosa-purpura {
  bottom: -10%;
  right: 15%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, var(--color-neon-purple-glow) 0%, transparent 70%);
  animation-delay: -5s;
}

@keyframes pulse-glow {
  0% { transform: scale(1) translate(0, 0); opacity: 0.1; }
  100% { transform: scale(1.3) translate(20px, -20px); opacity: 0.22; }
}

.futuristic-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 200, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  mask-image: radial-gradient(circle, black 40%, transparent 90%);
  -webkit-mask-image: radial-gradient(circle, black 40%, transparent 90%);
}

.particulas-lentas {
  position: absolute;
  inset: 0;
}

.p-lenta {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.3;
  box-shadow: 0 0 6px #fff;
}

.pl1 { top: 20%; left: 15%; animation: float-slow 20s infinite linear; }
.pl2 { top: 50%; left: 85%; animation: float-slow 25s infinite linear -4s; }
.pl3 { top: 80%; left: 25%; animation: float-slow 18s infinite linear -8s; }
.pl4 { top: 15%; left: 75%; animation: float-slow 22s infinite linear -12s; }
.pl5 { top: 65%; left: 45%; animation: float-slow 30s infinite linear -16s; }
.pl6 { top: 85%; left: 70%; animation: float-slow 24s infinite linear -20s; }

@keyframes float-slow {
  0% { transform: translateY(0) scale(1); opacity: 0.2; }
  50% { transform: translateY(-30px) scale(1.2); opacity: 0.5; }
  100% { transform: translateY(-60px) scale(1); opacity: 0.2; }
}
</style>
