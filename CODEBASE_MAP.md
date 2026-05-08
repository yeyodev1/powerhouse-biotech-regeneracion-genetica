# Ale Barreto Vue 3 Funnel — Current State Mapping

## ASSETS INVENTORY

**Directory:** `/src/assets/`

```
logos/
  - Logo-large.png
  - logo-small.png

team/
  - ale-barreto.png

stock/
  - video.png

testimonios/
  - johanna.png
  - mariaisabel.webp
  - mauro.webp
  - nicole.webp
```

---

## FILE STRUCTURE & CONTENT MAPPING

### index.html
**Template structure:**
- `<head>`: Meta (title, description, keywords, OG, Twitter, JSON-LD)
- Wistia embed script: `https://fast.wistia.com/player.js` + media-id `5ql8l131me`
- Meta Pixel (Facebook): `26594099306899876`
- Favicon: `/favicon.png`
- Theme color: `#FEFAE0`

**Hardcoded copy:**
- Title: "Ale Barreto | Expertos en Madera — Diseño y Construcción"
- Description: "Ale Barreto — expertos en diseño y construcción en madera. Transformamos espacios con acabados de alta gama..."
- OG Image: `https://alebarreto.com/og-image.png`
- Canonical: `https://alebarreto.com/`

**JSON-LD schema:**
- Organization name: "Ale Barreto Wood Design"
- Logo URL: `https://alebarreto.com/logo.png`
- Phone: "+593984934039"
- Email: "info@alebarreto.com"
- Location: "Guayaquil, Ecuador"
- Services: Diseño Interiores, Construcción Madera, Carpintería Alta Gama, Arquitectura Sostenible
- Social: LinkedIn, Instagram, Facebook, TikTok

---

### src/main.ts
**Setup:**
- Vue 3 app bootstrap
- Pinia store
- Vue Router
- GSAP (gsap + ScrollTrigger)
- FontAwesome

---

### src/App.vue
**Structure:** Single `<RouterView />` — all routing handled via router config

---

### src/router/index.ts
**Routes:**

| Path | Name | Component | Title / Meta |
|------|------|-----------|--------------|
| `/` | funnel | FunnelView | "Ale Barreto \| Expertos..." |
| `/ver-video` | video | VideoView | "Mira el video \| Paso 1 de 2" |
| `/agendar` | booking | BookingView | "Agenda tu Cita \| Paso 2 de 2" |
| `/cita-confirmada` | booked | BookedView | "¡Tu cita está confirmada!" |
| `/sin-espacio` | nospace | NoSpaceView | "Sin espacio disponible" |
| `/politicas-privacidad` | privacy-policy | PrivacyPolicyView | — |
| `/avisos-legales` | legal-notice | LegalNoticeView | — |

**Guards:**
- `os_booked_at` TTL: 3 days (redirect `/cita-confirmada` → forbidden if expired)
- `os_disq_at` TTL: 48 hours (redirect `/sin-espacio` → show `/` if expired)
- Public routes: `privacy-policy`, `legal-notice`

---

## CORE VIEWS

### src/views/FunnelView.vue
**Section layout:**
```html
<TheScrollOverlay />
<TheHero />          <!-- stats, benefits, 3D animation -->
<TheStrategies />    <!-- 3 pillars + benefit scroll -->
<TheTestimonials />  <!-- grid of testimonial cards -->
<TheContact />       <!-- split: left text, right form -->
<RegistrationModal open={modalOpen} />
```

**Props/State:**
- `modalOpen`: ref(false)
- `IS_DEV`: hostname === 'localhost'

**Hardcoded copy (Spanish):**
- Stats: "15+ Años trabajando con maderas nobles...", "500+ Proyectos residenciales...", "100% Compromiso con la calidad..."
- Pillars: "Sin materiales de baja calidad", "Sin diseños genéricos", "Sin retrasos en la entrega"
- Proof rotation: testimonial names (Mauro, Johanna, etc.)

**Assets imported:**
- `alePhoto from '@/assets/team/ale-barreto.png'`

