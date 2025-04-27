// package
import { JsonWebTokenError} from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
// layer
import { verifyAccessToken } from '@/infra/utils/jwt';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';
import { ValidationError } from '@/domain/error';
import { MatchPasswordUsecase } from '@/application/usecases/user/MatchPasswordUsecase';


export async function PUT(req: NextRequest) {
  try {
    //request
    const getHeaderToken = req.headers.get('authorization');
    // Authorization 필드 확인영역
    if (!getHeaderToken) throw new JsonWebTokenError("No token");
    const access_token = getHeaderToken.replace('Bearer ', '');
    const { user } = verifyAccessToken(access_token);


    const { password } = await req.json();




    return NextResponse.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (error) {
    
    if( error instanceof Error){
        const errorMessage = error.message || "서버에러"

        if(error instanceof JsonWebTokenError) return NextResponse.json({ status: 401, message: "인증실패" });
        
        return NextResponse.json({status: 500, message: errorMessage});
    }

    return NextResponse.json({ status: 520, message: error });
  }
}



export async function POST(req: NextRequest) {
  try {
    //request
    const getHeaderToken = req.headers.get('authorization');
    // Authorization 필드 확인영역
    if (!getHeaderToken) throw new JsonWebTokenError("No token");
    const access_token = getHeaderToken.replace('Bearer ', '');
    const { user } = verifyAccessToken(access_token);

    // body 필드 확인영역
    const { password }: {password: string;} = await req.json();
    const sbUserRepo = new SbUserRepo();
    const matchPasswordUsecase = new MatchPasswordUsecase(sbUserRepo);
    const data = await matchPasswordUsecase.excute(user.email, password);
    console.log(data);

    return NextResponse.json({ status: 200, data});
  } catch (error) {
    
    if( error instanceof Error){
        const errorMessage = error.message || "서버에러"

        if(error instanceof ValidationError) {
            if(error.message === "password") return NextResponse.json({ status: 400, message: "password" })
        }

        if(error instanceof JsonWebTokenError) return NextResponse.json({ status: 401, message: "인증실패" });
        
        return NextResponse.json({status: 500, message: errorMessage});
    }

    return NextResponse.json({ status: 520, message: error });
  }
}