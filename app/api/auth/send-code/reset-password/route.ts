import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/app/shared/lib/supabase';
import { sendVerificationCode } from '@/infra/user/utils/email';
import { createVerificationToken } from '@/infra/user/utils/jwt';

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
      return NextResponse.json(
        { success: false, error: '존재하지 않는 계정입니다.' },
        { status: 404 }
      );
    }

    // 인증번호 생성 및 전송
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationCode(email, code);

    // 토큰 생성 (email + code)
    const token = createVerificationToken({ email, code });

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (err: any) {
    console.error('비밀번호 찾기 인증코드 전송 실패:', err.message);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
