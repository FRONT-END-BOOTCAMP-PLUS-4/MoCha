import { ReactNode } from 'react';

export type Category =
  | '급여'
  | '투자수익'
  | '용돈'
  | '환급&환불'
  | '식비'
  | '생활'
  | '교통'
  | '통신'
  | '의료'
  | '쇼핑'
  | '교육'
  | '문화&여가'
  | '경조사'
  | '기타';

export type Transaction = {
  id: string;
  category: Category;
  memo?: string;
  amount: number;
  is_expense: boolean;
};

export type DailyDetailModalProps = {
  date: string;
  income: number;
  expense: number;
  onClose: () => void;
};

export type DailyData = {
  amount: number;
  is_expense: boolean;
  date: string;
};

export type DailyTransaction = {
  income: number;
  expense: number;
  transactions: DailyData[];
};

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    type: 'income' | 'expense';
  };
}

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
