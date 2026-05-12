const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/b26ee589-52a8-4240-893c-7d1aaa53696a'

export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export async function trackStage(etapa: string, data: Record<string, unknown> & { event_id?: string }) {
  try {
    const event_id = data.event_id ?? generateEventId('view')
    await fetch(GHL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapa, event_id, ...data }),
    })
  } catch {
    // silencioso — nunca bloquear la UX por un fallo de tracking
  }
}
