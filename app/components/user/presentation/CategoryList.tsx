'use client';
import { type ReactElement } from 'react';
import { Dot } from 'lucide-react'
import { type CategoryProps} from '@/app/shared/types/Chart';
import { categoryColorMap } from '@/app/shared/consts/categoryColorMap';

export default function CategoryList(props: CategoryProps): ReactElement {
    const { categoryList } = props;
  return (
    <ul className="p-2 max-w-150 flex justify-center flex-wrap">
      {categoryList.map((item, idx) => {
        const color = categoryColorMap[item.category] || categoryColorMap.other
        return (
          <li key={idx} className={`flex items-center gap-1 text-shadow-lg/5`}>
            <Dot size={15} strokeWidth={15} color={color} />
            <span className="text-gray-6">{item.name}</span>
            <span className="'text-black'">{item.price.toLocaleString()}</span>
          </li>
        );
      })}
    </ul>
  );
}
