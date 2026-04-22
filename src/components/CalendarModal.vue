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
  sector: '',
  embarcaciones: '',
  hp: '',
  presupuesto: '',
  reto: '',
  consent: false,
})

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const isValid = () =>
  !!form.value.sector &&
  !!form.value.embarcaciones &&
  !!form.value.hp &&
  !!form.value.presupuesto &&
  wordCount(form.value.reto) >= 10 &&
  form.value.consent

const qualifies = () => {
  if (form.value.presupuesto === 'menos1200') return false
  return true
}

const handleSubmit = async () => {
  touched.value = true
  if (!isValid()) return

  submitting.value = true
  const contact = contactStore.get()
  const califica = qualifies()
  const scheduleEventId = generateEventId('schedule')

  const sectorLabel: Record<string, string> = {
    residencial: 'Proyecto residencial (Casa/Depto)',
    comercial:   'Proyecto comercial (Local/Oficina)',
    nautico:     'Proyecto náutico (Interiores yates)',
    otro:        'Otro proyecto',
  }
  const embarcacionesLabel: Record<string, string> = {
    'cuarto': 'Habitación o espacio único',
    'casa':   'Casa o departamento completo',
    'local':  'Local comercial u oficina',
    'yate':   'Embarcación o yate',
  }
  const hpLabel: Record<string, string> = {
    rustico:   'Rústico / Natural',
    moderno:   'Moderno / Lujoso',
    industrial: 'Industrial / Vintage',
  }
  const presupuestoLabel: Record<string, string> = {
    menos1200: 'Menos de $1,200 USD',
    mas1200:   'Al menos $1,200 USD',
    mas2000:   'Más de $2,000 USD',
  }

  const etiquetas = [
    'funnel-alebarreto',
    'step-2-cualificacion',
    califica ? 'califica-ab' : 'no-califica-ab',
    `tipo-${form.value.sector}`,
    `espacio-${form.value.embarcaciones}`,
    `estilo-${form.value.hp}`,
    `budget-${form.value.presupuesto}`,
  ]

  const notas = `
━━━━━━━━━━━━━━━━━━━━━━━━
🪵 ALE BARRETO — Cualificación
━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${contact.nombre} ${contact.apellido}
📧 ${contact.email}
📱 ${contact.telefono}
━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Tipo: ${sectorLabel[form.value.sector] ?? form.value.sector}
📐 Espacio: ${embarcacionesLabel[form.value.embarcaciones] ?? form.value.embarcaciones}
🎨 Estilo: ${hpLabel[form.value.hp] ?? form.value.hp}
💰 Presupuesto: ${presupuestoLabel[form.value.presupuesto] ?? form.value.presupuesto}
💡 Idea/Reto: ${form.value.reto}
━━━━━━━━━━━━━━━━━━━━━━━━
${califica ? '✅ CALIFICA' : '❌ NO CALIFICA'}
  `.trim()

  const payload = {
    nombre: contact.nombre,
    apellido: contact.apellido,
    email: contact.email,
    telefono: contact.telefono,
    sector: form.value.sector,
    embarcaciones: form.value.embarcaciones,
    hp: form.value.hp,
    presupuesto: form.value.presupuesto,
    reto: form.value.reto,
    califica: String(califica),
    etiquetas: etiquetas.join(','),
    notas,
    nota: notas,
    event_id: scheduleEventId,
  }

  trackStage('cualificacion_completada', payload)

  // TODO: Actualizar webhook URL para Ale Barreto
  await fetch('https://services.leadconnectorhq.com/hooks/nSvINWsG3QGCGfcdpPdu/webhook-trigger/Dgr46VPmCNAtluiaBEQS', {
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
    if (!IS_DEV) localStorage.setItem('os_disq_at', String(Date.now()))
    router.push('/sin-espacio')
  }
}

const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close') }

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

watch(() => props.open, (v) => {
  if (v) {
    touched.value = false
    form.value = { sector: '', embarcaciones: '', hp: '', presupuesto: '', reto: '', consent: false }
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
              <i class="fa-solid fa-tree"></i>
            </div>
            <h2 id="cal-title" class="cal-title">
              Antes de agendar, cuéntanos sobre
              <span class="cal-accent">tu proyecto</span>
            </h2>
            <p class="cal-subtitle">5 preguntas rápidas para entender tu visión — 60 segundos.</p>
          </div>

          <form class="cal-form" @submit.prevent="handleSubmit" novalidate>

            <!-- Q1 — Tipo de Proyecto -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.sector }">
              <legend class="cal-legend">
                <span class="cal-q-num">01</span>
                ¿Qué tipo de proyecto estás buscando?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'residencial', label: 'Residencial (Casa o Departamento)' },
                  { value: 'comercial', label: 'Comercial (Oficina o Local)' },
                  { value: 'nautico', label: 'Náutico (Interiores de Embarcación)' },
                  { value: 'otro', label: 'Otro proyecto' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.sector === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.sector" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.sector" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q2 — Espacio -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.embarcaciones }">
              <legend class="cal-legend">
                <span class="cal-q-num">02</span>
                ¿Para qué espacio principal es el trabajo?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'cuarto', label: 'Habitación o espacio único' },
                  { value: 'casa',   label: 'Casa o departamento completo' },
                  { value: 'local',  label: 'Local comercial u oficina' },
                  { value: 'yate',   label: 'Yate o bote' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.embarcaciones === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.embarcaciones" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.embarcaciones" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q3 — Estilo -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.hp }">
              <legend class="cal-legend">
                <span class="cal-q-num">03</span>
                ¿Qué estilo de diseño prefiere?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'rustico',   label: 'Rústico / Natural' },
                  { value: 'moderno',   label: 'Moderno / Lujoso' },
                  { value: 'industrial', label: 'Industrial / Vintage' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.hp === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.hp" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.hp" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q4 — Presupuesto -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.presupuesto }">
              <legend class="cal-legend">
                <span class="cal-q-num">04</span>
                ¿Dispone de un presupuesto mayor a $1,200?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'mas2000',   label: 'Sí, cuento con más de $2,000 USD' },
                  { value: 'mas1200',   label: 'Sí, cuento con al menos $1,200 USD' },
                  { value: 'menos1200', label: 'No, por ahora menos de $1,200 USD' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.presupuesto === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.presupuesto" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.presupuesto" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q5 — Idea/Reto -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && wordCount(form.reto) < 10 }">
              <legend class="cal-legend">
                <span class="cal-q-num">05</span>
                ¿Qué idea tienes en mente para tu espacio?
              </legend>
              <textarea
                v-model="form.reto"
                class="cal-textarea"
                placeholder="Ej: Me gustaría revestir una pared principal de mi sala con madera noble y añadir una estantería empotrada que combine con..."
                rows="4"
                aria-describedby="q4-hint"
              ></textarea>
              <span id="q4-hint" class="cal-hint">
                {{ wordCount(form.reto) }}/10 palabras mínimo
              </span>
              <span v-if="touched && wordCount(form.reto) < 10" class="cal-error">
                Describe tu idea con al menos 10 palabras
              </span>
            </fieldset>

            <!-- Consent -->
            <label class="cal-consent" :class="{ 'has-error': touched && !form.consent }">
              <input type="checkbox" v-model="form.consent" />
              <span class="cal-consent__box" aria-hidden="true" />
              <span class="cal-consent__text">
                Acepto que Ale Barreto me contacte para brindarme una asesoría de diseño personalizada.
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
