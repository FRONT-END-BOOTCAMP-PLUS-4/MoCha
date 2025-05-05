'use client';
// package
import { type ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
// slice
import { type CategoryItem} from '../container/CategoryContainer';


const ResponsiveContainer = dynamic(
  () => import('recharts').then((comp) => comp.ResponsiveContainer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function CategoryChart(props: {categoryList: CategoryItem[]}): ReactElement {
  const { categoryList } = props;
  const defaultValue = [{amount: 1, name: '등록된 카테고리가 없습니다', color: '#9e9e9e'}];
  const isValue:boolean = !!categoryList.length;
  const replaceValue = isValue ? categoryList : defaultValue;

  return (
    <>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <PieChart>
          <Pie
            data={replaceValue}
            nameKey="name"
            dataKey="amount"
            innerRadius={'30%'}
            outerRadius={'100%'}
            paddingAngle={ isValue ? 3 : 0}
            fill="#ffffff"
            cornerRadius={3}
          >
            {replaceValue.map((item, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={item.color}
                  style={{ filter: 'drop-shadow(0px 2px 2px gray)' }}
                  strokeWidth={0}
                />
              );
            })}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: "12px"
            }}
            formatter={(value)=> isValue && `${value.toLocaleString()}원`}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
