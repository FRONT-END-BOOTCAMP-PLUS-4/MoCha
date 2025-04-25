export class SignupRequestDto {
  constructor(
    public email: string,
    public password: string | null,
    public nickname: string | null,
    public phone_number: string | null,
    public provider: number
  ) {}
}
