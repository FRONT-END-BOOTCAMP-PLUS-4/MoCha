import { NextRequest, NextResponse } from 'next/server';

import { ResetPasswordUseCase } from '@/application/usecases/auth/ResetPasswordUseCase';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function PUT(req: NextRequest) {
  try {
    const { email, password, token, code } = await req.json();

    if (!email || !password || !token || !code) {
      return NextResponse.json(
        { success: false, error: '이메일, 비밀번호, 인증토큰, 인증번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const userRepo = new SbUserRepo();
    const usecase = new ResetPasswordUseCase(userRepo);
    await usecase.execute({ email, password, token, code });

    return NextResponse.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    const status =
      message.includes('토큰') || message.includes('인증번호')
        ? 401
        : message.includes('사용자')
          ? 404
          : 500;

    console.error('비밀번호 재설정 실패:', message);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
