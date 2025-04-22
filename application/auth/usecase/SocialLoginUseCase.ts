import { generateAccessToken, generateRefreshToken } from '@/infra/user/utils/jwt';

import { ProviderRepository } from '@/domain/repositories/ProviderRepository';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { OAuthService } from '@/domain/services/OAuthService';
import { SocialLoginDto } from '../dto/SocialLoginDto';

export class SocialLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly providerRepo: ProviderRepository,
    private readonly oauthService: OAuthService
  ) {}

  async execute(dto: SocialLoginDto) {
    const { code, provider } = dto;

    // 1. 외부 OAuth 프로필 정보 가져오기
    const { email } = await this.oauthService.getUserProfile(code);

    if (!email) {
      throw new Error('이메일 정보 없음');
    }

    // 2. provider ID 가져오기
    const providerId = await this.providerRepo.getIdByName(provider);

    // 3. 유저 조회
    let userRecord = await this.userRepo.findByEmailAndProvider(email, providerId);
    let isNew = false;

    // 4. 없으면 새로 생성
    if (!userRecord) {
      userRecord = await this.userRepo.create({
        email,
        nickname: null,
        phone_number: null,
        provider: providerId,
      });
      isNew = true;
    }

    // 5. JWT 발급
    const access_token = generateAccessToken({ id: userRecord.id, email });
    const refresh_token = generateRefreshToken({ id: userRecord.id, email });

    // 6. 응답 반환
    return {
      success: true,
      access_token,
      refresh_token,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        nickname: userRecord.nickname,
        phone_number: userRecord.phone_number,
      },
      isNew,
    };
  }
}
