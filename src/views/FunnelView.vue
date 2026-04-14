<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import RegistrationModal from '@/components/RegistrationModal.vue'
import { captureFbParams } from '@/utils/fbclid'
import osLogo from '@/assets/logos/logo-small.png'

const router = useRouter()
const modalOpen = ref(false)
const IS_DEV = window.location.hostname === 'localhost'

const openModal = () => {
  if (!IS_DEV) {
    const disqAt = localStorage.getItem('os_disq_at')
    if (disqAt && Date.now() - Number(disqAt) < 24 * 60 * 60 * 1000) {
      router.push('/sin-espacio')
      return
    }
  }
  modalOpen.value = true
}

const stats = [
  {
    icon: 'fa-solid fa-circle-check',
    number: '0',
    text: 'paradas por recalentamiento en 6 meses tras implementar Honda BF2.3',
  },
  {
    icon: 'fa-solid fa-gas-pump',
    number: '22%',
    text: 'de ahorro en combustible reportado por clientes camaroneros',
  },
  {
    icon: 'fa-solid fa-award',
    number: '1964',
    text: 'año en que Honda Marine comenzó a liderar la innovación náutica mundial',
  },
]

const pillars = [
  'Sin motores baratos que fallan en media faena',
  'Sin consumo excesivo que devora tus márgenes',
  'Sin dificultad para conseguir repuestos originales',
  'Con tecnología 100% japonesa fabricada en Japón',
]

const methodology = [
  {
    num: '01',
    icon: 'fa-solid fa-gear',
    title: 'Ingeniería de Precisión Japonesa',
    body: 'Motores como el BF150 con tecnología VTEC y BLAST. Fabricados y ensamblados en Japón para resistir el trabajo más duro.',
  },
  {
    num: '02',
    icon: 'fa-solid fa-wrench',
    title: 'Mantenimiento Simplificado',
    body: 'Desde el portátil BF2.3 enfriado por aire hasta sistemas electrónicos que garantizan arranques fáciles cada mañana.',
  },
  {
    num: '03',
    icon: 'fa-solid fa-shield-halved',
    title: 'Equipamiento Integral',
    body: 'No es solo el motor. Te asesoramos con baterías de ciclo profundo y direcciones hidráulicas de alta tecnología.',
  },
]

