export interface MonthlySummaryResponse {
  date: string;
  incomes: number;
  expenses: number;
}
export interface MonthlySummaryRequest {
  userId: string;
  startDate: string | null;
  endDate: string | null;
}
