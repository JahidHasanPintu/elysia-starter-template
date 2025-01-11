import nodemailer from 'nodemailer'

export async function sendMail({ to, subject, text }: { to: string, subject: string, text: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: +process.env.SMTP_PORT!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    }
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject,
    text,
  })
}
