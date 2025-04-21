import { OAuthService } from '@/domain/user/services/OAuthService';

export class KakaoOAuthService implements OAuthService {
  async getUserProfile(code: string) {
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    console.log('tokenData: ', tokenData);
    const accessToken = tokenData.access_token;

    const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const profileData = await profileRes.json();

    return {
      email: profileData.kakao_account?.email,
      nickname: profileData.kakao_account?.profile?.nickname ?? null,
    };
  }
}
