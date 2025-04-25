import { NextRequest, NextResponse } from 'next/server';

import { SendCodeUseCase } from '@/application/usecases/auth/SendCodeUseCase';
import { supabase } from '@/app/shared/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // 이메일 유효성 검사
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json({ success: false, error: '이메일이 필요합니다.' }, { status: 400 });
    }

    // Supabase에서 해당 이메일이 존재하는지 확인
    const { data: user } = await supabase.from('user').select('id').eq('email', email).single();

    if (!user) {
      throw new Error('존재하지 않는 계정입니다.');
    }

    const usecase = new SendCodeUseCase();
    const { token } = await usecase.execute(email);

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error: unknown) {
    // 에러 메시지를 안전하게 추출
    const message = error instanceof Error ? error.message : String(error);

    console.error('[SendCode] 에러:', message);

    return NextResponse.json({ success: false, notFound: true, error: message }, { status: 404 });
  }
}
