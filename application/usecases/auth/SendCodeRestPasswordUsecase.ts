import { supabase } from '@/app/shared/lib/supabase';
import { sendVerificationCode } from '@/infra/utils/email';
import { createVerificationToken } from '@/infra/utils/jwt';

export class SendCodeRestPasswordUsecase {
  async execute(email: string): Promise<{ token: string }> {
    // 이메일 유효성 검사
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new Error('유효한 이메일을 입력해주세요.');
    }

    // Supabase에서 해당 이메일이 존재하는지 확인
    const { data: user } = await supabase.from('user').select('id').eq('email', email).single();

    if (!user) {
      throw new Error('존재하지 않는 계정입니다.');
    }

    // 인증 코드 생성 및 전송
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationCode(email, code);

    // 토큰 생성
    const token = createVerificationToken({ email, code });

    return { token };
  }
}
