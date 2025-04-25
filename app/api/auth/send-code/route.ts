import { NextRequest, NextResponse } from 'next/server';

import { SendCodeUseCase } from '@/application/usecases/auth/SendCodeUseCase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json({ success: false, error: '이메일이 필요합니다.' }, { status: 400 });
    }

    const usecase = new SendCodeUseCase();
    const { token } = await usecase.execute(email);

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (err: any) {
    console.error('인증코드 전송 실패:', err.message);
    const status = err.message === '이미 가입된 이메일입니다.' ? 409 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
