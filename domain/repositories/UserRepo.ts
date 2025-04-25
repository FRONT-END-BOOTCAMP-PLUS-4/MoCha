import { User } from '../entities/User';

export interface UserRepo {
  findByUserEmail(email: string): Promise<User | null>;

  // 회원가입
  create(user: User): Promise<User | null>;

  // 닉네임 중복확인
  findByUserNickname(nickname: string): Promise<User | null>;

  // 닉네임과 전화번호로 이메일(id) 찾기
  findByUserNicknameAndPhone(nickname: string, phoneNumber: string): Promise<User | null>;

  // 비밀번호 재설정
  resetPasswordByUserEmail(email: string, password: string): Promise<void>;

  // provider 이름으로 provider id 가져오기
  getProviderIdByProviderName(providerName: string): Promise<number>;
}
