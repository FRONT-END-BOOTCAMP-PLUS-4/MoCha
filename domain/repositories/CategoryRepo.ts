export interface CategoryRepo {
  GETmonthlyCategory(props: { userId: string; startDate: string; endDate: string }): Promise<
    | {
        [K in 'incomes' | 'expenses']: Array<{
          is_expense: boolean;
          amount: number;
          name: string;
          primary_color: string;
        }>;
      }
    | []
  >;

  GETcategory(props: { userId: string }): Promise<
    | {
        id: string;
        name: string;
      }[]
    | []
  >;
}
