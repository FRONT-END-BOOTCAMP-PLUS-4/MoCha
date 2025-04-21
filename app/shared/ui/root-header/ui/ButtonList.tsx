import { useAuthStore } from '@/app/shared/stores/authStore';
import { AlarmClock, CalendarDays, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

export default function ButtonList(): ReactElement {
  const router = useRouter();
  const logOut = async () => {
    console.log('로그아웃 버튼 클릭');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // zustand 초기화
      useAuthStore.getState().clearAuth();

      // 로컬스토리지 초기화
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // 로그인 페이지로 이동
      router.push('/login');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <>
      <Link href="" className="hover:text-main flex gap-2">
        <CalendarDays size={20} />
        <span>캘린더</span>
      </Link>
      <Link href="" className="hover:text-main flex gap-2">
        <AlarmClock size={20} />
        <span>챌린지</span>
      </Link>
      <Link href="" className="hover:text-main flex gap-2">
        <User size={20} />
        <span>마이페이지</span>
      </Link>
      <Link href="" className="hover:text-main flex gap-2">
        <LogOut size={20} />
        <span>로그인</span>
      </Link>
    </>
  );
}
