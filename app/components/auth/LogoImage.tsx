'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LogoImage() {
  return (
    <Link href="/" className="flex items-center justify-center hover:cursor-pointer">
      <div className="text-2xl font-bold">MoCha</div>
      <Image src="/images/mocha-logo.png" alt="Mocha_logo" width={50} height={50} priority />
    </Link>
  );
}
