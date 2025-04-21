export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nickname: string | null,
    public readonly phone_number: string | null,
    public readonly provider: string
  ) {}
}
