'use client';

import { useState } from 'react';
import FloatingButton from '../components/main/FloatingButton';
import FullCalendarWrapper from '../components/main/FullCalendarWrapper';
import Modal from '../components/main/modal/TransactionModal';
import SummaryHeader from '../components/main/SummaryHeader';
import IncomeExpenseForm from '../components/main/modal/IncomeExpenseForm';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState<string>('');

  return (
    <div>
      <SummaryHeader yearMonth={yearMonth} />
      <FullCalendarWrapper onYearMonthChange={setYearMonth} />
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen}>
        <IncomeExpenseForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
