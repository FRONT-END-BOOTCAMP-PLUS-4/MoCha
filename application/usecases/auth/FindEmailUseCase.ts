import { FindEmailRequestDto } from '@/application/usecases/auth/dto/FindEmailDto';
import { UserRepo } from '@/domain/repositories/UserRepo';

export class FindEmailUseCase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(FindEmailRequestDto: FindEmailRequestDto): Promise<{ email: string }> {
    const { nickname, phoneNumber } = FindEmailRequestDto;
    const user = await this.userRepo.findByUserNicknameAndPhone(nickname, phoneNumber);

    if (!user) throw new Error('일치하는 계정을 찾을 수 없습니다.');
    return { email: user.email };
  }
}
