import { CategoryRepo } from '@/domain/repositories/CategoryRepo';
import { SplitCategories } from './dto/CategoryDto';

export class GETcategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async excute(props: { userId: string }): Promise<SplitCategories> {
    const { userId } = props;

    const categories = await this.categoryRepo.GETcategory({ userId });

    if (!categories) {
      return { income: [], expense: [] };
    }

    const incomeCategoryNames = ['급여', '투자수익', '용돈', '환급&환불', '기타'];
    const expenseCategoryNames = [
      '식비',
      '생활',
      '교통',
      '통신',
      '의료',
      '쇼핑',
      '교육',
      '문화&여가',
      '경조사',
      '기타',
    ];

    const income = categories.filter((category) => incomeCategoryNames.includes(category.name));
    const expense = categories.filter((category) => expenseCategoryNames.includes(category.name));

    return { income, expense };
  }
}
