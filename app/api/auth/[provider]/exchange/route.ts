// /api/auth/[provider]/exchange/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { SocialLoginDto } from '@/application/usecases/auth/dto/SocialLoginDto';
import { SocialLoginUseCase } from '@/application/usecases/auth/SocialLoginUseCase';
import { OAuthServiceFactory } from '@/infra/oauth/OAuthServiceFactory';
import { SupabaseProviderRepository } from '@/infra/repositories/supabase/SupabaseProviderRepository';
import { SupabaseUserRepository } from '@/infra/repositories/supabase/SupabaseUserRepository';

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const { code } = await req.json();
    const provider = params.provider;

    if (!code || !provider) {
      return NextResponse.json(
        { success: false, error: 'code 또는 provider가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 의존성 생성
    const userRepo = new SupabaseUserRepository();
    const providerRepo = new SupabaseProviderRepository();
    const oauthService = OAuthServiceFactory.create(provider);

    // UseCase 실행
    const dto = new SocialLoginDto(provider as 'google' | 'kakao', code);
    const usecase = new SocialLoginUseCase(userRepo, providerRepo, oauthService);
    const result = await usecase.execute(dto);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(`[소셜 로그인 오류] ${params.provider}:`, err);
    return NextResponse.json(
      { success: false, error: err.message || '서버 오류' },
      { status: 500 }
    );
  }
}
