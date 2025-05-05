'use client';
import { useEffect, useRef, useState } from 'react';
import PasswordChange from '@/app/components/user/presentation/PasswordChange';
import { useFullModal } from '@/app/(core)/user/store/useFullModalStore';
import { isValidPassword } from '@/app/shared/consts/validation';

type FetchData = {
    status: number;
  };

export default function PasswordChangeContainer() {

  const [fetchData, setFetchData] = useState<FetchData | null>(null);  
  const closeModal = useFullModal((state) => state.action.close);
  const passwordRef = useRef<HTMLInputElement>(null);
  const checkPasswordRef = useRef<HTMLInputElement>(null);

  const submitPassword = async (): Promise<void> => {
    if (!passwordRef.current) return;
    if (!checkPasswordRef.current) return;

    if (!isValidPassword(passwordRef.current.value)) return alert('비밀번호 형식이 맞지않아요');
    if (passwordRef.current.value !== checkPasswordRef.current.value ) return alert('비밀번호가 일치하지 않습니다');

    try {
      const fetchRequest: Response = await fetch('/api/user/password', {
        method: 'PUT',
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
        closeModal();
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
    <PasswordChange
      closeModal={closeModal}
      passwordRef={passwordRef}
      checkPasswordRef={checkPasswordRef}
      submitPassword={submitPassword}
    />
  );
}
