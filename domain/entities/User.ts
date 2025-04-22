export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nickname: string | null,
    public readonly phone_number: string | null,
    public readonly provider: number,
    public readonly password?: string,
    public readonly deleted_at?: string
  ) {}

  // Supabase에서 가져온 plain object를 클래스로 변환해주는 정적 메서드
  static from(data: any): User {
    return new User(
      data.id,
      data.email,
      data.nickname,
      data.phone_number,
      data.provider,
      data.password,
      data.deleted_at
    );
  }
}
