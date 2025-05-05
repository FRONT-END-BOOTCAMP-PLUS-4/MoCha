// slice
import { MonthlyCategoryRequest, MonthlyCategoryResponse } from './dto/MonthlyCategoryDto';
// layer
import { CategoryRepo } from '@/domain/repositories/CategoryRepo';


export class GETmonthlyCategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async excute(props: MonthlyCategoryRequest): Promise<MonthlyCategoryResponse | []> {  
      const {userId , date} = props;

      // 현재 KST
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 9);
      const currentYears = currentDate.getFullYear();
      const currentMmonths = currentDate.getMonth() + 1;

      // 전달받은 날짜 or 현재날짜 
      const [year, months] = (date ?? `${currentYears}-${currentMmonths}`).split('-').map(Number);

      // 시작날짜 (한달기준 조회이기때문에 시작일 고정 = 1일)
      const startDate = `${year}-${String(months).padStart(2, "0")}-01`;

      // 종료날짜
      let endYears = year;
      let endMonth = months;

      // 월 기준 넘어갈시 endYears, endMonth 초기화
      if(+endMonth > 11){
        endYears += 1;
        endMonth = 1;
      }

      // DB가 timestamptz 으로 설정되어었기 떄문에 다음달 1일 기준으로
      const endDate = `${endYears}-${String(endMonth + 1).padStart(2,"0")}-01`;
      
      const categoryRepo = await this.categoryRepo.GETmonthlyCategory({ userId, startDate, endDate });

      return categoryRepo ?? [];
  }
}
