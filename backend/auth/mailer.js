// sends OTP and password-reset emails; falls back to logging to the console
// when no SMTP credentials are configured, so the app still runs in dev
// without a real mail provider (see backend/.env.example)
const nodemailer = require("nodemailer")

const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

const transporter = smtpConfigured
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          },
      })
    : null

const from = process.env.SMTP_FROM || "Ghribi Foundation <no-reply@ghribifoundation.local>"

const sendMail = async ({ to, subject, text, html }) => {
    if (!transporter) {
        console.log(`[mailer] SMTP not configured, printing email instead of sending it.`)
        console.log(`[mailer] To: ${to}\n[mailer] Subject: ${subject}\n[mailer] ${text}`)
        return
    }
    await transporter.sendMail({ from, to, subject, text, html })
}

const sendOtpEmail = (to, code) => {
    return sendMail({
        to,
        subject: "Your Ghribi Foundation verification code",
        text: `Your verification code is ${code}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
        html: `<p>Your verification code is <b>${code}</b>.</p><p>It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>`,
    })
}

const sendPasswordResetEmail = (to, resetLink) => {
    return sendMail({
        to,
        subject: "Reset your Ghribi Foundation password",
        text: `Reset your password using this link: ${resetLink} (expires in ${process.env.PASSWORD_RESET_EXPIRY_MINUTES || 30} minutes). If you didn't request this, ignore this email.`,
        html: `<p>Reset your password using <a href="${resetLink}">this link</a>.</p><p>It expires in ${process.env.PASSWORD_RESET_EXPIRY_MINUTES || 30} minutes. If you didn't request this, ignore this email.</p>`,
    })
}

module.exports = { sendOtpEmail, sendPasswordResetEmail }
