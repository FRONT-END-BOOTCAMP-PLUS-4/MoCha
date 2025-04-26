'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { decodeJwt } from 'jose';
import { useAuthStore } from '@/app/shared/stores/authStore';

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAccessToken, setUser } = useAuthStore.getState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const handleSocialCallback = async () => {
      try {
        const res = await fetch(`/api/auth/kakao/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(`소셜 로그인 실패: ${data.error}`);
          router.push('/login');
          return;
        }

        const { token, isNew } = data;

        const decodedToken = decodeJwt(token) as {
          user: {
            email: string;
            nickname: string;
            phone_number: string;
            provider: number;
          };
        };

        localStorage.setItem('access_token', token);
        setAccessToken(token);
        setUser(decodedToken.user);

        router.push(isNew ? '/social-info' : '/');
      } catch (err) {
        console.error('소셜 로그인 처리 중 오류:', err);
        alert('로그인 실패');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleSocialCallback();
  }, [searchParams]);

  return <div>{loading ? '로그인 처리 중입니다...' : '잠시만 기다려 주세요.'}</div>;
}
