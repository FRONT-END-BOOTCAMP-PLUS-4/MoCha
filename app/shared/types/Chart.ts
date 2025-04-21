export type IncomeCategories =
  | 'salary'
  | 'investment'
  | 'allowance'
  | 'refund';
  
export type ExpenseCategories =
  | 'food'
  | 'housing'
  | 'transportation'
  | 'communication'
  | 'medical'
  | 'shopping'
  | 'education'
  | 'culture'
  | 'event'
  | 'other';

export type Category = {
  name: string;
  price: number;
  category: IncomeCategories | ExpenseCategories;
};

export type CategoryProps = {
  categoryList: Category[];
};

export type Period = {
  name: string;
  income: number;
  expense: number;
}

export type PeriodProps = {
  periodList: Period[]
}


