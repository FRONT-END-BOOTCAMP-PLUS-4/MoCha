import { supabase } from '@/app/shared/lib/supabase';
import { ProviderRepository } from '@/domain/user/repositories/ProviderRepository';

export class SupabaseProviderRepository implements ProviderRepository {
  async getIdByName(providerName: string): Promise<number> {
    const { data, error } = await supabase
      .from('provider')
      .select('id')
      .eq('name', providerName)
      .single();

    if (error || !data) {
      throw new Error('provider 조회 실패');
    }

    return data.id;
  }
}
