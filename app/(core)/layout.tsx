'use client';
import Header from '@/app/shared/ui/root-header';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className='h-full flex flex-col'>
      <div><Header /></div>
      <main className="max-w-(--layout-w-base) w-full grow shrink-0 mx-auto">{children}</main>
    </div>
  );
}
