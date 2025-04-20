import { useState } from 'react';
import { Button } from '@/app/shared/ui/button/Button';

export default function ProfileSettings() {
  const [isEdit, setIsEdit] = useState(false);
  const toggleEdit = () => setIsEdit(!isEdit);

  return (
    <div className="border-gray-5 text-gray-6 flex items-start gap-5 rounded-lg border p-3">
      <div className="flex grow flex-col gap-2">
        {/* 이메일 */}
        <div>
          <span>이메일:</span>
          <span>Mocha@gmail.com</span>
        </div>
        {/* 닉네임 */}
        <div className='flex'>
          <span>닉네임:</span>
          {isEdit ? <input defaultValue={"치카치카"} className='outline-none border-b grow border-gray-5'/> : <span>치카치카</span> }
        </div>
        {/* 전화번호 */}
        <div className='flex'>
          <span>전화번호:</span>
          {isEdit ? <input defaultValue={"010-1111-2222"} className='outline-none border-b grow border-gray-5'/> : <span>010-1111-2222</span> }
        </div>
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
