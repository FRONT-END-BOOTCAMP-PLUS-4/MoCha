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
import useIsHide from '@/app/shared/hooks/useIsHide';
import { FormStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button/Button';
import Input from '@/app/shared/ui/input/Input';
import PasswordInput from '@/app/shared/ui/input/PasswordInput';
import Label from '@/app/shared/ui/label/Label';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { isHide, onToggle } = useIsHide();

  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    phoneNumber: '',
    code: '',
  });

  const [verificationToken, setVerificationToken] = useState('');

  const [status, setStatus] = useState<FormStatus>({
    email: 'none',
    nickname: 'none',
    password: 'none',
    passwordCheck: 'none',
    phoneNumber: 'none',
    code: 'none',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

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
          passwordCheck: doPasswordsMatch(form.password, value) ? 'valid' : 'invalid',
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
      case 'code':
        setStatus((prev) => ({ ...prev, code: 'none' }));
        break;
    }
  };

  const handleSendCode = async () => {
    if (!isValidEmail(form.email)) {
      setStatus((prev) => ({ ...prev, email: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
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

  const handleVerifyCode = async () => {
    if (!verificationToken || !form.code) {
      alert('인증번호가 발송되지 않았거나 입력되지 않았습니다.');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ token: verificationToken, code: form.code }),
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

  const handleCheckNickname = async () => {
    if (!isValidNickname(form.nickname)) {
      setStatus((prev) => ({ ...prev, nickname: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: form.nickname }),
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

  const isFormValid =
    status.email === 'success' &&
    status.code === 'success' &&
    status.password === 'valid' &&
    status.passwordCheck === 'valid' &&
    status.nickname === 'success' &&
    status.phoneNumber === 'valid';

  const handleSignup = async () => {
    if (!isFormValid || !verificationToken) return;

    try {
      const { email, password, nickname, phoneNumber } = form;

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nickname,
          phone_number: phoneNumber,
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
              value={form.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요."
              className="flex-1"
              error={['invalid', 'duplicated', 'error'].includes(status.email ?? '')}
              disabled={status.code === 'success'}
            />
            <Button
              intent="primary"
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
              value={form.code}
              onChange={handleInputChange}
              placeholder="6자리 인증번호를 입력해주세요."
              maxLength={6}
              className="flex-1"
              error={['invalid', 'error'].includes(status.code ?? '')}
              disabled={status.code === 'success'}
            />
            <Button
              intent="primary"
              type="button"
              className="w-full"
              onClick={handleVerifyCode}
              disabled={status.code === 'success' || form.code.length !== 6}
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
          <PasswordInput
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={form.password}
            onInputChange={handleInputChange}
            error={status.password}
            isHide={isHide}
            onToggle={onToggle}
            autoComplete="new-password"
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
          <PasswordInput
            id="passwordCheck"
            placeholder="비밀번호를 다시 입력해주세요."
            value={form.passwordCheck}
            onInputChange={handleInputChange}
            error={status.passwordCheck}
            isHide={isHide}
            onToggle={onToggle}
            autoComplete="new-password"
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
              value={form.nickname}
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
            value={form.phoneNumber}
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

        {/* 버튼 */}
        <div className="mt-4 flex gap-4">
          <Button intent="cancel" className="w-full" onClick={() => router.back()}>
            취소
          </Button>
          <Button
            intent="primary"
            className="w-full"
            type="button"
            onClick={handleSignup}
            disabled={!isFormValid}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
