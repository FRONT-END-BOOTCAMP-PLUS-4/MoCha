import { NextRequest, NextResponse } from 'next/server';

import { ResetPasswordUseCase } from '@/application/auth/usecase/ResetPasswordUseCase';
import { SupabaseUserRepository } from '@/infra/user/repositories/SupabaseUserRepository';

export async function PUT(req: NextRequest) {
  try {
    const { email, password, token, code } = await req.json();

    if (!email || !password || !token || !code) {
      return NextResponse.json(
        { success: false, error: '이메일, 비밀번호, 인증토큰, 인증번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const usecase = new ResetPasswordUseCase(new SupabaseUserRepository());
    await usecase.execute({ email, password, token, code });

    return NextResponse.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (err: any) {
    const status =
      err.message.includes('토큰') || err.message.includes('인증번호')
        ? 401
        : err.message.includes('사용자')
          ? 404
          : 500;

    console.error('비밀번호 재설정 실패:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
