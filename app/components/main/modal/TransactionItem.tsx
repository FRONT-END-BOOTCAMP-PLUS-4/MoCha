'use client';

import { Transaction } from '@/app/shared/types/Calendar';
import CategoryIcon from './CategoryIcon';
import { Trash2 } from 'lucide-react';

export default function TransactionItem({ item }: { item: Transaction }) {
  return (
    <li className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <CategoryIcon
          name={item.category.name}
          primaryColor={item.category.primary_color}
          secondaryColor={item.category.secondary_color}
        />
        <div>
          <p className="font-bold">{item.category.name}</p>
          {item.memo && <p className="text-sm text-gray-500">{item.memo}</p>}
        </div>
      </div>
      <div className="flex flex-col">
        <button>
          <Trash2 className="ml-auto" size={14} />
        </button>
        <p className={`font-semibold ${item.is_expense ? 'text-expense' : 'text-income'}`}>
          {item.is_expense ? '-' : '+'}
          {item.amount.toLocaleString()}
        </p>
      </div>{' '}
    </li>
  );
}
