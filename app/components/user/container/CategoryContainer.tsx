import { useEffect } from 'react';
import CategoryList from '@/app/components/user/presentation/CategoryList';
import CategoryPieChart from '@/app/components/user/presentation/CategoryPieChart';
import { Category } from '@/app/shared/types/Chart';
const data1: Category[] = [
  { name: '급여', price: 500000, category: 'salary' },
  { name: '투자수익', price: 500000, category: 'investment' },
  { name: '용동', price: 500000, category: 'allowance' },
  { name: '환급 & 환불', price: 500000, category: 'refund' },
  { name: '기타', price: 500000, category: 'other' },
];

const data2: Category[] = [
  { name: '식비', price: 500000, category: 'food' },
  { name: '생활', price: 500000, category: 'housing' },
  { name: '교통', price: 500000, category: 'transportation' },
  { name: '통신', price: 500000, category: 'communication' },
  { name: '의료', price: 500000, category: 'medical' },
  { name: '쇼핑', price: 500000, category: 'shopping' },
  { name: '교육', price: 500000, category: 'education' },
  { name: '문화 & 여가', price: 500000, category: 'culture' },
  { name: '경조사', price: 500000, category: 'event' },
  { name: '기타', price: 500000, category: 'other' },
];

export default function CategoryContainer() {
  
  useEffect(()=>{
    fetch('/api/category?date=2025-04',{
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`},
    })
    .then( res => res.json())
    .then( data => console.log(data))
  },[])

  return (
    <div className="md:flex md:gap-3">
      <div className="flex grow basis-0 flex-col items-center p-2">
        <div className="size-40">
          <CategoryPieChart categoryList={data1} />
        </div>
        <CategoryList categoryList={data1} />
      </div>

      <div className="flex grow basis-0 flex-col items-center p-2">
        <div className="size-40">
          <CategoryPieChart categoryList={data2} />
        </div>
        <CategoryList categoryList={data2} />
      </div>
    </div>
  );
}
