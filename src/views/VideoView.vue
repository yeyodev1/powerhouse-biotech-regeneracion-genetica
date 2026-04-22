<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CalendarModal from '@/components/CalendarModal.vue'
import { trackStage, generateEventId } from '@/utils/ghl'
import { useContactStore } from '@/stores/contact'
import osLogo from '@/assets/logos/logo-small.png'
import robertoPhoto from '@/assets/team/image.png'

const contactStore = useContactStore()

// ── Calendar modal ────────────────────────────────────────────────────────────
const calendarOpen = ref(false)

// ── Contact capture guard ─────────────────────────────────────────────────────
const captureOpen = ref(false)
const captureForm = ref({ nombre: '', apellido: '', empresa: '', email: '', telefono: '' })
const captureErrors = ref<Record<string, string>>({})
const captureTouched = ref<Record<string, boolean>>({})
const captureSubmitting = ref(false)

const validateCapture = () => {
  const e: Record<string, string> = {}
  if (captureForm.value.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre'
  if (captureForm.value.apellido.trim().length < 2) e.apellido = 'Ingresa tu apellido'
  if (captureForm.value.empresa.trim().length < 2) e.empresa = 'Ingresa el nombre de tu proyecto'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captureForm.value.email.trim())) e.email = 'Email inválido'
  if (captureForm.value.telefono.trim().length < 7) e.telefono = 'Teléfono inválido'
  captureErrors.value = e
  return Object.keys(e).length === 0
}

const submitCapture = async () => {
  captureTouched.value = { nombre: true, apellido: true, empresa: true, email: true, telefono: true }
  if (!validateCapture()) return
  captureSubmitting.value = true

  contactStore.save({
    nombre: captureForm.value.nombre.trim(),
    apellido: captureForm.value.apellido.trim(),
    negocio: captureForm.value.empresa.trim(),
    email: captureForm.value.email.trim().toLowerCase(),
    telefono: captureForm.value.telefono.trim(),
  })

  const c = contactStore.get()
  const leadEventId = generateEventId('lead_video')
  trackStage('lead_capturado', {
    nombre: c.nombre,
    apellido: c.apellido,
    negocio: c.negocio,
    email: c.email,
    telefono: c.telefono,
    event_id: leadEventId,
  })
  ;(window as any).fbq?.('track', 'Lead', { content_name: 'video-gate' }, { eventID: leadEventId })
  await new Promise(r => setTimeout(r, 600))
  captureSubmitting.value = false
  captureOpen.value = false
  startTimer()
}

