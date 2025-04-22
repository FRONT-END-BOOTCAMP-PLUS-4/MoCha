import { UserRepository } from '@/domain/repositories/UserRepository';
import { CheckNicknameDto } from './dto/CheckNicknameDto ';

export class CheckNicknameUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: CheckNicknameDto): Promise<{ available: boolean }> {
    const { nickname } = dto;

    const existing = await this.userRepo.findByNickname(nickname);
    return { available: !existing };
  }
}
