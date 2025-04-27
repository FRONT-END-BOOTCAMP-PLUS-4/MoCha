export interface MonthlyCategoryRequest {
  userId: string;
  date: string | null;
}

type CategoryMapper = {
  is_expense: boolean;
  amount: number;
  name: string;
  primary_color: string;
};

export interface MonthlyCategoryResponse {
  incomes: CategoryMapper[];
  expenses: CategoryMapper[];
}
