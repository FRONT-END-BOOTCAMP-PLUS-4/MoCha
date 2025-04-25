import { LoginRequestDto } from './dto/LoginDto';
import { UserRepo } from '@/domain/repositories/UserRepo';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '@/infra/utils/jwt';

export class LoginUseCase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(loginRequestDto: LoginRequestDto) {
    const { email, password } = loginRequestDto;

    const user = await this.userRepo.findByUserEmail(email);

    if (!user || user.deleted_at) {
      throw new Error('존재하지 않는 계정입니다.');
    }

    if (!user.password) {
      throw new Error('이 계정은 비밀번호로 로그인할 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = true;
    if (!isMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone_number: user.phone_number,
        provider: user.provider,
      },
    };
    const token = generateAccessToken(payload);
    // const refresh_token = generateRefreshToken(payload);

    return {
      token,
    };
  }
}
