export class SignupRequestDto {
  constructor(
    public email: string,
    public password: string,
    public nickname: string,
    public phone_number: string,
    public provider: number
  ) {}
}
