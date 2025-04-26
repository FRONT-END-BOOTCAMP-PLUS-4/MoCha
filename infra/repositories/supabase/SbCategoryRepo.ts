import { supabase } from '@/app/shared/lib/supabase';
import { CategoryRepo } from '@/domain/repositories/CategoryRepo';

type GETmonthlyCategoryProps = {
  userId: string;
  start: string;
  end: string;
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
  async GETmonthlyCategory(
    props: GETmonthlyCategoryProps
  ): Promise<GETmonthlyCategoryRetrun[] | []> {
      const { userId, start, end } = props;
      const { data, error } = await supabase
      .rpc('get_category_monthly_list', { user_id:userId, start_date: start, end_date:end });

      if(error) throw new Error(error.message);

      return data ?? [];
  }
}