**localStorage keys:**
- `os_disq_at` (timestamp check for 48h gate)
- `os_contact` (contact form data)
- `os_fb` (Facebook params)

**Tracking:**
- `captureFbParams()` on mount
- Proof rotation loop
- Modal open → route `/ver-video`

---

### src/views/VideoView.vue
**Structure:**
```html
<div class="vv-page">
  <header>Mira el video</header>
  <iframe wistia-id="5ql8l131me" />
  <RegistrationModal open={captureOpen} />  <!-- if no contact saved -->
  <CalendarModal open={calendarOpen} />     <!-- 2-min countdown unlock -->
</div>
```

**Props/State:**
- `contactStore`: pinia store
- `captureOpen`: ref(false) — shows form if no email/nombre in store
- `calendarOpen`: ref(false)
- `secondsLeft`: countdown (120s in prod, 3s in dev)
- `ctaUnlocked`: ref(false) — blocks calendar modal until timer done

**Hardcoded copy:**
- Page title: "Mira el video"
- Button text: "Agendar ahora" (unlocks after countdown)
- Countdown: "2:00" → "0:00"

**Assets:**
- `alePhoto from '@/assets/team/ale-barreto.png'`

**Tracking:**
- `fbq('ViewContent', { content_name: 'video-vsl' })`
- `fbq('Lead', { content_name: 'video-gate' })` when capture submitted
- `trackStage('lead_capturado', {...})`

**localStorage:**
- `os_contact` (save + read)

---

### src/views/BookingView.vue
**Structure:**
```html
<header class="booking__topbar">
<iframe src="https://api.leadconnectorhq.com/..." />  <!-- GHL calendar -->
```

**Props/State:**
- `iframeHeight`: ref(600) — dynamically resized via postMessage
- `onMessage` listener → sets `os_booked_at` timestamp on `msgsndr-booking-complete`

**Hardcoded copy:**
- Header: "Selecciona tu disponibilidad"
- GHL form embed script injected: `https://api.leadconnectorhq.com/js/form_embed.js`

**localStorage:**
- `os_booked_at` = Date.now() on booking success

**Routing:**
- On booking complete: `router.push('/cita-confirmada')`

---

### src/views/BookedView.vue
**Structure:**
```html
<BookedHeader />
<BookedHero contactName={computed} />
<BookedSteps />
<BookedTeam />
<BookedFooter />
```

**Props/State:**
- `contactName`: computed from `localStorage.getItem('os_contact')`
- `isReturningVisitor`: computed (booking timestamp > 10 min ago)
- `RETURNING_THRESHOLD_MS`: 10 * 60 * 1000

**Hardcoded copy:**
- Hero title: "¡Listo, {nombre}!" or "¡Tu cita está confirmada!"
- Hero subtitle: "En breve recibirás un correo con todos los detalles..."
- Steps: Revisa tu email, Espera el contacto, Prepara tu proyecto
- Next steps card: "Un miembro del equipo de Bakano..."

**Tracking:**
- `fbq('CompleteRegistration', { content_name: 'consulta-agendada' })` (once per session)

**localStorage:**
- `os_contact` (read)
- `os_booked_at` (read)
- `os_complete_fired` (sessionStorage, fires fbq once)

---

### src/views/NoSpaceView.vue
**Structure:**
```html
<div class="nospace">
  <section class="nospace__card">
    <h2>Sin espacio disponible</h2>
    <p>Determinamos si eres candidato o no...</p>
    <div class="nospace__steps">
      <!-- 3 challenge callouts -->
    </div>
    <div class="nospace__teaser">
      <h3>Prepárate para tu siguiente oportunidad</h3>
      <p>Acceso VIP al programa...</p>
    </div>
    <a href="/">Volver al inicio</a>
  </section>
</div>
```

**Props/State:** None (static view)

**Hardcoded copy:**
- Title: "Sin espacio disponible"
- Subtitle: "Determinamos si eres candidato o no..."
- Steps: "Qué está bloqueando tu recuperación", "Cómo es el proceso", "Resultados garantizados"
- Teaser: "Prepárate para tu siguiente oportunidad"
- Button: "Volver al inicio"

