import { verifyAccessToken, verifyEmailToken } from '@/infra/utils/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/app/shared/lib/supabase';
import { GetUserUseCase } from '@/application/usecases/user/GetUserUseCase';
import { SignupUseCase } from '@/application/usecases/user/SignupUsecase';
import { SupabaseUserRepository } from '@/infra/repositories/supabase/SupabaseUserRepository';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '토큰 없음' }, { status: 401 });
    }

    const { id } = verifyAccessToken(token);
    const userRepo = new SupabaseUserRepository();
    const getUserUsecase = new GetUserUseCase(userRepo);
    const user = await getUserUsecase.execute(id);

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (err: any) {
    console.error('유저 조회 실패:', err.message);
    return NextResponse.json(
      { success: false, error: err.message || '유저 정보 확인 실패' },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = ['email', 'password', 'nickname', 'phone_number', 'token', 'provider'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `필수 항목이 누락되었습니다: ${field}` },
          { status: 400 }
        );
      }
    }

    const { email, password, nickname, phone_number, token, provider } = body;

    // 이메일 인증 토큰 검증
    const payload = verifyEmailToken(token);
    if (payload.email !== email) {
      return NextResponse.json(
        { success: false, error: '이메일 인증이 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 회원가입 유스케이스 실행
    const userRepo = new SupabaseUserRepository();
    const signupUsecase = new SignupUseCase(userRepo);
    const user = await signupUsecase.execute({
      email,
      password,
      nickname,
      phone_number,
      provider,
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    console.error('회원가입 실패:', err.message);
    return NextResponse.json(
      { success: false, error: err.message || '회원가입 중 오류 발생' },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // 헤더에서 Authorization 값 읽기
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ success: false, error: '토큰 없음' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    const { id } = payload;

    const body = await req.json();
    const { nickname, phone_number } = body;

    const { error } = await supabase.from('user').update({ nickname, phone_number }).eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: '업데이트 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PUT /api/user 오류:', e);
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
  }
}
