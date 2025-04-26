import { CategoryRepo } from '@/domain/repositories/CategoryRepo';
import { MonthlyCategoryRequest, MonthlyCategoryResponse } from './dto/MonthlyCategoryDto';


export class GETmonthlyCategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async excute(props: MonthlyCategoryRequest): Promise<MonthlyCategoryResponse[] | []> {
    try {
  
      const {userId , date} = props;
      const currentDate = new Date();
      const currentYears = currentDate.getFullYear();
      const currentMmonths = currentDate.getMonth() + 1;
      const [year, months] = (date ?? `${currentYears}-${currentMmonths}`).split('-').map(Number);
      const start = `${year}-${months}-1`;
      const end = `${year}-${months + 1}-1`;

      const categoryRepo = await this.categoryRepo.GETmonthlyCategory({ userId, start, end });

      return categoryRepo ?? [];
    } catch (error) {
      console.warn('GETmonthlyCategoryUsecase:', error);
      return [];
    }
  }
}
