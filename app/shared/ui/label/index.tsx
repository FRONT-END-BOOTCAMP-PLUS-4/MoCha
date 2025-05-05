'use client';

type LabelProps = {
  label: string;
  htmlFor?: string;
};

export default function Label({ htmlFor, label }: LabelProps) {
  return (
    <label className="text-gray-7 mb-1 inline-block text-sm" htmlFor={htmlFor}>
      {label}
    </label>
  );
}
