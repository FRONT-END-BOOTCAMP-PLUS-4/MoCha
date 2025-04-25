import { NextRequest, NextResponse } from 'next/server';

import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 로그인 UseCase 실행
    const userRepo = new SbUserRepo();
    const loginUsecase = new LoginUseCase(userRepo);
    const { token }: { token: string } = await loginUsecase.execute({ email, password });

    // 응답  저장
    const res = NextResponse.json({
      success: true,
      token,
      // refresh_token,
      // user,
    });

    return res;
  } catch (err: any) {
    console.error('로그인 에러:', err.message);
    const isAuthError = err.message.includes('비밀번호') || err.message.includes('존재하지');
    return NextResponse.json(
      { success: false, error: err.message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
