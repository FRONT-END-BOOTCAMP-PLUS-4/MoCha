export interface TransactionRepo {
  GETmonthlySummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{ amount: number; is_expense: Boolean; date: string }[] | []>;

  GETdailySummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{ amount: number; is_expense: Boolean; date: string }[] | []>;

  GETdailyDetail(
    userId: string,
    date: string
  ): Promise<
    | {
        id: number;
        user_id: number;
        category_id: number;
        date: string;
        amount: number;
        memo: string | null;
        is_expense: boolean;
      }[]
    | []
  >;
}
