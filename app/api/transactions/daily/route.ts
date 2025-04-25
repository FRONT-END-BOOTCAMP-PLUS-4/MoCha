import { SbTransactionRepo } from '@/infra/repositories/supabase/SbTransactionRepo';
import { GetdailySummaryUsecase } from '@/application/usecases/transactions/GetDailySummaryUsecase';
import { NextRequest, NextResponse } from 'next/server';
// 임시작업
import { verifyAccessToken } from '@/infra/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const access_token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!access_token) {
      return NextResponse.json({ status: 401 });
    }
    const { id } = verifyAccessToken(access_token);
    const startDate = req.nextUrl.searchParams.get('start');
    const sbTransactionRepo = new SbTransactionRepo();
    const dailySummaryUsecase = new GetdailySummaryUsecase(sbTransactionRepo);
    const data = await dailySummaryUsecase.execute({ userId: id, yearMonth: startDate });

    return NextResponse.json({ status: 200, data });
  } catch (err) {
    return NextResponse.json({ status: 401 });
  }
}
