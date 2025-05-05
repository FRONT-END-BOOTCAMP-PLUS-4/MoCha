import { useState, useRef, useEffect } from 'react';
import { isValidNickname, isValidPhoneNumber } from '@/app/shared/consts/validation';
import ProfileSettings from '@/app/components/user/presentation/ProfileSettings';
import { useAuthStore } from '@/app/shared/stores/authStore';

type FetchData = {
  status: number;
  data: { email: string;
    nickname: string;
    phone_number: string;
    provider: number; };
};

export default function ProfileSettingsContainer() {
  const [fetchData, setFetchData] = useState<FetchData | null>(null);
  const nickNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const setUser = useAuthStore( state => state.setUser);

  const submitInfo = async ():Promise<void> => {
    if (!nickNameRef.current) return;
    if (!phoneRef.current) return;

    if(!isValidNickname(nickNameRef.current.value)) return alert("닉네임 형식이 맞지않아요");
    if(!isValidPhoneNumber(phoneRef.current.value)) return alert("핸드폰 형식이 맞지않아요");

    try{
      const fetchRequest:Response = await fetch('/api/user/edit', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickName: nickNameRef.current.value, phone: phoneRef.current.value }),
      });
  
      const response:FetchData = await fetchRequest.json();
      setFetchData(response);
    }catch(error){
      console.error('error:',error);
      alert('잠시 후 다시 시도해주세요.');
    }
  };

  useEffect(()=>{
    if(!fetchData) return;

    switch(fetchData.status){
      case 201:
        setUser(fetchData.data);
        break;
      case 400:
        // 임시
        alert('유효성검사 실패')
        break;
      case 500:
        // 임시
        alert("서버에러")
      default:
        // 임시
        alert('잠시후 다시 시도해주세요')
        break;
    }

  },[fetchData])

  return <ProfileSettings nickNameRef={nickNameRef} phoneRef={phoneRef} submitInfo={submitInfo} />;
}
