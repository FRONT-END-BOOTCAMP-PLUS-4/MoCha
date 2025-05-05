import { NextRequest, NextResponse } from 'next/server';

import { FindEmailUseCase } from '@/application/usecases/auth/FindEmailUseCase';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function POST(req: NextRequest) {
  try {
    const { nickname, phoneNumber } = await req.json();

    if (!nickname || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: '닉네임과 전화번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const userRepo = new SbUserRepo();
    const usecase = new FindEmailUseCase(userRepo);
    const { email } = await usecase.execute({ nickname, phoneNumber });

    return NextResponse.json({ success: true, email }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    const status = message.includes('일치') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
