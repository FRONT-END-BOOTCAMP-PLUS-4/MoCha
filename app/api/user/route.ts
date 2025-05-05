import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyEmailToken } from '@/infra/utils/jwt';

import { GetUserUseCase } from '@/application/usecases/user/GetUserUseCase';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';
import { SignupUseCase } from '@/application/usecases/user/SignupUsecase';
import { supabase } from '@/app/shared/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ success: false, error: '토큰 없음' }, { status: 401 });
    }
    const payload = verifyAccessToken(token);

    const { email } = payload.user;
    const userRepo = new SbUserRepo();
    const getUserUsecase = new GetUserUseCase(userRepo);
    const user = await getUserUsecase.execute(email);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: unknown) {
    // 메시지 추출
    const message = error instanceof Error ? error.message : String(error);
    console.error('유저 조회 실패:', message);

    // 401, 기본 메시지 유지
    return NextResponse.json(
      { success: false, error: message || '유저 정보 확인 실패' },
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
    const userRepo = new SbUserRepo();
    const signupUsecase = new SignupUseCase(userRepo);
    const user = await signupUsecase.execute({
      email,
      password,
      nickname,
      phone_number,
      provider,
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('회원가입 실패:', message);

    // 400, 기본 메시지 유지
    return NextResponse.json(
      { success: false, error: message || '회원가입 중 오류 발생' },
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
    const { email } = payload.user;

    const body = await req.json();
    const { nickname, phone_number } = body;

    const { error } = await supabase
      .from('user')
      .update({ nickname, phone_number })
      .eq('email', email);

    if (error) {
      return NextResponse.json({ success: false, error: '업데이트 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('PUT /api/user 오류:', message);

    // 500, 메시지도 클라이언트에 전달
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
