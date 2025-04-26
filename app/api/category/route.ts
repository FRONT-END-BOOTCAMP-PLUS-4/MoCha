// package
import { NextRequest, NextResponse } from 'next/server';
// layer
import { GETmonthlyCategoryUsecase } from '@/application/usecases/category/GETmonthlyCategoryUsecase';
import { SbCategoryRepo } from '@/infra/repositories/supabase/SbCategoryRepo';
import { verifyAccessToken } from '@/infra/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // request
    const getHeaderToken = req.headers.get('authorization');
    // token 확인영역
    if (!getHeaderToken) return NextResponse.json({ status: 401 });
    const access_token = getHeaderToken.replace('Bearer ', '');
    const { user:{ id } }  = verifyAccessToken(access_token);
    // data
    const date = req.nextUrl.searchParams.get('date');
    const sbCategoryRepo = new SbCategoryRepo();
    const getMonthlyCategoryUsecase = new GETmonthlyCategoryUsecase(sbCategoryRepo);
    const data = await getMonthlyCategoryUsecase.excute({userId:id, date});

    return NextResponse.json({ status: 200, data});
  } catch (error) {
    console.error("api/category/route.ts",error);
    return NextResponse.json({ status: 500 });
  }
}
