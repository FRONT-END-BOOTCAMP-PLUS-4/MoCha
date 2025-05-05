import { GETcategoryUsecase } from '@/application/usecases/category/GETcategoryUsecase';
import { SbCategoryRepo } from '@/infra/repositories/supabase/SbCategoryRepo';
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
    const sbCategoryRepo = new SbCategoryRepo();
    const getCategoryUsecase = new GETcategoryUsecase(sbCategoryRepo);
    const data = await getCategoryUsecase.excute({ userId: id });

    return NextResponse.json({ status: 200, data });
  } catch (err) {
    return NextResponse.json({ status: 401 });
  }
}
