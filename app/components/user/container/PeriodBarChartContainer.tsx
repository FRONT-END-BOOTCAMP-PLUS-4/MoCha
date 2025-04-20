import { type Period } from '@/app/shared/types/Chart';
import PeriodBarChart from '@/app/components/user/presentation/PeriodBarChart';


const bardata: Period[] = [
  { name: '1월', income: 30000000, expense: 1500000 },
  { name: '2월', income: 3500000, expense: 1500000 },
  { name: '3월', income: 3200000, expense: 1500000 },
  { name: '4월', income: 2800000, expense: 1500000 },
  { name: '5월', income: 3000000, expense: 1500000 },
  { name: '6월', income: 4000000, expense: 1500000 },
];

export default function PeriodBarChartContainer() {
    return(
        <PeriodBarChart periodList={bardata} />
    );
}