import { ResetPasswordDto } from '@/application/usecases/auth/dto/ResetPasswordDto';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { verifyEmailToken } from '@/infra/user/utils/jwt';
import bcrypt from 'bcryptjs';

export class ResetPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const { email, password, token, code } = dto;

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
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 해싱 후 업데이트
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.updatePasswordByEmail(email, hashedPassword);
  }
}
