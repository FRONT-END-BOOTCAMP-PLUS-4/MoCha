import { UserRepo } from '@/domain/repositories/UserRepo';

export class CheckNicknameUseCase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(nickname: string): Promise<{ available: boolean }> {
    const existing = await this.userRepo.findByUserNickname(nickname);
    return { available: !existing };
  }
}
