import { generateAccessToken, generateRefreshToken } from '@/infra/user/utils/jwt';

import { LoginDto } from '@/application/auth/dto/LoginDto';
import { UserRepository } from '@/domain/user/repositories/UserRepository';
import bcrypt from 'bcryptjs';

export class LoginUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);
    if (!user || user.deleted_at) {
      throw new Error('존재하지 않는 계정입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const payload = { id: user.id, email: user.email };
    const access_token = generateAccessToken(payload);
    const refresh_token = generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone_number: user.phone_number,
        provider: user.provider,
      },
    };
  }
}
