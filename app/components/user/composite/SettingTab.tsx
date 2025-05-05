'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSettingsContainer from '@/app/components/user/container/ProfileSettingsContainer';
import PasswordContainer from '@/app/components/user/container/PasswordContainer';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';

export default function SettingTab() {
  const router = useRouter();
  const open = useFullModal((state) => state.action.open);
  const [isSecession, setIsSecession] = useState(false);

  // 이메일 , delete_id 같은값
  // 닉네임, 전화번호 null
  const outSecession = async  () => {
    const CONFIRM = confirm("정말로 탈퇴하시겠습니까?");

    if(!CONFIRM) return;
    
    const res = await fetch('/api/user/delete',{
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    })

    const response = await res.json();
    setIsSecession(response.data);
  }

  useEffect(()=>{
    if(isSecession) router.push('/login');
  },[isSecession])
  
  return (
    <div>
      {/* 프로필 */}
      <ProfileSettingsContainer />
      <hr className="text-gray-4 my-3" />
      <div className="flex flex-col gap-3 text-sm">
        <button
          className="border-gray-5 text-gray-5 hover:text-main hover:border-main cursor-pointer rounded-lg border p-1"
          onClick={() => open(<PasswordContainer />)}
        >
          비밀번호 변경
        </button>
        <button className="border-gray-5 text-gray-5 hover:text-main hover:border-main cursor-pointer rounded-lg border p-1" onClick={outSecession}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
