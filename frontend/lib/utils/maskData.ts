/**
 * Mask phone number
 * Example: 081234567890 → ************90
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return '*'.repeat(phone.length - 2) + phone.slice(-2);
}

/**
 * Mask email
 * Example: sahrul@icloud.com → s*************t@icloud.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length < 3) return email;
  return local[0] + '*'.repeat(local.length - 2) + local.slice(-1) + '@' + domain;
}
