'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/app/shared/stores/authStore';

export default function SocialCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const provider = params.provider as string;

  const { setAccessToken, setUser } = useAuthStore.getState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || !provider) return;

    const handleSocialCallback = async () => {
      try {
        const res = await fetch(`/api/auth/${provider}/exchange`, {
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

        const { access_token, refresh_token, user, isNew } = data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setAccessToken(access_token);
        setUser(user);

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
  }, [searchParams, provider]);

  return <div>{loading ? '로그인 처리 중입니다...' : '잠시만 기다려 주세요.'}</div>;
}
