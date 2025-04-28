// Home.tsx
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
  const [monthly, setMonthly] = useState({ date: '', expenses: 0, incomes: 0 });
  const [refetchCalendar, setRefetchCalendar] = useState(false);

  const fetchMonthly = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !yearMonth) return;
    try {
      const res = await fetch(`/api/transactions/monthly?start=${yearMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setMonthly(data[0] || { date: '', expenses: 0, incomes: 0 });
    } catch {
      setMonthly({ date: '', expenses: 0, incomes: 0 });
    }
  };

  const handleFloatingClick = () => {
    if (!accessToken) router.push('/login');
    else setIsModalOpen(true);
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setRefetchCalendar((prev) => !prev);
  };

  useEffect(() => {
    fetchMonthly();
  }, [yearMonth]);

  useEffect(() => {
    fetchMonthly();
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
