import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { DailyDetailRequest, DailyDetailResponse } from './dto/DailyDetailDto';

export class GetDailyDetailUsecase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(request: DailyDetailRequest): Promise<DailyDetailResponse[] | []> {
    try {
      if (!request.date) {
        return [];
      }

      const transactionRepo = await this.transactionRepo.GETdailyDetail(
        request.userId,
        request.date
      );
      return transactionRepo;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
