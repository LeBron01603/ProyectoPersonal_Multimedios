<template>
  <!-- PiePaginaApp: pie de página con info del proyecto y curso -->
  <footer class="pie-pagina-app">
    <div class="footer-inner container">
      <!-- Info del proyecto -->
      <div class="footer-brand">
        <span class="footer-icon">🦸</span>
        <div>
          <p class="footer-title">Ruta Tica: El Héroe del After</p>
          <p class="footer-course">IF7102 Multimedios · Opción 5: Juego Educativo</p>
        </div>
      </div>

      <!-- Separador decorativo -->
      <div class="footer-divider" aria-hidden="true">
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
      </div>

      <!-- Nota del juego -->
      <p class="footer-note">
        🌿 Juega con responsabilidad. La verdadera energía viene del conocimiento y el equilibrio.
      </p>

      <!-- Info legal/académica -->
      <p class="footer-legal">
        Proyecto académico · Vue 3 + Vite · UCR · 2026
      </p>
    </div>
  </footer>
</template>

<script setup>
// PiePaginaApp es un componente de presentación puro.
// No necesita props ni estado reactivo en esta versión.
</script>

<style scoped>
.pie-pagina-app {
  margin-top: auto;
  background: rgba(10, 14, 26, 0.90);
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-5);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.footer-icon {
  font-size: 1.6rem;
}

.footer-title {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: var(--color-neon-green);
  letter-spacing: 0.03em;
  margin: 0;
}

.footer-course {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

/* Separador decorativo */
.footer-divider {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  max-width: 300px;
}

.divider-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-neon-green);
  box-shadow: 0 0 6px var(--color-neon-green-glow);
  flex-shrink: 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--color-neon-green), transparent, var(--color-neon-green));
}

.footer-note {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0;
}

.footer-legal {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  margin: 0;
}
</style>
