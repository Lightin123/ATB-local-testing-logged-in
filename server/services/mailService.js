// server/services/mailService.js
import nodemailer from 'nodemailer';
/**
 * Stubbed email sender – logs and uses local sendmail if available.
 */
export async function sendEmail(to, subject, text) {
  console.log(`[mailService] To: ${to}; Subject: ${subject}; Body: ${text}`);
  try {
    const transporter = nodemailer.createTransport({
      sendmail: true, newline: 'unix', path: '/usr/sbin/sendmail'
    });
    await transporter.sendMail({ from: 'no-reply@example.com', to, subject, text });
    console.log(`[mailService] Sent to ${to}`);
  } catch (err) {
    console.error(`[mailService] Error sending to ${to}:`, err);
  }
}
