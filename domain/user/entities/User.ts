export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  phone_number: string;
  provider: number;
  created_at?: string;
  deleted_at?: string;
}
