import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'
import VideoView from '../views/VideoView.vue'
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
        title: 'Ocean Safety | Aumenta tu operación entre 10% y 20% — Asesoría Gratuita',
        description:
          'Ayudamos a dueños de negocios establecidos a aumentar su operación entre un 10% y 20% de forma predecible con la metodología Honda Marine Ecuador. Agenda tu asesoría gratuita.',
        canonical: 'https://oceansafety.ec/',
        ogTitle: 'Ocean Safety | Aumenta tu operación entre 10% y 20%',
        ogDescription:
          'Metodología Honda Marine Ecuador: profesionaliza tu marketing y ventas sin depender de la suerte ni de agencias de viralidad. Asesoría gratuita — cupos limitados.',
        ogUrl: 'https://oceansafety.ec/',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el video | Ocean Safety — Paso 1 de 2',
        description: 'Ve el video completo y descubre cómo la metodología Honda Marine Ecuador puede aumentar la operación de tu negocio entre un 10% y 20%.',
        canonical: 'https://oceansafety.ec/ver-video',
        ogTitle: 'Mira el video | Ocean Safety',
        ogDescription: 'Ve el video y agenda tu Cita Estratégica gratuita con el equipo de Ocean Safety.',
        ogUrl: 'https://oceansafety.ec/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Cita | Ocean Safety — Paso 2 de 2',
        description: 'Selecciona el día y hora para tu Cita Estratégica gratuita con el equipo de Ocean Safety.',
        canonical: 'https://oceansafety.ec/agendar',
        ogTitle: 'Agenda tu Cita | Ocean Safety',
        ogDescription: 'Elige tu horario y reserva tu Cita Estratégica gratuita con Ocean Safety.',
        ogUrl: 'https://oceansafety.ec/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Cita Confirmada | Ocean Safety',
        description: 'Tu cita estratégica con el equipo de Ocean Safety está confirmada. Revisa tu correo y prepárate.',
        canonical: 'https://oceansafety.ec/cita-confirmada',
        ogTitle: 'Cita Confirmada | Ocean Safety',
        ogDescription: 'Tu cita con el equipo de Ocean Safety está reservada. Te contactaremos pronto.',
        ogUrl: 'https://oceansafety.ec/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Sin Espacio Disponible | Ocean Safety',
        description: 'En este momento los cupos de asesoría de Ocean Safety están completos. Te notificaremos cuando se libere un espacio.',
        canonical: 'https://oceansafety.ec/sin-espacio',
        ogTitle: 'Sin Espacio Disponible | Ocean Safety',
        ogDescription: 'Los cupos de asesoría están completos. Te avisaremos cuando haya disponibilidad.',
        ogUrl: 'https://oceansafety.ec/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Ocean Safety Ecuador',
        description: 'Política de privacidad de Ocean Safety. Información sobre el tratamiento de datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
        canonical: 'https://oceansafety.ec/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Ocean Safety Ecuador',
        ogDescription: 'Política de privacidad de Ocean Safety Ecuador.',
        ogUrl: 'https://oceansafety.ec/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Ocean Safety Ecuador',
        description: 'Aviso legal de Ocean Safety Ecuador. Términos y condiciones de uso del sitio web oceansafety.ec.',
        canonical: 'https://oceansafety.ec/aviso-legal',
        ogTitle: 'Aviso Legal | Ocean Safety Ecuador',
        ogDescription: 'Aviso legal de Ocean Safety Ecuador.',
        ogUrl: 'https://oceansafety.ec/aviso-legal',
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
  document.title = meta.title ?? 'Ocean Safety'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

export default router
