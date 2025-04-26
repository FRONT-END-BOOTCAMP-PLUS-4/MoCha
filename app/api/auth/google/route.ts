import { NextRequest, NextResponse } from 'next/server';

import { GoogleLoginUseCase } from '@/application/usecases/auth/GoogleLoginUseCase';
import { GoogleOAuthService } from '@/infra/oauth/GoogleOAuthService';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function POST(req: NextRequest) {
  try {
    const { token: googleToken } = await req.json();
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'token이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 1) 인스턴스 생성
    const userRepo = new SbUserRepo();
    const oauthService = new GoogleOAuthService();

    // 2) UseCase 실행
    const usecase = new GoogleLoginUseCase(userRepo, oauthService);
    const { token, isNew } = await usecase.execute(googleToken);

    // 3) 결과 반환
    return NextResponse.json({ success: true, token, isNew }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[Google Login Error]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
