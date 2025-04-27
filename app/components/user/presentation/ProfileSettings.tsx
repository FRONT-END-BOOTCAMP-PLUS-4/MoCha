// package
import { useState, useEffect, type RefObject, type ChangeEvent, type ReactElement } from 'react';
// layer
import { Button } from '@/app/shared/ui/button';
import { cn } from '@/app/shared/utils/cn';
import { useAuthStore } from '@/app/shared/stores/authStore';
import { isValidNickname, isValidPhoneNumber } from '@/app/shared/consts/validation';

type ProfileSettingsProps = {
  nickNameRef: RefObject<HTMLInputElement | null>;
  phoneRef: RefObject<HTMLInputElement | null>;
  submitInfo: () => void;
};

export default function ProfileSettings(props: ProfileSettingsProps):ReactElement {

  const { nickNameRef, phoneRef, submitInfo } = props;
  const user = useAuthStore((state) => state.user);
  const NICKNAME = 'userNickName';
  const PHONE = 'userPhone';

  const [isEdit, setIsEdit] = useState(false);

  const [nickNameValidation, setNickNameValidation] = useState<boolean | null>(null);
  const [phoneValidation, setPhoneValidation] = useState<boolean | null>(null);

  const changeInputValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === NICKNAME) {
      const isValid = isValidNickname(value);
      setNickNameValidation(!isValid);
    }

    if (name === PHONE) {
      const isValid = isValidPhoneNumber(value);
      setPhoneValidation(!isValid);
    }
  };

  const toggleEdit = () => {
    if (isEdit && user && nickNameRef.current && phoneRef.current) {
      nickNameRef.current.value = user.nickname;
      phoneRef.current.value = user.phone_number;
      setNickNameValidation(null);
      setPhoneValidation(null);
    };
    setIsEdit(!isEdit);
  };

  // 선언위치가 잘못되었다.
  // ui만 사용하는 상태가 아니라면, Container Layer에서 사용하는게 맞다고본다.
  useEffect(() => {
    if (user && nickNameRef.current && phoneRef.current) {
      nickNameRef.current.value = user.nickname;
      phoneRef.current.value = user.phone_number;
    }
    setIsEdit(false);
    setNickNameValidation(null);
    setPhoneValidation(null);
  }, [user]);
  return (
    <div
      className={cn(
        'border-gray-5 text-gray-6 flex items-start gap-5 rounded-lg border p-3',
        'text-base md:text-lg'
      )}
    >
      <div className="flex grow flex-col gap-2">
        {/* Email */}
        <div className="flex gap-1">
          <label className="min-w-20">이메일</label>
          <input
            type="text"
            value={user ? user.email : ''}
            className="grow outline-none"
            readOnly={true}
          />
        </div>

        {/* NickName */}
        <div className="flex gap-1">
          <label htmlFor={NICKNAME} className="min-w-20">
            닉네임
          </label>
          <input
            type="text"
            id={NICKNAME}
            name={NICKNAME}
            ref={nickNameRef}
            defaultValue={user ? user.nickname : ''}
            placeholder="2~8자의 한글, 영문, 숫자만 사용할 수 있어요."
            onChange={changeInputValidation}
            className={cn('grow border-b-2 border-transparent outline-none', {
              'border-gray-5 focus:border-main': isEdit,
            })}
            readOnly={!isEdit}
          />
        </div>

        {/* Phone */}
        <div className="flex gap-1">
          <label htmlFor={PHONE} className="min-w-20">
            전화번호
          </label>
          <input
            type="text"
            id={PHONE}
            name={PHONE}
            ref={phoneRef}
            defaultValue={user ? user.phone_number : ''}
            placeholder="숫자만 입력해주세요. (예: 01012345678)"
            onChange={changeInputValidation}
            className={cn('grow border-b-2 border-transparent outline-none', {
              'border-gray-5 focus:border-main': isEdit,
            })}
            readOnly={!isEdit}
          />
        </div>

        {nickNameValidation && (
          <p className="text-error text-sm">2~8자의 한글, 영문, 숫자만 사용할 수 있어요.</p>
        )}
        {phoneValidation && (
          <p className="text-error text-sm">숫자만 입력해주세요. (예: 01012345678)</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isEdit ? (
          <>
            <Button intent="primary" className="px-4 py-2" onClick={submitInfo}>
              저장
            </Button>
            <Button intent="ghost" className="px-4 py-2" onClick={toggleEdit}>
              취소
            </Button>
          </>
        ) : (
          <Button intent="primary" className="px-4 py-2" onClick={toggleEdit}>
            수정
          </Button>
        )}
      </div>
    </div>
  );
}
