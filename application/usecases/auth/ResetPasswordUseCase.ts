import { ResetPasswordRequestDto } from '@/application/usecases/auth/dto/ResetPasswordDto';
import { UserRepo } from '@/domain/repositories/UserRepo';
import { verifyEmailToken } from '@/infra/utils/jwt';
import bcrypt from 'bcryptjs';

export class ResetPasswordUseCase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(ResetPasswordRequestDto: ResetPasswordRequestDto): Promise<void> {
    const { email, password, token, code } = ResetPasswordRequestDto;

    // 토큰 검증
    let payload;
    try {
      payload = verifyEmailToken(token); // { email, code }
    } catch {
      throw new Error('유효하지 않거나 만료된 토큰입니다.');
    }

    if (payload.email !== email || payload.code !== code) {
      throw new Error('인증번호가 일치하지 않습니다.');
    }

    // 유저 존재 여부 확인
    const user = await this.userRepo.findByUserEmail(email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 해싱 후 업데이트
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.resetPasswordByUserEmail(email, hashedPassword);
  }
}
