export class VerifyCodeRequestDto {
  constructor(
    public token: string,
    public code: string
  ) {}
}