**localStorage:**
- Sets `os_disq_at` = Date.now() + 48h when user lands here

---

### src/views/PrivacyPolicyView.vue & LegalNoticeView.vue
**Status:** Placeholder views, no state. Hardcoded Spanish legal text.

---

## COMPONENTS

### src/components/TheHero.vue
**Template blocks:**
```html
<section class="hero">
  <div class="hero__container">
    <div class="hero__reveal-shape">  <!-- 3D cube animation -->
    <div class="hero__hidden-video">   <!-- Cloudinary video MP4 -->
    <div class="hero__content">
      <h1>Headline</h1>
      <div class="hero__benefits-track">  <!-- horizontal scroll -->
        <div class="stat">...</div>
    <img class="hero__bg-slide" />  <!-- Cloudinary JPGs -->
```

**Props:** None

**Data:**
- `heroContainer`, `revealShape`, `hiddenVideo`, `revealContent`, `horizontalTrack`, `bgSlide1`, `bgSlide2`: template refs
- GSAP timeline with ScrollTrigger

**Hardcoded copy:**
- Headline: (read from template)
- Benefit copy: (read from template)

**Assets (Cloudinary):**
- Video: `https://res.cloudinary.com/dpimsaaa4/video/upload/v1772741967/IMG_8601_y5tgbu.mov`
- BgFoto1: `https://res.cloudinary.com/dpimsaaa4/image/upload/v1772741965/IMG_7973_fm7dfc.jpg`
- BgFoto2: `https://res.cloudinary.com/dpimsaaa4/image/upload/v1772741964/IMG_8099_h9zifs.jpg`

**GSAP animations:**
- Phase 1: Scale cube 30x, rotate 3D
- Phase 2: Portal reveal effect
- Phase 3: Horizontal scroll of benefits
- Phase 4-5: Background photo transitions

---

### src/components/TheStrategies.vue
**Template:** 3-column layout + scroll animations

**Hardcoded copy:**
- Section title: (3 strategies + descriptions)
- Column headers: e.g., "Sin materiales..."

**Props:** None

**Animations:** GSAP ScrollTrigger stagger

---

### src/components/TheTestimonials.vue
**Template:**
```html
<section class="testimonials">
  <header class="testimonials__header">
  <div class="testimonials__grid">
    <TestimonialCard v-for="testimonial in testimonials" @openVideo />
  <video /> <!-- hidden, synced to card -->
```

**Props:** None

**Data:**
```javascript
const testimonials = [
  {
    id: 1,
    name: 'Mauro Salgán',
    quote: 'Su estrategia rompió nuestro umbral de producción',
    image: imgMauro,
    videoUrl: 'https://www.instagram.com/p/DExquGpxwP_/',
  },
  {
    id: 2,
    name: 'Johanna Quezada',
    quote: 'Teníamos una desorganización total...',
    image: imgJohanna,
    videoUrl: 'https://www.instagram.com/p/DMtdBuMup4k',
  },
  {
    id: 3,
    name: 'María Isabel Soriano',
    quote: 'Me hicieron dar cuenta de esquemas...',
    image: imgMariaIsabel,
    videoUrl: 'https://drive.google.com/file/d/19QGvEoV9IbVBzMhprv61ER20XfjQMExk/view?usp=sharing',
  },
]
```

**Assets:**
- `imgMauro from '../assets/testimonios/mauro.webp'`
- `imgJohanna from '../assets/testimonios/johanna.png'`
- `imgMariaIsabel from '../assets/testimonios/mariaisabel.webp'`
- `imgNicole from '../assets/testimonios/nicole.webp'` (if used)

**Emits:** None directly; child component emits `openVideo`

---

### src/components/TestimonialCard.vue
**Template:**
```html
<article class="t-card" @click="handleOpen">
  <div class="t-card__body">
    <p class="t-card__quote">"{{ testimonial.quote }}"</p>
  <div class="t-card__divider" />
  <footer class="t-card__footer">
    <img class="t-card__avatar" :src="testimonial.image" />
    <span class="t-card__name">{{ testimonial.name }}</span>
    <button class="t-card__play">▶</button>
```

