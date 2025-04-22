import { NextRequest, NextResponse } from 'next/server';

import { FindEmailUseCase } from '@/application/usecases/auth/FindEmailUseCase';
import { SupabaseUserRepository } from '@/infra/user/repositories/SupabaseUserRepository';

export async function POST(req: NextRequest) {
  try {
    const { nickname, phoneNumber } = await req.json();

    if (!nickname || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: '닉네임과 전화번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const usecase = new FindEmailUseCase(new SupabaseUserRepository());
    const { email } = await usecase.execute({ nickname, phoneNumber });

    return NextResponse.json({ success: true, email }, { status: 200 });
  } catch (err: any) {
    console.error('아이디 찾기 에러:', err.message);
    const status = err.message.includes('일치') ? 404 : 500;
    return NextResponse.json(
      { success: false, error: err.message || '서버 오류가 발생했습니다.' },
      { status }
    );
  }
}
