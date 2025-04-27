export class KakaoOAuthService {
  async getUserProfile(code: string) {
    /* 1) 토큰 교환 */
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
    if (!tokenRes.ok) {
      throw new Error('카카오 토큰 교환 실패');
    }
    const { access_token } = await tokenRes.json();
    if (!access_token) {
      throw new Error('access_token 없음');
    }

    /* 2) 프로필 조회 */
    const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!profileRes.ok) {
      throw new Error('카카오 프로필 조회 실패');
    }
    const profile = await profileRes.json();

    return {
      email: profile.kakao_account?.email ?? null,
      nickname: null,
    };
  }
}
