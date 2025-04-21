'use client';
import { type ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { type CategoryProps } from '@/app/shared/types/Chart';
import { categoryColorMap } from '@/app/shared/consts/categoryColorMap';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((comp) => comp.ResponsiveContainer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function CategoryChart(props: CategoryProps): ReactElement {
  const { categoryList } = props;

  return (
    <>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <PieChart>
          <Pie
            data={categoryList} // 차트에 표시할 데이터 배열을 설정
            nameKey="name" // 각 섹터의 이름을 나타내는 키
            dataKey="price" // 각 섹터의 값을 나타내는 데이터 키
            // cx="50%" // 차트중심의 x 좌표, 기본값: 50%
            // cy="50%" // 차트중심의 y 좌표, 기본값: 50%
            innerRadius={'30%'} // 차트의 내부 반지름
            outerRadius={'100%'} // 차트의 외부 반지름
            paddingAngle={3} // 섹터간의 간격
            fill="#ffffff" // 차트의 전체적인 색상
            cornerRadius={3} // 섹터의 모서리를 둥글게 만드는 반지름을 설정
          >
            {categoryList.map((item, index) => {
              const color = categoryColorMap[item.category] || categoryColorMap.other
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={color}
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
            formatter={(value)=> `${value.toLocaleString()}원`}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
