'use client';

import { useAuthStore } from '@/app/shared/stores/authStore';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('res: ', res);

        // 인증 실패(401)일 때만 토큰 삭제
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('access_token');
            clearAuth();
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('data: ', data);

        // API 레벨 실패 처리
        if (!data.success) {
          localStorage.removeItem('access_token');
          clearAuth();
          throw new Error('유저 정보 로드 실패');
        }

        // 성공 시 상태 복원
        setAccessToken(token);
        setUser(data.user);
      } catch (error) {
        console.error('유저 정보 로드 중 오류 발생:', error);
        // 네트워크 오류 등 401 외 에러는 토큰 유지
      }
    })();
  }, []);

  return <>{children}</>;
}
