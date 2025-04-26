import { GoogleOAuthService } from '@/infra/oauth/GoogleOAuthService';
import { UserRepo } from '@/domain/repositories/UserRepo';
import { generateAccessToken } from '@/infra/utils/jwt';

export class GoogleLoginUseCase {
  constructor(
    private userRepo: UserRepo,
    private oauthService: GoogleOAuthService
  ) {}

  async execute(token: string) {
    // 1) 프로필 가져오기
    const profile = await this.oauthService.getUserProfile(token);
    if (!profile.email) throw new Error('이메일 정보 없음');

    // 2) provider ID 조회
    const providerId = await this.userRepo.getProviderIdByProviderName('google');

    // 3) 기존 유저 조회·생성
    let user = await this.userRepo.findByUserEmail(profile.email);
    let isNew = false;
    if (!user) {
      const created = await this.userRepo.create({
        email: profile.email,
        password: '',
        nickname: profile.nickname,
        phone_number: null,
        provider: providerId,
        deleted_at: null,
      });
      if (!created) throw new Error('User creation failed');
      user = created;
      isNew = true;
    }

    // 4) JWT 발급
    const payload = {
      user: {
        email: user.email,
        nickname: user.nickname,
        phone_number: user.phone_number,
        provider: user.provider,
      },
    };
    const accessToken = generateAccessToken(payload);

    return { token: accessToken, isNew };
  }
}
