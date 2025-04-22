import { type RefObject, type ChangeEvent } from 'react';
import { Button } from '@/app/shared/ui/button';
import { cn } from '@/app/shared/utils/cn';

type ProfileSettingsProps = {
  userInfo: { userEmail: string; userNickName: string; userPhone: string };
  isEdit: boolean;
  toggleEdit: () => void;
  nickNameRef: RefObject<HTMLInputElement | null>;
  nickNameValidation: boolean | null;
  phoneRef: RefObject<HTMLInputElement | null>;
  phoneValidation: boolean | null;
  checkValidation: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileSettings(props: ProfileSettingsProps) {
  const {
    userInfo,
    isEdit,
    toggleEdit,
    nickNameRef,
    nickNameValidation,
    phoneRef,
    phoneValidation,
    checkValidation,
  } = props;

  return (
    <div
      className={cn(
        'border-gray-5 text-gray-6 flex items-start gap-5 rounded-lg border p-3',
        'text-base md:text-lg'
      )}
    >
      <div className="flex grow flex-col gap-2">
        <div className="flex gap-1">
          <label className="min-w-20">이메일</label>
          <input
            type="text"
            value={userInfo.userEmail}
            className="grow outline-none"
            readOnly={true}
          />
        </div>
        <div className="flex gap-1">
          <label htmlFor="userNickName" className="min-w-20">
            닉네임
          </label>
          <input
            type="text"
            id="userNickName"
            name="userNickName"
            ref={nickNameRef}
            defaultValue={userInfo.userNickName}
            placeholder="2~8자의 한글, 영문, 숫자만 사용할 수 있어요."
            onChange={checkValidation}
            className={cn('grow border-b-2 border-transparent outline-none', {
              'border-gray-5 focus:border-main': isEdit,
            })}
            readOnly={!isEdit}
          />
        </div>
        <div className="flex gap-1">
          <label htmlFor="userPhone" className="min-w-20">
            전화번호
          </label>
          <input
            type="text"
            id="userPhone"
            name="userPhone"
            ref={phoneRef}
            defaultValue={userInfo.userPhone}
            placeholder="숫자만 입력해주세요. (예: 01012345678)"
            onChange={checkValidation}
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
            <Button intent="primary" className="px-4 py-2">
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
