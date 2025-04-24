import { NextResponse } from 'next/server';
// 임시작업
import { generateAccessToken } from '@/infra/utils/jwt';


export async function GET() {
  try {
    const temp_user = {
      id: '1a04cacb-e11d-476a-a204-7cde310c2d81',
      email: 'test@gmail.com',
      nickname: 'test',
      provider: 1,
    }
    const access_token = generateAccessToken(temp_user);

    return NextResponse.json({ status: 200, access_token});
  } catch (err) {
    return NextResponse.json({ status: 401 });
  }
}
