import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { supabase } from '@/app/shared/lib/supabase';
import { addDays } from 'date-fns';

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
      const startDate = new Date(date);
      const endDate = addDays(startDate, 1);

      const { data, error } = await supabase
        .from('transaction')
        .select(`id, user_id, category_id, date, amount, memo, is_expense`)
        .eq('user_id', userId)
        .gte('date', startDate.toISOString()) // 날짜 >= 2025-04-01T00:00:00
        .lt('date', endDate.toISOString()); // 날짜 < 2025-04-02T00:00:00
      console.log('data:', data);
      return data ? data : [];
    } catch (error) {
      console.error('error:', error);
      return [];
    }
  }
}
