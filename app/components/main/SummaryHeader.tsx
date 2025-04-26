'use client';

import { SummaryHeaderProps } from '@/app/shared/types/Calendar';
import { useEffect, useState } from 'react';

export default function SummaryHeader({ totalIncome, totalExpense }: SummaryHeaderProps) {
  return (
    <div className="m-3 mb-2 flex justify-between px-4 text-sm sm:text-base">
      <div className="flex flex-col">
        <span className="text-gray-6 flex">수입</span>
        <span className="text-income">+{totalIncome.toLocaleString()}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-6 flex">지출</span>
        <span className="text-expense">-{totalExpense.toLocaleString()}</span>
      </div>
    </div>
  );
}
