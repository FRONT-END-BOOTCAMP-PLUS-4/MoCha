export interface DailyDetailRequest {
  userId: string;
  date: string | null;
}

export interface DailyDetailResponse {
  id: number;
  user_id: number;
  category_id: number;
  date: string;
  amount: number;
  memo: string | null;
  is_expense: boolean;
}
