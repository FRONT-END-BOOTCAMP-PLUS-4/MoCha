'use client';
// slice
import CategoryList from './CategoryList';
import CategoryPieChart from './CategoryPieChart';
import { type CategoryItem} from '../container/CategoryContainer';

type CategoryProps = {
    incomes: CategoryItem[];
    expenses: CategoryItem[];
};

export default function Category({incomes, expenses} : CategoryProps) {

  return (
    <div className="md:flex md:gap-3">
      {/* 수익 */}
      <div className="flex grow basis-0 flex-col items-center p-2">
        <div className="size-40">
          <CategoryPieChart categoryList={incomes} />
        </div>
        <CategoryList categoryList={incomes} type="수입"/>
      </div>
      {/* 지출 */}
      <div className="flex grow basis-0 flex-col items-center p-2">
        <div className="size-40">
          <CategoryPieChart categoryList={expenses} />
        </div>
        <CategoryList categoryList={expenses} type="지출"/>
      </div>
    </div>
  );
}
