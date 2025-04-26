// package
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
// slice
import CategoryContainer from '../container/CategoryContainer';
import PeriodBarChartContainer from '../container/PeriodBarChartContainer';

export default function ChartTab() {
  const date = new Date();
  const [selectYears, setSelectYears] = useState<number>(date.getFullYear());
  const [selectMonths, setSelectMonths] = useState<number>(date.getMonth() + 1);

  const prevMonths = () => {
    if(selectMonths <= 1){
      setSelectYears(selectYears -1);
      setSelectMonths(12);
      return;
    }

    setSelectMonths(selectMonths - 1)
  }
  const nextMonths = () => {
    if(selectMonths >= 12){
      setSelectYears(selectYears + 1);
      setSelectMonths(1);
      return;
    }
    setSelectMonths(selectMonths + 1)
  }

  return (
    <div className="flex grow flex-col">
      <div className="text-gray-5 flex justify-center gap-20">
        <button className="hover:text-main cursor-pointer" onClick={prevMonths}>
          <ArrowBigLeft size={30}/>
        </button>
        <span className="text-black text-xl">{`${selectYears}년 ${selectMonths}월`}</span>
        <button className="hover:text-main cursor-pointer" onClick={nextMonths}>
          <ArrowBigRight size={30}/>
        </button>
      </div>

      <CategoryContainer date={`${selectYears}-${selectMonths}`}/>

      <div className="min-h-50 grow">
        <PeriodBarChartContainer/>
      </div>
    </div>
  );
}
