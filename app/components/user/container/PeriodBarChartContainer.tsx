import { type Period } from '@/app/shared/types/Chart';
import PeriodBarChart from '@/app/components/user/presentation/PeriodBarChart';


const bardata: Period[] = [
  { name: '2024년 1월', income: 3000000, expense: 1200000 },
  { name: '2024년 2월', income: 3300000, expense: 1000000 },
  { name: '2025년 3월', income: 3200000, expense: 1800000 },
  { name: '2025년 4월', income: 4000000, expense: 1500000 },
  { name: '2025년 5월', income: 0, expense: 0 },
  { name: '2025년 6월', income: 0, expense: 0 },
  { name: '2025년 7월', income: 0, expense: 0},
];

export default function PeriodBarChartContainer() {
    return(
        <PeriodBarChart periodList={bardata} />
    );
}