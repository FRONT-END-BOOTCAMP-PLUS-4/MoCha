import { User } from '@/domain/entities/User';
import { UserRepo } from '@/domain/repositories/UserRepo';
import { supabase } from '@/app/shared/lib/supabase';

export class SbUserRepo implements UserRepo {
  async findByUserEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('user').select('*').eq('email', email).single();

    if (error || !data) return null;

    return data;
  }

  async create(user: {
    email: string;
    password: string;
    nickname: string;
    phone_number: string;
    provider: number;
    deleted_at: null;
  }): Promise<User> {
    const { data, error } = await supabase.from('user').insert([user]).select().single();

    if (error || !data) {
      throw new Error('회원가입 실패');
    }

    return data;
  }

  async findByUserNickname(nickname: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('email, nickname, phone_number, provider')
      .eq('nickname', nickname)
      .single();

    if (error || !data) return null;

    return data as User;
  }

  async findByUserNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('email, nickname, phone_number, provider')
      .eq('nickname', nickname)
      .eq('phone_number', phoneNumber)
      .single();

    if (error || !data) return null;

    return data as User;
  }

  async resetPasswordByUserEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.from('user').update({ password }).eq('email', email);

    if (error) {
      throw new Error('비밀번호 업데이트 실패');
    }
  }

  async getProviderIdByProviderName(providerName: string): Promise<number> {
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

  async updateInfo(
    userId: string,
    nickName: string,
    phone_number: string
  ): Promise<{ nickname: string; phone_number: string,  provider:string, email:string}> {
    const { data, error } = await supabase
      .from('user')
      .update({ "nickname":nickName, "phone_number":phone_number })
      .eq('id', userId)
      .select("nickname, phone_number, provider, email")
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteUser( userId:string ): Promise<boolean> {

    const { data, error } = await supabase
    .from('user')
    .update({
      nickname: null,
      phone_number: null,
      email: new Date().toISOString(),
      deleted_at: new Date().toISOString()
    })
    .eq('id', userId);

    if (error) throw new Error(error.message);

      
    return true;
  }
}
