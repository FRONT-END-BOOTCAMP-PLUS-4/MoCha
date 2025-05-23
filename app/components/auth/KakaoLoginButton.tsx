'use client';

import Image from 'next/image';

export default function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="flex h-12.5 justify-center gap-2 rounded-md bg-[#FEE500] px-4 py-3 hover:cursor-pointer"
    >
      <Image
        src="/images/social/kakao-logo.svg"
        alt="카카오 로그인 아이콘"
        width={20}
        height={24}
      />
      <div>카카오톡으로 로그인하기</div>
    </button>
  );
}
