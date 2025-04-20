import { useState } from 'react';
import { FieldStatus } from '../types/FormStatus';

export function useFormStatus<T extends string>(fields: T[]) {
  const initialState = fields.reduce(
    (acc, key) => {
      acc[key] = 'none';
      return acc;
    },
    {} as Record<T, FieldStatus>
  );

  const [status, setStatus] = useState<Record<T, FieldStatus>>(initialState);

  const setField = (field: T, value: FieldStatus) => {
    setStatus((prev) => ({ ...prev, [field]: value }));
  };

  return { status, setField };
}
