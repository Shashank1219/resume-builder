import { useRef, useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface MonthYearPickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function MonthYearPicker({ value, onChange, placeholder = "e.g. 05-2023 or May 2023" }: MonthYearPickerProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState(false);

  // Sync external value to local state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // Native picker returns "YYYY-MM"
    if (val) {
      const [year, month] = val.split("-");
      const formatted = `${month}-${year}`;
      setLocalValue(formatted);
      onChange(formatted);
      setError(false);
    }
  };

  const validateAndSave = () => {
    const trimmed = localValue.trim();
    if (!trimmed) {
      onChange("");
      setError(false);
      return;
    }

    if (trimmed.toLowerCase() === "present") {
      onChange("Present");
      setError(false);
      return;
    }

    // Check MM-YYYY or MM/YYYY (e.g. 08-2025 or 08/2025)
    if (/^(0[1-9]|1[0-2])[-/]\d{4}$/.test(trimmed)) {
      const normalized = trimmed.replace("/", "-");
      onChange(normalized);
      setError(false);
      return;
    }

    // Check Month YYYY (e.g. August 2025, Aug 2025)
    if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}$/i.test(trimmed)) {
      onChange(trimmed);
      setError(false);
      return;
    }

    // Invalid format
    setError(true);
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative flex items-center">
        <input
          type="text"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:outline-none pr-10 transition-colors ${
            error ? "border-red-500 focus:ring-red-500 bg-red-50" : "border-gray-300 focus:ring-blue-500 bg-white"
          }`}
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (error) setError(false);
          }}
          onBlur={validateAndSave}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute right-2 text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
          onClick={() => {
            try {
              hiddenInputRef.current?.showPicker?.();
            } catch (e) {
              // Fallback for browsers that don't support showPicker
              hiddenInputRef.current?.focus();
            }
          }}
          title="Open Calendar"
        >
          <Calendar size={16} />
        </button>
        <input
          type="month"
          ref={hiddenInputRef}
          className="absolute bottom-0 right-0 opacity-0 pointer-events-none w-0 h-0"
          onChange={handleDateChange}
          max={new Date().toISOString().slice(0, 7)}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">Format must be MM-YYYY or Month YYYY</span>}
    </div>
  );
}
