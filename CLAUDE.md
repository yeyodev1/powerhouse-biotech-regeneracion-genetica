# PowerHouse Biotech — Funnel VSL Evaluación de Viabilidad Regenerativa™

## Proyecto
Repo es el **funnel de captación** de PowerHouse Biotech (PHB) — primera *Health Decision Platform* enfocada en Medicina Regenerativa. PHB no vende tratamiento; vende criterio clínico: la **Evaluación de Viabilidad Regenerativa™** que decide si el cuerpo del paciente puede regenerarse antes de aplicar terapias avanzadas.

Funnel multi-paso orientado a **Consulta Informativa gratuita**. Solo se acepta el 20% de las aplicaciones — la calificación es parte del producto.

## Stack
- **Vue 3** + Vite 7 + TypeScript
- **SCSS** con variables en `src/styles/colorVariables.module.scss`
- **GSAP** instalado (heredado del template AB; uso parcial en TheHero/TheStrategies/TheTestimonials)
- **pnpm** como package manager
- **Pinia** (`useContactStore`) + **vue-router** (rutas funnel + legales)
- **FontAwesome 6** (CDN en index.html). Sin emojis — usar `<i class="fa-solid fa-...">`.

## Flujo del Funnel
```
/ (FunnelView)
  ↓ [submit RegistrationModal → router.push('/ver-video')]
/ver-video (VideoView)            ← VSL Wistia; CTA bloqueado durante el video; guard de contacto
  ↓ [popup CalendarModal → calificación clínica]
/agendar (BookingView)            ← GHL calendar iframe (pre-llenado con datos del contacto)
  ↓ [postMessage('msgsndr-booking-complete')]
/cita-confirmada (BookedView)     ← Confirmación + 4 pasos previos a la sesión
  ↓ [no califica en CalendarModal]
/sin-espacio (NoSpaceView)        ← Rechazo empático + recurso educativo + cooldown 24h
```

## LocalStorage — claves en uso
| Clave | Contenido | Quién lo escribe |
|---|---|---|
| `os_contact` | `{ nombre, apellido, email, telefono, motivoConsulta, ... }` | RegistrationModal + VideoView guard + ContactWizard |
| `os_disq_at` | timestamp (ms) | CalendarModal al descalificar |
| `os_booked_at` | timestamp (ms) | BookingView al confirmar cita |
| `os_complete_fired` | `'1'` | VideoView al disparar Pixel `CompleteRegistration` (solo una vez) |
| `os_fb` (sessionStorage) | `{ fbclid, fbc, fbp, utm_* }` | `captureFbParams()` en FunnelView onMounted |

> **Nota:** las claves `os_*` son legacy del template original. Se mantienen porque cambiarlas requiere tocar 7+ archivos y no hay usuarios en producción aún. Si reviven analytics, considerar migrar a `phb_*` en una pasada dedicada.

## Guards de seguridad (router)
- **TTL de cita**: `os_booked_at` < 3 días → bloquea acceso a `/cita-confirmada` salvo si fue recién creada.
- **TTL de descalificación**: `os_disq_at` < 48h → redirige `/agendar`/`/cita-confirmada` a `/sin-espacio`.
- **Acceso directo a `/sin-espacio`** sin descalificación reciente → redirige a `/`.
- **Localhost**: guards de descalificación se desactivan en desarrollo (`window.location.hostname === 'localhost'`).

## CalendarModal — calificación clínica
Tres preguntas. Disqualifying combos:
- **Q1 condición principal** = `otra` → descalifica.
- **Q3 expectativa** = `cura total` → descalifica con redirección educativa (no es una promesa que PHB haga).
- Cualquier otra ruta → califica → `/agendar`.

## GHL Calendar
- URL: `// TODO: replace with PHB calendar URL`. Mientras tanto se usa el iframe stub heredado.
- Pre-fill params: `?firstName=...&email=...&phone=...` (leídos de `os_contact`).
- Confirmación: `postMessage(['msgsndr-booking-complete', {...}])`.
- Altura dinámica: `postMessage({ type: 'booking-app', height: N })`.

## GHL Webhook (tracking de etapas)
`src/utils/ghl.ts` → `trackStage(etapa, data)` → POST a webhook `services.leadconnectorhq.com/hooks/.../webhook-trigger/...`. Etapas PHB:
- `application_started` (CTA hero clickeado)
- `application_submitted` (RegistrationModal submit)
- `vsl_started` / `vsl_completed`
- `qualified` / `disqualified`
- `booking_completed`

