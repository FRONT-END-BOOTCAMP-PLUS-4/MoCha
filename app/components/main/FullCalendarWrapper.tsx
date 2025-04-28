'use client';

import { DailyData, DailyTransaction } from '@/app/shared/types/Calendar';
import { useEffect, useMemo, useState } from 'react';

import DailyDetailModal from './modal/DailyDetailModal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { formatDailyEvents } from '@/app/shared/utils/formatDailyEvents';
import { formattedDate } from '@/app/shared/utils/formattedDate';
import interactionPlugin from '@fullcalendar/interaction';

export default function FullCalendarWrapper({
  onYearMonthChange,
  refetchSignal,
  onRefetch,
}: {
  onYearMonthChange: (value: string) => void;
  refetchSignal: boolean;
  onRefetch: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DailyTransaction | null>(null);
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [yearMonth, setYearMonth] = useState<string>('');

  const clickEvent = (date: string) => {
    const clickedItems = daily.filter((item) => item.date.slice(0, 10) === date);

    if (clickedItems.length > 0) {
      const income = clickedItems
        .filter((item) => !item.is_expense)
        .reduce((sum, item) => sum + item.amount, 0);

      const expense = clickedItems
        .filter((item) => item.is_expense)
        .reduce((sum, item) => sum + item.amount, 0);

      setSelectedDate(date);
      setSelectedDetail({
        income,
        expense,
        transactions: clickedItems,
      });

      document.body.style.overflow = 'hidden'; // 스크롤 방지
    } else {
      console.log('No data found for the clicked date.');
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = formattedDate(info.date); // 클릭한 날짜
    clickEvent(clickedDate);
  };

  const handleEventClick = (info: any) => {
    const eventDate = info.event.start; // 이벤트의 시작 날짜
    const clickedDate = formattedDate(eventDate); // 클릭한 날짜
    clickEvent(clickedDate);
  };

  const handleDatesSet = (arg: any) => {
    const current = new Date(arg.view.currentStart);
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const formatted = `${String(year)}-${String(month).padStart(2, '0')}`;
    setYearMonth(formatted);
  };

  const events = useMemo(() => formatDailyEvents(daily), [daily]);

  const fetchDailyData = async () => {
    if (!yearMonth) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/transactions/daily?start=${yearMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDaily(data.data);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    }
  };

  useEffect(() => {
    if (!yearMonth) return;
    onYearMonthChange(yearMonth);
    fetchDailyData();
  }, [yearMonth]);

  useEffect(() => {
    if (refetchSignal) {
      fetchDailyData();
    }
  }, [refetchSignal]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today',
        }}
        events={events}
        eventContent={(arg) => {
          const isIncome = arg.event.extendedProps.type === 'income';
          const bgColor = isIncome ? 'bg-income' : 'bg-expense';

          return (
            <div
              className={`truncate rounded px-1 text-end text-xs font-medium text-white ${bgColor}`}
            >
              {arg.event.title}
            </div>
          );
        }}
        selectable={true}
        dateClick={(info) => handleDateClick(info)}
        eventClick={(info) => handleEventClick(info)}
        datesSet={handleDatesSet}
        height="auto"
      />

      {selectedDate && selectedDetail && (
        <DailyDetailModal
          date={selectedDate}
          income={selectedDetail.income}
          expense={selectedDetail.expense}
          onClose={() => {
            document.body.style.overflow = 'auto';
            setSelectedDate(null);
            setSelectedDetail(null);
            onRefetch();
          }}
        />
      )}

      <style jsx global>{`
        .fc-h-event {
          background-color: transparent !important;
          border: none !important;
        }
        .fc-toolbar {
          margin-left: 12px !important;
          margin-right: 12px !important;
        }
      `}</style>
    </>
  );
}
