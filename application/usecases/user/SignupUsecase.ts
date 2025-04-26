import { SignupRequestDto } from '@/application/usecases/user/dto/SignupDto';
import { UserRepo } from '@/domain/repositories/UserRepo';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/shared/lib/supabase';

export class SignupUseCase {
  constructor(public userRepo: UserRepo) {}

  async execute(SignupRequestDto: SignupRequestDto) {
    const { email, password, nickname, phone_number, provider } = SignupRequestDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepo.findByUserEmail(email);
    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const { data: providerData, error: providerError } = await supabase
      .from('provider')
      .select('id')
      .eq('name', provider)
      .single();

    if (!providerData) throw new Error('유효하지 않은 provider');

    const providerId = providerData.id as number;

    // 유저 생성
    const createdUser = await this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
      phone_number,
      provider: providerId,
      deleted_at: null,
    });

    return createdUser;
  }
}
