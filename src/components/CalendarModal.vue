<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { trackStage, generateEventId } from '@/utils/ghl'
import { useContactStore } from '@/stores/contact'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const contactStore = useContactStore()
const IS_DEV = window.location.hostname === 'localhost'

const submitting = ref(false)
const touched = ref(false)

const form = ref({
  ingresos: '',
  inversion: '',
  desplazamiento: '',
  consulta: '',
  consent: false,
})

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const isValid = () =>
  !!form.value.ingresos &&
  !!form.value.inversion &&
  !!form.value.desplazamiento &&
  wordCount(form.value.consulta) >= 5 &&
  form.value.consent

const qualifies = () => {
  if (form.value.ingresos === 'basico') return false
  if (form.value.inversion === 'no') return false
  return true
}

const handleSubmit = async () => {
  touched.value = true
  if (!isValid()) return

  submitting.value = true
  const contact = contactStore.get()
  const califica = qualifies()
  const scheduleEventId = generateEventId('schedule')

  const ingresosLabel: Record<string, string> = {
    premium: 'Seguro de gastos mayores privado',
    ejecutivo: 'Plan de salud ejecutivo / medicina premium',
    tradicional: 'IMSS / ISSSTE / Seguro popular',
    basico: 'Pago de bolsillo particular',
  }
  const inversionLabel: Record<string, string> = {
    si: 'Sí, estaría dispuesto a invertir en mi salud',
    llamada: 'Necesito una llamada para hablarlo',
    no: 'Definitivamente no',
  }
  const desplazamientoLabel: Record<string, string> = {
    si: 'Sí, puedo desplazarme',
    no: 'No, prefiero cerca de mi zona',
  }

  const etiquetas = [
    'funnel-phb',
    'step-2-cualificacion',
    califica ? 'califica-phb' : 'no-califica-phb',
    `cobertura-${form.value.ingresos}`,
    `inversion-${form.value.inversion}`,
    `desplazamiento-${form.value.desplazamiento}`,
    'landing-regeneracion',
  ]

  const notas = `
━━━━━━━━━━━━━━━━━━━━━━━━
🧬 POWERHOUSE BIOTECH — Calificación
━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${contact.nombre} ${contact.apellido}
📧 ${contact.email}
📱 ${contact.telefono}
━━━━━━━━━━━━━━━━━━━━━━━━
💳 Cobertura médica: ${ingresosLabel[form.value.ingresos] ?? form.value.ingresos}
💰 Disposición a invertir: ${inversionLabel[form.value.inversion] ?? form.value.inversion}
🚗 Disposición a desplazarse: ${desplazamientoLabel[form.value.desplazamiento] ?? form.value.desplazamiento}
📋 Consulta: ${form.value.consulta}
🏷️ Landing: landing-regeneracion
━━━━━━━━━━━━━━━━━━━━━━━━
${califica ? '✅ CALIFICA' : '❌ NO CALIFICA'}
  `.trim()

  const payload = {
    nombre: contact.nombre,
    apellido: contact.apellido,
    email: contact.email,
    telefono: contact.telefono,
    cobertura: form.value.ingresos,
    inversion: form.value.inversion,
    desplazamiento: form.value.desplazamiento,
    consulta: form.value.consulta,
    cualificado: califica,
    califica: califica ? 'si' : 'no',
    landing: 'landing-regeneracion',
    etiquetas: 'landing-regeneracion',
    source: window.location.hostname,
    tags: etiquetas,
    notas,
    nota: notas,
    event_id: scheduleEventId,
  }

  trackStage('cualificacion_completada', payload)

  await fetch(import.meta.env.VITE_WEBHOOK_CALIFICACION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})

  ;(window as any).fbq?.('track', 'CompleteRegistration',
    { content_name: 'cualificacion-step2', status: califica ? 'califica' : 'no-califica' },
    { eventID: scheduleEventId }
  )

  submitting.value = false
  emit('close')

  if (califica) {
    ;(window as any).fbq?.('track', 'Lead')
    router.push('/agendar')
  } else {
    localStorage.setItem('os_disq_at', String(Date.now()))
    router.push('/sin-espacio')
  }
}

const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close') }

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

