import { UserRepo } from '@/domain/repositories/UserRepo';
import bcrypt from 'bcryptjs';

export class ChangePasswordUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute( email: string, password: string ): Promise<boolean> {

    const hashedPassword = await bcrypt.hash(password as string, 10);
    const userRepo = await this.userRepo.resetPasswordByUserEmail(email, hashedPassword);
    
    return true;
  }
}
