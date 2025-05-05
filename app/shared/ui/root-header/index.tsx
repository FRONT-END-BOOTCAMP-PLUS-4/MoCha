'use client';
import LogoImage from '@/app/components/auth/LogoImage';
import { AlignJustify } from 'lucide-react';
import dynamic from 'next/dynamic';
import { type ReactElement } from 'react';
import { cn } from '../../utils/cn';
import useNavModal from './model/useNavModal';
const ButtonList = dynamic(() => import('./ui/ButtonList'), { ssr: false });

export default function RootHeader(): ReactElement {
  const { isModal, toggleModal } = useNavModal();

  return (
    <header className="h-(--header-h-base) text-base">
      <div className="bg-main-bg @container fixed z-1 h-(--header-h-base) w-full shadow-md">
        <div className="relative m-auto flex h-full max-w-(--layout-w-base) items-center justify-between px-4">
          <LogoImage />

          {/* button list */}
          <div className="text-gray-5">
            <div
              className={cn('hover:text-main flex cursor-pointer gap-2 @3xl:hidden', {
                'text-main': isModal,
              })}
              onClick={toggleModal}
            >
              <AlignJustify size={20} />
            </div>
            {isModal && (
              <div className="bg-main-bg absolute right-0 bottom-0 left-0 z-100 flex translate-y-full flex-col gap-4 p-4">
                <ButtonList />
              </div>
            )}

            <div className="hidden gap-4 @3xl:flex">
              <ButtonList />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
