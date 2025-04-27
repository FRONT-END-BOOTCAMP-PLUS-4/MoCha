// slice
import { MonthlySummaryRequest, MonthlySummaryResponse } from './dto/MonthlySummaryDto';
// layer
import { TransactionRepo } from '@/domain/repositories/TransactionRepo';

export class GetMonthlySummaryUsecase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(props: MonthlySummaryRequest): Promise<MonthlySummaryResponse[] | []> {
    const { userId, startDate, endDate } = props;

    // 현재 KST
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9);
    const currentYears = currentDate.getFullYear();
    const currentMmonths = currentDate.getMonth() + 1;

    // 전달받은 날짜 or 현재날짜
    const [year, months] = (startDate ?? `${currentYears}-${currentMmonths}`)
      .split('-')
      .map(Number);

    // 시작날짜 (한달기준 조회이기때문에 시작일 고정 = 1일)
    const start = `${year}-${String(months).padStart(2, '0')}-01`;

    // 종료날짜
    let endYear = year;
    let endMonth = months;

    if (endDate) [endYear, endMonth] = endDate.split('-').map(Number);

    // endDate가 들어왔을 때 다음달을 기준으로 잡아야 하니까
    if (endMonth === 12) {
      endYear += 1;
      endMonth = 1;
    } else {
      endMonth += 1;
    }

    // DB가 timestamptz 으로 설정되어었기 떄문에 다음달 1일 기준으로
    const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const transactionRepo = await this.transactionRepo.GETmonthlySummary({
      userId,
      startDate: start,
      endDate: end,
    });

    // 변환
    const monthlySummary: {[month: string]: {date:string, expenses:number, incomes:number}} = {};

    transactionRepo.forEach((item) => {
      const month = item.date.slice(0, 7);

      if (!monthlySummary[month]) {
        monthlySummary[month] = { date: month, expenses: 0, incomes: 0 };
      }

      if (item.is_expense) {
        monthlySummary[month].expenses += item.amount;
      } else {
        monthlySummary[month].incomes += item.amount;
      }
    });

    const result = Object.values(monthlySummary);

    return result ;
  }
}
