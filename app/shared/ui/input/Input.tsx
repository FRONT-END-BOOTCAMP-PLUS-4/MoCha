'use client';

import { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type InputProps = {
  error?: string | boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, error, type = 'text', ...props }: InputProps) {
  return (
    <input
      className={cn(
        'placeholder-gray-6 rounded-md border px-4 py-3 text-sm outline-none',
        error ? 'border-error' : 'border-gray-4',
        className
      )}
      type={type}
      {...props}
    />
  );
}
