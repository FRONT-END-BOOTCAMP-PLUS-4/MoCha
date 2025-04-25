// import { User } from '@/domain/entities/User';
// import { UserRepository } from '@/domain/repositories/UserRepository';
// import { supabase } from '@/app/shared/lib/supabase';

import { supabase } from '@/app/shared/lib/supabase';
import { User } from '@/domain/entities/User';
import { UserRepo } from '@/domain/repositories/UserRepo';

export class SbUserRepo implements UserRepo {
  async findByUserEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('user').select('*').eq('email', email).single();

    if (error || !data) return null;

    return data;
  }

  async create(user: User): Promise<User> {
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

    console.log('data: ', data);

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
}

// export class SupabaseUserRepository implements UserRepository {
//   async findByEmail(email: string): Promise<User | null> {
//     const { data, error } = await supabase
//       .from('user')
//       .select('id, email, nickname, phone_number, provider, password, deleted_at')
//       .eq('email', email)
//       .single();

//     if (error || !data) return null;

//     return User.from(data);
//   }

//   async findById(id: string): Promise<User | null> {
//     const { data, error } = await supabase
//       .from('user')
//       .select('id, email, nickname, phone_number, provider')
//       .eq('id', id)
//       .single();

//     if (error || !data) return null;

//     return User.from(data);
//   }

//   async findByNickname(nickname: string): Promise<User | null> {
//     const { data, error } = await supabase
//       .from('user')
//       .select('id, email, nickname, phone_number, provider')
//       .eq('nickname', nickname)
//       .single();

//     if (error || !data) return null;

//     return User.from(data);
//   }

//   async findByNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null> {
//     const { data, error } = await supabase
//       .from('user')
//       .select('id, email, nickname, phone_number, provider')
//       .eq('nickname', nickname)
//       .eq('phone_number', phoneNumber)
//       .single();

//     if (error || !data) return null;

//     return User.from(data);
//   }

//   async updatePasswordByEmail(email: string, hashedPassword: string): Promise<void> {
//     const { error } = await supabase
//       .from('user')
//       .update({ password: hashedPassword })
//       .eq('email', email);

//     if (error) {
//       throw new Error('비밀번호 업데이트 실패');
//     }
//   }

//   async create(user: Omit<User, 'id'>): Promise<User> {
//     const { data, error } = await supabase.from('user').insert([user]).select().single();

//     if (error || !data) {
//       throw new Error('회원가입 실패');
//     }

//     return User.from(data);
//   }

//   async findByEmailAndProvider(email: string, providerId: number): Promise<User | null> {
//     const { data, error } = await supabase
//       .from('user')
//       .select('id, email, nickname, phone_number, provider')
//       .eq('email', email)
//       .eq('provider', providerId)
//       .single();

//     if (error || !data) return null;

//     return User.from(data);
//   }
// }
