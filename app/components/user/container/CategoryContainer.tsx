'use client';
// package
import { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/navigation';
// slice
import Category from '../presentation/Category';

type CategoryContainerProps = {
  date: string;
};

type RawCategoryData = {
  total_amount: number;
  category_name: string;
  category_primary_color: string;
};

type FetchData = {
  status: number;
  data: { incomes: RawCategoryData[]; expenses: RawCategoryData[] } | null;
};

export type CategoryItem = {
  amount: number;
  name: string;
  color: string;
};

export default function CategoryContainer({ date }: CategoryContainerProps) {
  const router = useRouter()
  const [fetchData, setFetchData] = useState<FetchData | null>(null);
  const [incomes, setIncomes] = useState<CategoryItem[]>([]);
  const [expenses, setExpenses] = useState<CategoryItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/category?date=${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      const response = await res.json();
      setFetchData(response);
    })();
  }, [date]);


  useEffect(() => {
    if (!fetchData) return;

    switch (fetchData.status) {
      case 200:
        if (!fetchData.data) return;
        const incomesRaw: RawCategoryData[] = fetchData.data.incomes;
        const expensesRaw: RawCategoryData[] = fetchData.data.expenses;
        const incomesMapper: CategoryItem[] = (incomesRaw as RawCategoryData[]).map((value) => ({
          amount: value.total_amount,
          name: value.category_name,
          color: value.category_primary_color,
        }));
        const expensesMapper: CategoryItem[] = (expensesRaw as RawCategoryData[]).map((value) => ({
          amount: value.total_amount,
          name: value.category_name,
          color: value.category_primary_color,
        }));
        setIncomes(incomesMapper);
        setExpenses(expensesMapper);
        break;
      case 401:
        // 임시
        alert("회원가입후 이용가능합니다");
        router.push('/login');
        break;
      case 500:
        // 임시: 500페이지 필요
        router.push('/500');
        break;
    }
  }, [fetchData]);

  return <Category incomes={incomes} expenses={expenses} />;
}
