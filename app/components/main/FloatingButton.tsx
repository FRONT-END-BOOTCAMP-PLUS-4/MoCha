import { FloatingButtonProps } from '@/app/shared/types/Calendar';
import { Plus } from 'lucide-react';

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      className="bg-main hover:bg-main-hover fixed right-4 bottom-4 z-30 flex h-14 w-14 items-center justify-center rounded-full focus:outline-none"
      onClick={onClick}
    >
      <Plus stroke="white" />
    </button>
  );
}
