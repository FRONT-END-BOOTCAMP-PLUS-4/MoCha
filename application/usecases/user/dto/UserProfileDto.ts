export class UserProfileDto {
  constructor(
    public email: string,
    public nickname: string | null,
    public phone_number: string | null,
    public provider: number
  ) {}
}
