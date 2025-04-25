import { CalendarEvent, DailyData } from '../types/Calendar';

export function formatDailyEvents(daily: DailyData[]): CalendarEvent[] {
  const grouped: { [date: string]: { income: number; expense: number } } = {};

  daily.forEach((item) => {
    const date = item.date.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { income: 0, expense: 0 };
    }
    if (item.is_expense) {
      grouped[date].expense += item.amount;
    } else {
      grouped[date].income += item.amount;
    }
  });

  const result: CalendarEvent[] = [];

  for (const date in grouped) {
    if (grouped[date].income > 0) {
      result.push({
        id: `${date}-income`,
        title: `+ ${grouped[date].income.toLocaleString()}`,
        start: date,
        extendedProps: { type: 'income' },
      });
    }
    if (grouped[date].expense > 0) {
      result.push({
        id: `${date}-expense`,
        title: `- ${grouped[date].expense.toLocaleString()}`,
        start: date,
        extendedProps: { type: 'expense' },
      });
    }
  }

  return result;
}
