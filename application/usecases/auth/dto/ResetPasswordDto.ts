export class ResetPasswordRequestDto {
  constructor(
    public email: string,
    public password: string,
    public token: string,
    public code: string
  ) {}
}
