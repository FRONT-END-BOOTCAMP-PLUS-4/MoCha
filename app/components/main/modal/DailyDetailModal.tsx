'use client';

import { DailyDetailModalProps, Transaction } from '@/app/shared/types/Calendar';
import { X } from 'lucide-react';
import SummaryHeader from '../SummaryHeader';
import TransactionItem from './TransactionItem';
import { useEffect, useState } from 'react';

export default function DailyDetailModal({
  date,
  income,
  expense,
  onClose,
}: DailyDetailModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching daily summary:', error);
      }
    };
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
            <TransactionItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
