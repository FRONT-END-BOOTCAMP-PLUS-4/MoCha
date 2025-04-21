export class SocialLoginDto {
  constructor(
    public readonly provider: 'google' | 'kakao',
    public readonly code: string
  ) {}
}
