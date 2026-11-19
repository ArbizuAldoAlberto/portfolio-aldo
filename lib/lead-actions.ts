'use server'

import crypto from 'crypto'

function isConfiguredSecret(val?: string): boolean {
  if (!val) return false
  const upper = val.trim().toUpperCase()
  return (
    upper.length > 8 &&
    !upper.includes('PLACEHOLDER') &&
    !upper.includes('XXXX') &&
    !upper.includes('YYYY') &&
    !upper.includes('YOUR_')
  )
}

export async function submitLead(prevState: any, formData: FormData) {
  try {
    // 1. Honeypot check for bots
    const botField = formData.get('bot-field')
    if (botField) {
      console.warn('Bot detectado: Campo honeypot llenado.')
      return { success: true, message: 'Mensaje enviado correctamente.' }
    }

    // 2. Extract Data
    const name = formData.get('name')?.toString().trim() || 'Anónimo'
    const email = formData.get('email')?.toString().trim().toLowerCase() || ''
    const company = formData.get('company')?.toString().trim() || 'No especificada'
    const message = formData.get('message')?.toString().trim() || ''
    const source = formData.get('source')?.toString().trim() || 'contact_form'
    const servicesRaw = formData.get('services')?.toString().trim() || ''
    const totalRaw = formData.get('total')?.toString().trim() || '0'
    const totalNum = Number.isFinite(Number(totalRaw)) ? Math.max(0, Number(totalRaw)) : 0

    // 3. Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Por favor ingresa un email válido.' }
    }
    if (!message && source !== 'ucp_checkout') {
      return { success: false, message: 'El mensaje no puede estar vacío.' }
    }

    const servicesList = servicesRaw
      ? servicesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [source]

    const timeBucket = Math.floor(Date.now() / (5 * 60 * 1000))
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`aldoarbizu|${email}|${source}|${message}|${timeBucket}`)
      .digest('hex')

    const leadsApiUrl = process.env.ARBIZU_LEADS_API_URL || 'https://arbizulabs.com/api/leads'

    let persistedInLedger = false
    let sentViaResend = false
    let sentViaTelegram = false

    // 4. Primary Canonical Persistence: Arbizu Labs SQLite WAL + JSON + Telegram Ops (/api/leads)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(leadsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://aldoarbizu.com',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          name,
          email,
          company,
          services: servicesList,
          total: totalNum,
          message: message || `Lead UCP Checkout (${servicesList.join(', ')})`,
          source: `aldoarbizu.com:${source}`,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        persistedInLedger = true
      } else {
        const errBody = await res.text().catch(() => '')
        console.error('[aldoarbizu submitLead] /api/leads HTTP error:', res.status, errBody.slice(0, 200))
      }
    } catch (err) {
      console.error('[aldoarbizu submitLead] Error conectando a /api/leads:', err)
    }

    // 5. Secondary Email Dispatch via Resend (when configured with a real key)
    if (isConfiguredSecret(process.env.RESEND_API_KEY)) {
      try {
        let emailContent = `Nuevo lead de ${name} (${email})\nEmpresa: ${company}\nOrigen: aldoarbizu.com (${source})\n\nMensaje:\n${message}`
        if (source === 'ucp_checkout') {
          emailContent = `Nuevo lead UCP de ${name} (${email})\nServicios: ${servicesRaw}\nTotal Estimado: USD ${totalNum}`
        }

        const toEmail = process.env.RESEND_TO_EMAIL || 'aldo@arbizulabs.com'
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'NEXUS Autonomous <onboarding@resend.dev>'

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: toEmail,
            reply_to: email,
            subject: source === 'ucp_checkout' ? '💸 Nuevo Lead de UCP Checkout (aldoarbizu.com)' : '📩 Nuevo Lead B2B (aldoarbizu.com)',
            text: emailContent,
          }),
        })
        if (res.ok) {
          sentViaResend = true
        } else {
          const errText = await res.text().catch(() => '')
          console.error('[aldoarbizu submitLead] Resend error:', res.status, errText.slice(0, 200))
        }
      } catch (err) {
        console.error('[aldoarbizu submitLead] Fetch Resend error:', err)
      }
    }

    // 6. Direct Telegram Fallback (only if primary /api/leads ledger failed so we never lose a lead)
    if (!persistedInLedger && isConfiguredSecret(process.env.TELEGRAM_BOT_TOKEN) && process.env.TELEGRAM_CHAT_ID) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `🚨 [FALLBACK LEAD aldoarbizu.com]\n👤 ${name} (${company})\n📧 ${email}\n💼 ${servicesList.join(', ')}\n💰 $${totalNum}\n💬 ${message.slice(0, 500)}`,
          }),
        })
        if (tgRes.ok) {
          sentViaTelegram = true
        }
      } catch (err) {
        console.error('[aldoarbizu submitLead] Telegram fallback error:', err)
      }
    }

    // 7. Strict Delivery Verification (NEVER return silent fake success if all channels failed)
    if (!persistedInLedger && !sentViaResend && !sentViaTelegram) {
      return {
        success: false,
        message: 'No pudimos confirmar el registro automático en este momento. Contáctame directo por WhatsApp (+54 9 2314 489197) o a aldo@arbizulabs.com.',
      }
    }

    return {
      success: true,
      message: 'El mensaje fue registrado y despachado exitosamente. Me pondré en contacto a la brevedad.',
    }
  } catch (error) {
    console.error('Lead action error:', error)
    return {
      success: false,
      message: 'Hubo un error al procesar la transmisión. Por favor, intenta de nuevo o escribe a WhatsApp (+54 9 2314 489197).',
    }
  }
}
