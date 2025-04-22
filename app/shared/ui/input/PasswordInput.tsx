import { ChangeEvent, InputHTMLAttributes } from 'react';

import { Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

type PasswordInputProps = {
  isHide?: boolean;
  value: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
  error?: string | boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  className,
  isHide,
  value,
  onInputChange,
  error,
  onToggle,
  ...props
}: PasswordInputProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-md border px-4 py-3',
        error === 'invalid' ? 'border-error' : 'border-gray-4'
      )}
    >
      <input
        type={isHide ? 'text' : 'password'}
        value={value}
        onChange={onInputChange}
        className="w-full border-none text-sm outline-none"
        maxLength={20}
        {...props}
      />
      <Eye className="text-gray-5 hover:text-gray-7 cursor-pointer" onClick={onToggle} />
    </div>
  );
}
