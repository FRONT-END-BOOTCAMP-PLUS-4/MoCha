'use client';

import Image from 'next/image';
import { decodeJwt } from 'jose';
import { useAuthStore } from '@/app/shared/stores/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore.getState();

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async ({ access_token }) => {
      try {
        // 1) 백엔드 교환
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: access_token }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error ?? '소셜 로그인 실패');
        }

        const { token, isNew } = data;

        // 2) 로컬 스토리지 + zustand 저장
        localStorage.setItem('access_token', token);
        setAccessToken(token);
        const decoded = decodeJwt(token) as {
          user: { email: string; nickname: string; phone_number: string; provider: number };
        };
        console.log('decoded: ', decoded);
        setUser(decoded.user);

        // 3) 신규 여부에 따라 분기
        router.push(isNew ? '/social-info' : '/');
      } catch (e) {
        console.error('구글 로그인 처리 중 오류:', e);
        alert('로그인 실패');
        router.push('/login');
      }
    },
    onError: (err) => {
      console.error('구글 로그인 실패:', err);
      alert('로그인 실패');
    },
  });

  return (
    <button
      onClick={() => login()}
      className="border-gray-3 flex justify-center gap-2 rounded-md border bg-white px-4 py-3 hover:cursor-pointer"
    >
      <Image src="/images/social/google-logo.svg" alt="구글 로그인" width={20} height={24} />
      <span>구글로 로그인하기</span>
    </button>
  );
}
