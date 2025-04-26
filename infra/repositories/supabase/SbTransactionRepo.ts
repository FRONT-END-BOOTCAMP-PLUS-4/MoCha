import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { supabase } from '@/app/shared/lib/supabase';

export class SbTransactionRepo implements TransactionRepo {
  async GETmonthlySummary(
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

  async GETdailyDetail(
    userId: string,
    date: string
  ): Promise<
    | {
        id: number;
        user_id: number;
        category_id: number;
        date: string;
        amount: number;
        memo: string | null;
        is_expense: boolean;
      }[]
    | []
  > {
    try {
      const { data, error } = await supabase
        .from('transaction')
        .select(
          `
          *,
          category:category_id (
            id,
            name,
            primary_color,
            secondary_color
          )
        `
        )
        .eq('user_id', userId)
        .gte('date', `${date}T00:00:00`) // 하루 시작
        .lte('date', `${date}T23:59:59`); // 하루 끝까지

      return data ? data : [];
    } catch (error) {
      console.error('error:', error);
      return [];
    }
  }
}
