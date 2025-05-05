import { supabase } from '@/app/shared/lib/supabase';
import { CategoryRepo } from '@/domain/repositories/CategoryRepo';

type GETmonthlyCategoryProps = {
  userId: string;
  startDate: string;
  endDate: string;
};

type MonthlyCategoryItem = {
  is_expense: boolean;
  amount: number;
  name: string;
  primary_color: string;
};

type GETmonthlyCategoryRetrun = {
  incomes: MonthlyCategoryItem[];
  expenses: MonthlyCategoryItem[];
};

export class SbCategoryRepo implements CategoryRepo {
  async GETmonthlyCategory(props: GETmonthlyCategoryProps): Promise<GETmonthlyCategoryRetrun | []> {
    const { userId, startDate, endDate } = props;
    const { data, error } = await supabase.rpc('get_category_monthly_list', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    });

    if (error) throw new Error(error.message);

    return data ?? [];
  }

  async GETcategory(props: { userId: string }): Promise<{ id: string; name: string }[] | []> {
    const { userId } = props;
    const { data, error } = await supabase.from('category').select('id, name');

    if (error) throw new Error(error.message);

    return data ?? [];
  }
}
