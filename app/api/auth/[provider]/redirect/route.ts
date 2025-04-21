import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { provider: string } }) {
  const { provider } = params;

  let url = '';

  if (provider === 'google') {
    const client_id = process.env.GOOGLE_CLIENT_ID!;
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI!;
    const scope = 'openid email profile';

    url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline`;
  } else if (provider === 'kakao') {
    const client_id = process.env.KAKAO_CLIENT_ID!;
    const redirect_uri = process.env.KAKAO_REDIRECT_URI!;

    url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  } else {
    return NextResponse.json(
      { success: false, error: '지원하지 않는 provider입니다.' },
      { status: 400 }
    );
  }

  return NextResponse.redirect(url);
}