// ── 2-minute countdown (3s en localhost para testing) ────────────────────────
const IS_DEV = window.location.hostname === 'localhost'
const COUNTDOWN_SECONDS = IS_DEV ? 3 : 120
const secondsLeft = ref(COUNTDOWN_SECONDS)
const ctaUnlocked = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = () => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      ctaUnlocked.value = true
      if (timer) clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  // Load Wistia Scripts
  if (!document.getElementById('wistia-player-js')) {
    const s1 = document.createElement('script')
    s1.id = 'wistia-player-js'
    s1.src = 'https://fast.wistia.com/player.js'
    s1.async = true
    document.head.appendChild(s1)
  }
  if (!document.getElementById('wistia-embed-js')) {
    const s2 = document.createElement('script')
    s2.id = 'wistia-embed-js'
    s2.src = 'https://fast.wistia.com/embed/5ql8l131me.js'
    s2.async = true
    s2.type = 'module'
    document.head.appendChild(s2)
  }

  const c = contactStore.get()
  const hasContact = !!c.email && !!c.nombre
  if (!IS_DEV && !hasContact) {
    captureOpen.value = true
  } else {
    ;(window as any).fbq?.('track', 'ViewContent', { content_name: 'video-vsl' })
    startTimer()
  }
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="vv-page">

    <!-- Top bar -->
    <header class="vv-topbar">
      <h2 class="vv-topbar__logo-text">ALE BARRETO</h2>
    </header>

    <!-- Main content -->
    <main class="vv-main">

      <!-- Progress stepper -->
      <div class="vv-stepper" aria-label="Paso 1 de 2">
        <span class="vv-stepper__pill">
          <span class="vv-stepper__dot vv-stepper__dot--active" aria-current="step"></span>
          <span class="vv-stepper__dot"></span>
          <span class="vv-stepper__label">Paso 1 de 2</span>
        </span>
      </div>

      <!-- Headline -->
      <section class="vv-headline">
        <p class="vv-eyebrow">
          <i class="fa-solid fa-tree" aria-hidden="true"></i>
          Antes de agendar
        </p>
        <h1 class="vv-h1">
          Descubre por qué los proyectos de lujo
          <span class="vv-accent">eligen a Ale Barreto</span>
        </h1>
        <p class="vv-subtitle">
          Ve el video completo. Ale Barreto te explica cómo transformamos espacios con la nobleza de la madera.
        </p>
      </section>

      <!-- Wistia video embed -->
      <div class="vv-video-wrapper">
        <div class="vv-video-ratio">
          <wistia-player media-id="5ql8l131me" aspect="1.7777777777777777"></wistia-player>
        </div>
      </div>

      <!-- CTA section -->
      <div class="vv-cta-section">
        <div v-if="!ctaUnlocked" class="vv-cta-locked" aria-live="polite">
          <i class="fa-solid fa-clock vv-cta-locked__icon" aria-hidden="true"></i>
          <p class="vv-cta-locked__text">
            El botón se habilitará en <strong>{{ formattedTime() }}</strong>
          </p>
          <div class="vv-cta-locked__bar-wrap" aria-hidden="true">
            <div
              class="vv-cta-locked__bar"
              :style="{ width: ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS * 100) + '%' }"
            />
          </div>
        </div>

        <button
          v-else
          class="vv-cta-btn"
          @click="calendarOpen = true"
        >
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
          AGENDAR MI ASESORÍA DE DISEÑO
        </button>

        <p class="vv-cta-sub">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          100% gratuito &nbsp;·&nbsp; Sin compromiso &nbsp;·&nbsp; Cupos limitados
        </p>
      </div>

      <!-- Authority section -->
      <section class="vv-authority" aria-labelledby="authority-heading">
        <div class="vv-authority__inner">
          <div class="vv-authority__photo-wrap">
            <div class="vv-authority__avatar" aria-hidden="true">
              <img :src="robertoPhoto" alt="Ale Barreto" class="vv-authority__img" />
            </div>
          </div>
          <div class="vv-authority__content">
            <p class="vv-authority__eyebrow">Tu especialista asignado</p>
            <h2 id="authority-heading" class="vv-authority__name">Ale Barreto</h2>
            <p class="vv-authority__role">Experta en Diseño y Construcción en Madera</p>
            <p class="vv-authority__bio">
              Con años de experiencia en el mercado ecuatoriano, me especializo en crear
              espacios que combinan la nobleza de la madera con diseños modernos y funcionales.
              Mi objetivo es que cada proyecto sea una inversión que dure toda la vida.
            </p>
            <ul class="vv-authority__creds" role="list">
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Especialista en maderas nobles y tratadas</li>
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Diseños exclusivos a medida</li>
              <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Gestión integral: del plano a la instalación</li>
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
      <p class="vv-footer__copy">© {{ new Date().getFullYear() }} ALE BARRETO. Todos los derechos reservados.</p>
    </footer>

  </div>

  <!-- Calendar modal -->
  <CalendarModal :open="calendarOpen" @close="calendarOpen = false" />

  <!-- Contact capture overlay -->
  <Teleport to="body">
    <Transition name="capture-fade">
      <div v-if="captureOpen" class="capture-overlay" role="dialog" aria-modal="true" aria-labelledby="capture-title">
        <div class="capture-modal">
          <div class="capture-modal__header">
            <h2 class="capture-modal__logo-text">ALE BARRETO</h2>
            <h2 id="capture-title" class="capture-modal__title">
              Antes de ver el video, <span>confirma tus datos</span>
            </h2>
            <p class="capture-modal__sub">Para personalizar tu asesoría de diseño</p>
          </div>
          <form class="capture-modal__form" @submit.prevent="submitCapture" novalidate>
            <div class="capture-row">
              <div class="capture-field" :class="{ error: captureTouched.nombre && captureErrors.nombre }">
                <label>Nombre</label>
                <input v-model="captureForm.nombre" type="text" placeholder="Roberto" @blur="captureTouched.nombre = true" />
                <span v-if="captureTouched.nombre && captureErrors.nombre" class="capture-field__error">{{ captureErrors.nombre }}</span>
              </div>
              <div class="capture-field" :class="{ error: captureTouched.apellido && captureErrors.apellido }">
                <label>Apellido</label>
                <input v-model="captureForm.apellido" type="text" placeholder="Allú" @blur="captureTouched.apellido = true" />
                <span v-if="captureTouched.apellido && captureErrors.apellido" class="capture-field__error">{{ captureErrors.apellido }}</span>
              </div>
            </div>
            <div class="capture-field" :class="{ error: captureTouched.empresa && captureErrors.empresa }">
              <label>Tu proyecto</label>
              <input v-model="captureForm.empresa" type="text" placeholder="Ej: Remodelación Sala" @blur="captureTouched.empresa = true" />
              <span v-if="captureTouched.empresa && captureErrors.empresa" class="capture-field__error">{{ captureErrors.empresa }}</span>
            </div>
            <div class="capture-field" :class="{ error: captureTouched.email && captureErrors.email }">
              <label>Email</label>
              <input v-model="captureForm.email" type="email" placeholder="tu@empresa.com" @blur="captureTouched.email = true" />
              <span v-if="captureTouched.email && captureErrors.email" class="capture-field__error">{{ captureErrors.email }}</span>
            </div>
            <div class="capture-field" :class="{ error: captureTouched.telefono && captureErrors.telefono }">
              <label>Teléfono</label>
              <input v-model="captureForm.telefono" type="tel" placeholder="+593 98 000 0000" @blur="captureTouched.telefono = true" />
              <span v-if="captureTouched.telefono && captureErrors.telefono" class="capture-field__error">{{ captureErrors.telefono }}</span>
            </div>
            <button type="submit" class="capture-submit" :disabled="captureSubmitting">
              <span v-if="!captureSubmitting">
                <i class="fa-solid fa-play" aria-hidden="true"></i>
                Ver el video
              </span>
              <span v-else>
                <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                Cargando...
              </span>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
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

  &__logo { height: 36px; width: auto; object-fit: contain; }
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

