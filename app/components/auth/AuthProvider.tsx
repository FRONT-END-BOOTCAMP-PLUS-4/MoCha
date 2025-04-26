'use client';

import { refreshToken } from '@/app/shared/utils/refreshToken';
import { useAuthStore } from '@/app/shared/stores/authStore';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setAccessToken, clearAuth } = useAuthStore.getState();

  useEffect(() => {
    async function initAuth() {
      let access = localStorage.getItem('access_token');
      if (!access) return;

      // 1) 첫 호출
      let res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${access}` },
      });

      // 2) 401이면 리프레시 시도
      if (res.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) {
          // 리프레시 실패 → 로그아웃
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          clearAuth();
          return;
        }
        access = newToken;
        // 재시도
        res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (res.status === 401) {
          // 재시도까지 실패 → 로그아웃
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          clearAuth();
          return;
        }
      }

      // 3) 기타 오류
      if (!res.ok) {
        console.error('AuthProvider HTTP error:', res.status);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        // API 레벨 실패 → 로그아웃
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        clearAuth();
        return;
      }

      // 4) 성공 → 상태 복원
      setAccessToken(access);
      setUser(data.user);
    }

    initAuth();
  }, []);

  return <>{children}</>;
}
