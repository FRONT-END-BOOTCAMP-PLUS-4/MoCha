export interface CategoryRepo {
    GETmonthlyCategory(props: {userId: string, start:string, end:string}): Promise<{incomes: {
      is_expense: boolean;
      amount: number;
      name: string;
      primary_color: string;
    }[];
    expenses: {
      is_expense: boolean;
      amount: number;
      name: string;
      primary_color: string;
    }[];}[] | []>;
  }