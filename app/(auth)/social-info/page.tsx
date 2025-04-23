'use client';

import { isValidNickname, isValidPhoneNumber } from '@/app/shared/consts/validation';
import { ChangeEvent, useEffect, useState } from 'react';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { useAuthStore } from '@/app/shared/stores/authStore';
import { FormStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input';
import Label from '@/app/shared/ui/label';
import { useRouter } from 'next/navigation';

export default function SocialInfoPage() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState({ nickname: '', phoneNumber: '' });
  const [status, setStatus] = useState<FormStatus>({ nickname: 'none', phoneNumber: 'none' });

  useEffect(() => {
    if (!authUser) return;

    setUser({
      nickname: authUser.nickname || '',
      phoneNumber: authUser.phone_number || '',
    });

    setStatus({
      nickname: authUser.nickname ? 'valid' : 'none',
      phoneNumber: authUser.phone_number ? 'valid' : 'none',
    });
  }, [authUser]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));

    if (id === 'nickname') {
      setStatus((prev) => ({ ...prev, nickname: isValidNickname(value) ? 'valid' : 'invalid' }));
    }
    if (id === 'phoneNumber') {
      setStatus((prev) => ({
        ...prev,
        phoneNumber: isValidPhoneNumber(value) ? 'valid' : 'invalid',
      }));
    }
  };

  const handleCheckNickname = async () => {
    if (status.nickname !== 'valid') return;

    try {
      const res = await fetch('/api/auth/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: user.nickname }),
      });

      if (res.status === 200) {
        setStatus((prev) => ({ ...prev, nickname: 'success' }));
      } else if (res.status === 409) {
        setStatus((prev) => ({ ...prev, nickname: 'duplicated' }));
      } else {
        setStatus((prev) => ({ ...prev, nickname: 'error' }));
      }
    } catch {
      setStatus((prev) => ({ ...prev, nickname: 'error' }));
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          nickname: user.nickname || null,
          phone_number: user.phoneNumber || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert('저장 실패: ' + data.error);
        return;
      }

      router.push('/');
    } catch (err) {
      console.error('서버 오류:', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const isFormEmpty = user.nickname === '' && user.phoneNumber === '';
  const isFormValid =
    (user.nickname === '' || status.nickname === 'success') &&
    (user.phoneNumber === '' || status.phoneNumber === 'valid');

  return (
    <div>
      <LogoImage />
      <Title>추가 정보 입력</Title>

      {/* 닉네임 */}
      <div>
        <Label label="닉네임" htmlFor="nickname" />
        <div className="flex gap-2">
          <Input
            id="nickname"
            value={user.nickname}
            onChange={handleInputChange}
            placeholder="닉네임을 입력해주세요."
            className="flex-1"
            error={['invalid', 'duplicated', 'error'].includes(status.nickname ?? '')}
          />
          <Button
            intent="primary"
            type="button"
            className="w-full"
            onClick={handleCheckNickname}
            disabled={status.nickname !== 'valid'}
          >
            중복 확인
          </Button>
        </div>
        <MessageZone
          errorMessages={
            ['invalid', 'duplicated', 'error'].includes(status.nickname ?? '')
              ? [getFieldMessage('nickname', status.nickname ?? 'none')]
              : []
          }
          successMessages={
            status.nickname === 'success' ? [getFieldMessage('nickname', status.nickname)] : []
          }
        />
      </div>

      {/* 전화번호 */}
      <div>
        <Label label="전화번호" htmlFor="phoneNumber" />
        <Input
          id="phoneNumber"
          value={user.phoneNumber}
          onChange={handleInputChange}
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

      <div className="mt-2 mb-4">
        {isFormEmpty ? (
          <Button className="w-full" intent="cancel" onClick={() => router.push('/')}>
            나중에 입력하기
          </Button>
        ) : (
          <Button
            className="w-full"
            intent="primary"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            저장하고 시작하기
          </Button>
        )}
      </div>

      <div className="text-gray-6 text-center text-sm leading-6">
        <p>마이페이지에서 언제든지 수정 가능합니다.</p>
        <p>단, 닉네임과 전화번호로 아이디를 찾을 수 있습니다.</p>
      </div>
    </div>
  );
}
