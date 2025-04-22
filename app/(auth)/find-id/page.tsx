'use client';

import { isValidNickname, isValidPhoneNumber } from '@/app/shared/consts/validation';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import Modal from '@/app/components/main/modal/TransactionModal';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input/Input';
import Label from '@/app/shared/ui/label/Label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
}

export default function FindIdPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [foundEmail, setFoundEmail] = useState<string | null>(null);

  const [status, setStatus] = useState({
    nickname: 'none',
    phoneNumber: 'none',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFormValid = isValidNickname(nickname) && isValidPhoneNumber(phoneNumber);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setStatus((prev) => ({
      ...prev,
      nickname: isValidNickname(value) ? 'valid' : 'invalid',
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setStatus((prev) => ({
      ...prev,
      phoneNumber: isValidPhoneNumber(value) ? 'valid' : 'invalid',
    }));
  };

  const handleFindId = async () => {
    if (!isFormValid) {
      setStatus({
        nickname: isValidNickname(nickname) ? 'valid' : 'invalid',
        phoneNumber: isValidPhoneNumber(phoneNumber) ? 'valid' : 'invalid',
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, phoneNumber }),
      });

      const data = await res.json();

      if (res.ok && data.email) {
        setFoundEmail(data.email);
      } else {
        setFoundEmail(null);
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error('아이디 찾기 실패:', err);
      setFoundEmail(null);
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <LogoImage />
      <Title>아이디 찾기</Title>

      <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
        {/* 닉네임 */}
        <div>
          <Label label="닉네임" htmlFor="nickname" />
          <Input
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요."
            className="w-full"
            error={status.nickname === 'invalid'}
          />
          <MessageZone
            errorMessages={
              status.nickname === 'invalid' ? [getFieldMessage('nickname', 'invalid')] : []
            }
          />
        </div>

        {/* 전화번호 */}
        <div>
          <Label label="전화번호" htmlFor="phone_number" />
          <Input
            id="phone_number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="전화번호를 입력해주세요."
            className="w-full"
            error={status.phoneNumber === 'invalid'}
          />
          <MessageZone
            errorMessages={
              status.phoneNumber === 'invalid' ? [getFieldMessage('phoneNumber', 'invalid')] : []
            }
          />
        </div>
      </form>

      <Modal isOpen={isModalOpen}>
        <div className="rounded-lg bg-white p-4 text-center">
          <h2 className="mb-4 text-xl font-bold">아이디 찾기 결과</h2>

          {foundEmail ? (
            <>
              <p className="mb-3 text-sm text-gray-700">
                <span className="font-semibold">{nickname}</span> 님, 입력하신 전화번호로 등록된
                아이디는 다음과 같아요.
              </p>
              <div className="rounded-md bg-gray-100 px-4 py-3 text-lg font-semibold">
                {foundEmail}
              </div>
              <Button
                intent="primary"
                className="mt-6 w-full"
                onClick={() => router.push('/login')}
              >
                로그인하러 가기
              </Button>
              <p className="mt-4 text-sm text-gray-600">
                비밀번호가 기억나지 않으신가요?
                <Link href="/find-password" className="ml-2 text-blue-500 underline">
                  비밀번호 찾기
                </Link>
              </p>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-700">
                <span className="font-semibold">{nickname}</span> 님과 전화번호
                <span className="ml-1 font-semibold">{formatPhoneNumber(phoneNumber)}</span>로
                가입된 계정을 찾을 수 없습니다.
              </p>
              <Button
                intent="primary"
                className="mt-2 w-full"
                onClick={() => router.push('/signup')}
              >
                회원가입 하러 가기
              </Button>
              <Button intent="cancel" className="mt-3 w-full" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
            </>
          )}
        </div>
      </Modal>

      <div className="mt-2 mb-4">
        <Button
          intent={'primary'}
          className="w-full"
          onClick={handleFindId}
          disabled={!isFormValid}
        >
          아이디 찾기
        </Button>
      </div>
      <div className="mb-4">
        <Button intent={'cancel'} className="w-full" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </div>
  );
}