watch(() => props.open, (v) => {
  if (v) {
    touched.value = false
    form.value = { ingresos: '', inversion: '', desplazamiento: '', consulta: '', consent: false }
  }
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cal-fade">
      <div v-if="open" class="cal-backdrop" @click.self="emit('close')" role="dialog" aria-modal="true" aria-labelledby="cal-title">

        <div class="cal-modal">

          <button class="cal-close" @click="emit('close')" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="cal-header">
            <div class="cal-header-icon" aria-hidden="true">
              <i class="fa-solid fa-dna"></i>
            </div>
            <h2 id="cal-title" class="cal-title">
              Antes de agendar, cuéntanos
              <span class="cal-accent">sobre ti</span>
            </h2>
            <p class="cal-subtitle">4 preguntas rápidas para saber si eres candidato — menos de 1 minuto.</p>
          </div>

          <form class="cal-form" @submit.prevent="handleSubmit" novalidate>

            <!-- Q1 — Cobertura médica -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.ingresos }">
              <legend class="cal-legend">
                <span class="cal-q-num">01</span>
                ¿Qué tipo de cobertura médica tienes actualmente?
              </legend>
              <p class="cal-legend-hint">Solo para contextualizar tu perfil — confidencial.</p>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'premium', label: 'Seguro de gastos mayores privado' },
                  { value: 'ejecutivo', label: 'Plan de salud ejecutivo / medicina premium' },
                  { value: 'tradicional', label: 'IMSS / ISSSTE / Seguro popular' },
                  { value: 'basico', label: 'Pago de bolsillo particular' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.ingresos === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.ingresos" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.ingresos" class="cal-error">Selecciona tu tipo de cobertura</span>
            </fieldset>

            <!-- Q2 — Disposición -->
            <fieldset class="cal-fieldset cal-fieldset--highlight" :class="{ 'has-error': touched && !form.inversion }">
              <div class="cal-legend-wrap">
                <span class="cal-q-num">02</span>
                <span class="cal-legend-text">
                  <strong>¿Te gustaría recuperar tu calidad de vida?</strong>
                  <span>Cuéntanos qué tan interesado estás en seguir este proceso.</span>
                </span>
              </div>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'si', icon: 'fa-solid fa-circle-check', label: 'Sí, me interesa seguir adelante' },
                  { value: 'llamada', icon: 'fa-solid fa-phone', label: 'Primero quisiera una llamada para resolver dudas' },
                  { value: 'no', icon: 'fa-solid fa-clock', label: 'Por ahora no, gracias' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.inversion === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.inversion" hidden />
                  <i :class="opt.icon" class="cal-option__icon" aria-hidden="true"></i>
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.inversion" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q3 — Desplazamiento -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.desplazamiento }">
              <legend class="cal-legend">
                <span class="cal-q-num">03</span>
                ¿Podrías desplazarte a Polanco para tu consulta?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'si', label: 'Sí, sin problema' },
                  { value: 'no', label: 'Prefiero algo más cerca de mi zona' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.desplazamiento === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.desplazamiento" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.desplazamiento" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q4 — Consulta -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && wordCount(form.consulta) < 5 }">
              <legend class="cal-legend">
                <span class="cal-q-num">04</span>
                ¿Qué te gustaría consultar con Juan Román Garza o su equipo de especialistas?
              </legend>
              <textarea
                v-model="form.consulta"
                class="cal-textarea"
                placeholder="Ej: Tengo dolor crónico de rodilla desde hace 2 años, he ido con varios especialistas y quiero saber si la medicina regenerativa es opción para mí..."
                rows="4"
                aria-describedby="q3-hint"
              ></textarea>
              <span id="q3-hint" class="cal-hint">
                {{ wordCount(form.consulta) }}/5 palabras mínimo
              </span>
              <span v-if="touched && wordCount(form.consulta) < 5" class="cal-error">
                Describe tu situación con al menos 5 palabras
              </span>
            </fieldset>

            <!-- Consent -->
            <label class="cal-consent" :class="{ 'has-error': touched && !form.consent }">
              <input type="checkbox" v-model="form.consent" />
              <span class="cal-consent__box" aria-hidden="true" />
              <span class="cal-consent__text">
                Acepto que PowerHouse Biotech procese mis datos y me contacte para evaluar si mi caso califica para una Consulta Informativa de Evaluación de Viabilidad Regenerativa™ con Juan Román Garza o uno de sus especialistas.
              </span>
            </label>
            <span v-if="touched && !form.consent" class="cal-error">Debes aceptar para continuar</span>

            <button type="submit" class="cal-submit" :disabled="submitting">
              <span v-if="!submitting">
                <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
                Ver disponibilidad
              </span>
              <span v-else>
                <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                Procesando...
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

.cal-fade-enter-active,
.cal-fade-leave-active { transition: opacity 0.25s ease; }
.cal-fade-enter-from,
.cal-fade-leave-to { opacity: 0; }

