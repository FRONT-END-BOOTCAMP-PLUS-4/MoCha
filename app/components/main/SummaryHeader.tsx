'use client';

import { useEffect, useState } from 'react';

export default function SummaryHeader() {
  const [monthly, setMonthly] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    fetch(`/api/transactions/monthly?start=2025-04`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    })
      .then((res) => res.json())
      .then((res) => setMonthly(res.data));
  }, []);

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
