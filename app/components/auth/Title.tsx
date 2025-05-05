'use client';

import { ReactNode } from 'react';

export default function Title({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-center text-xl font-semibold">{children}</h1>
    </div>
  );
}
