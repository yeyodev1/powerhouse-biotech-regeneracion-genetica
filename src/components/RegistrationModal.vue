<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { parsePhoneNumberFromString, getCountries, getCountryCallingCode, AsYouType } from 'libphonenumber-js'
import { useRouter } from 'vue-router'
import { getStoredFbParams } from '@/utils/fbclid'
const router = useRouter()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// ── Países con emoji flag ─────────────────────────────────────────────────────
interface Country { code: string; name: string; dial: string; flag: string }

const flagEmoji = (code: string) =>
  [...code.toUpperCase()].map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('')

// Lista curada: LATAM primero, luego resto
const PRIORITY = ['EC', 'CO', 'PE', 'MX', 'AR', 'CL', 'VE', 'BO', 'PY', 'UY', 'GT', 'HN', 'SV', 'CR', 'PA', 'DO', 'CU', 'US', 'ES']

const nameMap: Record<string, string> = {
  EC: 'Ecuador', CO: 'Colombia', PE: 'Perú', MX: 'México', AR: 'Argentina',
  CL: 'Chile', VE: 'Venezuela', BO: 'Bolivia', PY: 'Paraguay', UY: 'Uruguay',
  GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador', CR: 'Costa Rica',
  PA: 'Panamá', DO: 'Rep. Dominicana', CU: 'Cuba', US: 'Estados Unidos',
  ES: 'España', BR: 'Brasil', PT: 'Portugal', FR: 'Francia', DE: 'Alemania',
  IT: 'Italia', GB: 'Reino Unido', CA: 'Canadá', AU: 'Australia', JP: 'Japón',
  CN: 'China', IN: 'India',
}

const allCountries: Country[] = getCountries()
  .map(code => ({
    code,
    name: nameMap[code] ?? code,
    dial: '+' + getCountryCallingCode(code),
    flag: flagEmoji(code),
  }))

const priorityList = PRIORITY
  .map(code => allCountries.find(c => c.code === code))
  .filter(Boolean) as Country[]

const otherList = allCountries
  .filter(c => !PRIORITY.includes(c.code))
  .sort((a, b) => a.name.localeCompare(b.name))

const countries = [...priorityList, { code: '---', name: '─────────', dial: '', flag: '' }, ...otherList]

// ── Estado del formulario ─────────────────────────────────────────────────────
const selectedCountry = ref<Country>(priorityList[0])
const dropdownOpen = ref(false)
const countrySearch = ref('')
const submitting = ref(false)

type Urgency = '' | 'immediate' | 'next-month' | 'just-looking'

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  phone: '',
  empresa: '' as string,
  urgency: '' as Urgency,
})

const URGENCY_LABEL: Record<Exclude<Urgency, ''>, string> = {
  'immediate': 'Crítica — busca evaluación clínica este mes',
  'next-month': 'Alta — busca respuesta en 1–3 meses',
  'just-looking': 'Explorando — sin urgencia clínica',
}

const MOTIVO_LABEL: Record<string, string> = {
  'dolor-articular': 'Dolor articular o muscular crónico',
  'fatiga': 'Fatiga crónica o falta de energía',
  'metabolica': 'Problemas metabólicos (peso, diabetes, tiroides)',
  'autoinmune': 'Enfermedad autoinmune o inflamatoria',
  'regenerativa': 'Medicina regenerativa / segunda opinión',
}

const motivoOpts = Object.entries(MOTIVO_LABEL).map(([value, label]) => ({ value, label }))

const urgencyOpts: { value: Exclude<Urgency, ''>; label: string; sub: string; hot?: boolean }[] = [
  { value: 'immediate',   label: 'Necesito atención este mes', sub: 'Urgencia clínica', hot: true },
  { value: 'next-month',  label: 'En los próximos 1–3 meses',     sub: 'Planificación' },
  { value: 'just-looking', label: 'Solo estoy explorando',         sub: 'Sin urgencia' },
]

