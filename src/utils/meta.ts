// Meta Pixel + Conversions API (CAPI) helper.
// Pixel ID y access token quedan embebidos en el bundle por petición explícita del cliente
// (riesgo conocido: el token es público para cualquiera que inspeccione el JS).
// Rotar desde Events Manager si se detecta abuso.

const PIXEL_ID = '1288670429531709'
const CAPI_TOKEN = 'EAAKyoXo4MS4BRYOGcOybWXtHbWX3iFutxbadTRzV1m9QVGq6CgN9XeL9QIJP9ZCgAPqmRCBxUTZBpD6zgKlG5ITApdepkb1kMBJLXdyUyZBDyBpII5Hv5aXZBHbTvYKgO5ILupRZBv4rSmBLDlaebMZB274VvZACaxHiPou9D97919U6GEerpsbv3lDOj9cyxZAASAZDZD'
const GRAPH_VERSION = 'v19.0'
const CAPI_ENDPOINT = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`

type UserData = {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
}

type CustomData = Record<string, unknown>

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return
  const match = document.cookie.split('; ').find(row => row.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

async function sha256(input: string): Promise<string> {
  const normalized = input.trim().toLowerCase()
  const buf = new TextEncoder().encode(normalized)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function digitsOnly(input: string): string {
  return input.replace(/\D/g, '')
}

async function buildUserData(u: UserData): Promise<Record<string, string | string[]>> {
  const ud: Record<string, string | string[]> = {}
  if (u.email) ud.em = await sha256(u.email)
  if (u.phone) ud.ph = await sha256(digitsOnly(u.phone))
  if (u.firstName) ud.fn = await sha256(u.firstName)
  if (u.lastName) ud.ln = await sha256(u.lastName)
  if (u.country) ud.country = await sha256(u.country)
  if (u.city) ud.ct = await sha256(u.city)

  const fbc = readCookie('_fbc')
  const fbp = readCookie('_fbp')
  if (fbc) ud.fbc = fbc
  if (fbp) ud.fbp = fbp

  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    ud.client_user_agent = navigator.userAgent
  }
  return ud
}

export type MetaEventInput = {
  eventName: 'Lead' | 'CompleteRegistration' | 'Schedule' | string
  eventId: string
  userData?: UserData
  customData?: CustomData
}

export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  try {
    const user_data = input.userData ? await buildUserData(input.userData) : {}
    const payload = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: 'website',
          event_source_url: typeof location !== 'undefined' ? location.href : undefined,
          user_data,
          custom_data: input.customData ?? {},
        },
      ],
    }
    await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // silencioso — nunca bloquear UX por tracking
  }
}