**Props:**
```typescript
testimonial: { id, name, quote, image, videoUrl }
```

**Emits:**
- `openVideo: [url]`

**Handler:** `emit('openVideo', testimonial.videoUrl)`

---

### src/components/TheContact.vue
**Template:**
```html
<section class="contact">
  <div class="contact__left">
    <h2>Headline</h2>
    <div class="contact__stats">
      <div class="stat">20% promedio de aumento...</div>
      <div class="stat">...</div>
  <div class="contact__form-wrap">
    <!-- ContactWizard component -->
```

**Props:** None

**Hardcoded copy:**
- Section title: (read from template)
- Stat text: "20% promedio de aumento en facturación en los primeros 90 días"

---

### src/components/ContactWizard.vue
**Template:**
```html
<form @submit.prevent="handleSubmit">
  <div class="wizard__step-1">
    <input name="nombre" placeholder="Tu nombre" />
    <input name="apellido" placeholder="Apellido" />
    <input name="email" type="email" />
    <input name="phone" with country selector />
    <input name="empresa" placeholder="Nombre del proyecto" />
    <select name="urgency">
      <option value="immediate">Necesito iniciar de inmediato</option>
      <option value="next-month">En los próximos 1–3 meses</option>
      <option value="just-looking">Solo estoy explorando</option>
    </select>
    <label>
      <input type="checkbox" name="consent" />
      He leído y acepto...
    </label>
    <button type="submit">Continuar</button>
```

**Props:**
- `open: boolean`

**Emits:**
- `close: void`

**Data:**
```typescript
form: {
  nombre: '',
  apellido: '',
  email: '',
  phone: '',
  empresa: '',
  urgency: '' as Urgency,
}
selectedCountry: Country (default: EC)
submitting: ref(false)
```

**Urgency options:**
- `'immediate'` → tags: `['web-lead', 'funnel-registro', 'urgente', 'contrato-inmediato']`
- `'next-month'` → tags: `[..., 'urgencia-media']`
- `'just-looking'` → tags: `[..., 'no-urgente', 'explorando']`

**Validation:**
- Email required, phone valid per country, 10+ word note field
- Consent checkbox required

**Countries:** LATAM priority (EC, CO, PE, MX, AR, CL, VE, BO, PY, UY) + 100+ others with emoji flags

**On submit:**
- Save to `contactStore`
- `trackStage('registro_inicial', {...})`
- `fbq('Lead', { content_name: 'funnel-registro' })`
- Router: `/ver-video`

**localStorage:**
- `os_contact` (via store)
- `os_fb` (Facebook params capture)

---

### src/components/RegistrationModal.vue
**Template:**
```html
<dialog open={open} @close="emit('close')">
  <form @submit.prevent="handleSubmit">
    <h2>Información de contacto</h2>
    <ContactWizard />
    <button type="submit">Continuar</button>
```

**Props:**
- `open: boolean`

**Emits:**
- `close: void`

**State:** Wraps `ContactWizard` or its own form

---

### src/components/CalendarModal.vue
**Template:**
```html
<dialog open={open}>
  <form @submit.prevent="handleSubmit">
    <h3>Últimos detalles</h3>
    <select name="sector">
      <option value="residencial">Proyecto residencial (Casa/Depto)</option>
      <option value="comercial">Proyecto comercial (Local/Oficina)</option>
      <option value="nautico">Proyecto náutico</option>
    </select>
    <select name="embarcaciones">... (project scope)</select>
    <select name="hp">... (design style)</select>
    <select name="presupuesto">
      <option value="menos1200">Menos de $1,200 USD</option>
      <option value="mas1200">Al menos $1,200 USD</option>
      <option value="mas2000">Más de $2,000 USD</option>
    </select>
    <textarea name="reto" placeholder="En 10+ palabras, describe..." />
    <label>
      <input type="checkbox" name="consent" />
      He leído y acepto...
    </label>
    <button type="submit">Agendar ahora</button>
```

