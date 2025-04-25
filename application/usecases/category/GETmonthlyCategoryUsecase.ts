import { CategoryRepo } from '@/domain/repositories/CategoryRepo';
import { SbCategoryRepo } from '@/infra/repositories/supabase/SbCategoryRepo';

export class GETmonthlyCategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async excute(
    userId: string,
    date: string | null
  ): Promise<{ name: string; is_expense: boolean; amount: number; primary_color: string }[] | []> {
    try {
      const currentDate = new Date();
      const currentYears = currentDate.getFullYear();
      const currentMmonths = currentDate.getMonth() + 1;
      const [year, months] = (date ?? `${currentYears}-${currentMmonths}`).split('-').map(Number);
      const start = `${year}-${months}-1`;
      const end = `${year}-${months + 1}-1`;
      const categoryRepo = await this.categoryRepo.GETmonthlyCategory({ userId, start, end });
      const restCategory = categoryRepo.map((value) => ({
        is_expense: value.is_expense,
        amount: value.amount,
        ...value.category,
      }));

    //   need a refactor type
      const merged = Object.values(
        restCategory.reduce(
          (acc, curr) => {
            const key = curr.name as string;
            if (acc[key]) {
              acc[key].amount += curr.amount;
            } else {
              acc[key] = { ...curr };
            }
            return acc;
          },
          {} as Record<string, (typeof restCategory)[number]>
        )
      );

      //   need a refactor type
      return merged ?? [];
    } catch (error) {
      console.warn('GETmonthlyCategoryUsecase:', error);
      return [];
    }
  }
}
