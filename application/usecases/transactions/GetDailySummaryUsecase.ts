import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { DailySummaryRequest, DailySummaryResponse } from './dto/DailySummaryDto';

export class GetdailySummaryUsecase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(request: DailySummaryRequest): Promise<DailySummaryResponse[] | []> {
    try {
      const currentDate = new Date();
      const currentYears = currentDate.getFullYear();
      const currentMonths = currentDate.getMonth() + 1;

      const [year, months] = (request.yearMonth ?? `${currentYears}-${currentMonths}`)
        .split('-')
        .map(Number);
      const monthsLastDay = new Date(year, months, 0).getDate();

      const padMonths = `${months}`.padStart(2, '0');
      const start = `${year}-${padMonths}-1`;
      const end = `${year}-${padMonths}-${monthsLastDay}`;

      const transactionRepo = await this.transactionRepo.GETdailySummary(
        request.userId,
        start,
        end
      );
      return transactionRepo;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
