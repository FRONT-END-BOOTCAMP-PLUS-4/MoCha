'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { isValidEmail, isValidPassword } from '@/app/shared/consts/validation';

import { Button } from '@/app/shared/ui/button';
import { FormStatus } from '@/app/shared/types/FormStatus';
import GoogleLoginButton from '@/app/components/auth/GoogleLoginButton';
import Input from '@/app/shared/ui/input';
import KakaoLoginButton from '@/app/components/auth/KakaoLoginButton';
import Label from '@/app/shared/ui/label';
import Link from 'next/link';
import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import PasswordInput from '@/app/shared/ui/input/PasswordInput';
import Title from '@/app/components/auth/Title';
import { decodeJwt } from 'jose';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { useAuthStore } from '@/app/shared/stores/authStore';
import useIsHide from '@/app/shared/hooks/useIsHide';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { isHide, onToggle } = useIsHide();

  // form 상태로 통합
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [status, setStatus] = useState<FormStatus>({
    email: 'none',
    password: 'none',
    login: 'none',
  });

  const isFormValid = isValidEmail(form.email) && form.password.trim().length > 0;

  // 공통 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    switch (id) {
      case 'email':
        setStatus((prev) => ({
          ...prev,
          email: isValidEmail(value) ? 'valid' : 'invalid',
          login: 'none',
        }));
        break;
      case 'password':
        setStatus((prev) => ({
          ...prev,
          password: isValidPassword(value) ? 'valid' : 'invalid',
          login: 'none',
        }));
        break;
    }
  };

  const handleLogin = async () => {
    const emailValid = isValidEmail(form.email);
    const passwordValid = isValidPassword(form.password);

    if (!emailValid || !passwordValid) {
      setStatus((prev) => ({
        ...prev,
        email: emailValid ? 'valid' : 'invalid',
        password: passwordValid ? 'valid' : 'invalid',
      }));
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus((prev) => ({ ...prev, login: 'invalid' }));
        return;
      }
      const { setAccessToken, setUser } = useAuthStore.getState();

      const { token } = data;
      const decodedToken = decodeJwt(token) as {
        user: {
          email: string;
          nickname: string;
          phone_number: string;
          provider: number;
        };
      };

      setAccessToken(token);
      setUser(decodedToken.user);

      localStorage.setItem('access_token', token);

      router.push('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setStatus((prev) => ({ ...prev, login: 'error' }));
    }
  };

  return (
    <div>
      <LogoImage />
      <Title>로그인</Title>

      <form
        className="mb-4 flex flex-col"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        {/* 이메일 */}
        <div>
          <Label label="이메일" htmlFor="email" />
          <Input
            id="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력해주세요."
            className="w-full"
            error={['invalid', 'error'].includes(status.email ?? '')}
            autoComplete="email"
          />
          <MessageZone
            errorMessages={
              ['invalid', 'error'].includes(status.email ?? '')
                ? [getFieldMessage('email', status.email ?? 'none')]
                : []
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
            autoComplete="current-password"
          />
          <MessageZone
            errorMessages={[
              status.password === 'invalid' ? getFieldMessage('password', 'invalid') : '',
              status.login === 'invalid' ? getFieldMessage('login', 'invalid') : '',
            ].filter(Boolean)}
          />
        </div>

        {/* 로그인 버튼 */}
        <div className="mt-2">
          <Button intent="primary" type="submit" className="w-full" disabled={!isFormValid}>
            로그인
          </Button>
        </div>
      </form>

      {/* 하단 링크 */}
      <div className="flex justify-center gap-4 text-sm">
        <Link href="/signup" className="hover:cursor-pointer">
          회원가입
        </Link>
        <span>|</span>
        <Link href="/find-id" className="hover:cursor-pointer">
          아이디 찾기
        </Link>
        <span>|</span>
        <Link href="/reset-password" className="hover:cursor-pointer">
          비밀번호 찾기
        </Link>
      </div>

      {/* 간편 로그인 */}
      <div>
        <div className="my-6 flex items-center">
          <div className="border-gray-2 flex-grow border-t" />
          <span className="text-gray-6 mx-4 text-sm">간편 로그인</span>
          <div className="border-gray-2 flex-grow border-t" />
        </div>

        <div className="flex flex-col justify-center gap-4">
          <GoogleLoginButton />
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}
