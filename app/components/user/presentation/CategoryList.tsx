'use client';
// package
import { type ReactElement } from 'react';
import { Dot } from 'lucide-react'
// slice
import { type CategoryItem} from '../container/CategoryContainer';

export default function CategoryList(props: {categoryList: CategoryItem[], type?: string}): ReactElement {
  const { categoryList, type } = props;
  const defaultValue = [{amount: 1, name: `${type}`, color: '#9e9e9e'}];
  const isValue:boolean = !!categoryList.length;
  const replaceValue = isValue ? categoryList : defaultValue;

  return (
    <ul className="p-2 max-w-150 flex justify-center flex-wrap">
      {replaceValue.map((item, idx) => {
        return (
          <li key={idx} className={`flex items-center gap-1 text-shadow-lg/5`}>
            <Dot size={13} strokeWidth={13} color={item.color} />
            <span className="text-gray-6">{item.name}</span>
            {isValue && <span className="'text-black'">{item.amount.toLocaleString()}</span>}
          </li>
        );
      })}
    </ul>
  );
}
