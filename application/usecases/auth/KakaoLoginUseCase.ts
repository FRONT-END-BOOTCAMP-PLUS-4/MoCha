import { generateAccessToken, generateRefreshToken } from '@/infra/utils/jwt';

import { KakaoOAuthService } from '@/infra/oauth/KakaoOAuthService';
import { UserRepo } from '@/domain/repositories/UserRepo';

export class KakaoLoginUseCase {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly kakaoOAuthService: KakaoOAuthService
  ) {}

  async execute(code: string) {
    /* 1) 외부 프로필 */
    const { email, nickname } = await this.kakaoOAuthService.getUserProfile(code);
    if (!email) {
      throw new Error('이메일 정보 없음');
    }

    /* 2) provider id */
    const providerId = await this.userRepo.getProviderIdByProviderName('kakao');
    if (!providerId) {
      throw new Error('provider 정보 없음');
    }

    /* 3) 사용자 레코드 확보 */
    let user = await this.userRepo.findByUserEmail(email);
    let isNew = false;

    if (!user) {
      try {
        user = await this.userRepo.create({
          email,
          password: '',
          nickname: null,
          phone_number: null,
          provider: providerId,
          deleted_at: null,
        });
        isNew = true;
      } catch {
        throw new Error('회원가입 실패');
      }
    }

    /* 4) 토큰 생성 */
    if (!user) {
      throw new Error('사용자 정보 없음');
    }

    const payload = {
      user: {
        email: user.email,
        nickname: user.nickname,
        phone_number: user.phone_number,
        provider: user.provider,
      },
    };

    return {
      access_token: generateAccessToken(payload),
      refresh_token: generateRefreshToken(user.email.toLocaleLowerCase()),
      isNew,
    };
  }
}
