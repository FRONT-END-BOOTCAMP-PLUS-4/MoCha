'use client';

import { doPasswordsMatch, isValidEmail, isValidPassword } from '@/app/shared/consts/validation';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { FieldStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input';
import Label from '@/app/shared/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FindPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  const [isVerified, setIsVerified] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [status, setStatus] = useState({
    email: 'none',
    code: 'none',
    password: 'none',
    passwordCheck: 'none',
  });

  const handleSendVerificationCode = async () => {
    if (!isValidEmail(email)) {
      setStatus((prev) => ({ ...prev, email: 'invalid' }));
      return;
    }

    try {
      const res = await fetch('/api/auth/send-code/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
    if (!verificationToken || !code) {
      setStatus((prev) => ({ ...prev, code: 'invalid' }));
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
    const passwordValid = isValidPassword(password);
    const passwordMatch = doPasswordsMatch(password, passwordCheck);

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
          email,
          password,
          token: verificationToken,
          code,
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
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus((prev) => ({
              ...prev,
              email: isValidEmail(e.target.value) ? 'valid' : 'invalid',
            }));
          }}
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
          intent={'primary'}
          className="mt-2 w-full"
          onClick={handleSendVerificationCode}
          disabled={isVerified || !isValidEmail(email)}
        >
          인증번호 발송
        </Button>
      </div>

      {/* 인증번호 입력 */}
      <div className="mt-3">
        <Label label="인증번호" htmlFor="code" />
        <Input
          id="code"
          placeholder="인증번호를 입력해주세요."
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus((prev) => ({ ...prev, code: 'none' }));
          }}
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
          intent={'primary'}
          className="mt-2 w-full"
          onClick={handleVerifyCode}
          disabled={isVerified}
        >
          인증번호 확인
        </Button>
        {!isVerified && (
          <Button intent={'cancel'} className="mt-4 w-full" onClick={() => router.back()}>
            취소
          </Button>
        )}
      </div>

      {/* 인증 성공 시 비밀번호 변경 UI */}
      {isVerified && (
        <div className="mt-3">
          <div>
            <Label label="비밀번호" htmlFor="password" />
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setStatus((prev) => ({
                  ...prev,
                  password: isValidPassword(e.target.value) ? 'valid' : 'invalid',
                }));
              }}
              className="w-full"
              error={status.password === 'invalid' || status.password === 'error'}
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
            <Input
              id="passwordCheck"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={passwordCheck}
              onChange={(e) => {
                setPasswordCheck(e.target.value);
                setStatus((prev) => ({
                  ...prev,
                  passwordCheck: doPasswordsMatch(password, e.target.value) ? 'valid' : 'invalid',
                }));
              }}
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

          <div className="mt-3 flex gap-4">
            <Button intent={'cancel'} className="w-full" onClick={() => router.back()}>
              취소
            </Button>
            <Button
              intent={'primary'}
              className="w-full"
              onClick={handleChangePassword}
              disabled={!isValidPassword(password) || !doPasswordsMatch(password, passwordCheck)}
            >
              변경
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
