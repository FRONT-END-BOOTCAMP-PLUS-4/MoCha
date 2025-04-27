import { useState, useRef, type ChangeEvent } from 'react';
import { Eye } from 'lucide-react';
import { isValidPassword } from '@/app/shared/consts/validation';
import { Button } from '@/app/shared/ui/button/index';
import { cn } from '@/app/shared/utils/cn';

type PasswordChangeProps = {
  closeModal: () => void;
  changeProcess: () => void;
} & {};

export default function PasswordChange(props: PasswordChangeProps) {
  const { closeModal, changeProcess } = props;

  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordValidation, setPasswordValidation] = useState(false);

  const checkPasswordRef = useRef<HTMLInputElement>(null);
  const [checkPassword, setCheckPassword] = useState(false);

  const checkValidation = (event: ChangeEvent<HTMLInputElement>) => {
    if (!passwordRef.current) return;
    if (!checkPasswordRef.current) return;
    const passwordValue = passwordRef.current.value;
    const checkValue = checkPasswordRef.current.value;
    const target = event.target.value;
    const checkValidation = isValidPassword(target);
    setPasswordValidation(checkValidation);

    if (passwordValue === checkValue) {
      console.log('비밀번호가 같아요');
      setCheckPassword(true);
    } else {
      console.log('비밀번호가 틀려요');
      setCheckPassword(false);
    }
  };

  const [isHide, setIsHide] = useState(false);
  const toggleHide = () => setIsHide(!isHide);

  return (
    <div className="flex flex-col gap-3 text-base">
      <label className="text-gray-4">변경할 비밀번호</label>
      <div
        className={cn(
          'bg-main-bg border-main flex min-w-80 items-center justify-around rounded-lg border px-1',
          {
            'border-error': !passwordValidation,
          }
        )}
      >
        <input
          ref={passwordRef}
          onChange={checkValidation}
          type={isHide ? 'text' : 'password'}
          className="grow p-1 outline-none"
        />
        <Eye className="text-gray-5 hover:text-gray-7 cursor-pointer" onClick={toggleHide} />
      </div>
      <label className="text-gray-4">변경할 비밀번호 확인</label>
      <div
        className={cn(
          'bg-main-bg border-main flex min-w-80 items-center justify-around rounded-lg border px-1',
          {
            'border-error': !checkPassword,
          }
        )}
      >
        <input
          ref={checkPasswordRef}
          onChange={checkValidation}
          type={isHide ? 'text' : 'password'}
          className="grow p-1 outline-none"
        />
      </div>
      <div className="flex justify-center gap-3">
        <Button
          intent={'primary'}
          className={cn('cursor-not-allowed px-4', {
            'cursor-pointer': passwordValidation,
          })}
          disabled={passwordValidation ? false : true}
          onClick={changeProcess}
        >
          변경하기
        </Button>
        <Button intent="ghost" className="hover:bg-main px-4" onClick={closeModal}>
          취소
        </Button>
      </div>
    </div>
  );
}
