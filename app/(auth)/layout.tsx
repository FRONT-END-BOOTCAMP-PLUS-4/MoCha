'use client';

import { ReactNode, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // access_token 이름으로 아무 값 넣어도 작동됨, 추후에 수정해야함
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/');
    } else {
      setIsLoading(true);
    }
  }, [router]);

  if (!isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-main h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <div className="bg-main-bg m-auto max-w-(--layout-w-auth) p-3">{children}</div>;
}
