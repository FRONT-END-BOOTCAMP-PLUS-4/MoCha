'use client';

import { useAuthStore } from '@/app/shared/stores/authStore';
import { CalendarDays, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';

export default function ButtonList(): ReactElement {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const logOut = async () => {
    try {
      setIsLogged(false);

      // zustand 초기화
      useAuthStore.getState().clearAuth();

      // 로컬스토리지 초기화
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // 로그인 페이지로 이동
      router.push('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <>
      <Link href="/" className="hover:text-main flex gap-2">
        <CalendarDays size={20} />
        <span>캘린더</span>
      </Link>

      <Link href="/user" className="hover:text-main flex gap-2">
        <User size={20} />
        <span>마이페이지</span>
      </Link>
      {isLogged ? (
        <button onClick={logOut} className="hover:text-main flex gap-2 hover:cursor-pointer">
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      ) : (
        <Link href="/login" className="hover:text-main flex gap-2">
          <LogOut size={20} />
          <span>로그인</span>
        </Link>
      )}
    </>
  );
}
