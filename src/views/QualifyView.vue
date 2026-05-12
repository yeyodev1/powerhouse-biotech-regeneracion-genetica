<script setup lang="ts">
import { ref } from 'vue'
import CalendarModal from '@/components/CalendarModal.vue'
import romanPhoto from '@/assets/team/image.png'

const calendarOpen = ref(false)
</script>

<template>
  <div class="vv-page">

    <!-- Top bar -->
    <header class="vv-topbar">
      <h2 class="vv-topbar__logo-text">POWERHOUSE BIOTECH</h2>
    </header>

    <!-- Main content -->
    <main class="vv-main">

      <!-- Headline -->
      <section class="vv-headline">
        <p class="vv-eyebrow">
          <i class="fa-solid fa-dna" aria-hidden="true"></i>
          Calificación clínica
        </p>
        <h1 class="vv-h1">
          Responde unas preguntas y
          <span class="vv-accent">descubre si calificas</span>
        </h1>
        <p class="vv-subtitle">
          Juan Román Garza evaluará tu caso en base a tu zona, tu perfil y tu motivo de consulta.
          Solo el 20% de los solicitantes califica — honestidad clínica ante todo.
        </p>
      </section>

      <!-- CTA section -->
      <div class="vv-cta-section">
        <button class="vv-cta-btn" @click="calendarOpen = true">
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
          INICIAR MI EVALUACIÓN
        </button>
        <p class="vv-cta-sub">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          Sin costo &nbsp;·&nbsp; Solo 20% aceptados &nbsp;·&nbsp; Confidencial
        </p>
      </div>

      <!-- Authority section — Juan Román Garza -->
      <section class="vv-authority" aria-labelledby="authority-heading">
        <div class="vv-authority__inner">
          <div class="vv-authority__photo-wrap">
            <div class="vv-authority__avatar" aria-hidden="true">
              <img :src="romanPhoto" alt="Juan Román Garza — PowerHouse Biotech" class="vv-authority__img" />
            </div>
          </div>
          <div class="vv-authority__content">
            <p class="vv-authority__eyebrow">Tu especialista evaluador</p>
            <h2 id="authority-heading" class="vv-authority__name">Juan Román Garza</h2>
            <p class="vv-authority__role">Especialista en Medicina Regenerativa · PowerHouse Biotech</p>
            <p class="vv-authority__bio">
              Especialista en medicina regenerativa con más de 20 años de experiencia clínica.
              Ha evaluado a miles de pacientes en CDMX y Latinoamérica, aplicando criterio
              regenerativo honesto: no vende terapias, evalúa viabilidad. Su consultorio en
              Polanco es referente para quienes buscan respuestas reales, no promesas vacías.
            </p>
            <ul class="vv-authority__creds" role="list">
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> +15,000 pacientes evaluados con criterio regenerativo</li>
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Interpretación cruzada de biomarcadores</li>
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Solo acepta pacientes con probabilidad real de respuesta</li>
            </ul>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="vv-footer">
      <nav class="vv-footer__links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="vv-footer__copy">© {{ new Date().getFullYear() }} POWERHOUSE BIOTECH. Todos los derechos reservados.</p>
    </footer>

  </div>

  <!-- Calendar modal -->
  <CalendarModal :open="calendarOpen" @close="calendarOpen = false" />
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.vv-page {
  min-height: 100vh;
  background: #ffffff;
  color: colors.$OS-DARK;
  display: flex;
  flex-direction: column;
}

.vv-topbar {
  background: #ffffff;
  border-bottom: 1px solid #E8EDF5;
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);

  &__logo-text {
    font-family: fonts.$font-principal;
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
    color: colors.$OS-NAVY;
    margin: 0;
  }
}

.vv-main {
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  width: 100%;
}

.vv-stepper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;

  &__pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #F5F8FF;
    border: 1px solid #E4EDF7;
    border-radius: 999px;
    padding: 0.4rem 1rem;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #D0DBE8;
    transition: background 0.2s;

    &--active { background: colors.$OS-NAVY; }
  }

  &__label {
    font-family: fonts.$font-interface;
    font-size: 0.78rem;
    font-weight: 600;
    color: #7A8EA5;
    letter-spacing: 0.03em;
  }
}

.vv-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: fonts.$font-interface;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: colors.$OS-NAVY;
  margin: 0 0 0.75rem;
  i { font-size: 0.75rem; }
}

.vv-headline { margin-bottom: 1.75rem; }

.vv-h1 {
  @include fonts.heading-font(800);
  font-size: clamp(1.7rem, 4vw, 2.5rem);
  color: colors.$OS-DARK;
  line-height: 1.2;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
}

.vv-accent { color: colors.$OS-RED; }

.vv-subtitle {
  font-size: 0.95rem;
  color: #4A5F7A;
  line-height: 1.6;
  margin: 0;
}

// ── CTA section ──────────────────────────────────────────────────────────────
.vv-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.vv-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: colors.$OS-RED;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 1.1rem 2.5rem;
  font-family: fonts.$font-accent;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  width: 100%;
  max-width: 420px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(204, 0, 0, 0.35);

  &:hover { background: #AA0000; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(204, 0, 0, 0.45); }
  &:active { transform: translateY(0); }
}

.vv-cta-sub {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: #B0C0D5;
  margin: 0;
  i { font-size: 0.7rem; }
}

// ── Authority ────────────────────────────────────────────────────────────────
.vv-authority {
  margin-top: 3.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #F5F8FF 0%, #ffffff 100%);
  border: 1px solid #E4EDF7;
  border-radius: 20px;
}

.vv-authority__inner {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  @media (max-width: 580px) { flex-direction: column; align-items: center; text-align: center; }
}

.vv-authority__avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 16px rgba(0, 63, 125, 0.15);
  overflow: hidden;
  background: colors.$OS-NAVY;
}

.vv-authority__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vv-authority__eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: colors.$OS-BLUE;
  letter-spacing: 0.05em;
  margin: 0 0 0.25rem;
}

.vv-authority__name {
  @include fonts.heading-font(800);
  font-size: 1.5rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.1rem;
}

.vv-authority__role {
  font-size: 0.8rem;
  color: #8A9BB5;
  margin: 0 0 1rem;
}

.vv-authority__bio {
  font-size: 0.88rem;
  color: #3A4F6A;
  line-height: 1.6;
  margin: 0 0 1.25rem;
  strong { color: colors.$OS-DARK; }
}

.vv-authority__creds {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: #4A5F7A;
    i { color: colors.$OS-BLUE; font-size: 0.75rem; }
    @media (max-width: 580px) { justify-content: center; }
  }
}

// ── Footer ───────────────────────────────────────────────────────────────────
.vv-footer {
  padding: 1.5rem;
  border-top: 1px solid #F0F4FB;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &__links {
    display: flex;
    gap: 1.5rem;
    a {
      font-size: 0.76rem;
      color: #B0C0D5;
      text-decoration: none;
      &:hover { color: colors.$OS-NAVY; }
    }
  }

  &__copy {
    font-size: 0.72rem;
    color: #C8D8ED;
    margin: 0;
  }
}

</style>
