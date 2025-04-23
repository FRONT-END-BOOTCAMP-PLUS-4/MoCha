'use client';

import Image from 'next/image';

export default function LogoImage() {
  return (
    <div className="flex justify-center">
      <Image src="/images/mocha_logo.svg" alt="Mocha_logo" width={120} height={80} priority />
    </div>
  );
}
