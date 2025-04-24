import { supabase } from '@/app/shared/lib/supabase';
import { TransactionRepo } from '@/domain/repositories/TransactionRepo';

export class SbTransactionRepo implements TransactionRepo {
  async GETmonthlySummary(userId: string, startDate: string, endDate: string): Promise<{amount: number;is_expense: Boolean;date: string;}[] | []> {
    try {

        const { data, error } = await supabase
        .from('transaction')
        .select(`amount, is_expense, date`)
        .eq('user_id', userId)
        .gte('date',startDate)
        .lte('date',endDate)

      return data ? data : [];
    } catch (error) {
      console.error('error:', error);
      return [];
    }
  }
}
