// server/services/smsService.js
/**
 * Stubbed SMS sender – logs messages instead of really sending.
 */
export async function sendSMS(to, body) {
  console.log(`[smsService stub] To: ${to} — ${body}`);
  return Promise.resolve();
}
