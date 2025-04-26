'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { decodeJwt } from 'jose';
import { useAuthStore } from '@/app/shared/stores/authStore';

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setUser } = useAuthStore.getState();
  const [loading, setLoading] = useState(true);

  /** Strict Mode 중복 호출 방지 */
  const invoked = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || invoked.current) return;
    invoked.current = true;

    (async () => {
      try {
        const res = await fetch('/api/auth/kakao/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.error);

        const { access_token, refresh_token, isNew } = data;
        const { user } = decodeJwt(access_token) as { user: any };

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setAccessToken(access_token);
        setUser(user);

        router.replace(isNew ? '/social-info' : '/');
      } catch (err) {
        alert(`소셜 로그인 실패: ${(err as Error).message}`);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, router, setAccessToken, setUser]);

  return <div>{loading ? '로그인 처리 중입니다…' : '잠시만 기다려 주세요.'}</div>;
}
