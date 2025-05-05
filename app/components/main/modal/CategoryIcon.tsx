'use client';

import { Category, CategoryIconProps } from '@/app/shared/types/Calendar';
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

const CategoryIcon = ({ name, primaryColor, secondaryColor }: CategoryIconProps): JSX.Element => {
  const categoryIcons: Record<Category, JSX.Element> = {
    급여: <CircleDollarSign stroke={primaryColor} />,
    투자수익: <ChartLine stroke={primaryColor} />,
    용돈: <Banknote stroke={primaryColor} />,
    '환급&환불': <BanknoteArrowDown stroke={primaryColor} />,
    식비: <Utensils stroke={primaryColor} />,
    생활: <House stroke={primaryColor} />,
    교통: <TramFront stroke={primaryColor} />,
    통신: <Wifi stroke={primaryColor} />,
    의료: <BriefcaseMedical stroke={primaryColor} />,
    쇼핑: <ShoppingCart stroke={primaryColor} />,
    교육: <GraduationCap stroke={primaryColor} />,
    '문화&여가': <Clapperboard stroke={primaryColor} />,
    경조사: <Calendar stroke={primaryColor} />,
    기타: <PiggyBank stroke={primaryColor} />,
  };

  return (
    <span
      className={`flex size-9 items-center justify-center rounded-full`}
      style={{ backgroundColor: secondaryColor }}
    >
      {categoryIcons[name] || categoryIcons['기타']}
    </span>
  );
};

export default CategoryIcon;
