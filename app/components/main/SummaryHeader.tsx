'use client';

import { useEffect, useState } from 'react';

export default function SummaryHeader({ yearMonth }: { yearMonth: string }) {
  const [monthly, setMonthly] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await fetch(`/api/transactions/monthly?start=${yearMonth}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch monthly data');
        }

        const data = await res.json();
        console.log('Monthly data:', data);
        setMonthly(data.data);
      } catch (error) {
        console.error('Error fetching monthly summary:', error);
        // 필요하면 setMonthly({ totalIncome: 0, totalExpense: 0 }) 초기화도 가능
      }
    };

    fetchMonthly();
  }, [yearMonth]);

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
