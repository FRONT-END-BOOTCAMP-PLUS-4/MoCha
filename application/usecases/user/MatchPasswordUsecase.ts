import { UserRepo } from '@/domain/repositories/UserRepo';
import bcrypt from 'bcryptjs';

export class MatchPasswordUsecase {
    constructor(private readonly userRepo:UserRepo){}

    async excute(email: string, password: string): Promise<boolean>{

        const userRepo = await this.userRepo.findByUserEmail(email);
        const isMatch = await bcrypt.compare(password, userRepo?.password as string);

        return isMatch;
    }
}