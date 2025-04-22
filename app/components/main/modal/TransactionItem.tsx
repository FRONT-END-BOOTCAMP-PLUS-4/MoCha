'use client';

import { Transaction } from '@/app/shared/types/Calendar';
import CategoryIcon from './CategoryIcon';
import { categoryKoMap } from '@/app/shared/consts/categoryKoMap';

export default function TransactionItem({ item }: { item: Transaction }) {
  return (
    <li className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <CategoryIcon category={item.category} />
        <div>
          <p className="font-bold">{categoryKoMap[item.category]}</p>
          {item.memo && <p className="text-sm text-gray-500">{item.memo}</p>}
        </div>
      </div>
      <p className={`font-semibold ${item.type === 'income' ? 'text-income' : 'text-expense'}`}>
        {item.type === 'income' ? '+' : '-'}
        {item.amount.toLocaleString()}
      </p>
    </li>
  );
}
