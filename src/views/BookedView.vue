<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ── Contact name from localStorage ───────────────────────────────────────────
const contactName = computed(() => {
  try {
    const stored = localStorage.getItem('os_contact')
    if (!stored) return ''
    return JSON.parse(stored).nombre ?? ''
  } catch { return '' }
})

// ── ¿Visitante que regresa? (booking > 10 min) ───────────────────────────────
const RETURNING_THRESHOLD_MS = 10 * 60 * 1000
const isReturningVisitor = computed(() => {
  const ts = Number(localStorage.getItem('os_booked_at') ?? 0)
  if (!ts) return false
  return Date.now() - ts > RETURNING_THRESHOLD_MS
})

// ── Fire fbq CompleteRegistration once ───────────────────────────────────────
onMounted(() => {
  const alreadyFired = sessionStorage.getItem('os_complete_fired')
  if (!alreadyFired) {
    ;(window as any).fbq?.('track', 'CompleteRegistration', {
      content_name: 'consulta-agendada',
    })
    sessionStorage.setItem('os_complete_fired', '1')
  }
})

const nextSteps = [
  {
    icon: 'fa-solid fa-envelope',
    title: 'Revisa tu email',
    body: 'Te enviamos la confirmación de tu Consulta Informativa con todos los detalles.',
  },
  {
    icon: 'fa-brands fa-whatsapp',
    title: 'Te contactamos por WhatsApp',
    body: 'Un miembro del equipo médico te escribirá para confirmar la cita y solicitar tus laboratorios recientes (si los tienes).',
  },
  {
    icon: 'fa-solid fa-vials',
    title: 'Prepara tu historial clínico',
    body: 'Ten a mano antecedentes médicos relevantes y exámenes recientes (<6 meses si es posible). Eso acelera la Evaluación.',
  },
]
</script>

<template>
  <div class="booked">

    <!-- TOP BAR -->
    <header class="booked__topbar">
      <h2 class="booked__logo-text">POWERHOUSE BIOTECH</h2>
    </header>

    <main class="booked__main">

      <!-- Success hero -->
      <section class="booked__hero">
        <div class="booked__hero-icon" aria-hidden="true">
          <i class="fa-solid fa-circle-check"></i>
        </div>

        <!-- Visitante que regresa: ya tiene cita -->
        <template v-if="isReturningVisitor">
          <p class="booked__hero-eyebrow">
            <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
            Ya tienes una cita agendada
          </p>
          <h1 class="booked__hero-title">
            <template v-if="contactName">
              {{ contactName }}, ya tenemos tu cita reservada
            </template>
            <template v-else>
              Ya tenemos tu cita reservada
            </template>
          </h1>
          <p class="booked__hero-subtitle">
            Tu Consulta Informativa de Evaluación de Viabilidad Regenerativa™ está confirmada.
            Revisa tu correo o WhatsApp para todos los detalles. Si necesitas reagendar, escríbenos por WhatsApp.
          </p>
        </template>

        <!-- Recién agendado -->
        <template v-else>
          <h1 class="booked__hero-title">
            <template v-if="contactName">
              ¡Listo, {{ contactName }}!
            </template>
            <template v-else>
              ¡Tu consulta está confirmada!
            </template>
          </h1>
          <p class="booked__hero-subtitle">
            Tu Consulta Informativa de Evaluación de Viabilidad Regenerativa™ ha sido agendada
            correctamente. En breve recibirás todos los detalles para preparar la sesión.
          </p>
        </template>
      </section>

      <!-- What to expect -->
      <section class="booked__steps" aria-labelledby="steps-heading">
        <p id="steps-heading" class="booked__steps-label">Próximos pasos</p>
        <div class="booked__steps-grid">
          <div v-for="(step, i) in nextSteps" :key="i" class="booked__step">
            <div class="booked__step-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="booked__step-icon" aria-hidden="true">
              <i :class="step.icon"></i>
            </div>
            <h3 class="booked__step-title">{{ step.title }}</h3>
            <p class="booked__step-body">{{ step.body }}</p>
          </div>
        </div>
      </section>

      <!-- Team card — PowerHouse Biotech -->
      <section class="booked__team" aria-labelledby="team-heading">
        <p id="team-heading" class="booked__team-label">Tu especialista</p>
        <div class="booked__team-card">
          <div class="booked__team-avatar" aria-hidden="true">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <div class="booked__team-info">
            <strong class="booked__team-name">PowerHouse Biotech</strong>
            <span class="booked__team-role">Equipo médico evaluador — Medicina Regenerativa</span>
            <p class="booked__team-note">
              "La medicina regenerativa no es para todos. Saber a tiempo qué se puede mejorar y qué no, vale más que cualquier promesa."
            </p>
          </div>
        </div>
      </section>

      <!-- Disclaimer -->
      <p class="booked__disclaimer">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        Los porcentajes y casos mencionados en el video son resultados clínicos agregados. Cada caso es único y los resultados dependen de la condición, edad, antecedentes y respuesta individual del paciente. PowerHouse Biotech no garantiza resultados clínicos ni reemplaza al médico tratante. Toda terapia regenerativa debe realizarse bajo supervisión médica especializada y con consentimiento informado.
      </p>

    </main>

    <footer class="booked__footer">
      <nav class="booked__footer-links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="booked__footer-copy">© {{ new Date().getFullYear() }} POWERHOUSE BIOTECH. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.booked {
  min-height: 100vh;
  background: #ffffff;
  color: colors.$OS-DARK;
  display: flex;
  flex-direction: column;
}