**Props:**
- `open: boolean`

**Emits:**
- `close: void`

**Data:**
```typescript
form: {
  sector: '',
  embarcaciones: '',
  hp: '',
  presupuesto: '',
  reto: '',
  consent: false,
}
```

**Validation:**
- All fields required
- `reto` minimum 10 words
- `presupuesto !== 'menos1200'` → qualifies

**On submit:**
- If no qualify: route `/sin-espacio` + set `os_disq_at`
- If qualify: `trackStage('schedule', {...})` + open GHL calendar
- Tags applied per selection: `tipo-{sector}`, `espacio-{embarcaciones}`, `estilo-{hp}`, `budget-{presupuesto}`

**localStorage:**
- `os_contact` (read)

---

### src/components/TheScrollOverlay.vue
**Template:**
```html
<div class="scroll-overlay">
  <div class="scroll-overlay__icon-wrapper">
    <div class="scroll-overlay__mouse">
      <div class="scroll-overlay__wheel"></div>
    </div>
  </div>
  <h2 class="scroll-overlay__title">Para empezar la experiencia</h2>
  <p class="scroll-overlay__description">Desliza hacia abajo para descubrir...</p>
  <svg class="scroll-overlay__arrows"> <!-- 2 down arrows --> </svg>
```

**Props:** None

**Hardcoded copy:**
- Title: "Para empezar la experiencia"
- Description: "Desliza hacia abajo para descubrir toda la información"

---

### src/components/booked/*.vue

#### BookedHeader.vue
- Logo + title bar

#### BookedHero.vue
**Props:**
- `contactName?: string`

**Template:**
```html
<section class="booked-hero">
  <i class="fa-solid fa-circle-check" />
  <h1>¡Listo, {{ contactName }}!</h1>
  <p>En breve recibirás un correo...</p>
```

#### BookedSteps.vue
**Hardcoded:**
- 3 steps: email, contact, prepare project
- Icon + title + description per step

#### BookedTeam.vue
**Import:** `alePhoto from '@/assets/team/ale-barreto.png'`

**Template:**
- Photo of Ale
- Bio text

#### BookedFooter.vue
- Bakano logo + contact info

---

## STORES & COMPOSABLES

### src/stores/contact.ts
```typescript
export interface BkContact {
  nombre: string
  apellido: string
  negocio: string
  email: string
  telefono: string
  timestamp?: number
}

const STORAGE_KEY = 'os_contact'

export const useContactStore = defineStore('contact', () => {
  const contact = ref<BkContact>({...})
  
  function save(data: Partial<BkContact>) {
    Object.assign(contact.value, data, { timestamp: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contact.value))
  }
  
  function get(): BkContact { ... }
  function clear() { ... }
})
```

**localStorage:** `os_contact` (JSON string)

---

### src/composables/useContactModal.ts
**Exports:** Hook for modal management (re-usable logic)

---

## UTILS

### src/utils/ghl.ts
```typescript
const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/b26ee589-52a8-4240-893c-7d1aaa53696a'

export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random()...}`
}

export async function trackStage(etapa: string, data: Record<string, string>) {
  await fetch(GHL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ etapa, event_id, ...data }),
  })
}
```

**Stages tracked:**
- `lead_capturado` (VideoView capture form)
- `schedule` (CalendarModal submit)
- `view` (generic page views)

---

### src/utils/fbclid.ts
```typescript
const STORAGE_KEY = 'os_fb'

export interface FbParams {
  fbclid?: string
  fbc?: string
  fbp?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_id?: string
}

export function captureFbParams(): void {
  // Read URL params + existing sessionStorage/localStorage
  // Persist fbclid, UTMs, _fbc, _fbp
}

