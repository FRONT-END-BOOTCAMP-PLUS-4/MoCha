interface MessageZoneProps {
  errorMessages?: string[];
  successMessages?: string[];
}

export default function MessageZone({
  errorMessages = [],
  successMessages = [],
}: MessageZoneProps) {
  return (
    <div className="mt-1 min-h-[16px] space-y-1 text-xs">
      {errorMessages.map((msg, i) => (
        <div key={`error-${i}`} className="text-red-500">
          {msg}
        </div>
      ))}
      {successMessages.map((msg, i) => (
        <div key={`success-${i}`} className="text-green-500">
          {msg}
        </div>
      ))}
    </div>
  );
}
