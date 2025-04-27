export interface TransactionRepo {
  GETmonthlySummary(props: {
    userId: string;
    startDate: string;
    endDate: string;
  }): Promise<Array<{ amount: number; is_expense: Boolean; date: string }> | []>;

  GETdailySummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{ amount: number; is_expense: Boolean; date: string }[] | []>;
}
