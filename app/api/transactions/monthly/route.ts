// package
import { NextRequest, NextResponse } from 'next/server';
// layer
import { GetMonthlySummaryUsecase } from '@/application/usecases/transactions/GetMonthlySummaryUsecase';
import { SbTransactionRepo } from '@/infra/repositories/supabase/SbTransactionRepo';
import { verifyAccessToken } from '@/infra/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // request
    const getHeaderToken = req.headers.get('authorization');
    // token 확인영역
    if (!getHeaderToken) return NextResponse.json({ status: 401 });
    const access_token = getHeaderToken.replace('Bearer ', '');
    const { user } = verifyAccessToken(access_token);
    // data
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const sbTransactionRepo = new SbTransactionRepo();
    const monthlySummaryUsecase = new GetMonthlySummaryUsecase(sbTransactionRepo);
    const data = await monthlySummaryUsecase.execute({ userId: user.id, startDate, endDate });

    return NextResponse.json({ status: 200, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
