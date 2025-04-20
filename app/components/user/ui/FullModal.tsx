import { type ReactElement } from 'react';
import { useFullModal } from '@/app/(core)/user/model/useFullModalStore';
import { X } from 'lucide-react';
import { cn } from '@/app/shared/utils/cn';

export default function FullModal(): ReactElement {
  const { content, action } = useFullModal();

  return (
    <div
      className={cn(
        'fixed inset-0 z-2 flex items-center justify-center bg-black/80',
        'transform transition-transform duration-200 ease-in-out',
        {
          'translate-x-0': content,
          'translate-x-full': !content,
        }
      )}
    >
      <div className="absolute top-5 right-5 cursor-pointer text-white" onClick={action.close}>
        <X size={30} />
      </div>

      {content}
    </div>
  );
}
