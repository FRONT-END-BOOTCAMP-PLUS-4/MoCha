'use client';

import { useRef, useEffect, useState } from 'react';
import { isValidPassword } from '@/app/shared/consts/validation';
import PasswordCheck from '@/app/components/user/presentation/PasswordCheck';
import PasswordChangeContainer from '@/app/components/user/container/PasswordChangeContainer';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';

type FetchData = {
  status: number;
  data: boolean
};

export default function PasswordContainer() {
  const [fetchData, setFetchData] = useState<FetchData | null>(null);
  const action = useFullModal((state) => state.action);
  const closeModal = () => action.close();
  const nextProcess = () => action.open(<PasswordChangeContainer />);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitPassword = async (): Promise<void> => {
    if (!passwordRef.current) return;

    if (!isValidPassword(passwordRef.current.value)) return alert('비밀번호 형식이 맞지않아요');

    try {
      const fetchRequest: Response = await fetch('/api/user/edit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordRef.current.value }),
      });

      const response: FetchData = await fetchRequest.json();
      setFetchData(response);
    } catch (error) {
      console.error('error:', error);
      alert('잠시 후 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (!fetchData) return;

    switch (fetchData.status) {
      case 200:
        if(fetchData.data) nextProcess()
        break;
      case 400:
        // 임시
        alert('유효성검사 실패');
        break;
      case 500:
        // 임시
        alert('서버에러');
      default:
        // 임시
        alert('잠시후 다시 시도해주세요');
        break;
    }
  }, [fetchData]);

  return (
    <PasswordCheck closeModal={closeModal} passwordRef={passwordRef} submitPassword={submitPassword}/>
  );
}
