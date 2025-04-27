'use client';

import { IncomeExpenseFormProps } from '@/app/shared/types/Calendar';
import { Button } from '@/app/shared/ui/button';
import Input from '@/app/shared/ui/input';
import { useEffect, useState } from 'react';

export default function IncomeExpenseForm({ onClose }: IncomeExpenseFormProps) {
  const [selectedTab, setSelectedTab] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState<string>('');
  const [categories, setCategories] = useState<{
    expense: { id: number; name: string }[];
    income: { id: number; name: string }[];
  }>({
    expense: [],
    income: [],
  });
  const [category, setCategory] = useState<string>(''); // 선택된 카테고리 ID
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

  const handleTabChange = (tab: 'income' | 'expense') => {
    setSelectedTab(tab);
    setCategory(''); // 탭 변경 시 선택 초기화
  };

  // 모든 필수값이 입력되었는지 확인
  const isFormValid = date !== '' && category !== '' && amount !== '';

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    const formData = {
      type: selectedTab,
      date,
      category,
      amount,
      memo,
    };

    // 입력값을 임시로 콘솔에 출력
    console.log('저장된 데이터:', formData);

    // 모달 닫기
    onClose();
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      const response = await res.json();
      setCategories(response.data);
    })();
  }, [date]);

  return (
    <div className="flex flex-col gap-4">
      {/* 수입/지출 탭 */}
      <div className="flex w-full gap-1 overflow-hidden rounded-lg">
        <Button
          intent={selectedTab === 'income' ? 'income' : 'ghost'}
          className="flex-1"
          onClick={() => handleTabChange('income')}
        >
          수입
        </Button>
        <Button
          intent={selectedTab === 'expense' ? 'expense' : 'ghost'}
          className="flex-1"
          onClick={() => handleTabChange('expense')}
        >
          지출
        </Button>
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">
          날짜 <span className="text-error">*</span>
        </label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* 카테고리 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">
          카테고리 <span className="text-error">*</span>
        </label>
        <select
          className="rounded border border-gray-300 px-4 py-3 text-sm text-gray-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">선택하세요</option>

          {(selectedTab === 'income' ? categories.income : categories.expense)?.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* 금액 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">
          금액 <span className="text-error">*</span>
        </label>
        <Input
          type="number"
          placeholder="금액을 입력하세요"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 값 제거
          }}
        />
      </div>

      {/* 메모 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">메모</label>
        <textarea
          placeholder="Add notes (optional)"
          className="resize-none rounded border border-gray-300 px-4 py-3 text-sm"
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={10}
        />
      </div>

      {/* 버튼 */}
      <div className="flex w-full gap-2 overflow-hidden rounded-lg">
        <Button intent={'cancel'} className="flex-1" onClick={onClose}>
          취소
        </Button>
        <Button intent={'primary'} className="flex-1" disabled={!isFormValid} onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