function calcTags(urgency: Urgency): string[] {
  const base = ['web-lead', 'funnel-registro']
  if (urgency === 'immediate')    return [...base, 'urgente', 'contrato-inmediato']
  if (urgency === 'next-month')   return [...base, 'urgencia-media']
  if (urgency === 'just-looking') return [...base, 'no-urgente', 'explorando']
  return base
}

function buildNote(f: typeof form.value, country: string): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━
🧬 POWERHOUSE BIOTECH — Registro
━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${f.nombre} ${f.apellido}
📧 ${f.email}
📱 ${selectedCountry.value.dial} ${formattedPhone.value}
🌎 País: ${country}
🧬 Motivo de consulta: ${MOTIVO_LABEL[f.empresa] ?? f.empresa}
⏱️ Urgencia: ${f.urgency ? URGENCY_LABEL[f.urgency] : '—'}
🏷️ Landing: landing-regeneracion
━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim()
}

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

// ── Phone formatter (AsYouType) ───────────────────────────────────────────────
const formattedPhone = computed(() => {
  if (!form.value.phone) return ''
  const formatter = new AsYouType(selectedCountry.value.code as any)
  return formatter.input(form.value.phone)
})

const phoneValid = computed(() => {
  const full = selectedCountry.value.dial + form.value.phone.replace(/\s/g, '')
  const parsed = parsePhoneNumberFromString(full, selectedCountry.value.code as any)
  return parsed?.isValid() ?? false
})

const parsedPhoneE164 = computed(() => {
  const full = selectedCountry.value.dial + form.value.phone.replace(/\s/g, '')
  const parsed = parsePhoneNumberFromString(full, selectedCountry.value.code as any)
  return parsed?.format('E.164') ?? ''
})

// ── Validaciones ──────────────────────────────────────────────────────────────
const validators: Record<string, (v: string) => string | null> = {
  nombre: v => v.trim().length < 2 ? 'Ingresa tu nombre' : null,
  apellido: v => v.trim().length < 2 ? 'Ingresa tu apellido' : null,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Email inválido',
  phone: () => phoneValid.value ? null : 'Número inválido para el país seleccionado',
  empresa: v => !v ? 'Selecciona tu motivo de consulta' : null,
  urgency: v => !v ? 'Selecciona cuándo necesitas iniciar' : null,
}

const validate = () => {
  const e: Record<string, string> = {}
  for (const [field, fn] of Object.entries(validators)) {
    const msg = fn(form.value[field as keyof typeof form.value])
    if (msg) e[field] = msg
  }
  errors.value = e
  return Object.keys(e).length === 0
}

const onBlur = (field: string) => {
  touched.value[field] = true
  const msg = validators[field]?.(form.value[field as keyof typeof form.value])
  if (msg) errors.value[field] = msg
  else delete errors.value[field]
}

const onPhoneInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d\s\-\(\)]/g, '')
  form.value.phone = raw
}

// ── Dropdown de país ──────────────────────────────────────────────────────────
const filteredCountries = computed(() => {
  const q = countrySearch.value.toLowerCase()
  if (!q) return countries
  return countries.filter(c =>
    c.code !== '---' && (c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q))
  )
})

const selectCountry = (c: Country) => {
  if (c.code === '---') return
  selectedCountry.value = c
  dropdownOpen.value = false
  countrySearch.value = ''
  form.value.phone = ''
}

const handleClickOutside = (e: MouseEvent) => {
  const el = document.querySelector('.rmodal__phone-wrap')
  if (el && !el.contains(e.target as Node)) dropdownOpen.value = false
}

