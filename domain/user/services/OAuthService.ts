export interface OAuthService {
  getUserProfile(code: string): Promise<{
    email: string;
    nickname: string | null;
  }>;
}
