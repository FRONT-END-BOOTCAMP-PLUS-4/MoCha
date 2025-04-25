'use client';

import { useEffect, useState } from 'react';

export default function SummaryHeader({ yearMonth }: { yearMonth: string }) {
  const [monthly, setMonthly] = useState<{
    totalIncome: number;
    totalExpense: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/transactions/monthly?start=${yearMonth}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    })
      .then((res) => res.json())
      .then((res) => setMonthly(res.data));
  }, [yearMonth]);

  if (!monthly) return null;

  return (
    <div className="m-3 mb-2 flex justify-between px-4 text-sm sm:text-base">
      <div className="flex flex-col">
        <span className="text-gray-6 flex">수입</span>
        <span className="text-income">+{monthly.totalIncome.toLocaleString()}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-6 flex">지출</span>
        <span className="text-expense">-{monthly.totalExpense.toLocaleString()}</span>
      </div>
    </div>
  );
}
