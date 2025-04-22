import { supabase } from '@/app/shared/lib/supabase';
import { SendCodeDto } from '@/application/usecases/auth/dto/SendCodeDto';
import { sendVerificationCode } from '@/infra/user/utils/email';
import { createVerificationToken } from '@/infra/user/utils/jwt';

export class SendCodeUseCase {
  async execute({ email }: SendCodeDto): Promise<{ token: string }> {
    // 이메일 중복 확인
    const { data: existingUser } = await supabase
      .from('user')
      .select('id')
      .eq('email', email)
      .is('deleted_at', null)
      .single();

    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    // 인증 코드 생성 및 전송
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationCode(email, code);

    // 토큰 생성
    const token = createVerificationToken({ email, code });

    return { token };
  }
}
