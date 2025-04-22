import { FindEmailDto } from '@/application/usecases/auth/dto/FindEmailDto';
import { UserRepository } from '@/domain/repositories/UserRepository';

export class FindEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: FindEmailDto): Promise<{ email: string }> {
    const { nickname, phoneNumber } = dto;
    const user = await this.userRepo.findByNicknameAndPhone(nickname, phoneNumber);

    if (!user) throw new Error('일치하는 계정을 찾을 수 없습니다.');
    return { email: user.email };
  }
}
