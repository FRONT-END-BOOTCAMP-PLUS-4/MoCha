import { NextRequest, NextResponse } from 'next/server';

import { GetMonthlySummaryUsecase } from '@/application/usecases/transactions/GetMonthlySummaryUsecase';
import { SbTransactionRepo } from '@/infra/repositories/supabase/SbTransactionRepo';
import { verifyAccessToken } from '@/infra/utils/jwt';

// 임시작업

/*
    supabaseorm 참조: https://supabase.com/docs/reference/javascript/typescript-support

    1. domain/repositories만 interface로 작성하고, 나머지는 class
    2. 입력 / 출력 의 형식이 2개이상부터는 DTO 파일로 분리한다.
    3. 맵핑을 하는구간은 역량것

    파일이름은 통일하며 뒤에 용어만 붙는다.
    단! 행위를 목적으로 파일이름을 지정할것 동사 + 명사
    domain/repositories = ***Repo.ts
    usecase =  ***Usecase.ts
    dto = ***Dto.ts (request,response)
    infra = Sb****Repo.ts


    마이크로소프트 아키텍처
    기존 3아키텍처에서 추가된 어뎁터 영역은 api관련인데
    이부분은 언어가 바뀌어도 가능하다 ?
    그렇기에 api영역이 생겨난거고
    다른 언어로 api를 작성해도 문제가되지 않는다.


    옵션으로 기간을 받아야함

    years=2025
    months=4

    1. years와 months가 없다면 현재 년,월로 (입력이 안되었을때 생각을 하면안될듯?) 
    2. years와 months가 있다면 해당 년,월로 
    3. 옵셔널로

    // true = 지출
    // false = 수입
*/

export async function GET(req: NextRequest) {
  try {
    const access_token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!access_token) {
      return NextResponse.json({ status: 401 });
    }
    const { user } = verifyAccessToken(access_token);
    const id = user.id;
    const startDate = req.nextUrl.searchParams.get('start');
    const endDate = req.nextUrl.searchParams.get('end');
    const sbTransactionRepo = new SbTransactionRepo();
    const monthlySummaryUsecase = new GetMonthlySummaryUsecase(sbTransactionRepo);
    const data = await monthlySummaryUsecase.execute({ userId: id, startDate, endDate });

    return NextResponse.json({ status: 200, data });
  } catch (err) {
    return NextResponse.json({ status: 401 });
  }
}
