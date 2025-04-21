// infra/user/repositories/SupabaseUserRepository.ts

import { supabase } from '@/app/shared/lib/supabase';
import { User } from '@/domain/user/entities/User';
import { UserRepository } from '@/domain/user/repositories/UserRepository';

export class SupabaseUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('user').select('*').eq('email', email).single();

    if (error || !data) return null;

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('user').select('*').eq('id', id).single();

    if (error || !data) return null;

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('nickname', nickname)
      .single();

    if (error || !data) return null;

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }

  async findByNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('nickname', nickname)
      .eq('phone_number', phoneNumber)
      .single();

    if (error || !data) return null;

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }

  async updatePasswordByEmail(email: string, hashedPassword: string): Promise<void> {
    const { error } = await supabase
      .from('user')
      .update({ password: hashedPassword })
      .eq('email', email);

    if (error) {
      throw new Error('비밀번호 업데이트 실패');
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase.from('user').insert([user]).select().single();

    if (error || !data) {
      throw new Error('회원가입 실패');
    }

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }

  // 이메일 + provider 조합으로 찾기
  async findByEmailAndProvider(email: string, providerId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('provider', providerId)
      .single();

    if (error || !data) return null;

    return new User(data.id, data.email, data.nickname, data.phone_number, data.provider);
  }
}
