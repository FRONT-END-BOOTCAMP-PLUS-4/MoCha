import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, verifyRefreshToken } from '@/infra/utils/jwt';

import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function POST(req: NextRequest) {
  const { refresh_token } = await req.json();

  try {
    // 이메일 추출
    const { sub: email } = verifyRefreshToken(refresh_token);

    // 이메일로 사용자 조회
    const userRepo = new SbUserRepo();
    const user = await userRepo.findByUserEmail(email);
    if (!user) throw new Error('존재하지 않는 계정');

    // 새 access_token
    const access_token = generateAccessToken({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone_number: user.phone_number,
        provider: user.provider,
      },
    });

    return NextResponse.json({ success: true, access_token });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
