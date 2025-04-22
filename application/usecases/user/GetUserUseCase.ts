import { UserRepository } from '@/domain/repositories/UserRepository';

export class GetUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('유저 정보를 찾을 수 없습니다.');
    return user;
  }
}
