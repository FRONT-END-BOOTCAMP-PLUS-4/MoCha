'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useMemo, useState } from 'react';
import { DailyData } from '@/app/shared/types/Calendar';
import DailyDetailModal from './modal/DailyDetailModal';
import { formattedDate } from '@/app/shared/utils/formattedDate';

export default function FullCalendarWrapper() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DailyData | null>(null);
  const [daily, setDaily] = useState<DailyData[]>([]);

  const clickEvent = (date: string) => {
    const clicked = daily.find((item) => item.date === date);
    if (clicked) {
      setSelectedDate(date);
      setSelectedDetail(clicked);
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

  useEffect(() => {
    fetch(`/api/transactions/daily?start=2025-04`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    })
      .then((res) => res.json())
      .then((res) => setDaily(res.data));
  }, []);

  const events = useMemo(() => {
    return daily?.map((item) => ({
      id: item.date,
      title: item.is_expense ? `- ${item.amount}` : `+ ${item.amount}`,
      start: item.date,
      extendedProps: {
        type: item.is_expense ? 'expense' : 'income',
      },
    }));
  }, [daily]);

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
        height="auto"
      />

      {selectedDate && selectedDetail && (
        <DailyDetailModal
          date={selectedDate}
          income={selectedDetail.is_expense ? 0 : selectedDetail.amount}
          expense={selectedDetail.is_expense ? selectedDetail.amount : 0}
          transactions={[]}
          onClose={() => {
            document.body.style.overflow = 'auto';
            setSelectedDate(null);
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
