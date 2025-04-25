export interface MonthlySummaryResponse {
  totalIncome: number;
  totalExpense: number;
}
export interface MonthlySummaryRequest {
  userId: string;
  startDate: string | null;
  endDate: string | null;
}
