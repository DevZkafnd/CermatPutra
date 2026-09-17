'use client';

import { useState, useEffect, useRef } from 'react';

interface EmailOTPModalProps {
  isOpen: boolean;
  currentEmail: string;
  onClose: () => void;
  onVerified: (newEmail: string, subscribeNewsletter: boolean) => void;
}

type Step = 'input' | 'verify';

export default function EmailOTPModal({ isOpen, currentEmail, onClose, onVerified }: EmailOTPModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setSubscribeNewsletter(false);
      setCountdown(0);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    setError(null);

    // Validasi email
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Format email tidak valid');
      return;
    }

    // Simulasi kirim OTP
    setStep('verify');
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    // Focus ke input OTP pertama
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus ke input berikutnya
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    // Focus ke input terakhir yang terisi
    const lastFilledIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerifyOTP = () => {
    setError(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    // Simulasi verifikasi OTP (mock: terima semua kode)
    // Di production, ini akan memanggil API backend
    onVerified(email, subscribeNewsletter);
    onClose();
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  const handleBack = () => {
    setStep('input');
    setOtp(['', '', '', '', '', '']);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Bottom Sheet Style */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {step === 'verify' && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                aria-label="Kembali"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-lg font-bold text-neutral-900">
              {step === 'input' ? 'Ubah Email' : 'Verifikasi OTP'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
            aria-label="Tutup"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 'input' ? (
            <>
              <p className="mb-1 text-sm text-gray-600">Email saat ini</p>
              <p className="mb-4 text-base font-bold text-neutral-900">{currentEmail}</p>
              
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-semibold text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  autoFocus
                />
              </div>

              {error && (
                <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
              )}

              {/* Newsletter Checkbox */}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-primary-300 hover:bg-primary-50">
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">Berlangganan Newsletter</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Dapatkan informasi promo, diskon, dan produk terbaru langsung ke email Anda
                  </p>
                </div>
              </label>

              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-700">
                  <span className="font-bold">⚠️ Demo Mode:</span> Kode OTP tidak akan dikirim ke email Anda. 
                  Fitur ini hanya untuk demonstrasi UI/UX. Masukkan 6 digit angka apa saja untuk verifikasi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendOTP}
                className="mt-4 w-full rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white transition hover:bg-primary-700"
              >
                Kirim Kode OTP
              </button>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600">
                Kode OTP telah dikirim ke email{' '}
                <span className="font-bold text-neutral-900">{email}</span>
              </p>

              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={index === 0 ? handleOTPPaste : undefined}
                    className="h-12 w-12 rounded-xl border-2 border-gray-300 text-center text-xl font-bold text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                ))}
              </div>

              {error && (
                <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>
              )}

              <div className="mt-4 text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Kirim ulang kode dalam{' '}
                    <span className="font-bold text-primary-600">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm font-bold text-primary-600 hover:text-primary-700"
                  >
                    Kirim Ulang Kode OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otp.some((d) => !d)}
                className="mt-4 w-full rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verifikasi
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
