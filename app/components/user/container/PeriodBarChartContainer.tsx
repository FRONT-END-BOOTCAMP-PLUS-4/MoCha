'use client'
// package
import { useEffect, useState, ReactElement, memo } from 'react';
import { useRouter } from 'next/navigation';
// slice
import PeriodBarChart from '../presentation/PeriodBarChart';


type PeriodBarChartContainerProps = {
  years: number;
}

export type PeriodItem = {
  date: string;
  expenses: number;
  incomes: number;
}

type FetchData = {
  status: number;
  data: PeriodItem[] | null;
};

export default memo(function PeriodBarChartContainer({years}: PeriodBarChartContainerProps):ReactElement  {
  const router = useRouter()
  const [fetchData, setFetchData] = useState<FetchData | null>(null);
  const [monthlyList, setMonthlyList] = useState<PeriodItem[]>([]);

  useEffect(() => {
      (async () => {
        const res = await fetch(`/api/transactions/monthly?startDate=${years}-01&endDate=${years}-12`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
  
        const response = await res.json();
        setFetchData(response);
      })();
    }, [years]);

    useEffect(() => {
      if (!fetchData) return;
  
      switch (fetchData.status) {
        case 200:
          if (!fetchData.data) return;
          setMonthlyList(fetchData.data);
          break;
        case 401:
          // 임시
          alert("회원가입후 이용가능합니다");
          router.push('/login');
          break;
        case 500:
          // 임시: 500페이지 필요
          router.push('/500');
          break;
      }
    }, [fetchData]);

    return(
        <PeriodBarChart periodList={monthlyList} />
    );
})