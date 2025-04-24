import { User } from '../entities/User';

export interface UserRepo {
  findByUserEmail(email: string): Promise<User | null>;

  // 회원가입
  create(user: User): Promise<User | null>;

  findByUserNickname(nickname: string): Promise<User | null>;

  // 닉네임과 전화번호로 이메일(id) 찾기
  findByUserNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null>;

  resetPasswordByUserEmail(email: string, password: string): Promise<void>;
  // findByEmail(email: string): Promise<User | null>;
  // findByNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null>;
  // updatePasswordByEmail(email: string, hashedPassword: string): Promise<void>;
  // create(user: Omit<User, 'id'>): Promise<User>;
  // findByEmailAndProvider(email: string, providerId: number): Promise<User | null>;
}
