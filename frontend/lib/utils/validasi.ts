export function validasiEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validasiPassword(password: string): boolean {
  return password.length >= 6;
}

export function validasiNomorTelepon(nomor: string): boolean {
  const nomorRegex = /^08[0-9]{8,12}$/;
  return nomorRegex.test(nomor);
}
