import { UserProfileDto } from './dto/UserProfileDto';
import { UserRepo } from '@/domain/repositories/UserRepo';

export class GetUserUseCase {
  constructor(public userRepo: UserRepo) {}

  async execute(email: string): Promise<UserProfileDto> {
    const user = await this.userRepo.findByUserEmail(email);

    if (!user) throw new Error('유저 정보를 찾을 수 없습니다.');

    const { nickname, provider, phone_number } = user;
    return { email: user.email, nickname, provider, phone_number };
  }
}
