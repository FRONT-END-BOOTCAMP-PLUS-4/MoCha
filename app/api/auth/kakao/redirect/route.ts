import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const client_id = process.env.KAKAO_CLIENT_ID!;
  const redirect_uri = process.env.KAKAO_REDIRECT_URI!;

  let url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  return NextResponse.redirect(url);
}