.vv-video-wrapper { margin-bottom: 1.75rem; }

.vv-video-ratio {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 63, 125, 0.12);
  border: 1px solid #E4EDF7;
  background: colors.$OS-NAVY;

  wistia-player {
    display: block;
    width: 100%;
    height: 100%;

    &:not(:defined) {
      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/5ql8l131me/swatch');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%;
    }
  }
}

// ── CTA section ──────────────────────────────────────────────────────────────
.vv-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.vv-cta-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  max-width: 420px;

  &__icon { font-size: 1.4rem; color: #B0C0D5; }

  &__text {
    font-size: 0.88rem;
    color: #8A9BB5;
    margin: 0;
    strong { color: colors.$OS-NAVY; }
  }

  &__bar-wrap {
    width: 100%;
    height: 4px;
    background: #E8EDF5;
    border-radius: 99px;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    background: colors.$OS-BLUE;
    border-radius: 99px;
    transition: width 0.8s linear;
  }
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

// ── Capture overlay ──────────────────────────────────────────────────────────
.capture-fade-enter-active,
.capture-fade-leave-active { transition: opacity 0.25s ease; }
.capture-fade-enter-from,
.capture-fade-leave-to { opacity: 0; }

.capture-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  background: rgba(colors.$OS-DARK, 0.8);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.capture-modal {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);

  &__header {
    padding: 2rem 2rem 1.25rem;
    text-align: center;
    background: linear-gradient(135deg, #EEF4FF 0%, #F9FBFF 100%);
    border-bottom: 1px solid #E8EDF5;
  }

  &__logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    margin-bottom: 1rem;
  }

  &__title {
    @include fonts.heading-font(800);
    font-size: 1.3rem;
    color: colors.$OS-DARK;
    margin: 0 0 0.4rem;
    letter-spacing: -0.02em;
    span { color: colors.$OS-RED; }
  }

  &__sub {
    font-size: 0.82rem;
    color: #8A9BB5;
    margin: 0;
  }

  &__form {
    padding: 1.5rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
}

.capture-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 400px) { grid-template-columns: 1fr; }
}

.capture-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-family: fonts.$font-interface;
    font-size: 0.78rem;
    font-weight: 700;
    color: #4A5F7A;
    letter-spacing: 0.02em;
  }

  input {
    border: 1.5px solid #E4EDF7;
    border-radius: 9px;
    padding: 0.7rem 0.85rem;
    font-family: fonts.$font-secondary;
    font-size: 0.88rem;
    color: colors.$OS-DARK;
    background: #FAFBFF;
    outline: none;
    transition: border-color 0.18s;
    &::placeholder { color: #B8CAE0; }
    &:focus { border-color: colors.$OS-BLUE; background: #F5F9FF; }
  }

  &.error input { border-color: colors.$OS-RED; }

  &__error {
    font-size: 0.73rem;
    color: colors.$OS-RED;
  }
}

.capture-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: colors.$OS-RED;
  color: #ffffff;
  border: none;
  border-radius: 11px;
  padding: 0.95rem 1.5rem;
  font-family: fonts.$font-accent;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  width: 100%;
  margin-top: 0.25rem;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 4px 16px rgba(204, 0, 0, 0.3);

  &:hover:not(:disabled) { background: #AA0000; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
