export class User {
  constructor(
    public id: string | null,
    public email: string,
    public password: string | null,
    public nickname: string | null,
    public phone_number: string | null,
    public provider: number,
    public deleted_at: Date | null
  ) {}
}
