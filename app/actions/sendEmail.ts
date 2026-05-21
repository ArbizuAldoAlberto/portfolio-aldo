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
      from: 'Antigravity Studio <onboarding@resend.dev>',
      to: 'aldoarbizu.dev@gmail.com',
      subject: `Nuevo Lead de ${name} (Dark Orbital)`,
      html: `
        <h3>Nuevo contacto desde tu Portfolio</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
      `
    })

    return { success: true, data }
  } catch (error: any) {
    console.error('Error al enviar email via Resend:', error)
    return { success: false, error: error.message || 'Error interno al enviar el correo.' }
  }
}
