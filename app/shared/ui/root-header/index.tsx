'use client';
import { type ReactElement } from 'react';
import { AlignJustify } from 'lucide-react';
import { cn } from '../../utils/cn';
import ButtonList from './ui/ButtonList';
import useNavModal from './model/useNavModal';

export default function RootHeader(): ReactElement {
  const { isModal, toggleModal } = useNavModal();

  return (
    <header className="h-(--header-h-base) text-base">
      <div className="bg-main-bg @container fixed z-1 h-(--header-h-base) w-full shadow-md">
        <div className="relative m-auto flex h-full max-w-(--layout-w-base) items-center justify-between px-4">
          {/* logo */}
          <div className="flex items-center">
            <span>Logo</span>
          </div>

          {/* button list */}
          <div className="text-gray-5">
            <div
              className={cn("hover:text-main flex cursor-pointer gap-2 @3xl:hidden",{
                "text-main": isModal
              })}
              onClick={toggleModal}
            >
              <AlignJustify size={20} />
            </div>
            {isModal && (
              <div className="absolute right-0 bottom-0 left-0 translate-y-full bg-main-bg p-4 flex flex-col gap-4">
                <ButtonList />
              </div>
            )}

            <div className="hidden gap-4 @3xl:flex">
              <ButtonList/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
