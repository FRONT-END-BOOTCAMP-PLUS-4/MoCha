'use client';

import './globals.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from './shared/stores/authStore';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 앱 로드 시, 사용자 정보 불러오기
  const { setUser, setAccessToken, clearAuth } = useAuthStore.getState();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // HTTP 에러(401, 500 등) 처리
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setAccessToken(token); // zustand에도 저장
          setUser(data.user);
        } else {
          throw new Error('유저 정보 로드 실패');
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('access_token');
        clearAuth();
      }
    })();
  }, [setUser, setAccessToken, clearAuth]);

  return (
    <html lang="ko">
      <body className="bg-main-bg">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
