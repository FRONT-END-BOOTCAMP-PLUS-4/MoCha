import { VerifyCodeRequestDto } from '@/application/usecases/auth/dto/VerifyCodeDto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class VerifyCodeUseCase {
  async execute(dto: VerifyCodeRequestDto): Promise<{ verified: boolean }> {
    const { token, code } = dto;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { code: string };

      const isValid = String(decoded.code) === String(code);
      if (!isValid) throw new Error('인증번호가 일치하지 않습니다.');

      return { verified: true };
    } catch (err: any) {
      throw new Error('유효하지 않은 또는 만료된 토큰입니다.');
    }
  }
}
