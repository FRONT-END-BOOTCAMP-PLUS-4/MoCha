import { IncomeCategories, ExpenseCategories } from '@/app/shared/types/Chart';

export const categoryColorMap: Record<IncomeCategories | ExpenseCategories, string> = {
  salary: '#4caf50', // 급여
  investment: '#2196f3', // 투자수익
  allowance: '#ffb74d', // 용돈
  refund: '#a1887f', // 환급 & 환불
  food: '#f44336', // 식비
  housing: '#e57373', // 생활
  transportation: '#ff9800', // 교통
  communication: '#ffb74d', // 통신
  medical: '#9c27b0', // 의료
  shopping: '#ba68c8', // 쇼핑
  education: '#3f51b5', // 교육
  culture: '#64b5f6', // 문화 & 여가
  event: '#5be5c3', // 경조사
  other: '#9e9e9e', // 기타
};

export const categoryBgColorMap: Record<IncomeCategories | ExpenseCategories, string> = {
  salary: '#e8f5e9',
  investment: '#e3f2fd',
  allowance: '#fff3e0',
  refund: '#efebe9',
  food: '#ffebee',
  housing: '#fce4ec',
  transportation: '#fff3e0',
  communication: '#fff3e0',
  medical: '#f3e5f5',
  shopping: '#f3e5f5',
  education: '#e8eaf6',
  culture: '#e3f2fd',
  event: '#e0f7f4',
  other: '#f5f5f5',
};
