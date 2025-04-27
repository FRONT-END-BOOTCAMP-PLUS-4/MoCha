'use client';

import { DailyDetailModalProps, Transaction } from '@/app/shared/types/Calendar';
import { X } from 'lucide-react';
import SummaryHeader from '../SummaryHeader';
import TransactionItem from './TransactionItem';
import { useEffect, useState } from 'react';

export default function DailyDetailModal({
  date,
  income: initialIncome,
  expense: initialExpense,
  onClose,
}: DailyDetailModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(initialIncome);
  const [expense, setExpense] = useState(initialExpense);

  const fetchDaily = async () => {
    try {
      const res = await fetch(`/api/transactions?date=${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch daily data');
      }

      const response = await res.json();
      const transactions = response.data; // 상세 내역 꺼내기

      setTransactions(transactions); // 받아온 걸 저장

      const incomeSum = transactions
        .filter((t: Transaction) => t.is_expense === false)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const expenseSum = transactions
        .filter((t: Transaction) => t.is_expense === true)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      setIncome(incomeSum);
      setExpense(expenseSum);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const handleDelete = async (item: Transaction) => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      return;
    }
    const response = await fetch(`/api/transactions?transactionId=${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.status === 200) {
      fetchDaily(); // 삭제 후 다시 불러오기
    }
  };

  useEffect(() => {
    fetchDaily();
  }, [date]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex h-screen w-full max-w-md flex-col bg-white px-2 md:h-3/4">
        <div className="border-b-gray-3 flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">{date}</h2>
          <button onClick={onClose}>
            <X className="text-gray-6" />
          </button>
        </div>

        <div className="border-b-gray-3 border-b px-10 text-sm font-semibold">
          <SummaryHeader totalExpense={expense} totalIncome={income} />
        </div>

        <ul className="divide-gray-3 h-full divide-y overflow-y-auto">
          {transactions.map((item) => (
            <TransactionItem key={item.id} item={item} onClick={() => handleDelete(item)} />
          ))}
        </ul>
      </div>
    </div>
  );
}
