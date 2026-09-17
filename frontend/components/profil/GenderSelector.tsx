'use client';

import { useState, useEffect } from 'react';
import { JenisKelamin } from '@/types/pengguna.types';

interface GenderSelectorProps {
  isOpen: boolean;
  currentGender: JenisKelamin | null;
  onClose: () => void;
  onConfirm: (gender: JenisKelamin) => void;
}

export default function GenderSelector({ isOpen, currentGender, onClose, onConfirm }: GenderSelectorProps) {
  const [selected, setSelected] = useState<JenisKelamin | null>(currentGender);

  useEffect(() => {
    setSelected(currentGender);
  }, [currentGender, isOpen]);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      onClose();
    }
  };

  const options: JenisKelamin[] = ['Pria', 'Wanita', 'Lainnya'];

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
          <h2 className="text-lg font-bold text-neutral-900">Jenis Kelamin</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-gray-500"
          >
            Batal
          </button>
        </div>

        <div className="p-6 space-y-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              className={`w-full rounded-xl border-2 px-6 py-4 text-left text-base font-semibold transition ${
                selected === option
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selected === option && (
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </>
  );
}
