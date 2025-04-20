import { supabase } from '@/app/shared/lib/supabase';
import { SignupDto } from '@/application/user/dto/SignupDto';
import { UserRepository } from '@/domain/user/repositories/UserRepository';
import bcrypt from 'bcryptjs';

export class SignupUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: SignupDto) {
    const { email, password, nickname, phone_number, provider } = dto;

    // 이메일 중복 확인
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: providerData, error: providerError } = await supabase
      .from('provider')
      .select('id')
      .eq('name', provider)
      .single();

    if (!providerData) throw new Error('유효하지 않은 provider');

    const providerId = providerData.id;

    // 유저 생성
    const createdUser = await this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
      phone_number,
      provider: providerId,
    });

    return createdUser;
  }
}
