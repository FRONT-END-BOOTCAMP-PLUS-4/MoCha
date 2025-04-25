import { UserRepo } from '@/domain/repositories/UserRepo';

export class GetUserUseCase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(email: string) {
    const user = await this.userRepo.findByUserEmail(email);
    if (!user) throw new Error('유저 정보를 찾을 수 없습니다.');
    return user;
  }
}
