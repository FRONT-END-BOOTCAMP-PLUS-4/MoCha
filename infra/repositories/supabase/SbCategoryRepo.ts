import { supabase } from '@/app/shared/lib/supabase';
import { CategoryRepo } from '@/domain/repositories/CategoryRepo';

type GETmonthlyCategoryProps = {
  userId: string;
  start: string;
  end: string;
};

type GETmonthlyCategoryRetrun = {
  is_expense: boolean;
  amount: number;
  category: { name: string; primary_color: string }[];
};

export class SbCategoryRepo implements CategoryRepo {
  async GETmonthlyCategory(props: GETmonthlyCategoryProps): Promise<GETmonthlyCategoryRetrun[] | []> {
    try {
      const { userId, start, end } = props;
      const { data, error } = await supabase
        .from('transaction')
        .select(`amount, is_expense, category(name, primary_color)`)
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end);

      return data ?? [];
    } catch (error) {
      console.error('GETmonthlyCategory:', error);
      return [];
    }
  }
}
