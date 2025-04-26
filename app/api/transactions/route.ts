import { GetDailyDetailUsecase } from '@/application/usecases/transactions/GetDailyDetailUsecase';
import { SbTransactionRepo } from '@/infra/repositories/supabase/SbTransactionRepo';
import { verifyAccessToken } from '@/infra/utils/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const access_token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!access_token) {
      return NextResponse.json({ status: 401 });
    }
    const { user } = verifyAccessToken(access_token);
    const id = user.id;
    const date = req.nextUrl.searchParams.get('date');
    const sbTransactionRepo = new SbTransactionRepo();
    const dailyDetailUsecase = new GetDailyDetailUsecase(sbTransactionRepo);
    const data = await dailyDetailUsecase.execute({ userId: id, date });

    return NextResponse.json({ status: 200, data });
  } catch (err) {
    return NextResponse.json({ status: 401 });
  }
}
