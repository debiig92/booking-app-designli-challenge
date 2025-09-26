'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jwt', token);
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  }, [params, router]);
  return <div className="p-8">Signing you in…</div>;
}