// Countdown urgency (24h rolling)
const hours = ref('23')
const minutes = ref('47')
const seconds = ref('12')
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  captureFbParams()
  let total = 23 * 3600 + 47 * 60 + 12
  interval = setInterval(() => {
    total--
    if (total <= 0) total = 23 * 3600 + 59 * 60 + 59
    hours.value = String(Math.floor(total / 3600)).padStart(2, '0')
    minutes.value = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    seconds.value = String(total % 60).padStart(2, '0')
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="funnel">

    <!-- TOP BAR -->
    <header class="funnel__topbar">
      <img :src="osLogo" alt="Ocean Safety" class="funnel__logo" />
    </header>

    <!-- URGENCY BANNER -->
    <div class="funnel__urgency" role="banner">
      <span class="funnel__urgency-dot" aria-hidden="true" />
      <span>Cupos limitados — expiran en:</span>
      <div class="funnel__timer" aria-live="polite" aria-label="Tiempo restante">
        <span class="funnel__timer-block"><strong>{{ hours }}</strong><small>h</small></span>
        <span class="funnel__timer-sep" aria-hidden="true">:</span>
        <span class="funnel__timer-block"><strong>{{ minutes }}</strong><small>m</small></span>
        <span class="funnel__timer-sep" aria-hidden="true">:</span>
        <span class="funnel__timer-block"><strong>{{ seconds }}</strong><small>s</small></span>
      </div>
    </div>

    <!-- HERO -->
    <section class="funnel__hero" aria-labelledby="funnel-headline">
      <div class="funnel__container">

        <p class="funnel__eyebrow">
          <i class="fa-solid fa-anchor" aria-hidden="true"></i>
          Representantes Oficiales Honda Marine en Ecuador
        </p>

        <h1 id="funnel-headline" class="funnel__headline">
          Profesionaliza tu flota y
          <span class="funnel__headline-accent">elimina las paradas no programadas</span>
          con ingeniería náutica japonesa
        </h1>

        <ul class="funnel__pillars" role="list">
          <li v-for="p in pillars" :key="p" class="funnel__pillar">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
            {{ p }}
          </li>
        </ul>

        <!-- VSL clickable area -->
        <div class="funnel__vsl-wrap">
          <div
            class="funnel__vsl"
            role="button"
            tabindex="0"
            aria-label="Ver video y reservar consulta técnica"
            @click="openModal()"
            @keydown.enter="openModal()"
            @keydown.space.prevent="openModal()"
          >
            <div class="funnel__vsl-bg" aria-hidden="true">
              <img :src="osLogo" alt="" class="funnel__vsl-watermark" />
            </div>
            <div class="funnel__vsl-overlay" aria-hidden="true">
              <div class="funnel__vsl-play">
                <i class="fa-solid fa-play"></i>
              </div>
              <p class="funnel__vsl-caption">
                Descubre cómo los líderes del sector camaronero protegen su operación
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="funnel__cta-wrap">
          <button class="funnel__cta-btn" @click="openModal()">
            <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
            AGENDAR CONSULTA TÉCNICA GRATIS
          </button>
          <p class="funnel__cta-sub">
            <i class="fa-solid fa-lock" aria-hidden="true"></i>
            100% gratuito &nbsp;·&nbsp; Sin compromiso &nbsp;·&nbsp; Cupos limitados
          </p>
        </div>

      </div>
    </section>

    <!-- STATS -->
    <section class="funnel__stats" aria-label="Resultados comprobados">
      <div class="funnel__container">
        <p class="funnel__section-label funnel__section-label--light">Resultados reales — clientes reales</p>
        <div class="funnel__stats-grid">
          <div v-for="stat in stats" :key="stat.number" class="funnel__stat">
            <div class="funnel__stat-icon" aria-hidden="true">
              <i :class="stat.icon"></i>
            </div>
            <strong class="funnel__stat-number">{{ stat.number }}</strong>
            <p class="funnel__stat-text">{{ stat.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROBLEMA -->
    <section class="funnel__problem" aria-labelledby="problem-heading">
      <div class="funnel__container">
        <p class="funnel__section-label">¿Te identificas con esto?</p>
        <h2 id="problem-heading" class="funnel__section-title">
          El error que cometen la mayoría de operadores
        </h2>
        <div class="funnel__problem-grid">
          <div class="funnel__problem-item">
            <i class="fa-solid fa-triangle-exclamation funnel__problem-icon" aria-hidden="true"></i>
            <div>
              <strong>Compran por precio inicial</strong>
              <p>Motores baratos que fallan a los pocos meses, generando costos de reparación que superan el ahorro.</p>
            </div>
          </div>
          <div class="funnel__problem-item">
            <i class="fa-solid fa-triangle-exclamation funnel__problem-icon" aria-hidden="true"></i>
            <div>
              <strong>Bombas de agua obstruidas por sedimento</strong>
              <p>Motores enfriados por agua en ríos poco profundos. El BF2.3 enfriado por aire elimina este problema por completo.</p>
            </div>
          </div>
          <div class="funnel__problem-item">
            <i class="fa-solid fa-triangle-exclamation funnel__problem-icon" aria-hidden="true"></i>
            <div>
              <strong>Sin repuestos ni respaldo técnico</strong>
              <p>Una avería sin stock local puede dejar tu flota paralizada por días, con pérdidas operativas reales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- METODOLOGÍA -->
    <section class="funnel__method" aria-labelledby="method-heading">
      <div class="funnel__container">
        <p class="funnel__section-label">Nuestra metodología de asesoría</p>
        <h2 id="method-heading" class="funnel__section-title">
          Tres pilares que protegen tu operación
        </h2>
        <div class="funnel__method-grid">
          <div v-for="m in methodology" :key="m.num" class="funnel__method-card">
            <div class="funnel__method-num" aria-hidden="true">{{ m.num }}</div>
            <div class="funnel__method-icon" aria-hidden="true">
              <i :class="m.icon"></i>
            </div>
            <h3 class="funnel__method-title">{{ m.title }}</h3>
            <p class="funnel__method-body">{{ m.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIAL -->
    <section class="funnel__testimonial" aria-labelledby="testimonial-heading">
      <div class="funnel__container">
        <p class="funnel__section-label">Caso de éxito real</p>
        <div class="funnel__testimonial-card">
          <i class="fa-solid fa-quote-left funnel__testimonial-quote" aria-hidden="true"></i>
          <blockquote class="funnel__testimonial-text">
            "Roberto, por fin duermo tranquilo porque sé que mis embarcaciones arrancarán mañana.
            Cero paradas por recalentamiento en 6 meses y un 22% menos en consumo de combustible."
          </blockquote>
          <footer class="funnel__testimonial-author">
            <div class="funnel__testimonial-avatar" aria-hidden="true">
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <strong>Administrador de flota</strong>
              <span>Una de las camaroneras más importantes del Ecuador</span>
            </div>
          </footer>
        </div>
      </div>
    </section>

    <!-- AUTHORITY — Roberto Allú -->
    <section class="funnel__authority" aria-labelledby="authority-heading">
      <div class="funnel__container funnel__authority-inner">
        <div class="funnel__authority-photo-wrap">
          <div class="funnel__authority-avatar" aria-hidden="true">
            <i class="fa-solid fa-user-tie"></i>
          </div>
        </div>
        <div class="funnel__authority-content">
          <p class="funnel__authority-eyebrow">Tu especialista asignado</p>
          <h2 id="authority-heading" class="funnel__authority-name">Roberto Allú</h2>
          <p class="funnel__authority-role">Especialista en Soluciones Náuticas Industriales</p>
          <p class="funnel__authority-bio">
            Como representantes oficiales de Honda Marine en Ecuador, llevo años ayudando
            a operadores camaroneros, de transporte y seguridad a profesionalizar sus flotas.
            No se trata de vender un motor — se trata de que
            <strong>tus embarcaciones arranquen mañana</strong>, y todos los días.
          </p>
          <ul class="funnel__authority-creds" role="list">
            <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Representante oficial Honda Marine Ecuador</li>
            <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Especialista en flotas camaroneras y de seguridad</li>
            <li><i class="fa-solid fa-check-circle" aria-hidden="true"></i> Asesoría llave en mano: motor + equipamiento</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="funnel__cta-final" aria-labelledby="cta-final-heading">
      <div class="funnel__container">
        <h2 id="cta-final-heading" class="funnel__cta-final-title">
          ¿Listo para profesionalizar tu flota?
        </h2>
        <p class="funnel__cta-final-sub">
          Agenda una consulta técnica gratuita de 15 minutos. Analizaremos tu operación
          y te recomendaremos el caballaje y equipos exactos para tu flota.
        </p>
        <button class="funnel__cta-btn" @click="openModal()">
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
          AGENDAR CONSULTA TÉCNICA GRATIS
        </button>
        <p class="funnel__cta-sub">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          100% gratuito &nbsp;·&nbsp; Sin compromiso &nbsp;·&nbsp; Cupos limitados
        </p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="funnel__footer">
      <div class="funnel__container funnel__footer-inner">
        <img :src="osLogo" alt="Ocean Safety" class="funnel__footer-logo" />
        <nav class="funnel__footer-links" aria-label="Legal">
          <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
          <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
        </nav>
        <p class="funnel__footer-copy">
          © {{ new Date().getFullYear() }} OCEAN SAFETY. Todos los derechos reservados.
        </p>
      </div>
    </footer>

  </div>

  <RegistrationModal :open="modalOpen" @close="modalOpen = false" />
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.funnel {
  background: #ffffff;
  color: colors.$OS-DARK;
  min-height: 100vh;
  font-family: fonts.$font-secondary;

  &__container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1.5rem;
    @media (min-width: 768px) { padding: 0 2rem; }
  }
}

// ── Top bar ──────────────────────────────────────────────────────────────────
.funnel__topbar {
  background: #ffffff;
  border-bottom: 1px solid #E8EDF5;
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
}

.funnel__logo {
  height: 38px;
  width: auto;
  object-fit: contain;
}

// ── Urgency banner ───────────────────────────────────────────────────────────
.funnel__urgency {
  background: colors.$OS-NAVY;
  color: #ffffff;
  padding: 0.55rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.funnel__urgency-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ADE80;
  flex-shrink: 0;
  animation: dot-pulse 1.5s infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
}

.funnel__timer {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.funnel__timer-block {
  display: flex;
  align-items: baseline;
  gap: 1px;
  strong { font-size: 0.95rem; font-weight: 800; }
  small { font-size: 0.68rem; opacity: 0.75; }
}

.funnel__timer-sep { font-weight: 800; opacity: 0.5; padding: 0 1px; }

// ── Hero ─────────────────────────────────────────────────────────────────────
.funnel__hero {
  padding: 3.5rem 0 3rem;
  background: linear-gradient(180deg, #EEF4FF 0%, #ffffff 70%);
}

.funnel__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(colors.$OS-NAVY, 0.06);
  border: 1px solid rgba(colors.$OS-NAVY, 0.14);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  color: colors.$OS-NAVY;
  font-family: fonts.$font-interface;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 1.4rem;
  i { font-size: 0.8rem; }
}

.funnel__headline {
  @include fonts.heading-font(800);
  font-size: clamp(2rem, 5vw, 3.1rem);
  line-height: 1.15;
  color: colors.$OS-DARK;
  margin: 0 0 1.5rem;
  letter-spacing: -0.025em;

  &-accent { color: colors.$OS-RED; }
}

.funnel__pillars {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.funnel__pillar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.93rem;
  color: #3A4F6A;

  i {
    color: colors.$OS-BLUE;
    font-size: 0.82rem;
    flex-shrink: 0;
  }
}

// ── VSL ──────────────────────────────────────────────────────────────────────
.funnel__vsl-wrap { margin-bottom: 2rem; }

.funnel__vsl {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #D8E6F5;
  box-shadow: 0 8px 40px rgba(0, 63, 125, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0, 63, 125, 0.2);
  }
  &:focus-visible {
    outline: 3px solid colors.$OS-BLUE;
    outline-offset: 2px;
  }
}

.funnel__vsl-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, colors.$OS-NAVY 0%, #0055A5 60%, colors.$OS-BLUE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.funnel__vsl-watermark {
  height: 72px;
  width: auto;
  opacity: 0.1;
  filter: brightness(100);
}

.funnel__vsl-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.funnel__vsl-play {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;

  .funnel__vsl:hover & { transform: scale(1.1); }

  i {
    color: colors.$OS-RED;
    font-size: 1.7rem;
    margin-left: 5px;
  }
}

.funnel__vsl-caption {
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: center;
  padding: 0 2rem;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  max-width: 420px;
}

// ── CTA ──────────────────────────────────────────────────────────────────────
.funnel__cta-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.funnel__cta-btn {
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
  max-width: 480px;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(204, 0, 0, 0.35);

  &:hover {
    background: #AA0000;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(204, 0, 0, 0.45);
  }
  &:active { transform: translateY(0); }
}

.funnel__cta-sub {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #8A9BB5;
  margin: 0;
  i { font-size: 0.72rem; }
}

// ── Stats ────────────────────────────────────────────────────────────────────
.funnel__stats {
  background: colors.$OS-NAVY;
  padding: 3rem 0;
}

.funnel__section-label {
  font-family: fonts.$font-interface;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: colors.$OS-NAVY;
  margin: 0 0 1rem;

  &--light { color: rgba(#ffffff, 0.55); }
}

.funnel__stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
}

.funnel__stat { text-align: center; }

.funnel__stat-icon {
  font-size: 1.6rem;
  color: rgba(#ffffff, 0.35);
  margin-bottom: 0.5rem;
}

.funnel__stat-number {
  display: block;
  @include fonts.heading-font(800);
  font-size: 2.6rem;
  color: #ffffff;
  line-height: 1;
  margin-bottom: 0.4rem;
  letter-spacing: -0.03em;
}

.funnel__stat-text {
  font-size: 0.83rem;
  color: rgba(#ffffff, 0.7);
  line-height: 1.45;
  margin: 0;
}

// ── Problem ──────────────────────────────────────────────────────────────────
.funnel__problem {
  padding: 4rem 0;
  background: #ffffff;
}

.funnel__section-title {
  @include fonts.heading-font(800);
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: colors.$OS-DARK;
  margin: 0.25rem 0 2rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.funnel__problem-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.funnel__problem-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  background: #F9FBFF;
  border: 1px solid #E4EDF7;
  border-radius: 12px;

  strong {
    display: block;
    color: colors.$OS-DARK;
    font-size: 0.93rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }
  p {
    font-size: 0.86rem;
    color: #4A5F7A;
    line-height: 1.5;
    margin: 0;
  }
}

.funnel__problem-icon {
  font-size: 1.2rem;
  color: colors.$OS-RED;
  flex-shrink: 0;
  margin-top: 2px;
}

// ── Methodology ──────────────────────────────────────────────────────────────
.funnel__method {
  padding: 4rem 0;
  background: #F5F8FF;
}

.funnel__method-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
}

.funnel__method-card {
  background: #ffffff;
  border: 1px solid #E4EDF7;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 63, 125, 0.05);
}

.funnel__method-num {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  @include fonts.heading-font(800);
  font-size: 2.5rem;
  color: rgba(colors.$OS-NAVY, 0.07);
  line-height: 1;
  user-select: none;
}

.funnel__method-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  i { color: #ffffff; font-size: 1.1rem; }
}

.funnel__method-title {
  @include fonts.heading-font(700);
  font-size: 0.97rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.5rem;
}

.funnel__method-body {
  font-size: 0.86rem;
  color: #4A5F7A;
  line-height: 1.55;
  margin: 0;
}

// ── Testimonial ──────────────────────────────────────────────────────────────
.funnel__testimonial {
  padding: 4rem 0;
  background: #ffffff;
}

.funnel__testimonial-card {
  background: #F5F8FF;
  border: 1px solid rgba(colors.$OS-NAVY, 0.1);
  border-left: 4px solid colors.$OS-NAVY;
  border-radius: 16px;
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0, 63, 125, 0.07);
}

.funnel__testimonial-quote {
  font-size: 2.2rem;
  color: rgba(colors.$OS-NAVY, 0.12);
  display: block;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.funnel__testimonial-text {
  font-size: 1.1rem;
  color: colors.$OS-DARK;
  line-height: 1.65;
  margin: 0 0 1.5rem;
  font-style: italic;
}

.funnel__testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  strong { display: block; color: colors.$OS-DARK; font-size: 0.88rem; font-weight: 700; }
  span { font-size: 0.78rem; color: #8A9BB5; }
}

.funnel__testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i { color: #ffffff; font-size: 1.2rem; }
}

// ── Authority ────────────────────────────────────────────────────────────────
.funnel__authority {
  padding: 4rem 0;
  background: linear-gradient(135deg, #EEF4FF 0%, #F9FBFF 100%);
  border-top: 1px solid #E4EDF7;
  border-bottom: 1px solid #E4EDF7;
}

.funnel__authority-inner {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  @media (max-width: 640px) { flex-direction: column; align-items: center; }
}

.funnel__authority-photo-wrap { flex-shrink: 0; }

.funnel__authority-avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 20px rgba(0, 63, 125, 0.2);
  i { color: rgba(#ffffff, 0.85); font-size: 3.2rem; }
}

.funnel__authority-content { flex: 1; }

.funnel__authority-eyebrow {
  font-family: fonts.$font-interface;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: colors.$OS-BLUE;
  margin: 0 0 0.35rem;
}

.funnel__authority-name {
  @include fonts.heading-font(800);
  font-size: 2rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.2rem;
  letter-spacing: -0.02em;
}

.funnel__authority-role {
  font-size: 0.88rem;
  color: #8A9BB5;
  margin: 0 0 1rem;
}

.funnel__authority-bio {
  font-size: 0.93rem;
  color: #3A4F6A;
  line-height: 1.65;
  margin: 0 0 1rem;
  strong { color: colors.$OS-DARK; font-weight: 700; }
}

.funnel__authority-creds {
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
    font-size: 0.86rem;
    color: #3A4F6A;
    i { color: colors.$OS-BLUE; font-size: 0.82rem; flex-shrink: 0; }
  }
}

// ── CTA Final ────────────────────────────────────────────────────────────────
.funnel__cta-final {
  padding: 4.5rem 0;
  background: colors.$OS-NAVY;
  text-align: center;

  .funnel__section-label { color: rgba(#ffffff, 0.5); }

  .funnel__cta-btn {
    margin: 0 auto 1rem;
    background: colors.$OS-RED;
    box-shadow: 0 4px 24px rgba(204, 0, 0, 0.4);
    &:hover { background: #AA0000; }
  }

  .funnel__cta-sub { color: rgba(#ffffff, 0.5); }
}

.funnel__cta-final-title {
  @include fonts.heading-font(800);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #ffffff;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
}

.funnel__cta-final-sub {
  font-size: 0.97rem;
  color: rgba(#ffffff, 0.72);
  margin: 0 auto 2rem;
  max-width: 520px;
  line-height: 1.55;
}

// ── Footer ───────────────────────────────────────────────────────────────────
.funnel__footer {
  background: colors.$OS-DARK;
  padding: 2rem 1.5rem;
}

.funnel__footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.funnel__footer-logo {
  height: 30px;
  width: auto;
  filter: brightness(100);
  opacity: 0.6;
  object-fit: contain;
}

.funnel__footer-links {
  display: flex;
  gap: 1.5rem;

  a {
    font-size: 0.78rem;
    color: rgba(#ffffff, 0.45);
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: rgba(#ffffff, 0.85); }
  }
}

.funnel__footer-copy {
  font-size: 0.72rem;
  color: rgba(#ffffff, 0.28);
  margin: 0;
}
</style>