.booked__topbar {
  background: #ffffff;
  border-bottom: 1px solid #E8EDF5;
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}

.booked__logo { height: 36px; width: auto; object-fit: contain; }

.booked__main {
  flex: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

// ── Hero ─────────────────────────────────────────────────────────────────────
.booked__hero {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #EEF4FF 0%, #F9FBFF 100%);
  border: 1px solid #E4EDF7;
  border-radius: 20px;
}

.booked__hero-icon {
  font-size: 3.5rem;
  color: colors.$OS-BLUE;
  margin-bottom: 1rem;
  line-height: 1;
}

.booked__hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(colors.$AB-SAGE, 0.14);
  color: colors.$AB-SAGE;
  border: 1px solid rgba(colors.$AB-SAGE, 0.3);
  border-radius: 999px;
  padding: 0.4rem 0.95rem;
  margin: 0 0 0.85rem;
  font-family: fonts.$font-interface;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  i { font-size: 0.78rem; }
}

.booked__hero-title {
  @include fonts.heading-font(800);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: colors.$OS-DARK;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
}

.booked__hero-subtitle {
  font-size: 0.95rem;
  color: #4A5F7A;
  line-height: 1.65;
  margin: 0 auto;
  max-width: 460px;
}

// ── Steps ────────────────────────────────────────────────────────────────────
.booked__steps-label,
.booked__team-label {
  font-family: fonts.$font-interface;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: colors.$OS-NAVY;
  margin: 0 0 1.25rem;
}

.booked__steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 620px) { grid-template-columns: 1fr; }
}

.booked__step {
  background: #F9FBFF;
  border: 1px solid #E4EDF7;
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 63, 125, 0.04);
}

.booked__step-num {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  @include fonts.heading-font(800);
  font-size: 2rem;
  color: rgba(colors.$OS-NAVY, 0.07);
  line-height: 1;
  user-select: none;
}

.booked__step-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  i { color: #ffffff; font-size: 1rem; }
}

.booked__step-title {
  @include fonts.heading-font(700);
  font-size: 0.93rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.4rem;
}

.booked__step-body {
  font-size: 0.83rem;
  color: #4A5F7A;
  line-height: 1.5;
  margin: 0;
}

// ── Team ─────────────────────────────────────────────────────────────────────
.booked__team-card {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  background: #F5F8FF;
  border: 1px solid rgba(colors.$OS-NAVY, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  @media (max-width: 480px) { flex-direction: column; align-items: center; text-align: center; }
}

.booked__team-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 3px solid #ffffff;
  box-shadow: 0 3px 12px rgba(0, 63, 125, 0.15);
  i { color: rgba(#ffffff, 0.85); font-size: 2rem; }
}

.booked__team-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.booked__team-name {
  @include fonts.heading-font(700);
  font-size: 1.05rem;
  color: colors.$OS-DARK;
}

.booked__team-role {
  font-size: 0.8rem;
  color: #8A9BB5;
}

.booked__team-note {
  margin: 0.5rem 0 0;
  font-size: 0.86rem;
  color: #3A4F6A;
  font-style: italic;
  line-height: 1.55;
}

// ── Disclaimer ───────────────────────────────────────────────────────────────
.booked__disclaimer {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  font-size: 0.76rem;
  color: #A0B0C5;
  line-height: 1.55;
  margin: 0;
  i { font-size: 0.8rem; flex-shrink: 0; margin-top: 1px; color: #C0D0E0; }
}

// ── Footer ───────────────────────────────────────────────────────────────────
.booked__footer {
  padding: 1.5rem;
  border-top: 1px solid #F0F4FB;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &-links {
    display: flex;
    gap: 1.5rem;
    a { font-size: 0.76rem; color: #B0C0D5; text-decoration: none; &:hover { color: colors.$OS-NAVY; } }
  }
  &-copy { font-size: 0.72rem; color: #C8D8ED; margin: 0; }
}
</style>
