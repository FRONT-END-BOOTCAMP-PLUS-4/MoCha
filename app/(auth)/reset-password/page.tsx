'use client';

import { doPasswordsMatch, isValidEmail, isValidPassword } from '@/app/shared/consts/validation';
import { ChangeEvent, useState } from 'react';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import useIsHide from '@/app/shared/hooks/useIsHide';
import { FieldStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input';
import PasswordInput from '@/app/shared/ui/input/PasswordInput';
import Label from '@/app/shared/ui/label';
import { useRouter } from 'next/navigation';

export default function FindPasswordPage() {
  const router = useRouter();
  const { isHide, onToggle } = useIsHide();

  // 통합된 입력 상태
  const [form, setForm] = useState({
    email: '',
    code: '',
    password: '',
    passwordCheck: '',
  });

  // 각 필드 상태
  const [status, setStatus] = useState<Record<keyof typeof form, FieldStatus>>({
    email: 'none',
    code: 'none',
    password: 'none',
    passwordCheck: 'none',
  });

  const [verificationToken, setVerificationToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // 공통 인풋 변경 핸들러
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
      case 'code':
        setStatus((prev) => ({ ...prev, code: 'none' }));
        break;
    }
  };

  const handleSendVerificationCode = async () => {
    if (!isValidEmail(form.email)) {
      setStatus((prev) => ({ ...prev, email: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/send-code/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus((prev) => ({ ...prev, email: 'error' }));
        return;
      }

      setVerificationToken(data.token);
      setStatus((prev) => ({ ...prev, email: 'success' }));
    } catch (err) {
      console.error('인증 요청 실패:', err);
      setStatus((prev) => ({ ...prev, email: 'error' }));
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationToken || !form.code) {
      setStatus((prev) => ({ ...prev, code: 'invalid' }));
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
        setIsVerified(true);
      } else {
        setStatus((prev) => ({ ...prev, code: 'invalid' }));
        setIsVerified(false);
      }
    } catch (err) {
      console.error('인증번호 확인 실패:', err);
      setStatus((prev) => ({ ...prev, code: 'error' }));
      setIsVerified(false);
    }
  };

  const handleChangePassword = async () => {
    const passwordValid = isValidPassword(form.password);
    const passwordMatch = doPasswordsMatch(form.password, form.passwordCheck);

    if (!passwordValid || !passwordMatch) {
      setStatus((prev) => ({
        ...prev,
        password: passwordValid ? 'valid' : 'invalid',
        passwordCheck: passwordMatch ? 'valid' : 'invalid',
      }));
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          token: verificationToken,
          code: form.code,
        }),
      });

      if (!res.ok) throw new Error('비밀번호 변경 실패');

      router.push('/login');
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      setStatus((prev) => ({ ...prev, password: 'error' }));
    }
  };

  return (
    <div>
      <LogoImage />
      <Title>비밀번호 찾기</Title>

      {/* 이메일 입력 */}
      <div>
        <Label label="이메일" htmlFor="email" />
        <Input
          id="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="이메일을 입력해주세요."
          className="w-full"
          error={['invalid', 'error'].includes(status.email)}
          disabled={isVerified}
        />
        <MessageZone
          errorMessages={
            ['invalid', 'error'].includes(status.email)
              ? [getFieldMessage('email', status.email as FieldStatus)]
              : []
          }
          successMessages={status.email === 'success' ? [getFieldMessage('email', 'success')] : []}
        />
        <Button
          intent="primary"
          className="mt-2 w-full"
          onClick={handleSendVerificationCode}
          disabled={isVerified || !isValidEmail(form.email)}
        >
          인증번호 발송
        </Button>
      </div>

      {/* 인증번호 입력 */}
      <div className="mt-3">
        <Label label="인증번호" htmlFor="code" />
        <Input
          id="code"
          value={form.code}
          onChange={handleInputChange}
          placeholder="6자리 인증번호를 입력해주세요."
          maxLength={6}
          className="w-full"
          error={['invalid', 'error'].includes(status.code)}
          disabled={isVerified}
        />
        <MessageZone
          errorMessages={
            ['invalid', 'error'].includes(status.code)
              ? [getFieldMessage('code', status.code as FieldStatus)]
              : []
          }
          successMessages={status.code === 'success' ? [getFieldMessage('code', 'success')] : []}
        />
        <Button
          intent="primary"
          className="mt-2 w-full"
          onClick={handleVerifyCode}
          disabled={isVerified}
        >
          인증번호 확인
        </Button>

        {!isVerified && (
          <Button intent="cancel" className="mt-4 w-full" onClick={() => router.back()}>
            취소
          </Button>
        )}
      </div>

      {/* 인증 성공 후 비밀번호 변경 UI */}
      {isVerified && (
        <div className="mt-3">
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
                ['invalid', 'error'].includes(status.password)
                  ? [getFieldMessage('password', status.password as FieldStatus)]
                  : []
              }
            />
          </div>

          <div className="mt-1">
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

          <div className="mt-3 flex gap-4">
            <Button intent="cancel" className="w-full" onClick={() => router.back()}>
              취소
            </Button>
            <Button
              intent="primary"
              className="w-full"
              onClick={handleChangePassword}
              disabled={
                !isValidPassword(form.password) ||
                !doPasswordsMatch(form.password, form.passwordCheck)
              }
            >
              변경
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
