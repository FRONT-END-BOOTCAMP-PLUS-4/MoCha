'use client';
// package
import { type ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
// slice
import { type PeriodItem} from '../container/PeriodBarChartContainer'

const ResponsiveContainer = dynamic(
  () => import('recharts').then((comp) => comp.ResponsiveContainer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function PeriodBarChart(props: {periodList:PeriodItem[], years: number}): ReactElement {
  const { periodList, years } = props;
  const defaultValue = [{date: years, expenses: 0, incomes: 0}];
  const isValue:boolean = !!defaultValue.length;
  const replaceValue = periodList.length ? periodList : defaultValue;

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <BarChart data={replaceValue}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date"
          interval="preserveStartEnd"/>
        <YAxis
          type="number"
          tickCount={5}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => {
            if(!isValue) return value;
            if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
            if (value >= 10000000) return `${(value / 10000000).toFixed(1)}천만`;
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}백만`;
            if (value >= 100000) return `${(value / 100000).toFixed(1)}십만`;
            if (value >= 10000) return `${(value / 10000).toFixed(1)}만`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}천`;
            return value.toLocaleString();
          }}
        />
        <Legend />
        <Tooltip cursor={false} contentStyle={{
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: "12px"
            }} formatter={(value)=> `${value.toLocaleString()}원`}/>
        <Bar dataKey="incomes" name="수입" fill={`var(--color-income-pastel)`} barSize={18}/>
        <Bar dataKey="expenses" name="지출" fill={`var(--color-expense-pastel)`}barSize={18}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
