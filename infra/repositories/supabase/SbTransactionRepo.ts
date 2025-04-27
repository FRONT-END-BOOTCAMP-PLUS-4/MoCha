import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { supabase } from '@/app/shared/lib/supabase';

type GETmonthlySummaryProps = {
  userId: string;
  startDate: string;
  endDate: string;
};

export class SbTransactionRepo implements TransactionRepo {
  async GETmonthlySummary(props: GETmonthlySummaryProps): Promise<Array<{ amount: number; is_expense: Boolean; date: string }> | []> {
    const { userId, startDate, endDate } = props;
    const { data, error } = await supabase
      .from('transaction')
      .select(`amount, is_expense, date`)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if(error) throw new Error(error.message);

    return data ?? [];
  }

  async GETdailySummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{ amount: number; is_expense: Boolean; date: string }[] | []> {
    try {
      const { data, error } = await supabase
        .from('transaction')
        .select(`amount, is_expense, date`)
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      return data ? data : [];
    } catch (error) {
      console.error('error:', error);
      return [];
    }
  }
}
