import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import CategoryContainer from '@/app/components/user/container/CategoryContainer';
import PeriodBarChartContainer from '@/app/components/user/container/PeriodBarChartContainer';

export default function ChartTab() {
  return (
    <div className="flex grow flex-col">
      <div className="text-gray-5 flex justify-center gap-20">
        <div className="hover:text-main">
          <ArrowBigLeft />
        </div>
        <span className="text-black">11월</span>
        <div className="hover:text-main">
          <ArrowBigRight />
        </div>
      </div>

      <CategoryContainer/>

      <div className="min-h-50 grow">
        <PeriodBarChartContainer/>
      </div>
    </div>
  );
}
