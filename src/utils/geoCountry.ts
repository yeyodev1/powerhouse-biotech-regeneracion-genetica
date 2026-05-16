// Detecta país (ISO2) del usuario por IP. Fallback a navigator.language.
// Cache en sessionStorage para no re-pegarle al endpoint en cada mount.

const CACHE_KEY = 'phb_geo_iso2'

function fromNavigatorLanguage(): string {
  const lang = (navigator.language || (navigator as any).userLanguage || '').toString()
  const match = lang.match(/[-_]([A-Z]{2})$/i)
  return (match?.[1] || '').toUpperCase()
}

async function fetchWithTimeout(url: string, ms = 2500): Promise<Response> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { signal: ctrl.signal, cache: 'no-store' })
  } finally {
    clearTimeout(t)
  }
}

export async function detectCountryISO2(): Promise<string> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached && /^[A-Z]{2}$/.test(cached)) return cached
  } catch { /* ignore */ }

  // ipapi.co — gratis, sin key, CORS habilitado, ~1k req/día por IP
  try {
    const r = await fetchWithTimeout('https://ipapi.co/json/')
    if (r.ok) {
      const j = await r.json() as { country_code?: string; country?: string }
      const iso = (j.country_code || j.country || '').toUpperCase()
      if (/^[A-Z]{2}$/.test(iso)) {
        try { sessionStorage.setItem(CACHE_KEY, iso) } catch { /* ignore */ }
        return iso
      }
    }
  } catch { /* fall through */ }

  // Fallback: navigator.language
  const fromLang = fromNavigatorLanguage()
  if (/^[A-Z]{2}$/.test(fromLang)) {
    try { sessionStorage.setItem(CACHE_KEY, fromLang) } catch { /* ignore */ }
    return fromLang
  }

  return 'EC' // último fallback: Ecuador (mercado principal PHB)
}
