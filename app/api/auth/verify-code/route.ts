import { NextRequest, NextResponse } from 'next/server';

import { VerifyCodeUseCase } from '@/application/usecases/auth/VerifyCodeUseCase';

export async function POST(req: NextRequest) {
  try {
    const { token, code } = await req.json();

    if (!token || !code) {
      return NextResponse.json(
        { success: false, error: '토큰과 인증번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const usecase = new VerifyCodeUseCase();
    const verified = await usecase.execute({ token, code });

    return NextResponse.json({ success: true, verified }, { status: 200 });
  } catch (error: unknown) {
    // 에러 메시지를 안전하게 추출
    const message = error instanceof Error ? error.message : String(error);

    console.error('로그인 에러:', message);

    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
