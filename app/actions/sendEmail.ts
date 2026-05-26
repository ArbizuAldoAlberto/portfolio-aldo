'use server'
import { Resend } from 'resend'

// Resend instance is initialized on the server side
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key')

export async function sendEmail(formData: { name: string; email: string; message: string }) {
  const { name, email, message } = formData

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, error: 'Todos los campos son obligatorios.' }
  }

  try {
    const data = await resend.emails.send({
      from: 'Arbizu Labs <onboarding@resend.dev>',
      to: 'aldoarbizu.dev@gmail.com',
      subject: `🛸 Nuevo Lead de ${name} (Dark Orbital)`,
      html: `
        <div style="background-color: #0A0A0F; color: #C2C0B6; font-family: monospace; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); max-width: 600px; margin: auto;">
          <h2 style="color: #ffffff; border-bottom: 2px solid #1D9E75; padding-bottom: 8px; font-family: serif; font-size: 20px;">🛸 NEXUS Telemetry: Nuevo Lead</h2>
          <p style="font-size: 14px;"><strong>Remitente/Empresa:</strong> <span style="color: #ffffff; font-weight: bold;">${name}</span></p>
          <p style="font-size: 14px;"><strong>Email:</strong> <span style="color: #1D9E75; font-weight: bold;">${email}</span></p>
          <div style="background-color: #111118; border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 6px; margin-top: 16px;">
            <p style="margin-top: 0; font-weight: bold; color: #ffffff; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">DESCRIPCIÓN DE LA MISIÓN:</p>
            <p style="white-space: pre-line; margin-bottom: 0; font-size: 13px; line-height: 1.5; color: #C2C0B6;">${message}</p>
          </div>
          <footer style="margin-top: 24px; font-size: 10px; color: rgba(255,255,255,0.3); border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; text-align: center;">
            Arbizu Labs &bull; Dark Orbital Pipeline Dispatcher &bull; 2026
          </footer>
        </div>
      `
    })

    return { success: true, data }
  } catch (error: any) {
    console.error('Error al enviar email via Resend:', error)
    return { success: false, error: error.message || 'Error interno al enviar el correo.' }
  }
}
