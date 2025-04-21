'use client';

import { isValidEmail, isValidPassword } from '@/app/shared/consts/validation';
import { ChangeEvent, FormEvent, useState } from 'react';

import LogoImage from '@/app/components/auth/LogoImage';
import MessageZone from '@/app/components/auth/MessageZone';
import Title from '@/app/components/auth/Title';
import { getFieldMessage } from '@/app/shared/consts/errorMessages';
import { useAuthStore } from '@/app/shared/stores/authStore';
import { FormStatus } from '@/app/shared/types/FormStatus';
import { Button } from '@/app/shared/ui/button/Button';
import Input from '@/app/shared/ui/input/Input';
import Label from '@/app/shared/ui/label/Label';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState<FormStatus>({
    email: 'none',
    password: 'none',
    login: 'none',
  });

  const isFormValid = isValidEmail(email) && password.trim().length > 0;

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setStatus((prev) => ({
      ...prev,
      email: isValidEmail(value) ? 'valid' : 'invalid',
      login: 'none',
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setStatus((prev) => ({
      ...prev,
      password: isValidPassword(value) ? 'valid' : 'invalid',
      login: 'none',
    }));
  };

  const handleLogin = async () => {
    const emailValid = isValidEmail(email);
    const passwordValid = isValidPassword(password);

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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus((prev) => ({ ...prev, login: 'invalid' }));
        return;
      }

      const { access_token, refresh_token, user } = data;
      const { setAccessToken, setUser } = useAuthStore.getState();
      setAccessToken(access_token);
      setUser(user);

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      router.push('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setStatus((prev) => ({ ...prev, login: 'error' }));
    }
  };

  const handleSocialLogin = (provider: 'google' | 'kakao') => {
    window.location.href = `/api/auth/${provider}/redirect`;
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
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력해주세요."
            className="w-full"
            error={['invalid', 'error'].includes(status.email ?? '')}
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요."
            className="w-full"
            error={['invalid', 'error'].includes(status.password ?? '') || status.login === 'error'}
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
          <button
            onClick={() => handleSocialLogin('google')}
            className="border-gray-3 flex justify-center gap-2 rounded-md border bg-white px-4 py-3 hover:cursor-pointer"
          >
            <Image
              src="/images/social/google-logo.svg"
              alt="구글 로그인 아이콘"
              width={20}
              height={20}
            />
            <div>구글로 로그인하기</div>
          </button>
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="flex justify-center gap-2 rounded-md bg-[#FEE500] px-4 py-3 hover:cursor-pointer"
          >
            <Image
              src="/images/social/kakao-logo.svg"
              alt="카카오 로그인 아이콘"
              width={20}
              height={20}
            />
            <div>카카오톡으로 로그인하기</div>
          </button>
        </div>
      </div>
    </div>
  );
}
