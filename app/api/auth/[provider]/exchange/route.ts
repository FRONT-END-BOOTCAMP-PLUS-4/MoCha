import { NextRequest, NextResponse } from 'next/server';

import { OAuthServiceFactory } from '@/infra/oauth/OAuthServiceFactory';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';
import { SocialLoginUseCase } from '@/application/usecases/auth/SocialLoginUseCase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { code } = await req.json();
    const provider = (await params).provider as 'google' | 'kakao';

    if (!code || !provider) {
      return NextResponse.json(
        { success: false, error: 'code 또는 provider가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 의존성 주입
    const userRepo = new SbUserRepo();
    const oauthService = OAuthServiceFactory.create(provider);

    // UseCase 호출
    const usecase = new SocialLoginUseCase(userRepo, oauthService);
    const { token, isNew } = await usecase.execute({ provider, code });

    return NextResponse.json({ success: true, token: token, isNew: isNew }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    console.error(`[소셜 로그인 오류]`, message);

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
