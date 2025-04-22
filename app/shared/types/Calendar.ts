import { ReactNode } from 'react';

export type Category =
  | 'salary'
  | 'investment'
  | 'allowance'
  | 'refund'
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

export type Transaction = {
  id: string;
  category: Category;
  memo?: string;
  amount: number;
  type: 'income' | 'expense';
};

export type DailyDetailModalProps = {
  date: string;
  income: number;
  expense: number;
  transactions: Transaction[];
  onClose: () => void;
};

export type DailyData = {
  date: string;
  income: number;
  expense: number;
  transactions?: Transaction[];
};

export type FullCalendarWrapperProps = {
  daily: DailyData[];
};

export type SummaryHeaderProps = {
  summary: {
    totalIncome: number;
    totalExpense: number;
  };
};

export type FloatingButtonProps = {
  onClick: () => void;
};

export type IncomeExpenseFormProps = {
  onClose: () => void;
};

export type ModalProps = {
  isOpen: boolean;
  children: ReactNode;
};
