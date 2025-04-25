export class SocialLoginRequestDto {
  constructor(
    public provider: 'google' | 'kakao',
    public code: string
  ) {}
}
