import { NextRequest, NextResponse } from 'next/server';

import { CheckNicknameUseCase } from '@/application/usecases/auth/CheckNicknameUseCase';
import { SupabaseUserRepository } from '@/infra/repositories/supabase/SupabaseUserRepository';

export async function POST(req: NextRequest) {
  try {
    const { nickname } = await req.json();

    // 유효성 검사
    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json(
        { success: false, error: '닉네임을 입력해주세요.' },
        { status: 400 }
      );
    }

    const userRepo = new SupabaseUserRepository();
    const checkNicknameUsecase = new CheckNicknameUseCase(userRepo);
    const result = await checkNicknameUsecase.execute({ nickname });

    if (!result.available) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, available: true }, { status: 200 });
  } catch (err) {
    console.error('닉네임 중복 확인 에러:', err);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
