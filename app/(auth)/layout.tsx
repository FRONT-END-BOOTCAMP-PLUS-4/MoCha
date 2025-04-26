'use client';

import { ReactNode, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

  return <div className="bg-main-bg m-auto max-w-(--layout-w-auth)">{children}</div>;
}
