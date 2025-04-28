// package
import { JsonWebTokenError} from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
// layer
import { verifyAccessToken } from '@/infra/utils/jwt';
import { SbUserRepo } from '@/infra/repositories/supabase/SbUserRepo';

export async function PUT(req: NextRequest) {
    try {
      //request
      const getHeaderToken = req.headers.get('authorization');
      // Authorization 필드 확인영역
      if (!getHeaderToken) throw new JsonWebTokenError("No token");
      const access_token = getHeaderToken.replace('Bearer ', '');
      const { user } = verifyAccessToken(access_token);
      const sbUserRepo = new SbUserRepo();
      const data = sbUserRepo.deleteUser(user.id);
  
      return NextResponse.json({ status: 200, data});
    } catch (error) {
      
      if( error instanceof Error){
          const errorMessage = error.message || "서버에러"
  
          if(error instanceof JsonWebTokenError) return NextResponse.json({ status: 401, message: "인증실패" });
          
          return NextResponse.json({status: 500, message: errorMessage});
      }
  
      return NextResponse.json({ status: 520, message: error });
    }
  }
  
  
  