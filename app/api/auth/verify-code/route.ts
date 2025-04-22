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
    const result = await usecase.execute({ token, code });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || '서버 오류' },
      { status: 401 }
    );
  }
}
