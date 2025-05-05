export class GoogleOAuthService {
  async getUserProfile(token: string) {
    // 구글 UserInfo API 호출
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`[Google OAuth Error] ${err.error_description ?? res.statusText}`);
    }
    const profile = await res.json();
    return {
      email: profile.email as string,
      nickname: (profile.name as string) ?? null,
    };
  }
}
