import { UserRepo } from '@/domain/repositories/UserRepo';
import { ValidationError } from '@/domain/error';

export class PutUserInfoUseCase {
    constructor(private readonly userRepo: UserRepo){}

    async excute( props: {userId: string, nickName: string, phone_number:string}):Promise<{ nickname: string; phone_number: string,  provider:string, email:string}>{
        const { userId, nickName = "", phone_number = ""} = props;

        const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/.test(nickName);
        const phoneRegex = /^\d{10,11}$/.test(phone_number);

        if(!nicknameRegex ) throw new ValidationError("nickName");
        if(!phoneRegex) throw new ValidationError("phone_number");

        const userRepo = await this.userRepo.updateInfo(userId, nickName, phone_number);

        return userRepo;
    }
}