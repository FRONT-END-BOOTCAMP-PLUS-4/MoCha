'use client';
import Header from '@/app/shared/ui/root-header';
import { useEffect } from 'react';

// 토큰을 위한 임시 타입 ___ Temp
interface Temp_Response {
  status: number;
  access_token: string;
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 토큰 임시저장 ___ Temp
    useEffect(() => {
      const isToken = localStorage.getItem('access_token');
      if(!isToken){
        fetch('/api/temp')
        .then((res) => res.json())
        .then((data: Temp_Response) => {
          localStorage.setItem('access_token', data.access_token);
          console.log("access_token 저장");
        });
      }
    }, []);

  return (
    <div className='h-full flex flex-col'>
      <div><Header /></div>
      <main className="max-w-(--layout-w-base) grow shrink-0">{children}</main>
    </div>
  );
}
