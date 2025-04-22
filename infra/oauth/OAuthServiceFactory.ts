import { OAuthService } from '@/domain/services/OAuthService';
import { GoogleOAuthService } from './GoogleOAuthService';
import { KakaoOAuthService } from './KakaoOAuthService';

export class OAuthServiceFactory {
  static create(provider: string): OAuthService {
    if (provider === 'google') return new GoogleOAuthService();
    if (provider === 'kakao') return new KakaoOAuthService();
    throw new Error('지원하지 않는 provider입니다');
  }
}