.cal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(colors.$OS-DARK, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.cal-modal {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  border: 1px solid #E4EDF7;
}

.cal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #F5F8FF;
  color: #8A9BB5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.2s, color 0.2s;
  z-index: 1;
  &:hover { background: #E4EDF7; color: colors.$OS-DARK; }
}

.cal-header {
  padding: 2rem 2rem 1.25rem;
  border-bottom: 1px solid #F0F4FB;
  text-align: center;
}

.cal-header-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: colors.$OS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  i { color: #ffffff; font-size: 1.4rem; }
}

.cal-title {
  @include fonts.heading-font(800);
  font-size: 1.45rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.5rem;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.cal-accent { color: colors.$OS-RED; }

.cal-subtitle {
  font-size: 0.86rem;
  color: #8A9BB5;
  margin: 0;
}

.cal-form {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cal-fieldset {
  border: none;
  padding: 0;
  margin: 0;

  &.has-error .cal-options { border-color: colors.$OS-RED; border-radius: 10px; }

  &--highlight {
    background: linear-gradient(135deg, rgba(colors.$OS-NAVY, 0.03) 0%, rgba(colors.$OS-BLUE, 0.03) 100%);
    border: 1px solid rgba(colors.$OS-NAVY, 0.08);
    border-radius: 14px;
    padding: 1rem 1.25rem;
  }
}

.cal-legend-wrap {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cal-legend-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    font-family: fonts.$font-interface;
    font-size: 0.93rem;
    font-weight: 700;
    color: colors.$OS-DARK;
    line-height: 1.3;
  }

  span {
    font-size: 0.82rem;
    color: #6A7E95;
    line-height: 1.4;
  }
}

.cal-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: fonts.$font-interface;
  font-size: 0.88rem;
  font-weight: 700;
  color: colors.$OS-DARK;
  margin-bottom: 0.75rem;
}

.cal-legend-hint {
  font-size: 0.78rem;
  color: #8A9BB5;
  margin: -0.5rem 0 0.75rem;
  font-style: italic;
}

.cal-q-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: colors.$OS-NAVY;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  flex-shrink: 0;
}

.cal-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cal-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid #E4EDF7;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
  background: #FAFBFF;

  &:hover { border-color: colors.$OS-BLUE; background: #F0F6FF; }

  &.selected {
    border-color: colors.$OS-NAVY;
    background: #EEF4FF;
  }

  &__icon {
    font-size: 1.1rem;
    color: #B0C0D5;
    flex-shrink: 0;
    width: 1.4rem;
    text-align: center;
    transition: color 0.18s;

    .cal-option.selected & {
      color: colors.$OS-NAVY;
    }
  }

  &__radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #C8D8ED;
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.18s;

    .cal-option.selected & {
      border-color: colors.$OS-NAVY;
      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: colors.$OS-NAVY;
      }
    }
  }

  &__label {
    font-size: 0.88rem;
    color: #3A4F6A;
    font-weight: 500;

    .cal-option.selected & { color: colors.$OS-DARK; font-weight: 600; }
  }
}

.cal-textarea {
  width: 100%;
  border: 1.5px solid #E4EDF7;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-family: fonts.$font-secondary;
  font-size: 0.88rem;
  color: colors.$OS-DARK;
  background: #FAFBFF;
  resize: vertical;
  outline: none;
  transition: border-color 0.18s;
  line-height: 1.55;
  box-sizing: border-box;

  &::placeholder { color: #B0C0D5; }
  &:focus { border-color: colors.$OS-BLUE; background: #F5F9FF; }
}

.cal-hint {
  display: block;
  font-size: 0.76rem;
  color: #B0C0D5;
  margin-top: 0.35rem;
}

.cal-error {
  display: block;
  font-size: 0.78rem;
  color: colors.$OS-RED;
  margin-top: 0.35rem;
}

.cal-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;

  input { display: none; }

  &__box {
    width: 18px;
    height: 18px;
    border: 2px solid #C8D8ED;
    border-radius: 5px;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;

    input:checked ~ & {
      background: colors.$OS-NAVY;
      border-color: colors.$OS-NAVY;
      &::after {
        content: '✓';
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 800;
      }
    }
  }

  &__text {
    font-size: 0.82rem;
    color: #6A7E95;
    line-height: 1.5;
  }
}

.cal-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: colors.$OS-RED;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-family: fonts.$font-accent;
  font-size: 0.97rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease, transform 0.15s ease;
  box-shadow: 0 4px 16px rgba(204, 0, 0, 0.3);

  &:hover:not(:disabled) { background: #AA0000; transform: translateY(-1px); }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
}
</style>
