export interface DailySummaryResponse {
  amount: number;
  is_expense: Boolean;
  date: string;
}

export interface DailySummaryRequest {
  userId: string;
  yearMonth: string | null;
}
