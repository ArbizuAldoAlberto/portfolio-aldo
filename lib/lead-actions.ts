'use server'

export async function submitLead(prevState: any, formData: FormData) {
  try {
    // 1. Honeypot check for bots
    const botField = formData.get('bot-field')
    if (botField) {
      console.warn('Bot detectado: Campo honeypot llenado.')
      // Simulate success so bots stop trying
      return { success: true, message: 'Mensaje enviado correctamente.' }
    }

    // 2. Extract Data
    const name = formData.get('name')?.toString().trim() || 'Anónimo'
    const email = formData.get('email')?.toString().trim() || ''
    const company = formData.get('company')?.toString().trim() || 'No especificada'
    const message = formData.get('message')?.toString().trim() || ''
    const source = formData.get('source')?.toString() || 'contact_form'
    const services = formData.get('services')?.toString() || ''
    const total = formData.get('total')?.toString() || ''

    // 3. Validation
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Por favor ingresa un email válido.' }
    }
    if (!message && source !== 'ucp_checkout') {
      return { success: false, message: 'El mensaje no puede estar vacío.' }
    }

    const leadData = {
      name,
      email,
      company,
      message,
      source,
      services,
      total,
      timestamp: new Date().toISOString(),
    }

    const promises = []

    // 4. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      let emailContent = `Nuevo lead de ${name} (${email})\nEmpresa: ${company}\n\nMensaje:\n${message}`
      if (source === 'ucp_checkout') {
        emailContent = `Nuevo lead UCP de ${name} (${email})\nServicios: ${services}\nTotal Estimado: USD ${total}`
      }

      const toEmail = process.env.RESEND_TO_EMAIL || 'aldo@arbizulabs.com'
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'NEXUS Autonomous <onboarding@resend.dev>'
      
      const resendPromise = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          reply_to: email,
          subject: source === 'ucp_checkout' ? '💸 Nuevo Lead de UCP Checkout' : '📩 Nuevo Mensaje del Portfolio',
          text: emailContent
        })
      }).then(async res => {
        if (!res.ok) {
          const errText = await res.text()
          console.error('Error enviando a Resend - Status:', res.status, 'Text:', res.statusText, 'Body:', errText)
        } else {
          console.log('Correo enviado exitosamente vía Resend a:', toEmail)
        }
      }).catch(err => console.error('Error en fetch Resend:', err))
      
      promises.push(resendPromise)
    }

    // 5. Send Webhook to n8n
    if (process.env.N8N_WEBHOOK_URL) {
      const n8nPromise = fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      }).then(res => {
        if (!res.ok) console.error('Error enviando webhook a n8n:', res.statusText)
      }).catch(err => console.error('Error en fetch n8n:', err))
      
      promises.push(n8nPromise)
    }

    // Wait for all external API calls to finish
    await Promise.allSettled(promises)

    return { success: true, message: 'El mensaje fue cifrado y enviado exitosamente a la bóveda. Me pondré en contacto pronto.' }

  } catch (error) {
    console.error('Lead action error:', error)
    return { success: false, message: 'Hubo un error al procesar la transmisión. Por favor, intenta de nuevo.' }
  }
}
