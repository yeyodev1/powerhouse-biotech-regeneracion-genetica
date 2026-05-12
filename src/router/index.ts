import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'
import QualifyView from '../views/QualifyView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import LegalNoticeView from '../views/LegalNoticeView.vue'
import BookingView from '../views/BookingView.vue'
import BookedView from '../views/BookedView.vue'
import NoSpaceView from '../views/NoSpaceView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    jsonLd?: object[]
  }
}

// ── Router ─────────────────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      alias: '/registro-vsl-tr',
      name: 'funnel',
      component: FunnelView,
      meta: {
        title: 'PowerHouse Biotech | Juan Román Garza — Evaluación de Viabilidad Regenerativa™',
        description:
          'Consulta con Juan Román Garza en Polanco, CDMX. Más de 20 años en Medicina Regenerativa. Evaluamos si tu cuerpo puede regenerarse antes de cualquier terapia. Solo 20% aceptados.',
        canonical: 'https://www.powerhousebiotech.com/',
        ogTitle: 'PowerHouse Biotech | Juan Román Garza — Medicina Regenerativa en Polanco',
        ogDescription:
          'Evaluación de Viabilidad Regenerativa™ por Juan Román Garza. +15,000 pacientes evaluados. Criterio clínico honesto en Polanco, CDMX.',
        ogUrl: 'https://www.powerhousebiotech.com/',
      } satisfies RouteMeta,
    },
    {
      path: '/calificar',
      name: 'qualify',
      component: QualifyView,
      meta: {
        title: 'Califica tu caso | Juan Román Garza — PowerHouse Biotech',
        description: 'Responde unas preguntas y descubre si tu caso califica para una Evaluación de Viabilidad Regenerativa™ con Juan Román Garza en Polanco, CDMX.',
        canonical: 'https://www.powerhousebiotech.com/calificar',
        ogTitle: 'Califica tu caso | Juan Román Garza',
        ogDescription: 'Descubre si calificas para una consulta con Juan Román Garza en Polanco. Solo 20% aceptados.',
        ogUrl: 'https://www.powerhousebiotech.com/calificar',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Consulta | Juan Román Garza — Paso 2 de 2',
        description: 'Selecciona el día y hora para tu consulta informativa con Juan Román Garza en PowerHouse Biotech, Polanco.',
        canonical: 'https://www.powerhousebiotech.com/agendar',
        ogTitle: 'Agenda tu Consulta | Juan Román Garza',
        ogDescription: 'Elige tu horario y reserva tu consulta informativa con Juan Román Garza.',
        ogUrl: 'https://www.powerhousebiotech.com/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Consulta Confirmada | PowerHouse Biotech',
        description: 'Tu consulta con Juan Román Garza está confirmada. Revisa tu correo y prepárate para tu Evaluación de Viabilidad Regenerativa™.',
        canonical: 'https://www.powerhousebiotech.com/cita-confirmada',
        ogTitle: 'Consulta Confirmada | Juan Román Garza',
        ogDescription: 'Tu consulta está reservada. Juan Román Garza te contactará pronto.',
        ogUrl: 'https://www.powerhousebiotech.com/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Aplicación no calificada | PowerHouse Biotech',
        description: 'Solo aceptamos el 20% de las aplicaciones. En este momento tu perfil no coincide con los criterios de Juan Román Garza. No es un rechazo permanente.',
        canonical: 'https://www.powerhousebiotech.com/sin-espacio',
        ogTitle: 'Aplicación no calificada | Juan Román Garza',
        ogDescription: 'Solo el 20% de las aplicaciones son aceptadas. Criterio honesto de Juan Román Garza.',
        ogUrl: 'https://www.powerhousebiotech.com/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | PowerHouse Biotech',
        description: 'Política de privacidad de PowerHouse Biotech. Información sobre el tratamiento de datos personales.',
        canonical: 'https://www.powerhousebiotech.com/politicas-privacidad',
        ogTitle: 'Política de Privacidad | PowerHouse Biotech',
        ogDescription: 'Política de privacidad de PowerHouse Biotech.',
        ogUrl: 'https://www.powerhousebiotech.com/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | PowerHouse Biotech',
        description: 'Aviso legal de PowerHouse Biotech. Términos y condiciones de uso del sitio web.',
        canonical: 'https://www.powerhousebiotech.com/aviso-legal',
        ogTitle: 'Aviso Legal | PowerHouse Biotech',
        ogDescription: 'Aviso legal de PowerHouse Biotech.',
        ogUrl: 'https://www.powerhousebiotech.com/aviso-legal',
      } satisfies RouteMeta,
    },
  ],
})

// ── SEO dinámico por ruta ──────────────────────────────────────────────────────
const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

const setOgMeta = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.content = content
}

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'PowerHouse Biotech'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

// ── Router Guards ──────────────────────────────────────────────────────────────
const BOOKED_TTL_MS = 3 * 24 * 60 * 60 * 1000  // 3 días
const DISQ_TTL_MS   = 48 * 60 * 60 * 1000      // 48 horas

const readTimestamp = (key: string): number | null => {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

const isFresh = (key: string, ttl: number): boolean => {
  const ts = readTimestamp(key)
  if (ts === null) return false
  if (Date.now() - ts <= ttl) return true
  // Expirado → limpiar para que no quede colgado
  localStorage.removeItem(key)
  return false
}

const PUBLIC_ROUTES = ['privacy-policy', 'legal-notice']

router.beforeEach((to, from, next) => {
  const routeName = to.name as string
  if (PUBLIC_ROUTES.includes(routeName)) return next()

  const bookedFresh = isFresh('os_booked_at', BOOKED_TTL_MS)
  const disqFresh   = isFresh('os_disq_at',   DISQ_TTL_MS)

  // /cita-confirmada solo es accesible si tiene booking fresco
  if (routeName === 'booked') {
    if (!bookedFresh) return next({ name: 'funnel' })
    return next()
  }

  // Si tiene booking fresco → redirigir todo a /cita-confirmada
  if (bookedFresh) {
    return next({ name: 'booked' })
  }

  // Si está descalificado dentro de 48h → no permitir booking ni booked
  if (disqFresh && ['booking', 'booked'].includes(routeName)) {
    return next({ name: 'no-space' })
  }

  // /sin-espacio solo si está descalificado fresco (evita acceso directo)
  if (routeName === 'no-space' && !disqFresh) {
    return next({ name: 'funnel' })
  }

  next()
})

export default router
