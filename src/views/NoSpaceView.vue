<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const COOLDOWN_MS = 48 * 60 * 60 * 1000

const hoursLeft = ref(0)

const contactName = computed(() => {
  try {
    const stored = localStorage.getItem('os_contact')
    if (!stored) return ''
    return JSON.parse(stored).nombre ?? ''
  } catch { return '' }
})

onMounted(() => {
  const osDisqAt = localStorage.getItem('os_disq_at')
  if (osDisqAt) {
    const elapsed = Date.now() - Number(osDisqAt)
    const remaining = COOLDOWN_MS - elapsed
    if (remaining > 0) {
      hoursLeft.value = Math.ceil(remaining / (60 * 60 * 1000))
    }
  }
})
</script>

<template>
  <div class="nospace">

    <!-- TOP BAR -->
    <header class="nospace__topbar">
      <h2 class="nospace__logo-text">POWERHOUSE BIOTECH</h2>
    </header>

    <main class="nospace__main">

      <!-- Cooldown notice -->
      <div v-if="hoursLeft > 0" class="nospace__cooldown" role="alert">
        <i class="fa-solid fa-clock" aria-hidden="true"></i>
        <span>
          <template v-if="contactName">{{ contactName }}, podrás</template>
          <template v-else>Podrás</template>
          volver y solicitar una nueva consulta en
          <strong>{{ hoursLeft }} hora{{ hoursLeft !== 1 ? 's' : '' }}</strong>
        </span>
      </div>

      <!-- Main message -->
      <div class="nospace__card">
        <div class="nospace__icon-wrap" aria-hidden="true">
          <i class="fa-solid fa-calendar-xmark nospace__icon"></i>
        </div>
        <h1 class="nospace__title">Por ahora, no calificas para la consulta presencial</h1>
        <p class="nospace__subtitle">
          Solo aceptamos el 20% de las aplicaciones. En este momento tu perfil no coincide
          con los criterios de Juan Román Garza para una Evaluación de Viabilidad Regenerativa™
          en Polanco. No es un rechazo permanente — es criterio honesto para ahorrarte tiempo y dinero.
        </p>
      </div>

      <!-- Next steps -->
      <div class="nospace__steps">
        <p class="nospace__steps-title">¿Qué puedes hacer ahora?</p>
        <ul class="nospace__steps-list" role="list">
          <li>
            <div class="nospace__step-icon" aria-hidden="true">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div>
              <strong>Revisa tu email</strong>
              <p>Te notificaremos cuando se libere un espacio en la agenda de PowerHouse Biotech.</p>
            </div>
          </li>
          <li>
            <div class="nospace__step-icon" aria-hidden="true">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <strong>Caso urgente</strong>
              <p>Si tu salud requiere atención inmediata, escríbenos por WhatsApp para revisar manualmente tu caso. No reemplazamos al médico tratante — orientamos decisiones clínicas.</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Teaser -->
      <div class="nospace__teaser">
        <div class="nospace__teaser-badge">
          <i class="fa-solid fa-book-medical" aria-hidden="true"></i>
          Próximamente
        </div>
        <h2 class="nospace__teaser-title">Guía: Cómo prepararte para una terapia regenerativa</h2>
        <p class="nospace__teaser-body">
          Estamos preparando una guía clínica con los pasos básicos para preparar a tu cuerpo
          antes de iniciar cualquier terapia regenerativa — sin necesidad de llamar a un especialista.
        </p>
      </div>

      <div class="nospace__back">
        <RouterLink to="/" class="nospace__back-link">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al inicio
        </RouterLink>
      </div>

    </main>

    <footer class="nospace__footer">
      <nav class="nospace__footer-links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="nospace__footer-copy">© {{ new Date().getFullYear() }} POWERHOUSE BIOTECH. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.nospace {
  min-height: 100vh;
  background: #ffffff;
  color: colors.$OS-DARK;
  display: flex;
  flex-direction: column;
}

.nospace__topbar {
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

.nospace__logo { height: 36px; width: auto; object-fit: contain; }

.nospace__main {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nospace__cooldown {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(colors.$OS-BLUE, 0.06);
  border: 1px solid rgba(colors.$OS-BLUE, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.84rem;
  color: colors.$OS-NAVY;
  i { color: colors.$OS-BLUE; flex-shrink: 0; }
  strong { font-weight: 700; }
}

.nospace__card {
  background: #F9FBFF;
  border: 1px solid #E4EDF7;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
}

.nospace__icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(colors.$OS-RED, 0.07);
  border: 1.5px solid rgba(colors.$OS-RED, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.nospace__icon {
  font-size: 2.4rem;
  color: rgba(colors.$OS-RED, 0.7);
  line-height: 1;
}

.nospace__title {
  @include fonts.heading-font(800);
  font-size: 1.5rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.nospace__subtitle {
  font-size: 0.9rem;
  color: #4A5F7A;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 420px;
}

.nospace__steps {
  background: #F5F8FF;
  border: 1px solid #E4EDF7;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
}

.nospace__steps-title {
  font-family: fonts.$font-interface;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: colors.$OS-NAVY;
  margin: 0 0 1rem;
}

.nospace__steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    strong { display: block; font-size: 0.9rem; color: colors.$OS-DARK; margin-bottom: 0.2rem; }
    p { font-size: 0.83rem; color: #4A5F7A; line-height: 1.5; margin: 0; }
  }
}

.nospace__step-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i { color: #ffffff; font-size: 1rem; }
}

.nospace__teaser {
  background: #F9FBFF;
  border: 1.5px solid rgba(colors.$OS-NAVY, 0.15);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 63, 125, 0.06);
}

.nospace__teaser-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.28rem 0.75rem;
  border-radius: 999px;
  background: rgba(colors.$OS-NAVY, 0.07);
  border: 1px solid rgba(colors.$OS-NAVY, 0.18);
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  font-weight: 700;
  color: colors.$OS-NAVY;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.85rem;
  i { font-size: 0.68rem; }
}

.nospace__teaser-title {
  @include fonts.heading-font(700);
  font-size: 1.05rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.5rem;
}

.nospace__teaser-body {
  font-size: 0.85rem;
  color: #4A5F7A;
  line-height: 1.6;
  margin: 0;
}

.nospace__back { display: flex; justify-content: center; }

.nospace__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.86rem;
  color: colors.$OS-NAVY;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  &:hover { color: colors.$OS-BLUE; }
  i { font-size: 0.78rem; }
}

.nospace__footer {
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
