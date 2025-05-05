'use client';

import { ModalProps } from '@/app/shared/types/Calendar';

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative max-h-[90vh] w-[90%] max-w-md overflow-y-auto rounded-xl bg-white p-6">
        {children}
      </div>
    </div>
  );
}
