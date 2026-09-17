import FormLogin from '@/components/forms/FormLogin';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-sm text-gray-600">Memuat...</div>}>
        <FormLogin />
      </Suspense>
    </div>
  );
}
