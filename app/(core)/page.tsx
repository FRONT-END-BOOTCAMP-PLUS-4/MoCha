'use client';

import { useEffect, useState } from 'react';

import FloatingButton from '../components/main/FloatingButton';
import FullCalendarWrapper from '../components/main/FullCalendarWrapper';
import IncomeExpenseForm from '../components/main/modal/IncomeExpenseForm';
import Modal from '../components/main/modal/TransactionModal';
import SummaryHeader from '../components/main/SummaryHeader';
import { useAuthStore } from '../shared/stores/authStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState<string>('');
  const [monthly, setMonthly] = useState({
    date: '',
    expenses: 0,
    incomes: 0,
  });
  const [refetchCalendar, setRefetchCalendar] = useState(false);

  const fetchMonthly = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !yearMonth) return;

    try {
      const res = await fetch(`/api/transactions/monthly?start=${yearMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch monthly data');

      // 응답 구조 분리
      const result = (await res.json()) as {
        status: number;
        data: Array<{ date: string; expenses: number; incomes: number }>;
      };

      const items = result.data;
      if (Array.isArray(items) && items.length > 0) {
        setMonthly(items[0]);
      } else {
        // 데이터가 없으면 0으로 초기화
        setMonthly({ date: '', expenses: 0, incomes: 0 });
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setMonthly({ date: '', expenses: 0, incomes: 0 });
    }
  };

  // FloatingButton 클릭 핸들러
  const handleFloatingClick = () => {
    if (!accessToken) {
      // 로그인 안 된 상태면 로그인 페이지로
      router.push('/login');
    } else {
      // 로그인 돼 있으면 모달 열기
      setIsModalOpen(true);
    }
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setRefetchCalendar((prev) => !prev);
  };

  useEffect(() => {
    fetchMonthly();
  }, [yearMonth]);

  useEffect(() => {
    if (refetchCalendar) {
      fetchMonthly();
    }
  }, [refetchCalendar]);

  return (
    <div>
      <SummaryHeader totalExpense={monthly.expenses} totalIncome={monthly.incomes} />
      <FullCalendarWrapper
        onYearMonthChange={setYearMonth}
        refetchSignal={refetchCalendar}
        onRefetch={() => setRefetchCalendar((prev) => !prev)}
      />
      <FloatingButton onClick={handleFloatingClick} />

      <Modal isOpen={isModalOpen}>
        <IncomeExpenseForm onClose={handleFormClose} />
      </Modal>
    </div>
  );
}
