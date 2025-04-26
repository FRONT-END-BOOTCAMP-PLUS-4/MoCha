import { KakaoOAuthService } from '@/infra/oauth/KakaoOAuthService';
import { User } from '@/domain/entities/User';
import { UserRepo } from '@/domain/repositories/UserRepo';
import { generateAccessToken } from '@/infra/utils/jwt';

export class KakaoLoginUseCase {
  constructor(
    public userRepo: UserRepo,
    public kakaoOAuthService: KakaoOAuthService
  ) {}

  async execute(code: string) {
    // 외부 OAuth 프로필 정보 가져오기
    const profile = await this.kakaoOAuthService.getUserProfile(code);
    const { email, nickname } = profile;
    if (!email) {
      throw new Error('이메일 정보 없음');
    }

    // provider ID 가져오기
    const providerId = await this.userRepo.getProviderIdByProviderName('kakao');

    // 유저 조회
    const existingUser = await this.userRepo.findByUserEmail(email);

    // 새 유저 생성 또는 기존 유저 사용
    let userRecord: User;
    let isNew = false;

    if (existingUser) {
      userRecord = existingUser;
    } else {
      const createdUser = await this.userRepo.create({
        email,
        password: '',
        nickname: nickname || null,
        phone_number: null,
        provider: providerId,
        deleted_at: null,
      });

      if (!createdUser) {
        throw new Error('User creation failed');
      }

      userRecord = createdUser;
      isNew = true;
    }

    // JWT 발급을 위한 payload 구성
    const payload = {
      user: {
        email: userRecord.email,
        nickname: userRecord.nickname,
        phone_number: userRecord.phone_number,
        provider: userRecord.provider,
      },
    };

    // JWT 발급
    const token = generateAccessToken(payload);

    // 응답 반환
    return {
      token,
      isNew,
    };
  }
}
