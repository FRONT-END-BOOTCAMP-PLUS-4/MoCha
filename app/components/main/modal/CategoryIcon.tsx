'use client';

import { categoryBgColorMap, categoryColorMap } from '@/app/shared/consts/categoryColorMap';
import { Category } from '@/app/shared/types/Calendar';
import {
  CircleDollarSign,
  ChartLine,
  Banknote,
  BanknoteArrowDown,
  Utensils,
  House,
  TramFront,
  Wifi,
  BriefcaseMedical,
  ShoppingCart,
  GraduationCap,
  Clapperboard,
  Calendar,
  PiggyBank,
} from 'lucide-react';
import { JSX } from 'react';

const CategoryIcon = ({ category }: { category: Category }): JSX.Element => {
  const color = categoryColorMap[category];
  const bgColor = categoryBgColorMap[category];

  const categoryIcons: Record<Category, JSX.Element> = {
    salary: <CircleDollarSign stroke={color} />,
    investment: <ChartLine stroke={color} />,
    allowance: <Banknote stroke={color} />,
    refund: <BanknoteArrowDown stroke={color} />,
    food: <Utensils stroke={color} />,
    housing: <House stroke={color} />,
    transportation: <TramFront stroke={color} />,
    communication: <Wifi stroke={color} />,
    medical: <BriefcaseMedical stroke={color} />,
    shopping: <ShoppingCart stroke={color} />,
    education: <GraduationCap stroke={color} />,
    culture: <Clapperboard stroke={color} />,
    event: <Calendar stroke={color} />,
    other: <PiggyBank stroke={color} />,
  };

  return (
    <span
      className={`flex size-9 items-center justify-center rounded-full`}
      style={{ backgroundColor: bgColor }}
    >
      {categoryIcons[category] || categoryIcons['other']}
    </span>
  );
};

export default CategoryIcon;