## Estructura clave
```
src/
  views/
    FunnelView.vue          ← / — orquesta TheHero + TheStrategies (DECI) + TheTestimonials + TheContact
    VideoView.vue           ← /ver-video — VSL Wistia + guard de contacto
    BookingView.vue         ← /agendar — GHL calendar iframe pre-llenado
    BookedView.vue          ← /cita-confirmada — orquestador de subcomponentes
    NoSpaceView.vue         ← /sin-espacio — rechazo + recurso educativo + cooldown 24h
    PrivacyPolicyView.vue   ← /politicas-privacidad
    LegalNoticeView.vue     ← /aviso-legal
  components/
    TheHero.vue             ← Headline + 3 bullets + stats rotativos + 4 pillar cards + scarcity 20%
    TheStrategies.vue       ← Metodología DECI (4 fases: Detectar / Evaluar / Clarificar / Identificar)
    TheTestimonials.vue     ← 3 testimonios pacientes (TODO: contenido real con consent)
    TestimonialCard.vue     ← Card de testimonio (quote + paciente + CTA "Ver testimonio")
    TheContact.vue          ← Sección de contacto (left copy + ContactWizard a la derecha)
    ContactWizard.vue       ← Form multi-paso (nombre, email, teléfono, motivoConsulta, urgencia, estudios)
    RegistrationModal.vue   ← Modal de captura inicial (pre-VSL)
    CalendarModal.vue       ← Modal de calificación clínica (3 preguntas)
    TheScrollOverlay.vue    ← Overlay GSAP "DESLIZA" / "SCROLL" entre secciones
    booked/
      BookedHero.vue        ← "Tu Evaluación está agendada, [nombre]"
      BookedSteps.vue       ← 4 pasos previos (email, cuestionario, laboratorios, sesión)
      BookedTeam.vue        ← Bio del equipo médico
      BookedHeader.vue
      BookedFooter.vue
  styles/
    colorVariables.module.scss   ← $PHB-NAVY / $PHB-TEAL / $PHB-VIOLET / $PHB-PULSE + aliases legacy
    fonts.modules.scss           ← $font-principal Outfit / $font-secondary Plus Jakarta / $font-fallback Inter
  utils/
    ghl.ts                  ← trackStage() → GHL webhook
    fbclid.ts               ← captureFbParams() → sessionStorage 'os_fb'
  stores/
    contact.ts              ← Pinia useContactStore — persistencia en 'os_contact'
  composables/
    useContactModal.ts      ← isOpen / open / close para modal de captura
  assets/
    logos/                  ← Logo-large.png, logo-small.png (TODO: reemplazar con logo PHB)
    team/                   ← ale-barreto.png (TODO: reemplazar con foto del médico director)
    testimonios/            ← johanna/mariaisabel/mauro/nicole (TODO: reemplazar con pacientes reales con consent)
```

## Voz y tono — PHB
- **Autoridad clínica** sobre marketing agresivo. No "explota tu negocio", no "7 cifras", no "garantía total".
- **Honestidad por encima de promesa**. "No todos los cuerpos están listos para regenerarse" es el ancla del mensaje.
- **Criterio sobre volumen**. La fricción del 20% es el filtro, no un tope artificial.
- **No diagnóstico ni promesa de cura**. PHB **evalúa viabilidad** y orienta — no garantiza resultados ni reemplaza al médico tratante.

## Disclaimers regulatorios — qué SIEMPRE incluir
- "No reemplazamos al médico tratante. Solo orientamos decisiones."
- "PowerHouse Biotech no garantiza resultados clínicos."
- "Toda terapia regenerativa debe realizarse bajo supervisión médica especializada y con consentimiento informado."
- En Ecuador: cualquier mención de tratamiento debe respetar normativa **ARCSA** (no publicidad de fármacos no aprobados, no promesas terapéuticas no avaladas).

## Colores de marca (PHB — clínico)
```scss
// Variables en colorVariables.module.scss
$PHB-NAVY:    #0A2540   // Brand principal / texto
$PHB-INK:     #0F1A2E   // Secciones oscuras
$PHB-TEAL:    #00B4A6   // Regeneración / accent
$PHB-VIOLET:  #6E4BFF   // Premium / científico
$PHB-MIST:    #F4F8FB   // Fondo claro
$PHB-CLOUD:   #E6EEF5   // Superficie/cards
$PHB-PULSE:   #FF4D6D   // Urgencia / scarcity / disqualify
```
Aliases `$BAKANO-*`, `$AB-*`, `$OS-*` apuntan a la paleta PHB para no romper imports legacy.

## Fuentes
- Headings: **Outfit** (700-800)
- Body: **Plus Jakarta Sans**
- Accent / CTAs: **Space Grotesk** (heredado)
- UI: **Manrope**
- Fallback / data clínica: **Inter**

## Imágenes CDN
- Cloudinary cloud: `dpimsaaa4` (heredado AB) → **TODO: migrar a cuenta PHB**.
- Wistia VSL ID actual: `5ql8l131me` (placeholder AB) → **TODO: reemplazar con video PHB**.

## Comandos
```bash
pnpm dev        # desarrollo local
pnpm build      # build de producción
pnpm type-check # TypeScript check
```

## No hacer
- No agregar Header/Footer global de navegación (la app no los monta).
- No usar emojis — íconos FontAwesome (`<i class="fa-solid fa-...">`).
- No prometer cura, garantía de resultado, ni hacer claims terapéuticos no avalados.
- No usar la copy heredada de Ale Barreto / Bakano (madera, Lean Startup, "7 cifras", "Honda Marine"). Cualquier residuo es un bug.
- No commitear ni hacer git operations — el usuario commitea manualmente.

## TODOs abiertos (assets / branding)
- [ ] Logo PHB (SVG + PNG 512px) → reemplaza `Logo-large.png`, `logo-small.png`.
- [ ] Foto del médico director / specialist principal → reemplaza `ale-barreto.png`.
- [ ] Wistia VSL ID definitivo → swap en `index.html` + componentes.
- [ ] GHL calendar URL definitiva → `BookingView.vue`.
- [ ] Meta Pixel ID PHB → swap en `index.html`.
- [ ] 3 testimonios de pacientes reales con consent → swap en `TheTestimonials.vue`.
- [ ] Razón social, RUC, dirección, email DPO → `PrivacyPolicyView.vue` + `LegalNoticeView.vue`.
- [ ] Cloudinary cuenta PHB → migrar URLs en componentes que usan `dpimsaaa4`.
- [ ] PDF "Cómo prepararte para una terapia regenerativa" → linkear desde `NoSpaceView.vue`.