export function getStoredFbParams(): FbParams {
  // Read from localStorage.os_fb
}
```

**localStorage:** `os_fb` (JSON with Facebook + UTM params)

---

## STYLES

### src/styles/colorVariables.module.scss
```scss
$BAKANO-GREEN:   #4CAF50
$BAKANO-BLUE:    #0066FF
$BAKANO-DARK:    #0D1B2A
$BAKANO-LIGHT:   #F0F6FF
$BAKANO-SURFACE: #F5F8FF
```

### src/styles/global.scss
- Reset, typography, button defaults, modal styles

### src/styles/fonts.modules.scss
- Font imports (Outfit, Plus Jakarta Sans, Space Grotesk, Manrope)

---

## LOCALSTORAGE KEYS SUMMARY

| Key | TTL | Used by | Purpose |
|-----|-----|---------|---------|
| `os_contact` | Session | ContactStore, VideoView, CalendarModal | Contact form data (nombre, apellido, email, telefono, negocio) |
| `os_fb` | Session | fbclid.ts, FunnelView | Facebook fbclid + UTM params |
| `os_booked_at` | 3 days | Router guards, BookedView | Booking timestamp for route protection |
| `os_disq_at` | 48 hours | Router guards, NoSpaceView | Disqualification timestamp for 48h gate |
| `os_complete_fired` | Session (sessionStorage) | BookedView | Prevents duplicate fbq CompleteRegistration event |

---

## EXTERNAL INTEGRATIONS

| Service | Endpoint / ID | Used in |
|---------|---------------|---------|
| **Wistia** | `5ql8l131me` | index.html, VideoView |
| **Meta Pixel** | `26594099306899876` | index.html, all views (fbq tracking) |
| **GHL Webhook** | `https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/b26ee589-52a8-4240-893c-7d1aaa53696a` | CalendarModal, VideoView (trackStage) |
| **GHL Calendar** | `https://api.leadconnectorhq.com/` | BookingView (iframe embed) |
| **Cloudinary** | `dpimsaaa4` | TheHero.vue (video + images) |

---

## CURRENT PAGE COPY (KEY STRINGS)

### FunnelView
- "15+ Años trabajando con maderas nobles y certificadas"
- "500+ Proyectos residenciales y comerciales entregados"
- "100% Compromiso con la calidad artesanal y diseño premium"
- "Sin materiales de baja calidad que se deterioran rápido"
- "Sin diseños genéricos que no aprovechan tu espacio"
- "Sin retrasos en la entrega de tu proyecto"

### VideoView
- "Mira el video"
- (Countdown timer: "2:00" → "0:00")
- "Agendar ahora" (CTA unlocks after countdown)

### CalendarModal
- Sector options: "Proyecto residencial (Casa/Depto)", "Proyecto comercial (Local/Oficina)", "Proyecto náutico"
- Budget options: "Menos de $1,200 USD", "Al menos $1,200 USD", "Más de $2,000 USD"

### BookedView
- "¡Listo, {nombre}!" or "¡Tu cita está confirmada!"
- "En breve recibirás un correo con todos los detalles. Un miembro del equipo de Bakano te contactará..."
- Step 1: "Revisa tu email"
- Step 2: "Espera el contacto"
- Step 3: "Prepara tu proyecto"

### NoSpaceView
- "Sin espacio disponible"
- "Determinamos si eres candidato o no."
- "Qué está bloqueando tu recuperación"
- "Cómo es el proceso"
- "Resultados garantizados"
- Teaser: "Prepárate para tu siguiente oportunidad"

---

## REWRITE PRIORITIES

1. **TheHero.vue** → Replace Cloudinary URLs, hardcoded stats, GSAP animations (keep structure)
2. **TheStrategies.vue** → New pillar copy, layout preservation
3. **TheTestimonials.vue** + **TestimonialCard.vue** → New testimonials, images, video URLs
4. **TheContact.vue** + **ContactWizard.vue** → New stats, form labels (same flow)
5. **CalendarModal.vue** → New qualification questions, budget ranges, sector types
6. **VideoView.vue** → New VSL Wistia ID, gate copy
7. **BookedView.vue** → Personalization logic, step names, next-step teaser
8. **NoSpaceView.vue** → New waitlist/rejection copy
9. **index.html** + **router/index.ts** → Update meta tags, canonical, JSON-LD org data
10. **colorVariables.module.scss** → New brand palette

