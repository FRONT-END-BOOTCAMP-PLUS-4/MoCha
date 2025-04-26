'use client';

import { useEffect, useState } from 'react';
import FloatingButton from '../components/main/FloatingButton';
import FullCalendarWrapper from '../components/main/FullCalendarWrapper';
import Modal from '../components/main/modal/TransactionModal';
import SummaryHeader from '../components/main/SummaryHeader';
import IncomeExpenseForm from '../components/main/modal/IncomeExpenseForm';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState<string>('');
  const [monthly, setMonthly] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await fetch(`/api/transactions/monthly?start=${yearMonth}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch monthly data');
        }

        const data = await res.json();
        setMonthly(data.data);
      } catch (error) {
        console.error('Error fetching monthly summary:', error);
        // 필요하면 setMonthly({ totalIncome: 0, totalExpense: 0 }) 초기화도 가능
      }
    };

    fetchMonthly();
  }, [yearMonth]);
  console.log(monthly);

  return (
    <div>
      <SummaryHeader totalExpense={monthly.totalExpense} totalIncome={monthly.totalIncome} />
      <FullCalendarWrapper onYearMonthChange={setYearMonth} />
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen}>
        <IncomeExpenseForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
