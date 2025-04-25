import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { MonthlySummaryRequest, MonthlySummaryResponse } from './dto/MonthlySummaryDto';

export class GetMonthlySummaryUsecase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(request: MonthlySummaryRequest): Promise<MonthlySummaryResponse | []> {
    try {
      // 년,월 없을경우에 해당 년,월을 참고한다.
      const currentDate = new Date();
      // 해당 년 가져오기
      const currentYears = currentDate.getFullYear();
      // 해당 월 가져오기
      const currentMonths = currentDate.getMonth() + 1;
      // startDate가 존재하냐?
      const [year, months] = (request.startDate ?? `${currentYears}-${currentMonths}`)
        .split('-')
        .map(Number);
      console.log('months:', months);
      const monthsLastDay = new Date(year, months, 0).getDate();
      const padMonths = `${months}`.padStart(2, '0');
      const start = `${year}-${padMonths}-1`;
      // endDate 존재하냐?
      const end = request.endDate
        ? `${request.endDate}-${monthsLastDay}`
        : `${year}-${padMonths}-${monthsLastDay}`;
      const transactionRepo = await this.transactionRepo.GETmonthlySummary(
        request.userId,
        start,
        end
      );

      const totalIncome = transactionRepo
        .filter((value) => !value.is_expense)
        .reduce((acc, cur) => {
          return acc + cur.amount;
        }, 0);

      const totalExpense = transactionRepo
        .filter((value) => value.is_expense)
        .reduce((acc, cur) => {
          return acc + cur.amount;
        }, 0);

      return { totalIncome, totalExpense };
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
