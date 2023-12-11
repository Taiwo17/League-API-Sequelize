import nodemailer, { Transporter } from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const prepareMail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    const transport: Transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: text,
    })
  } catch (err: any) {
    console.log(err.stack)
  }
}
