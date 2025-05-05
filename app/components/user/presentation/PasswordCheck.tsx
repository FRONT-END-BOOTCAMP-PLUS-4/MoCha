'use client';

import { ChangeEvent, useRef, useState, type ReactElement, type RefObject } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/app/shared/ui/button/index';
import { isValidPassword } from '@/app/shared/consts/validation';
import { cn } from '@/app/shared/utils/cn';

type PasswordCheckProps = {
  closeModal: () => void;
  passwordRef: RefObject<HTMLInputElement | null>;
  submitPassword: () => void;
} & {};

export default function PasswordCheck(props: PasswordCheckProps): ReactElement {
  const { closeModal, passwordRef, submitPassword } = props;

  const [passwordValidation, setPasswordValidation] = useState(false);
  const checkValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value;
    const checkValidation = isValidPassword(target);
    setPasswordValidation(checkValidation);
  };

  const [isHide, setIsHide] = useState(false);
  const toggleHide = () => setIsHide(!isHide);

  return (
    <div className="flex flex-col gap-3 text-base">
      <label className="text-gray-4">현재 비밀번호</label>
      <div className="bg-main-bg border-main flex min-w-80 items-center justify-around rounded-lg border px-1">
        <input
          ref={passwordRef}
          onChange={checkValidation}
          type={isHide ? 'text' : 'password'}
          className="grow p-1 outline-none"
        />
        <Eye className="text-gray-5 hover:text-gray-7 cursor-pointer" onClick={toggleHide} />
      </div>
      <div className="flex justify-center gap-3">
        <Button
          intent={'primary'}
          className={cn('cursor-not-allowed px-4', {
            'cursor-pointer': passwordValidation,
          })}
          disabled={passwordValidation ? false : true}
          onClick={submitPassword}
        >
          다음
        </Button>
        <Button intent="ghost" className="hover:bg-main px-4" onClick={closeModal}>
          취소
        </Button>
      </div>
    </div>
  );
}
