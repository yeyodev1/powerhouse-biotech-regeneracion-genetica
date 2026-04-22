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
        title: 'Ale Barreto | Expertos en Madera — Diseño y Construcción de Alta Gama',
        description:
          'Expertos en diseño y construcción en madera. Transformamos espacios con acabados premium y estructuras sostenibles. Agenda tu asesoría gratuita.',
        canonical: 'https://alebarreto.com/',
        ogTitle: 'Ale Barreto | Expertos en Madera',
        ogDescription:
          'Diseño y construcción en madera de alta gama. Calidad artesanal para tus proyectos residenciales y comerciales.',
        ogUrl: 'https://alebarreto.com/',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el video | Ale Barreto — Paso 1 de 2',
        description: 'Descubre cómo transformamos espacios con madera de alta gama en nuestro video exclusivo.',
        canonical: 'https://alebarreto.com/ver-video',
        ogTitle: 'Mira el video | Ale Barreto',
        ogDescription: 'Ve el video y agenda tu Cita Estratégica gratuita con Ale Barreto.',
        ogUrl: 'https://alebarreto.com/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Cita | Ale Barreto — Paso 2 de 2',
        description: 'Selecciona el día y hora para tu Cita Estratégica gratuita con Ale Barreto.',
        canonical: 'https://alebarreto.com/agendar',
        ogTitle: 'Agenda tu Cita | Ale Barreto',
        ogDescription: 'Elige tu horario y reserva tu Cita Estratégica gratuita.',
        ogUrl: 'https://alebarreto.com/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Cita Confirmada | Ale Barreto',
        description: 'Tu cita estratégica con Ale Barreto está confirmada. Revisa tu correo y prepárate.',
        canonical: 'https://alebarreto.com/cita-confirmada',
        ogTitle: 'Cita Confirmada | Ale Barreto',
        ogDescription: 'Tu cita está reservada. Te contactaremos pronto.',
        ogUrl: 'https://alebarreto.com/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Sin Espacio Disponible | Ale Barreto',
        description: 'En este momento los cupos de asesoría de Ale Barreto están completos. Te notificaremos cuando se libere un espacio.',
        canonical: 'https://alebarreto.com/sin-espacio',
        ogTitle: 'Sin Espacio Disponible | Ale Barreto',
        ogDescription: 'Los cupos de asesoría están completos. Te avisaremos cuando haya disponibilidad.',
        ogUrl: 'https://alebarreto.com/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Ale Barreto',
        description: 'Política de privacidad de Ale Barreto. Información sobre el tratamiento de datos personales.',
        canonical: 'https://alebarreto.com/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Ale Barreto',
        ogDescription: 'Política de privacidad de Ale Barreto.',
        ogUrl: 'https://alebarreto.com/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Ale Barreto',
        description: 'Aviso legal de Ale Barreto. Términos y condiciones de uso del sitio web.',
        canonical: 'https://alebarreto.com/aviso-legal',
        ogTitle: 'Aviso Legal | Ale Barreto',
        ogDescription: 'Aviso legal de Ale Barreto.',
        ogUrl: 'https://alebarreto.com/aviso-legal',
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
  document.title = meta.title ?? 'Ale Barreto'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

export default router
