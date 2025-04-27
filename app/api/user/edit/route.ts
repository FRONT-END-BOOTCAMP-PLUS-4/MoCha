// package
import { JsonWebTokenError} from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
// layer
import { verifyAccessToken } from '@/infra/utils/jwt';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';
import { PutUserInfoUseCase } from '@/application/usecases/user/PutUserInfoUseCase';
import { ValidationError } from '@/domain/error';

export async function PUT(req: NextRequest) {
  try {
    //request
    const getHeaderToken = req.headers.get('authorization');
    // Authorization 필드 확인영역
    if (!getHeaderToken) throw new JsonWebTokenError("No token");
    const access_token = getHeaderToken.replace('Bearer ', '');
    const { user } = verifyAccessToken(access_token);

    // body 필드 확인영역
    const { nickName, phone }: {nickName: string; phone:string} = await req.json();
    const sbUserRepo = new SbUserRepo();
    const putUserInfoUseCase = new PutUserInfoUseCase(sbUserRepo);
    const data = await putUserInfoUseCase.excute({userId:user.id, nickName:nickName, phone_number:phone})

    return NextResponse.json({ status: 201, data});
  } catch (error) {
    
    if( error instanceof Error){
        const errorMessage = error.message || "서버에러"

        if(error instanceof ValidationError) {
            if(error.message === "nickName") return NextResponse.json({ status: 400, message: "nickName" })
            if(error.message === "phone_number") return NextResponse.json({ status: 400, message: "phone_number" })
        }

        if(error instanceof JsonWebTokenError) return NextResponse.json({ status: 401, message: "인증실패" });
        
        return NextResponse.json({status: 500, message: errorMessage});
    }

    return NextResponse.json({ status: 520, message: error });
  }
}
