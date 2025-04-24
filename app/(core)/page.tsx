'use client';

import { useState, useEffect } from 'react';
import FloatingButton from '../components/main/FloatingButton';
import FullCalendarWrapper from '../components/main/FullCalendarWrapper';
import Modal from '../components/main/modal/TransactionModal';
import SummaryHeader from '../components/main/SummaryHeader';
import IncomeExpenseForm from '../components/main/modal/IncomeExpenseForm';
import { DailyData } from '../shared/types/Calendar';
import { json } from 'stream/consumers';

const mockData: { summary: { totalIncome: number; totalExpense: number }; daily: DailyData[] } = {
  summary: {
    totalIncome: 4280000,
    totalExpense: 3150000,
  },
  daily: [
    {
      date: '2025-04-15',
      income: 3500000,
      expense: 337000,
      transactions: [
        {
          id: '1',
          category: 'salary',
          amount: 3500000,
          type: 'income',
        },
        {
          id: '2',
          category: 'shopping',
          memo: '올리브영 구매',
          amount: 150000,
          type: 'expense',
        },
        {
          id: '3',
          category: 'food',
          memo: '동기들과 점심 식사',
          amount: 42000,
          type: 'expense',
        },
        {
          id: '4',
          category: 'investment',
          amount: 20000,
          type: 'expense',
        },
        {
          id: '5',
          category: 'transportation',
          memo: '버스비',
          amount: 3000,
          type: 'expense',
        },
        {
          id: '6',
          category: 'allowance',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '7',
          category: 'refund',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '8',
          category: 'housing',
          amount: 200000,
          type: 'expense',
        },
        {
          id: '9',
          category: 'communication',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '10',
          category: 'medical',
          memo: '간식',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '11',
          category: 'education',
          memo: '간식',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '12',
          category: 'culture',
          memo: '간식',
          amount: 20700,
          type: 'expense',
        },
        {
          id: '13',
          category: 'event',
          memo: '간식',
          amount: 2000,
          type: 'expense',
        },
        {
          id: '14',
          category: 'other',
          memo: '간식',
          amount: 2000,
          type: 'expense',
        },
      ],
    },
  ],
};


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const date = new Date();
  const dateYears = date.getFullYear();
  const dateMonths = date.getMonth() + 1;

  const [years, setYears] = useState(dateYears);
  const [months, setMonths] = useState(dateMonths);
  // console.log("years:",years)
  // console.log("months:",months)
  // 토큰 임시저장 ___ Temp
  useEffect(() => {
      fetch(`/api?start=2025-04&end=2025-05`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
      .then((res) => res.json())
      .then((data) => console.log("Homedata:",data));
  }, []);

  

  return (
    <div className="">
      <SummaryHeader summary={mockData.summary} />
      <FullCalendarWrapper daily={mockData.daily} />
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen}>
        <IncomeExpenseForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
