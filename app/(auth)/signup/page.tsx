'use client';

import {
  doPasswordsMatch,
  isValidEmail,
  isValidNickname,
  isValidPassword,
  isValidPhoneNumber,
} from '@/app/shared/consts/validation';
import { ChangeEvent, useState } from 'react';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { FormStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input';
import Label from '@/app/shared/ui/label';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  // 사용자 입력 상태
  const [user, setUser] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    phoneNumber: '',
  });

  // 인증번호 상태
  const [code, setCode] = useState('');

  // 각 필드의 상태 (유효성 및 서버 응답에 따른 상태)
  const [status, setStatus] = useState<FormStatus>({
    email: 'none',
    nickname: 'none',
    password: 'none',
    passwordCheck: 'none',
    phoneNumber: 'none',
    code: 'none',
  });

  // 서버에서 받은 인증 토큰 (JWT 기반)
  const [verificationToken, setVerificationToken] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setUser((prev) => ({ ...prev, [id]: value }));

    switch (id) {
      case 'email':
        setStatus((prev) => ({ ...prev, email: isValidEmail(value) ? 'valid' : 'invalid' }));
        break;
      case 'password':
        setStatus((prev) => ({ ...prev, password: isValidPassword(value) ? 'valid' : 'invalid' }));
        break;
      case 'passwordCheck':
        setStatus((prev) => ({
          ...prev,
          passwordCheck: doPasswordsMatch(user.password, value) ? 'valid' : 'invalid',
        }));
        break;
      case 'nickname':
        setStatus((prev) => ({ ...prev, nickname: isValidNickname(value) ? 'valid' : 'invalid' }));
        break;
      case 'phoneNumber':
        setStatus((prev) => ({
          ...prev,
          phoneNumber: isValidPhoneNumber(value) ? 'valid' : 'invalid',
        }));
        break;
    }
  };

  // 이메일 인증코드 요청
  const handleSendCode = async () => {
    if (!isValidEmail(user.email)) {
      setStatus((prev) => ({ ...prev, email: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      switch (res.status) {
        case 200:
          setVerificationToken(data.token);
          setStatus((prev) => ({ ...prev, email: 'success' }));
          break;
        case 409:
          setStatus((prev) => ({ ...prev, email: 'duplicated' }));
          break;
        case 400:
          setStatus((prev) => ({ ...prev, email: 'invalid' }));
          break;
        default:
          setStatus((prev) => ({ ...prev, email: 'error' }));
          break;
      }
    } catch (err) {
      console.error('이메일 인증 요청 실패:', err);
      setStatus((prev) => ({ ...prev, email: 'error' }));
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationToken || !code) {
      alert('인증번호가 발송되지 않았거나 입력되지 않았습니다.');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ token: verificationToken, code }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setStatus((prev) => ({ ...prev, code: 'success' }));
      } else {
        setStatus((prev) => ({ ...prev, code: 'invalid' }));
      }
    } catch (err) {
      console.error('인증번호 확인 실패:', err);
      setStatus((prev) => ({ ...prev, code: 'error' }));
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!isValidNickname(user.nickname)) {
      setStatus((prev) => ({ ...prev, nickname: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: user.nickname }),
      });

      switch (res.status) {
        case 200:
          setStatus((prev) => ({ ...prev, nickname: 'success' }));
          break;
        case 409:
          setStatus((prev) => ({ ...prev, nickname: 'duplicated' }));
          break;
        case 400:
          setStatus((prev) => ({ ...prev, nickname: 'invalid' }));
          break;
        default:
          setStatus((prev) => ({ ...prev, nickname: 'error' }));
          break;
      }
    } catch (err) {
      console.error('닉네임 확인 실패:', err);
      setStatus((prev) => ({ ...prev, nickname: 'error' }));
    }
  };

  // 폼 전체 유효성 검사
  const isFormValid =
    status.email === 'success' &&
    status.code === 'success' &&
    status.password === 'valid' &&
    status.passwordCheck === 'valid' &&
    status.nickname === 'success' &&
    status.phoneNumber === 'valid';

  // 회원가입 요청
  const handleSignup = async () => {
    if (!isFormValid || !verificationToken) return;

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          nickname: user.nickname,
          phone_number: user.phoneNumber,
          token: verificationToken,
          provider: 'local',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || '회원가입에 실패했습니다.');
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
      alert('서버 오류로 회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <LogoImage />
      <Title>회원가입</Title>
      <form className="mb-2 flex flex-col" onSubmit={(e) => e.preventDefault()}>
        {/* 이메일 */}
        <div>
          <Label label="이메일" htmlFor="email" />
          <div className="flex gap-2">
            <Input
              id="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요."
              className="flex-1"
              error={['invalid', 'duplicated', 'error'].includes(status.email ?? '')}
              disabled={status.code === 'success'}
            />
            <Button
              intent={'primary'}
              type="button"
              className="w-full"
              onClick={handleSendCode}
              disabled={status.email !== 'valid' || status.code === 'success'}
            >
              인증번호 발송
            </Button>
          </div>
          <MessageZone
            errorMessages={
              ['invalid', 'duplicated', 'error'].includes(status.email ?? '')
                ? [getFieldMessage('email', status.email ?? 'none')]
                : []
            }
            successMessages={
              status.email === 'success' ? [getFieldMessage('email', status.email)] : []
            }
          />
        </div>

        {/* 인증번호 */}
        <div>
          <Label label="인증번호" htmlFor="code" />
          <div className="flex gap-2">
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6자리 인증번호를 입력해주세요."
              maxLength={6}
              className="flex-1"
              error={['invalid', 'error'].includes(status.code ?? '')}
              disabled={status.code === 'success'}
            />
            <Button
              intent={'primary'}
              type="button"
              className="w-full rounded-md"
              onClick={handleVerifyCode}
              disabled={status.code === 'success' || code.length !== 6}
            >
              인증 확인
            </Button>
          </div>
          <MessageZone
            errorMessages={
              ['invalid', 'error'].includes(status.code ?? '')
                ? [getFieldMessage('code', status.code ?? 'none')]
                : []
            }
            successMessages={
              status.code === 'success' ? [getFieldMessage('code', status.code)] : []
            }
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <Label label="비밀번호" htmlFor="password" />
          <Input
            id="password"
            type="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력해주세요."
            className="w-full"
            error={status.password === 'invalid'}
          />
          <MessageZone
            errorMessages={
              status.password === 'invalid' ? [getFieldMessage('password', 'invalid')] : []
            }
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <Label label="비밀번호 확인" htmlFor="passwordCheck" />
          <Input
            id="passwordCheck"
            type="password"
            value={user.passwordCheck}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력해주세요."
            className="w-full"
            error={status.passwordCheck === 'invalid'}
          />
          <MessageZone
            errorMessages={
              status.passwordCheck === 'invalid'
                ? [getFieldMessage('passwordCheck', 'invalid')]
                : []
            }
          />
        </div>

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
              intent={'primary'}
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

        <div className="mt-4 flex gap-4">
          <Button intent={'cancel'} className="w-full" onClick={() => router.back()}>
            취소
          </Button>
          <Button
            type="button"
            intent={'primary'}
            className="w-full"
            disabled={!isFormValid}
            onClick={handleSignup}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
