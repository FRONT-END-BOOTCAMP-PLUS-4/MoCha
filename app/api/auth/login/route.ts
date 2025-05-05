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
    const { access_token, refresh_token } = await loginUsecase.execute({ email, password });

    // 응답  저장
    const res = NextResponse.json({
      success: true,
      access_token,
      refresh_token,
    });

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    console.error('로그인 에러:', message);

    const isAuthError = message.includes('비밀번호') || message.includes('존재하지');

    return NextResponse.json(
      { success: false, error: message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
