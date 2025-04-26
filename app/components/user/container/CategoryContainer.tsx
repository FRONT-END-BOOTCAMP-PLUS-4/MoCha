'use client';
// package
import { useEffect, useState } from 'react';
// slice
import Category from '../presentation/Category';

type CategoryContainerProps = {
  date: string;
}

type RawCategoryData = {
  total_amount: number;
  category_name: string;
  category_primary_color: string;
};

export type CategoryItem = {
      amount: number;
      name: string;
      color: string;
};

export default function CategoryContainer({date}: CategoryContainerProps) {
  
  const [incomes, setIncomes] = useState<CategoryItem[]>([]);
  const [expenses, setExpenses] = useState<CategoryItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/category?date=${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      const json = await res.json();
      const incomesRaw: RawCategoryData[] = json.data.incomes;
      const expensesRaw: RawCategoryData[] = json.data.expenses;

      const incomesMapper: CategoryItem[] = (incomesRaw as RawCategoryData[]).map( value => ({
        amount: value.total_amount,
        name: value.category_name,
        color: value.category_primary_color,
      }));
      const expensesMapper: CategoryItem[] = (expensesRaw as RawCategoryData[]).map( value => ({
        amount: value.total_amount,
        name: value.category_name,
        color: value.category_primary_color,
      }));

      setIncomes(incomesMapper);
      setExpenses(expensesMapper);
    })();
  }, [date]);

  return <Category incomes={incomes} expenses={expenses}/>
}
