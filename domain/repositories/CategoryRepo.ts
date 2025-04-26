export interface CategoryRepo {
    GETmonthlyCategory(props: {userId: string, start:string, end:string}): Promise<{
      [K in 'incomes' | 'expenses']: Array<{
        is_expense: boolean;
        amount: number;
        name: string;
        primary_color: string;
      }>;
    } | []>;
  }