// ── Submit ────────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  touched.value = { nombre: true, apellido: true, email: true, phone: true, empresa: true, urgency: true }
  if (!validate()) return

  submitting.value = true

  // event_id compartido entre Pixel y CAPI para deduplicación
  const leadEventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`

  const payload = {
    nombre: form.value.nombre.trim(),
    apellido: form.value.apellido.trim(),
    email: form.value.email.trim().toLowerCase(),
    telefono: parsedPhoneE164.value,
    telefonoDisplay: selectedCountry.value.dial + ' ' + formattedPhone.value,
    empresa: form.value.empresa.trim(),
    pais: selectedCountry.value.name,
    urgency: form.value.urgency,
    urgencyLabel: form.value.urgency ? URGENCY_LABEL[form.value.urgency] : '',
    tags: [...calcTags(form.value.urgency), 'landing-regeneracion'],
    landing: 'landing-regeneracion',
    etiquetas: 'landing-regeneracion',
    source: window.location.hostname,
    note: buildNote(form.value, selectedCountry.value.name),
    timestamp: new Date().toISOString(),
    event_id: leadEventId,
    ...getStoredFbParams(),
  }

  console.info('[AleBarreto Registro]', payload)

  await fetch(import.meta.env.VITE_WEBHOOK_REGISTRO, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})

  // Meta Pixel — evento Lead (deduplicado con CAPI via event_id)
  ;(window as any).fbq?.('track', 'Lead',
    { content_name: 'cita-estrategica' },
    { eventID: leadEventId }
  )

  localStorage.setItem('os_contact', JSON.stringify({
    nombre: form.value.nombre.trim(),
    email: form.value.email.trim().toLowerCase(),
    phone: parsedPhoneE164.value,
    timestamp: Date.now(),
  }))
  ;(window as any).fbq?.('track', 'CompleteRegistration')

  submitting.value = false
  emit('close')

  // Disqualify "just-looking" → /sin-espacio (mismo patrón que CalendarModal)
  if (form.value.urgency === 'just-looking') {
    localStorage.setItem('os_disq_at', String(Date.now()))
    router.push('/sin-espacio')
    return
  }

  router.push('/calificar')
}

// ── Keyboard trap ─────────────────────────────────────────────────────────────
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

watch(() => props.open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(dropdownOpen, open => {
  if (open) {
    setTimeout(() => document.querySelector<HTMLInputElement>('.rmodal__country-search')?.focus(), 50)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="rmodal-fade">
      <div v-if="props.open" class="rmodal-overlay" @click.self="$emit('close')" role="dialog" aria-modal="true" aria-labelledby="rmodal-title">

        <div class="rmodal">

          <!-- Close -->
          <button class="rmodal__close" @click="$emit('close')" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- ── FORMULARIO ─────────────────────────────────── -->
          <!-- ── FORMULARIO ─────────────────────────────────── -->
            <p class="rmodal__eyebrow">Consulta con Juan Román Garza</p>
            <h2 id="rmodal-title" class="rmodal__title">Aplica para tu consulta<br><span class="rmodal__title-accent">informativa sin costo</span></h2>
            <p class="rmodal__subtitle">Solo aceptamos el 20% de las aplicaciones. Completa tus datos para que Juan Román Garza evalúe tu caso.</p>

            <form class="rmodal__form" @submit.prevent="handleSubmit" novalidate>

              <!-- Nombre + Apellido -->
              <div class="rmodal__row">
                <div class="rmodal__field" :class="{ 'has-error': touched.nombre && errors.nombre }">
                  <label for="r-nombre">Nombre</label>
                  <input
                    id="r-nombre"
                    v-model="form.nombre"
                    type="text"
                    placeholder="Juan"
                    autocomplete="given-name"
                    @blur="onBlur('nombre')"
                  />
                  <span v-if="touched.nombre && errors.nombre" class="rmodal__error">{{ errors.nombre }}</span>
                </div>

                <div class="rmodal__field" :class="{ 'has-error': touched.apellido && errors.apellido }">
                  <label for="r-apellido">Apellido</label>
                  <input
                    id="r-apellido"
                    v-model="form.apellido"
                    type="text"
                    placeholder="Pérez"
                    autocomplete="family-name"
                    @blur="onBlur('apellido')"
                  />
                  <span v-if="touched.apellido && errors.apellido" class="rmodal__error">{{ errors.apellido }}</span>
                </div>
              </div>

              <!-- Email -->
              <div class="rmodal__field" :class="{ 'has-error': touched.email && errors.email }">
                <label for="r-email">Correo electrónico</label>
                <input
                  id="r-email"
                  v-model="form.email"
                  type="email"
                  placeholder="juan@empresa.com"
                  autocomplete="email"
                  @blur="onBlur('email')"
                />
                <span v-if="touched.email && errors.email" class="rmodal__error">{{ errors.email }}</span>
              </div>

              <!-- Teléfono con selector de país -->
              <div class="rmodal__field" :class="{ 'has-error': touched.phone && errors.phone }">
                <label>Teléfono</label>
                <div class="rmodal__phone-wrap">

                  <!-- Selector de país -->
                  <button
                    type="button"
                    class="rmodal__country-trigger"
                    :aria-expanded="dropdownOpen"
                    aria-haspopup="listbox"
                    @click="dropdownOpen = !dropdownOpen"
                  >
                    <span class="rmodal__flag">{{ selectedCountry.flag }}</span>
                    <span class="rmodal__dial">{{ selectedCountry.dial }}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="rmodal__chevron" :class="{ open: dropdownOpen }">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  <!-- Dropdown -->
                  <Transition name="dropdown">
                    <div v-if="dropdownOpen" class="rmodal__country-dropdown" role="listbox">
                      <input
                        type="text"
                        class="rmodal__country-search"
                        v-model="countrySearch"
                        placeholder="Buscar país..."
                        aria-label="Buscar país"
                      />
                      <ul>
                        <li
                          v-for="c in filteredCountries"
                          :key="c.code"
                          :class="['rmodal__country-item', { separator: c.code === '---', active: c.code === selectedCountry.code }]"
                          role="option"
                          :aria-selected="c.code === selectedCountry.code"
                          @click="selectCountry(c)"
                        >
                          <template v-if="c.code !== '---'">
                            <span class="rmodal__flag">{{ c.flag }}</span>
                            <span class="rmodal__country-name">{{ c.name }}</span>
                            <span class="rmodal__country-dial">{{ c.dial }}</span>
                          </template>
                          <template v-else>
                            <span class="rmodal__sep-line" aria-hidden="true" />
                          </template>
                        </li>
                      </ul>
                    </div>
                  </Transition>

                  <!-- Input numérico -->
                  <input
                    class="rmodal__phone-input"
                    type="tel"
                    :value="form.phone"
                    placeholder="98 493 4039"
                    autocomplete="tel-national"
                    inputmode="tel"
                    @input="onPhoneInput"
                    @blur="onBlur('phone')"
                  />

                  <!-- Indicador de validez -->
                  <span class="rmodal__phone-status" :class="{ valid: phoneValid, invalid: touched.phone && !phoneValid && form.phone }" aria-hidden="true">
                    <svg v-if="phoneValid" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <svg v-else-if="touched.phone && !phoneValid && form.phone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </span>

                </div>
                <span v-if="touched.phone && errors.phone" class="rmodal__error">{{ errors.phone }}</span>
                <span v-if="phoneValid && parsedPhoneE164" class="rmodal__phone-preview">
                  {{ selectedCountry.flag }} {{ selectedCountry.dial }} {{ formattedPhone }} · E.164: {{ parsedPhoneE164 }}
                </span>
              </div>

              <!-- Motivo de consulta — clickable -->
              <div class="rmodal__field rmodal__field--motivo" :class="{ 'has-error': touched.empresa && errors.empresa }">
                <label>Motivo de tu consulta</label>
                <div class="rmodal__motivo-opts" role="radiogroup">
                  <label
                    v-for="opt in motivoOpts"
                    :key="opt.value"
                    class="rmodal__motivo-opt"
                    :class="{ 'rmodal__motivo-opt--sel': form.empresa === opt.value }"
                  >
                    <input
                      type="radio"
                      v-model="form.empresa"
                      :value="opt.value"
                      class="sr-only"
                      @change="onBlur('empresa')"
                    />
                    <span class="rmodal__motivo-opt-dot" aria-hidden="true"></span>
                    <span class="rmodal__motivo-opt-text">{{ opt.label }}</span>
                  </label>
                </div>
                <span v-if="touched.empresa && errors.empresa" class="rmodal__error">{{ errors.empresa }}</span>
              </div>

              <!-- Urgencia -->
              <div class="rmodal__field rmodal__field--urgency" :class="{ 'has-error': touched.urgency && errors.urgency }">
                <label class="rmodal__urgency-label">
                  <i class="fa-solid fa-bolt" aria-hidden="true"></i>
                  ¿Cuándo necesitas esta consulta?
                </label>
                <div class="rmodal__urgency-opts" role="radiogroup">
                  <label
                    v-for="opt in urgencyOpts"
                    :key="opt.value"
                    class="rmodal__urgency-opt"
                    :class="{
                      'rmodal__urgency-opt--sel': form.urgency === opt.value,
                      'rmodal__urgency-opt--hot': opt.hot,
                      'rmodal__urgency-opt--hot-sel': opt.hot && form.urgency === opt.value,
                    }"
                  >
                    <input
                      type="radio"
                      v-model="form.urgency"
                      :value="opt.value"
                      class="rmodal__urgency-radio sr-only"
                      @change="onBlur('urgency')"
                    />
                    <span class="rmodal__urgency-opt-dot" aria-hidden="true"></span>
                    <span class="rmodal__urgency-opt-text">
                      <strong>{{ opt.label }}</strong>
                      <small>{{ opt.sub }}</small>
                    </span>
                    <i v-if="opt.hot" class="fa-solid fa-fire rmodal__urgency-opt-flame" aria-hidden="true"></i>
                  </label>
                </div>
                <span v-if="touched.urgency && errors.urgency" class="rmodal__error">{{ errors.urgency }}</span>
              </div>

              <!-- Submit -->
              <button
                class="rmodal__submit"
                :class="{ 'rmodal__submit--urgent': form.urgency === 'immediate' }"
                type="submit"
                :disabled="submitting"
              >
                <svg v-if="submitting" class="rmodal__spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <template v-else>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </template>
                {{ submitting
                  ? 'Enviando...'
                  : (form.urgency === 'immediate' ? 'RESERVAR MI CUPO AHORA' : 'AGENDAR MI ASESORÍA') }}
              </button>

              <p class="rmodal__legal">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                100% gratuito · Sin compromiso · Tus datos están seguros
              </p>

            </form>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use '@/styles/fonts.modules.scss' as fonts;

$bg: #ffffff;
$border: rgba(colors.$OS-NAVY, 0.1);
$input-bg: #f9fbff;
$text-muted: #7a8ea5;
$text-body: #3a4f6a;
$accent: colors.$OS-RED;

// ── Overlay ──────────────────────────────────────────────────────────────────
.rmodal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

// ── Modal box ─────────────────────────────────────────────────────────────────
.rmodal {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: $bg;
  border: 1px solid $border;
  border-radius: 24px;
  padding: 48px 40px 40px;
  box-shadow:
    0 10px 40px rgba(colors.$OS-NAVY, 0.08),
    0 40px 100px rgba(colors.$OS-NAVY, 0.12);
  max-height: 92vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 560px) {
    padding: 44px 20px 32px;
    border-radius: 20px;
  }
}

// ── Close ─────────────────────────────────────────────────────────────────────
.rmodal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid $border;
  background: rgba(255,255,255,0.03);
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba($accent, 0.4);
    color: $accent;
    background: rgba($accent, 0.06);
  }
}

// ── Header ────────────────────────────────────────────────────────────────────
.rmodal__eyebrow {
  font-family: fonts.$font-accent;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: $accent;
  margin: 0 0 12px;
}

.rmodal__title {
  font-family: fonts.$font-principal;
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.18;
  color: colors.$OS-DARK;
  margin: 0 0 8px;
}

.rmodal__title-accent {
  color: $accent;
}

.rmodal__subtitle {
  font-family: fonts.$font-secondary;
  font-size: 0.88rem;
  color: $text-muted;
  margin: 0 0 28px;
}

// ── Form ──────────────────────────────────────────────────────────────────────
.rmodal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rmodal__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
}

.rmodal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-family: fonts.$font-interface;
    font-size: 0.74rem;
    font-weight: 600;
    color: #4a5f7a;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    background: $input-bg;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 11px 14px;
    font-family: fonts.$font-secondary;
    font-size: 0.92rem;
    color: colors.$OS-DARK;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

    &::placeholder { color: #b8cae0; }

    &:focus {
      border-color: rgba($accent, 0.5);
      background: rgba($accent, 0.04);
      box-shadow: 0 0 0 3px rgba($accent, 0.08);
    }
  }

  &.has-error input {
    border-color: rgba(255, 80, 100, 0.5);
  }
}

.rmodal__error {
  font-family: fonts.$font-interface;
  font-size: 0.72rem;
  color: #ff6680;
}

// ── Phone ─────────────────────────────────────────────────────────────────────
.rmodal__phone-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  background: $input-bg;
  border: 1px solid $border;
  border-radius: 10px;
  overflow: visible;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: rgba($accent, 0.5);
    box-shadow: 0 0 0 3px rgba($accent, 0.08);
  }

  .has-error & {
    border-color: rgba(255, 80, 100, 0.5);
  }
}

.rmodal__country-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 10px 11px 14px;
  background: none;
  border: none;
  border-right: 1px solid $border;
  cursor: pointer;
  color: colors.$white;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
  border-radius: 10px 0 0 10px;

  &:hover {
    background: rgba(255,255,255,0.04);
  }
}

.rmodal__flag {
  font-size: 1.1rem;
  line-height: 1;
}

.rmodal__dial {
  font-family: fonts.$font-accent;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4a5f7a;
}

.rmodal__chevron {
  opacity: 0.4;
  transition: transform 0.2s ease;

  &.open {
    transform: rotate(180deg);
    opacity: 0.7;
  }
}

// ── Country dropdown ──────────────────────────────────────────────────────────
.rmodal__country-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  width: 280px;
  max-height: 240px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;

  @media (max-width: 560px) {
    width: 240px;
  }
}

.rmodal__country-search {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  color: colors.$OS-DARK;
  font-family: fonts.$font-secondary;
  font-size: 0.84rem;
  outline: none;
  border-radius: 12px 12px 0 0;

  &::placeholder { color: #b8cae0; }
}

.rmodal__country-dropdown ul {
  list-style: none;
  padding: 4px;
  margin: 0;
  overflow-y: auto;
  max-height: 190px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
}

.rmodal__country-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(.separator) {
    background: rgba($accent, 0.08);
  }

  &.active {
    background: rgba($accent, 0.12);
  }

  &.separator {
    padding: 4px 10px;
    cursor: default;
  }
}

.rmodal__sep-line {
  display: block;
  height: 1px;
  width: 100%;
  background: rgba(255,255,255,0.07);
}

.rmodal__country-name {
  font-family: fonts.$font-secondary;
  font-size: 0.82rem;
  color: #3a4f6a;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rmodal__country-dial {
  font-family: fonts.$font-accent;
  font-size: 0.75rem;
  color: #a0b0c5;
  flex-shrink: 0;
}

// ── Phone input + status ──────────────────────────────────────────────────────
.rmodal__phone-input {
  flex: 1;
  min-width: 0;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 11px 40px 11px 12px !important;
  font-family: fonts.$font-secondary;
  font-size: 0.92rem;
  color: colors.$OS-DARK;
  outline: none !important;
  box-shadow: none !important;

  &::placeholder { color: #b8cae0; }
}

.rmodal__phone-status {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.valid {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  &.invalid {
    background: rgba(255, 80, 100, 0.1);
    color: #ff6680;
  }
}

.rmodal__phone-preview {
  font-family: fonts.$font-interface;
  font-size: 0.68rem;
  color: #10b981;
  padding: 2px 0;
}

// ── Submit ─────────────────────────────────────────────────────────────────────
.rmodal__submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  padding: 15px 24px;
  font-family: fonts.$font-interface;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #ffffff;
  background: $accent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba($accent, 0.35);
  transition: transform 0.2s ease, box-shadow 0.25s ease, opacity 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(colors.$BAKANO-PINK, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.rmodal__spinner {
  animation: spin 0.8s linear infinite;
}

.rmodal__legal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  color: $text-muted;
  margin: 4px 0 0;

  svg { opacity: 0.5; flex-shrink: 0; }
}

// ── Thank You step ────────────────────────────────────────────────────────────
.rmodal__ty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
  padding: 4px 0 0;
}

.rmodal__ty-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 50px;
  background: rgba(colors.$BAKANO-GREEN, 0.12);
  border: 1px solid rgba(colors.$BAKANO-GREEN, 0.25);
  font-family: fonts.$font-interface;
  font-size: 0.72rem;
  font-weight: 600;
  color: colors.$BAKANO-GREEN;
  letter-spacing: 0.5px;
}

.rmodal__ty-title {
  font-family: fonts.$font-principal;
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: colors.$white;
  margin: 0;
}

.rmodal__ty-sub {
  font-family: fonts.$font-secondary;
  font-size: 0.95rem;
  color: $text-body;
  line-height: 1.6;
  margin: 0;
}

.rmodal__ty-disclaimer {
  font-family: fonts.$font-interface;
  font-size: 0.68rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.22);
  max-width: 420px;
  margin: 0;
}

.hide-mobile {
  @media (max-width: 480px) { display: none; }
}

// ── Team cards ────────────────────────────────────────────────────────────────
.rmodal__team {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.rmodal__team-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid $border;
  border-radius: 14px;
  flex: 1;
  min-width: 180px;
  max-width: 220px;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba(colors.$BAKANO-PINK, 0.2);
    background: rgba(colors.$BAKANO-PINK, 0.03);
  }
}

.rmodal__team-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  border: 2px solid rgba(colors.$BAKANO-PINK, 0.3);
  flex-shrink: 0;
}

.rmodal__team-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;

  strong {
    font-family: fonts.$font-interface;
    font-size: 0.82rem;
    font-weight: 700;
    color: colors.$white;
  }

  span {
    font-family: fonts.$font-interface;
    font-size: 0.68rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.3;
  }
}

.rmodal__submit--calendar {
  animation: cta-glow 2.5s ease-in-out infinite;
}

@keyframes cta-glow {
  0%, 100% { box-shadow: 0 8px 28px rgba(colors.$BAKANO-PINK, 0.35); }
  50% { box-shadow: 0 8px 44px rgba(colors.$BAKANO-PINK, 0.6); }
}

// ── Urgency field ─────────────────────────────────────────────────────────────
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.rmodal__field--urgency {
  gap: 8px;
}

.rmodal__urgency-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  i {
    color: colors.$AB-URGENT;
    font-size: 0.78rem;
  }
}

.rmodal__motivo-opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rmodal__motivo-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  background: $input-bg;
  border: 1px solid $border;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.2s;
  min-width: 0;

  &:hover {
    border-color: rgba($accent, 0.4);
    background: rgba($accent, 0.04);
  }

  &--sel {
    border-color: $accent;
    background: rgba($accent, 0.08);
    box-shadow: 0 0 0 3px rgba($accent, 0.08);

    .rmodal__motivo-opt-dot {
      border-color: $accent;
      background: $accent;
      box-shadow: inset 0 0 0 3px #ffffff;
    }

    .rmodal__motivo-opt-text {
      color: colors.$OS-DARK;
      font-weight: 600;
    }
  }

  &-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #c5d3e3;
    background: #ffffff;
    flex-shrink: 0;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }

  &-text {
    font-size: 0.88rem;
    color: #3a4f6a;
    font-weight: 500;
    line-height: 1.3;
    flex: 1;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}

.rmodal__field--motivo {
  gap: 8px;
}

.rmodal__urgency-opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rmodal__urgency-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  background: $input-bg;
  border: 1px solid $border;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.2s;
  position: relative;

  &:hover {
    border-color: rgba($accent, 0.4);
    background: rgba($accent, 0.04);
  }

  &--sel {
    border-color: $accent;
    background: rgba($accent, 0.08);
    box-shadow: 0 0 0 3px rgba($accent, 0.08);
  }

  &--hot {
    border-color: rgba(colors.$AB-URGENT, 0.35);
    background: colors.$AB-URGENT-BG;

    &:hover {
      border-color: colors.$AB-URGENT;
      background: rgba(colors.$AB-URGENT, 0.08);
    }
  }

  &--hot-sel {
    border-color: colors.$AB-URGENT !important;
    background: rgba(colors.$AB-URGENT, 0.12) !important;
    box-shadow: 0 0 0 3px rgba(colors.$AB-URGENT, 0.18) !important;

    .rmodal__urgency-opt-dot {
      border-color: colors.$AB-URGENT;
      background: colors.$AB-URGENT;
      box-shadow: inset 0 0 0 3px #ffffff;
    }

    .rmodal__urgency-opt-text strong {
      color: colors.$AB-URGENT-DARK;
    }
  }
}

.rmodal__urgency-opt-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #c5d3e3;
  background: #ffffff;
  flex-shrink: 0;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;

  .rmodal__urgency-opt--sel & {
    border-color: $accent;
    background: $accent;
    box-shadow: inset 0 0 0 3px #ffffff;
  }
}

.rmodal__urgency-opt-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  strong {
    font-family: fonts.$font-interface;
    font-size: 0.88rem;
    font-weight: 700;
    color: colors.$OS-DARK;
    line-height: 1.25;
  }

  small {
    font-family: fonts.$font-secondary;
    font-size: 0.74rem;
    color: $text-muted;
  }
}

.rmodal__urgency-opt-flame {
  color: colors.$AB-URGENT;
  font-size: 0.95rem;
  flex-shrink: 0;
  animation: flame-flicker 1.6s infinite;
}

@keyframes flame-flicker {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.92); }
}

// ── Submit (urgent variant) ───────────────────────────────────────────────────
.rmodal__submit--urgent {
  background: linear-gradient(90deg, colors.$AB-URGENT 0%, colors.$AB-URGENT-DARK 100%);
  box-shadow: 0 8px 28px rgba(colors.$AB-URGENT, 0.45);
  animation: urgent-pulse 2s ease-in-out infinite;

  &:hover:not(:disabled) {
    box-shadow: 0 14px 40px rgba(colors.$AB-URGENT, 0.6);
  }
}

@keyframes urgent-pulse {
  0%, 100% { box-shadow: 0 8px 28px rgba(colors.$AB-URGENT, 0.45); }
  50%      { box-shadow: 0 8px 44px rgba(colors.$AB-URGENT, 0.7); }
}

// ── Transiciones ──────────────────────────────────────────────────────────────
.rmodal-fade-enter-active {
  transition: opacity 0.3s ease, backdrop-filter 0.3s ease;

  .rmodal {
    transition: opacity 0.3s ease, transform 0.38s cubic-bezier(0.34, 1.4, 0.64, 1);
  }
}

.rmodal-fade-leave-active {
  transition: opacity 0.22s ease;

  .rmodal {
    transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.55, 0, 1, 0.45);
  }
}

.rmodal-fade-enter-from {
  opacity: 0;

  .rmodal {
    opacity: 0;
    transform: scale(0.92) translateY(24px);
  }
}

.rmodal-fade-leave-to {
  opacity: 0;

  .rmodal {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

.dropdown-enter-active {
  transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
