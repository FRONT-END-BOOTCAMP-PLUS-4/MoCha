import { NextRequest, NextResponse } from 'next/server';

import { KakaoLoginUseCase } from '@/application/usecases/auth/KakaoLoginUseCase';
import { KakaoOAuthService } from '@/infra/oauth/KakaoOAuthService';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'code가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 사용자 저장소 및 OAuth 서비스 인스턴스 생성
    const userRepo = new SbUserRepo();
    const oauthService = new KakaoOAuthService();

    // 소셜 로그인 UseCase 실행
    const usecase = new KakaoLoginUseCase(userRepo, oauthService);
    const { access_token, refresh_token, isNew } = await usecase.execute(code);

    return NextResponse.json(
      { success: true, access_token, refresh_token, isNew },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    console.error('[소셜 로그인 오류]', message);

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
